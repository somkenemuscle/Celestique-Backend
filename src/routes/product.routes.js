import { getProductsByGenderAndCategory, getProductBySlug, findProductBySearch, filterProducts, getProductsByGender} from "../controllers/product.controller.js";
import express from 'express';
import handleAsyncErr from '../utils/catchAsync.js';

const router = express.Router();

router.get('/', handleAsyncErr(filterProducts));

// Route to search products (should be above the productId route)
router.get('/search', handleAsyncErr(findProductBySearch));

// Route to get products by gender 
router.get('/:gender/all', handleAsyncErr(getProductsByGender));

// Route to get products by gender and category
router.get('/:gender/:categoryName', handleAsyncErr(getProductsByGenderAndCategory));

// Route to get a specific product by its Slug (should come after other routes)
router.get('/:slug', handleAsyncErr(getProductBySlug));




export default router;