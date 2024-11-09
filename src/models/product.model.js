import mongoose from 'mongoose';
const { Schema } = mongoose;

// Product Schema
const productSchema = new Schema({
     name: {
            type: String,
            required: true,
            trim: true, // Trim whitespace from the name
        },
        images: {
            type: [String], // Array of image URLs
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: [0, 'Price cannot be negative'], // Ensure price is non-negative
        },
        sizes: {
            type: [String], // Array of available sizes (e.g., ["S", "M", "L", "XL"])
            required: true,
        },
        colors: {
            type: [String], // Flexible array of colors (e.g., ["red", "green", "blue"])
            required: true,
        },
        quantity: {
            type: Number, // Number of items available
            required: true,
            min: [0, 'Quantity cannot be negative'],
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category', // Reference to the Categories collection
            required: true,
        },
        gender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Gender', // Reference to the Gender schema
            required: true,
        },
    },
    {
        timestamps: { createdAt: 'createdAt' }, // Automatically adds createdAt timestamp
    }
);

export const Product = mongoose.model('Product', productSchema);
