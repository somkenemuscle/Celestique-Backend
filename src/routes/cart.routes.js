import express from 'express';
import { addToCart, removeFromCart, getCart, clearCart, updateCartItemQuantity } from '../controllers/cart.controller.js';
import handleAsyncErr from '../utils/catchAsync.js'
import isLoggedin from '../utils/isLoggedin.js';

const router = express.Router();

// Get the user's cart
router.get('/', isLoggedin, handleAsyncErr(getCart));

// Add a product to the user's cart
router.post('/add/', isLoggedin, handleAsyncErr(addToCart));

// Update the quantity of a specific product in the cart
router.put('/item/:productId', isLoggedin, handleAsyncErr(updateCartItemQuantity));

// Remove a specific product from the cart
router.delete('/item/:productId', isLoggedin, handleAsyncErr(removeFromCart));

// Clear all products from the cart
router.delete('/clear', isLoggedin, handleAsyncErr(clearCart));

export default router;
