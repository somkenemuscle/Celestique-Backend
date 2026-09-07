import express from 'express';
import { addProductsToFavorite, getSavedProducts } from "../controllers/favouriteProduct.controller.js";
import handleAsyncErr from '../utils/catchAsync.js';


const router = express.Router();

//Route to get users fav products
router.get('/', getSavedProducts);

//Route to add a product to favourites
router.post('/:id/save', handleAsyncErr(addProductsToFavorite));

export default router;
