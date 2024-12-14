import { Order } from '../models/order.model.js'


// Fetch orders for the authenticated user
export const getUserOrders = async (req, res) => {
    const userId = req.user._id;

    // Fetch orders belonging to the user and sort by creation date (latest first)
    const orders = await Order.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate('items.product', 'name price images'); // Populate product details if needed

    if (orders.length === 0) {
        return res.status(404).json({ message: 'No orders found' });
    }

    res.status(200).json({ success: true, orders });

};

// Fetch details of an orders for the authenticated user
export const getUserOrderDetails = async (req, res) => {
    const OrderId = req.params.orderId

    // Fetch orders belonging to the user and sort by creation date (latest first)
    const orders = await Order.findById({ _id: OrderId })
        .sort({ createdAt: -1 })
        .populate('items.product', 'name price images').populate('paymentId'); // Populate product details if needed

    if (orders.length === 0) {
        return res.status(404).json({ message: 'No orders found' });
    }

    res.status(200).json({ success: true, orders });

};