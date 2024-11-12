import { getAllProducts, getProductsByGenderAndCategory } from "../controllers/product.controller.js";
import express from 'express';
import handleAsyncErr from '../utils/catchAsync.js';


const router = express.Router();

// Route to initialize payment
router.get('/', handleAsyncErr(getAllProducts));

router.get('/:gender/:category', handleAsyncErr(getProductsByGenderAndCategory));



export default router;