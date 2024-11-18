
import express from 'express';
import handleAsyncErr from '../utils/catchAsync.js';


const router = express.Router();

// Route to search products (should be above the productId route)
router.get('/search', handleAsyncErr(findProductBySearch));


// Route to get a specific product by its ID (should come after other routes)
router.get('/:productId', handleAsyncErr(getProductById));


export default router;