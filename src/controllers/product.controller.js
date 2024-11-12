import {Product} from '../models/product.model.js'
import { Gender } from '../models/gender.model.js';
import { Category } from '../models/category.model.js';


//controller for all products
export const getAllProducts = async (req, res) => {
    const Products=await Product.find().populate('gender').populate('categoryId')
    res.status(200).json({ Products });
}