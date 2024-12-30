import mongoose from 'mongoose';
const { Schema } = mongoose;

const FavoriteProductSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    savedItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }],
}, { timestamps: true });

export const FavoriteProduct = mongoose.model('FavoriteProduct', FavoriteProductSchema);


