import mongoose from 'mongoose';
import generateUniqueSlug from '../utils/generateSlug.js';
const { Schema } = mongoose;

// Product Schema
const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true, // Trim whitespace from the name
  },
  slug: {
    type: String,
    unique: true, // Ensure the slug is unique
    lowercase: true, // Slugs should always be lowercase
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
  });

// Pre-save hook to generate the slug
productSchema.pre('save', async function (next) {

  // If the product is new or slug is not already set, generate the slug
  if (!this.slug) {
    console.log("Generating slug for new product...");
    this.slug = await generateUniqueSlug(this.name); // Generate slug from the product name
  }

  next();  // Proceed to save the product
});


export const Product = mongoose.model('Product', productSchema);
