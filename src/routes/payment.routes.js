import express from 'express';
import { initializePayment, verifyPayment } from '../controllers/payment.controller.js';
import handleAsyncErr from '../utils/catchAsync.js'

const router = express.Router();

// Route to initialize payment
router.post('/initialize', handleAsyncErr(initializePayment));

// Route to verify payment
router.post('/verify', handleAsyncErr(verifyPayment));

export default router;
