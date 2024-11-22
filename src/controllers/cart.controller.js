import { Cart } from '../models/cart.model.js';
import { Product } from '../models/product.model.js';

// Add a product to the cart
export const addToCart = async (req, res) => {
    const { _id } = req.user; // User ID
    const { productId, quantity, color, size } = req.body;

    // Validate the requested quantity
    if (quantity <= 0) {
        return res.status(400).json({ message: 'Quantity must be greater than zero' });
    }

    // Fetch the product from the database
    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    // Validate color and size
    if (!product.colors.includes(color)) {
        return res.status(400).json({ message: `Selected color '${color}' is not available for this product.` });
    }
    if (!product.sizes.includes(size)) {
        return res.status(400).json({ message: `Selected size '${size}' is not available for this product.` });
    }

    // Check quantity availability (optional: track quantity by variant if implemented)
    if (quantity > product.quantity) {
        return res.status(400).json({ message: `Only ${product.quantity} units of this product are available.` });
    }

    // Find the user's cart or create a new one if it doesn't exist
    let cart = await Cart.findOne({ user: _id });
    if (!cart) {
        cart = new Cart({ user: _id, items: [] });
    }

    // Check if the same product, size, and color already exist in the cart
    const existingItemIndex = cart.items.findIndex(
        item =>
            item.product.toString() === productId &&
            item.color === color &&
            item.size === size
    );

    if (existingItemIndex >= 0) {
        // Update quantity and subtotal for the existing item
        const cartItem = cart.items[existingItemIndex];
        const newTotalQuantity = cartItem.quantity + quantity;

        // Ensure the new total quantity doesn't exceed quantity
        if (newTotalQuantity > product.quantity) {
            return res.status(400).json({
                message: `Cannot add more than ${product.quantity} units of this product to your cart.`,
            });
        }

        cartItem.quantity = newTotalQuantity;
        cartItem.subtotal = cartItem.quantity * product.price;
    } else {
        // Add a new item to the cart
        cart.items.push({
            product: productId,
            quantity,
            color,
            size,
            subtotal: quantity * product.price,
        });
    }

    // Recalculate the cart's total price
    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.subtotal, 0);
    await cart.save();

    return res.status(200).json({ message: 'Product added to cart', cart });
};


// Remove a product from the cart
export const removeFromCart = async (req, res) => {
    const { _id } = req.user;
    const { productId, color, size } = req.body;

    const cart = await Cart.findOne({ user: _id });
    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the specific item in the cart
    const removedItem = cart.items.find(
        item =>
            item.product.toString() === productId &&
            item.color === color &&
            item.size === size
    );

    if (!removedItem) {
        return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Subtract the item's subtotal from the total price
    cart.totalPrice -= removedItem.subtotal;

    // Remove the item from the cart
    cart.items = cart.items.filter(
        item =>
            item.product.toString() !== productId ||
            item.color !== color ||
            item.size !== size
    );

    await cart.save();
    return res.status(200).json({ message: 'Product removed from cart', cart });
};


// Update the quantity of a product in the cart
export const updateCartItemQuantity = async (req, res) => {
    const { _id } = req.user;
    const { productId, quantity, color, size } = req.body;

    if (quantity < 1) {
        return res.status(400).json({ message: 'Quantity must be greater than 0' });
    }

    const cart = await Cart.findOne({ user: _id });
    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the item in the cart
    const itemIndex = cart.items.findIndex(
        item =>
            item.product.toString() === productId &&
            item.color === color &&
            item.size === size
    );

    if (itemIndex >= 0) {
        const product = await Product.findById(productId);

        // Ensure quantity doesn't exceed quantity
        if (quantity > product.quantity) {
            return res.status(400).json({
                message: `Cannot update to more than ${product.quantity} units.`,
            });
        }

        // Update the quantity and subtotal
        const newSubtotal = product.price * quantity;
        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].subtotal = newSubtotal;

        // Recalculate total price
        cart.totalPrice = cart.items.reduce((acc, item) => acc + item.subtotal, 0);
        await cart.save();

        return res.status(200).json({ message: 'Cart updated successfully', cart });
    }

    return res.status(404).json({ message: 'Item not found in cart' });
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
