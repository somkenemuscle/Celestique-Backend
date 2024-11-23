import axios from 'axios';
import { Cart } from '../models/cart.model.js';
import { Product } from '../models/product.model.js';
import { mongoose } from 'mongoose';
import { createOrder, createPayment } from '../utils/confirmOrderAndPayment.js';


// Initialize payment with Paystack
export const initializePayment = async (req, res) => {
    const { amount, shippingAddress } = req.body; // Get email and amount from the request body
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!amount) {
        return res.status(400).send({ error: 'Amount was not given.' });
    }

    // Ensure shippingAddress is provided
    if (!shippingAddress || typeof shippingAddress !== 'object') {
        return res.status(400).send({ error: 'Invalid or missing shippingAddress.' });
    }


    // Add shippingAddress to cookie
    res.cookie('shippingAddress', shippingAddress, {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict',
        maxAge: 15 * 60 * 1000,
        path: '/',
    });


    // Make request to Paystack to initialize payment
    const response = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        {
            email: req.user.email,
            amount: amount * 100,
            callback_url: 'http://localhost:3000/verify'
        },
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
    const { reference, totalAmount } = req.body;
    const { shippingAddress } = req.cookies;

    if (!shippingAddress) {
        return res.status(400).json({ error: 'No shippingAddress found' });
    }

    if (!reference || !totalAmount) {
        return res.status(400).json({ error: 'No reference or totalAmount found' });
    }

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

    // Start a session for the transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Step 1: Verify the transaction with Paystack
        const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: { Authorization: `Bearer ${paystackSecretKey}` },
            }
        );

        const { data } = response.data;

        // Step 2: Check if Paystack payment status is 'success'
        if (data.status !== 'success') {
            throw new Error('Payment verification failed');
        }

        const userId = req.user._id;
        const paymentMethod = data.channel;
        const paidAmount = data.amount / 100; // Paystack returns amount in kobo, so divide by 100 to get Naira.

        // Step 3: Fetch the user's cart
        const cart = await Cart.findOne({ user: userId }).session(session);
        if (!cart || cart.items.length === 0) {
            throw new Error('Cart is empty');
        }

        // Step 4: Determine payment status based on the amount paid
        let paymentStatus = paidAmount < totalAmount ? 'Pending' : 'Paid';

        // Step 5: Create a payment record first
        const savedPayment = await createPayment(userId, paidAmount, reference, data.id, paymentMethod, session, paymentStatus);

        // Step 6: Create the order, now that we have the paymentId
        const savedOrder = await createOrder(userId, cart, shippingAddress, reference, savedPayment._id, totalAmount, session, paymentStatus);

        // Step 7: Deduct ordered quantities from products
        for (const item of cart.items) {
            const product = await Product.findById(item.product).session(session);
            if (!product) {
                throw new Error(`Product with ID ${item.product} not found`);
            }

            // Check if stock is sufficient before updating
            if (product.quantity < item.quantity) {
                // Refund the payment immediately
                await axios.post(
                    'https://api.paystack.co/refund',
                    {
                        transaction: reference, // Reference of the original transaction
                        amount: paidAmount * 100, // Amount in kobo
                        customer_note: `Refund due to insufficient stock for product: ${product.name}`,
                    },
                    {
                        headers: { Authorization: `Bearer ${paystackSecretKey}` },
                    }
                );

                throw new Error(`Insufficient stock for product: ${product.name}. Payment has been refunded.`);
            }

            product.quantity -= item.quantity;
            await product.save({ session }); // Save changes in the session
        }

        // Step 8: Clear the user's cart if payment was successful or pending
        if (paymentStatus === 'Paid' || paymentStatus === 'Pending') {
            await Cart.updateOne(
                { user: userId },
                { $set: { items: [], totalPrice: 0, subtotal: 0, updatedAt: Date.now() } },
                { session }
            );
        }

        // Commit the transaction if everything succeeded
        await session.commitTransaction();
        session.endSession();

        //Remove shippingAddress from cookies
        res.cookie('shippingAddress', '', {
            httpOnly: true, secure: false, sameSite: 'Strict', maxAge: 0, path: '/'
        });

        // Send success response
        return res.status(200).json({
            success: true,
            message: 'Order created and payment verified successfully',
            order: savedOrder,
            payment: savedPayment,
        });

    } catch (error) {
        // If an error occurs, abort the transaction and end the session
        await session.abortTransaction();
        session.endSession();

        // Pass the error to the route handler
        next(error);
    }
};