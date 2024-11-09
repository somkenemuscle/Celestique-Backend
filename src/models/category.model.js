import mongoose from 'mongoose';
const { Schema } = mongoose;

// Category Schema
const categorySchema = new Schema({
    categoryName: {
        type: String,
        required: true,
        unique: [true, 'Category already exists'],
        trim: true,
    }
}, { timestamps: true });

export const Category = mongoose.model('Category', categorySchema);
