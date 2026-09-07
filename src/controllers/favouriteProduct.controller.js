import { Product } from '../models/product.model.js';
import { FavoriteProduct } from '../models/favoriteProduct.model.js';


//GET SAVED PRODUCTS FOR USER
export const getSavedProducts = async (req, res) => {
    const userId = req.user._id;

    if (!userId) return res.status(400).json({ message: 'User Id is required' });

    const favoriteProducts = await FavoriteProduct.findOneAndUpdate(
        { user: userId }, {}, { new: true, upsert: true }
    ).populate('savedItems');

    res.status(200).json({ favoriteProducts });
}


//ADD PRODUCT TO FAVORITES FOR USER
export const addProductsToFavorite = async (req, res) => {
    const productId = req.params.id;
    const userId = req.user._id;

    if (!productId) return res.status(400).json({ message: 'Product Id is required' });
    if (!userId) return res.status(400).json({ message: 'User Id is required' });

    const favoriteProducts = await FavoriteProduct.findOneAndUpdate(
        { user: userId }, {}, { new: true, upsert: true }
    );

    const product = await Product.findById(productId);

    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Check if the product is already in the savedItems array
    const productIndex = favoriteProducts.savedItems.indexOf(productId);

    if (productIndex > -1) {
        // Product exists, so remove it
        favoriteProducts.savedItems.splice(productIndex, 1);
        await favoriteProducts.save();
        return res.status(200).json({ message: 'Product removed from favorites', favoriteProducts });
    } else {
        // Product does not exist, so add it
        favoriteProducts.savedItems.push(productId);
        await favoriteProducts.save();
        return res.status(200).json({ message: 'Product added to favorites', favoriteProducts });
    }
}
