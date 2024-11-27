import { Cart } from '../models/cart.model.js';
import { Product } from '../models/product.model.js';
import mongoose from 'mongoose';



// Add a product to the cart
export const addToCart = async (req, res) => {
    const userId = req.user._id; // User ID
    const { productId, quantity, color, size } = req.body;

    // Validate the requested quantity
    if (quantity <= 0) {
        return res.status(400).json({ message: 'Quantity must  be greater than zero' });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid product ID format.' });
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

    const availableQuantity = product.quantity;

    // Check quantity availability 
    if (quantity > availableQuantity) {
        return res.status(400).json({ message: `Only ${availableQuantity} units of this product are available.` });
    }

    // Find the user's cart 
    let cart = await Cart.findOne({ user: userId });

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
        if (newTotalQuantity > availableQuantity) {
            return res.status(400).json({
                message: `Cannot add more than ${availableQuantity} units of this product to your cart.`,
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
            subtotal: quantity * product.price
        });
    }

    // Recalculate the cart's subtotal (sum of item subtotals)
    cart.subtotal = cart.items.reduce((acc, item) => acc + item.subtotal, 0);

    // Recalculate the cart's total price (subtotal + delivery fee)
    cart.totalPrice = cart.subtotal + cart.deliveryFee;

    // Save the updated cart
    await cart.save();

    // Return the updated cart with the new subtotal and total price
    return res.status(200).json({ message: 'Product added to cart', cart });
};


// Remove a product from the cart
export const removeFromCart = async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.params;
    const { color, size } = req.query;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid product ID format.' });
    }

    const cart = await Cart.findOne({ user: userId }).populate({
        path: 'items.product',
        populate: {
            path: 'gender',
        },
    });

    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the specific item in the cart
    const removedItemIndex = cart.items.findIndex(
        item =>
            item.product._id.toString() === productId &&
            item.color === color &&
            item.size === size
    );

    if (removedItemIndex === -1) {
        return res.status(404).json({ message: 'Item not found in cart' });
    }

    const removedItem = cart.items[removedItemIndex];

    // Subtract the item's subtotal from the cart totals
    cart.subtotal -= removedItem.subtotal;
    cart.totalPrice -= removedItem.subtotal;

    // Remove the item from the cart's items array
    cart.items.splice(removedItemIndex, 1);

    // If the cart is empty, reset the totals
    if (cart.items.length === 0) {
        cart.subtotal = 0;
        cart.totalPrice = 0;
    }

    // Save the updated cart
    await cart.save();

    return res.status(200).json({ message: 'Product removed from cart', cart });

};


// Update the quantity of a product in the cart
export const updateCartItemQuantity = async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.params;
    const { color, size, quantity } = req.query;


    // Validate productId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid product ID format.' });
    }

    // Validate quantity
    if (quantity < 1) {
        return res.status(400).json({ message: 'Quantity must be greater than 0' });
    }


    // Fetch the cart and product in parallel to reduce DB calls
    const [cart, product] = await Promise.all([
        Cart.findOne({ user: userId }).populate({
            path: 'items.product',
            populate: {
                path: 'gender',
            },
        }),
        Product.findById(productId)
    ]);

    // Check if cart exists
    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }

    // Check if product exists
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    // Ensure the quantity doesn't exceed available stock
    if (quantity > product.quantity) {
        return res.status(400).json({
            message: `Cannot update to more than ${product.quantity} units.`,
        });
    }

    // Find the item in the cart
    const itemIndex = cart.items.findIndex(
        item => item.product._id.toString() === productId &&
            item.color === color &&
            item.size === size
    );

    // If the item is found, update it
    if (itemIndex >= 0) {
        const newSubtotal = product.price * quantity;
        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].subtotal = newSubtotal;

        // Recalculate subtotal and total price
        cart.subtotal = cart.items.reduce((acc, item) => acc + item.subtotal, 0);
        cart.totalPrice = cart.subtotal + cart.deliveryFee;

        // Save the updated cart
        await cart.save();

        return res.status(200).json({ message: 'Cart updated successfully', cart });
    }

    // If item not found in cart
    return res.status(404).json({ message: 'Item not found in cart' });
};



// Get the user's cart
export const getCart = async (req, res) => {
    const userId = req.user._id;

    // Find the user's cart or create a new one if it doesn't exist
    const cart = await Cart.findOneAndUpdate(
        { user: userId },
        { $setOnInsert: { items: [] } },
        { new: true, upsert: true }
    ).populate({
        path: 'items.product',
        populate: {
            path: 'gender',
        },
    });


    // Handle case where there are no items in the cart
    if (cart.items.length === 0) {
        return res.status(200).json({ message: 'Cart is empty', cart });
    }

    return res.status(200).json({ cart });
};



// Clear the user's cart (remove all items)
export const clearCart = async (req, res) => {
    const userId = req.user._id;

    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }

    // Clear the cart
    cart.items = [];
    cart.totalPrice = 0;
    cart.subtotal = 0;
    cart.updatedAt = Date.now();
    await cart.save();

    return res.status(200).json({ message: 'Cart cleared successfully', cart });
};
