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
            subtotal: {
                type: Number,
                required: true
            }
        }],
    totalPrice: {
        type: Number,
        default: 0
    },
}, { timestamps: true });

// Create the Cart model
export const Cart = mongoose.model('Cart', cartSchema);

