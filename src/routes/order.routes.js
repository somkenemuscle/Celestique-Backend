import express from 'express';
import { getUserOrders } from '../controllers/order.controller.js';
import handleAsyncErr from '../utils/catchAsync.js'
import isLoggedin from '../utils/isLoggedin.js';

const router = express.Router();

// Get the user's Orders
router.get('/', isLoggedin, handleAsyncErr(getUserOrders));

export default router;
