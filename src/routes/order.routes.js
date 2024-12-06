import express from 'express';
import { getUserOrderDetails, getUserOrders } from '../controllers/order.controller.js';
import handleAsyncErr from '../utils/catchAsync.js'
import isLoggedin from '../utils/isLoggedin.js';

const router = express.Router();

// Get the user's Orders
router.get('/', isLoggedin, handleAsyncErr(getUserOrders));

// Get the user's Orders
router.get('/:orderId',isLoggedin, handleAsyncErr(getUserOrderDetails))

export default router;
