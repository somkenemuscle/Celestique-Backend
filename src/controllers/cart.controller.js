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

    // Calculate the item's subtotal based on the product's price
    const itemSubtotal = product.price * quantity;

    // Check if the product already exists in the cart
    const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (existingItemIndex >= 0) {
        // If the product is already in the cart, update the quantity and subtotal
        cart.items[existingItemIndex].quantity += quantity;
        cart.items[existingItemIndex].subtotal += itemSubtotal;
    } else {
        // If the product is not in the cart, add it as a new item with price and subtotal
        cart.items.push({
            product: productId,
            quantity,
            price: product.price,   // Store the price at the time of adding to the cart
            subtotal: itemSubtotal   // Store the subtotal (price * quantity)
        });
    }

    // Calculate the new total price for the cart
    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.subtotal, 0);
    cart.updatedAt = Date.now();

    // Save the updated cart
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
