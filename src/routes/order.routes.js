import express from 'express';
import { getUserOrderDetails, getUserOrders } from '../controllers/order.controller.js';
import handleAsyncErr from '../utils/catchAsync.js'

const router = express.Router();

// Get the user's Orders
router.get('/',  handleAsyncErr(getUserOrders));

// Get the user's Orders
router.get('/:orderId',  handleAsyncErr(getUserOrderDetails))

export default router;
