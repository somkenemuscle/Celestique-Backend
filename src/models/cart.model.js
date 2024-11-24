import mongoose from 'mongoose';
const { Schema } = mongoose;

const cartSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        color: {
            type: String,
            required: true,
        },
        size: {
            type: String,
            required: true,
        },
        subtotal: {
            type: Number,
            required: true
        }
    }],
    deliveryFee: {
        type: Number,
        default: 1000
    },
    subtotal: {
        type: Number,
        default: 0
    },
    totalPrice: {
        type: Number,
        default: 0
    },
}, { timestamps: true });

// Create the Cart model
export const Cart = mongoose.model('Cart', cartSchema);

