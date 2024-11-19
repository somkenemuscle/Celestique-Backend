import { Cart } from '../models/cart.model.js';
import { Product } from '../models/product.model.js';

// Add a product to the cart
export const addToCart = async (req, res) => {
    const { _id } = req.user; // User ID from authentication middleware
    const { productId, quantity } = req.body; // Product ID and desired quantity

    // Validate the requested quantity
    if (quantity <= 0) {
        return res.status(400).json({ message: 'Quantity must be greater than zero' });
    }

    // Fetch the product from the database
    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    // Check stock availability
    if (quantity > product.quantity) {
        return res.status(400).json({ message: `Only ${product.quantity} units of this product are available` });
    }

    // Find the user's cart or create a new one if it doesn't exist
    let cart = await Cart.findOne({ user: _id });
    if (!cart) {
        cart = new Cart({ user: _id, items: [] });
    }

    // Check if the product already exists in the cart
    const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (existingItemIndex >= 0) {
        // Update quantity and subtotal for the existing item
        const cartItem = cart.items[existingItemIndex];
        const newTotalQuantity = cartItem.quantity + quantity;

        // Ensure the new total quantity doesn't exceed stock
        if (newTotalQuantity > product.quantity) {
            return res.status(400).json({ message: `Cannot add more than ${product.quantity} units of this product to your cart` });
        }

        cartItem.quantity = newTotalQuantity;
        cartItem.subtotal = cartItem.quantity * product.price;
    } else {
        // Add a new item to the cart
        cart.items.push({
            product: productId,
            quantity,
            price: product.price, // Capture the product price at the time of adding
            subtotal: quantity * product.price,
        });
    }

    // Recalculate the cart's total price
    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.subtotal, 0);
    cart.updatedAt = Date.now();

    // Save the updated cart to the database
    await cart.save();

    return res.status(200).json({ message: 'Product added to cart', cart });
};


// Remove a product from the cart
export const removeFromCart = async (req, res) => {
    const { _id } = req.user;
    const { productId } = req.params;

    // Find the user's cart
    const cart = await Cart.findOne({ user: _id });
    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the product in the cart and remove it
    const removedItem = cart.items.find(item => item.product.toString() === productId);
    if (removedItem) {
        // Subtract the item's subtotal from the total price
        cart.totalPrice -= removedItem.subtotal;
    }

    // Remove the item from the cart
    cart.items = cart.items.filter(item => item.product.toString() !== productId);

    // Save the updated cart
    cart.updatedAt = Date.now();
    await cart.save();

    return res.status(200).json({ message: 'Product removed from cart', cart });
};


// Update the quantity of a product in the cart
export const updateCartItemQuantity = async (req, res) => {
    const { _id } = req.user;
    const { productId, quantity } = req.body;

    if (quantity < 1) {
        return res.status(400).json({ message: 'Quantity must be greater than 0' });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ user: _id });
    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the item in the cart and update its quantity and subtotal
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex >= 0) {
        const product = await Product.findById(productId);
        const newSubtotal = product.price * quantity;

        // Update the quantity and subtotal for the item
        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].subtotal = newSubtotal;

        // Recalculate the total price
        cart.totalPrice = cart.items.reduce((acc, item) => acc + item.subtotal, 0);
    } else {
        return res.status(404).json({ message: 'Product not found in cart' });
    }

    // Save the updated cart
    cart.updatedAt = Date.now();
    await cart.save();

    return res.status(200).json({ message: 'Cart updated successfully', cart });
};


// Get the user's cart
export const getCart = async (req, res) => {
    const { _id } = req.user;

    // Find the user's cart (error probably)
    const cart = await Cart.findOne({ user: _id }).populate('items.product');

    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }

    return res.status(200).json({ cart });
};



// Clear the user's cart (remove all items)
export const clearCart = async (req, res) => {
    const { _id } = req.user;

    // Find the user's cart
    const cart = await Cart.findOne({ user: _id });
    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }

    // Clear the cart
    cart.items = [];
    cart.totalPrice = 0; // Reset the total price
    cart.updatedAt = Date.now();
    await cart.save();

    return res.status(200).json({ message: 'Cart cleared', cart });
};
