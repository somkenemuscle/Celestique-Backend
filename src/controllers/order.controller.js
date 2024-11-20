import { Order } from '../models/order.model.js'


// Fetch orders for the authenticated user
export const getUserOrders = async (req, res) => {
    const userId = req.user._id;

    // Fetch orders belonging to the user and sort by creation date (latest first)
    const orders = await Order.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate('products.productId', 'name price image'); // Populate product details if needed

    if (orders.length === 0) {
        return res.status(404).json({ message: 'No orders found' });
    }

    res.status(200).json({ success: true, orders });

};