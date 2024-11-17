import axios from 'axios';
import { Cart } from '../models/cart.model.js';
import { Payment } from '../models/payment.model.js';
import { mongoose } from 'mongoose';

// Initialize payment with Paystack
export const initializePayment = async (req, res) => {
    const { amount } = req.body; // Get email and amount from the request body
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

    // Make request to Paystack to initialize payment
    const response = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        {
            email: req.user.email,
            amount: amount * 100,
            callback_url: 'http://localhost:3000/verify'
        }, // Paystack expects amount in kobo
        {
            headers: {
                Authorization: `Bearer ${paystackSecretKey}`,
                'Content-Type': 'application/json',
            },
        }
    );
    res.status(200).json(response.data);
};



// Verify payment with Paystack
export const verifyPayment = async (req, res, next) => {
    const { reference } = req.body;
    if (!reference) {
        return res.status(400).json({ error: 'No reference found' });
    }

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

    // Start a session for the transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    // Use `try...catch` only for managing the session
    try {
        // Step 1: Verify the transaction with Paystack
        const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: { Authorization: `Bearer ${paystackSecretKey}` },
            }
        );

        const { data } = response.data;
        if (data.status !== 'success') {
            throw new Error('Payment verification failed');
        }

        const userId = req.user._id;
        const paymentMethod = data.channel;

        // Step 2: Fetch the user's cart
        const cart = await Cart.findOne({ user: userId }).session(session);
        if (!cart || cart.items.length === 0) {
            throw new Error('Cart is empty');
        }

        // Step 3: Create an order
        const newOrder = new Order({
            user: userId,
            products: cart.items,
            shippingAddress: req.body.shippingAddress,
            totalAmount: cart.totalPrice,
            paymentStatus: 'Paid',
            paymentReference: reference,
        });

        const savedOrder = await newOrder.save({ session });

        // Step 4: Create a payment record
        const newPayment = new Payment({
            order: savedOrder._id,
            user: userId,
            amount: cart.totalPrice,
            paymentReference: reference,
            transactionId: data.id,
            paymentStatus: 'Success',
            paymentMethod: paymentMethod,
        });

        await newPayment.save({ session });

        // Step 5: Clear the user's cart
        await Cart.updateOne(
            { user: userId },
            { $set: { items: [], totalPrice: 0, updatedAt: Date.now() } },
            { session }
        );

        // Commit the transaction if everything succeeded
        await session.commitTransaction();
        session.endSession();

        // Send success response
        res.status(200).json({
            success: true,
            message: 'Order created and payment verified successfully',
            order: savedOrder,
        });
    } catch (error) {
        // If an error occurs, abort the transaction and end the session
        await session.abortTransaction();
        session.endSession();

        // Pass the error to the route handler
        next(error);
    }
};