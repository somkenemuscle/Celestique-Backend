import express from 'express';
import { } from '../controllers/cart.controller.js';
import handleAsyncErr from '../utils/catchAsync.js'
import isLoggedin from '../utils/isLoggedin.js';

const router = express.Router();

// Route to get users cart
router.get('/', isLoggedin, handleAsyncErr());

// Route to add product to users cart
router.post('/add', isLoggedin, handleAsyncErr());

// Route to remove product from users cart
router.delete('/remove', isLoggedin, handleAsyncErr());


export default router;
