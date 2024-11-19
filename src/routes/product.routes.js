import { getProductsByGenderAndCategory, getProductById, findProductBySearch, filterProducts } from "../controllers/product.controller.js";
import express from 'express';
import handleAsyncErr from '../utils/catchAsync.js';


const router = express.Router();
// Route to initialize payment
router.get('/', handleAsyncErr(filterProducts));

// Route to search products (should be above the productId route)
router.get('/search', handleAsyncErr(findProductBySearch));

// Route to get products by gender and category
router.get('/:gender/:categoryName', handleAsyncErr(getProductsByGenderAndCategory));

// Route to get a specific product by its ID (should come after other routes)
router.get('/:productId', handleAsyncErr(getProductById));


export default router;