import express from 'express';
import { initializePayment, verifyPayment } from '../controllers/payment.controller.js';
import handleAsyncErr from '../utils/catchAsync.js'
import isLoggedin from '../utils/isLoggedin.js';

const router = express.Router();

// Route to initialize payment
router.post('/initialize', isLoggedin, handleAsyncErr(initializePayment));

// Route to verify payment
router.post('/verify', isLoggedin, handleAsyncErr(verifyPayment));

export default router;
