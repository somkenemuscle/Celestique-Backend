import { getAllProducts } from "../controllers/product.controller.js";
import express from 'express';
import handleAsyncErr from '../utils/catchAsync.js';


const router = express.Router();

// Route to initialize payment
router.get('/', handleAsyncErr(getAllProducts));


export default router;