import mongoose from 'mongoose';

const { Schema } = mongoose;

// Order Schema
const orderSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
    }],
    totalAmount: {
        type: Number,
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending',
    },
    paymentReference: {
        type: String,
        unique: true,
    }
}, {
    timestamps: { createdAt: 'createdAt' }, // Automatically adds createdAt timestamp
});

export const Order = mongoose.model('Order', orderSchema);
