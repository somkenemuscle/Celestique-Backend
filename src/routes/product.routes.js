import {getProductById,filterProducts } from "../controllers/product.controller.js";
import express from 'express';
import handleAsyncErr from '../utils/catchAsync.js';


const router = express.Router();

// Route to initialize payment
router.get('/', handleAsyncErr(filterProducts));

router.get('/:productId', handleAsyncErr(getProductById));


export default router;