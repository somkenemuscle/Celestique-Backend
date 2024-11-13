import { Cart } from '../models/cart.model.js';
import { Product } from '../models/product.model.js';

// Add a product to the cart
export const addToCart = async (req, res) => {
    const { _id } = req.user;
    const { productId, quantity } = req.body;

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    // Find the user's cart (or create a new one if not exists)
    let cart = await Cart.findOne({ user: _id });

    if (!cart) {
        cart = new Cart({ user: _id, items: [] });
    }

    // Check if the product already exists in the cart
    const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (existingItemIndex >= 0) {
        // If the product is already in the cart, update the quantity
        cart.items[existingItemIndex].quantity += quantity;
    } else {
        // If the product is not in the cart, add it as a new item
        cart.items.push({ product: productId, quantity });
    }

    // Save the updated cart
    cart.updatedAt = Date.now();
    await cart.save();

    return res.status(200).json({ message: 'Product added to cart', cart });
};


// Remove a product from the cart
export const removeFromCart = async (req, res) => {
    const { _id } = req.user;
    const { productId } = req.body;

    // Find the user's cart
    const cart = await Cart.findOne({ user: _id });
    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the product in the cart and remove it
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

    // Find the item in the cart and update its quantity
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex >= 0) {
        cart.items[itemIndex].quantity = quantity;
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
    cart.updatedAt = Date.now();
    await cart.save();

    return res.status(200).json({ message: 'Cart cleared', cart });
};
