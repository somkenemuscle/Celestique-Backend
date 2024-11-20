import mongoose from 'mongoose';
import { Product } from './models/product.model.js'; // Adjust the path if necessary

// The Gender and Category IDs for the new product
const genderId = new mongoose.Types.ObjectId('672ff4c23b4cc9b881d85201');
const categoryId = new mongoose.Types.ObjectId('672ff37b169ba3282a4d102a');

// New product data
const newProduct = {
    name: 'Japan Anchor Shirt',
    colors: ['grey', 'green', 'black'],
    images: [
        'https://sfycdn.speedsize.com/f872e742-7b4a-4913-b7dc-4d0ce34f2142/ash-luxe.com/cdn/shop/files/americanfootballblackpink.png?v=1728475024&width=900',
        'https://sfycdn.speedsize.com/f872e742-7b4a-4913-b7dc-4d0ce34f2142/ash-luxe.com/cdn/shop/files/americanfootballblackpink2.png?v=1728475024&width=900'
    ],
    gender: genderId, // Referencing the Gender ID
    categoryId: categoryId, // Referencing the Category ID
    price: 100.00, // Example price (change this accordingly)
    sizes: ['S', 'M', 'L', 'XL'], // Example sizes
    quantity: 50, // Example quantity
    description: 'A stylish T-shirt perfect for casual and complex wears.', // Example description
};

async function addProduct() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb+srv://somkene:muscle$$090@celestiquecluster.uwhws.mongodb.net/?retryWrites=true&w=majority&appName=CelestiqueCluster',);

        // Create a new Product instance with the data
        const product = new Product(newProduct);

        // Save the new product to the database
        await product.save();

        console.log('New product added successfully:', product);

        // Close the MongoDB connection
        mongoose.connection.close();
    } catch (error) {
        console.error('Error adding product:', error);
    }
}

// Call the addProduct function to add the new product to the database
addProduct();
