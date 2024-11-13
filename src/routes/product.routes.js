import { getAllProducts, getProductsByGenderAndCategory,getProductById } from "../controllers/product.controller.js";
import express from 'express';
import handleAsyncErr from '../utils/catchAsync.js';


const router = express.Router();

// Route to initialize payment
router.get('/', handleAsyncErr(getAllProducts));

router.get('/:gender/:categoryName', handleAsyncErr(getProductsByGenderAndCategory));

router.get('/:productId', handleAsyncErr(getProductById));


export default router;