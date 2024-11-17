import { Payment } from '../models/payment.model.js';
import { Order } from '../models/order.model.js';


// Function to create a new payment
export const createPayment = async (userId, paidAmount, reference, transactionId, paymentMethod, session, paymentStatus) => {
    const newPayment = new Payment({
        user: userId,
        amount: paidAmount,
        paymentReference: reference,
        transactionId,
        paymentStatus,  // Payment status can be dynamic (Pending or Success)
        paymentMethod,
    });

    return await newPayment.save({ session });
};

// Function to create a new order
export const createOrder = async (userId, cart, req, reference, paymentId, totalAmount, session, paymentStatus) => {
    const newOrder = new Order({
        user: userId,
        items: cart.items,
        shippingAddress: req.body.shippingAddress,
        totalAmount,
        paymentStatus,
        paymentReference: reference,
        paymentId
    });

    return await newOrder.save({ session });
};