import { Product } from '../models/product.model.js'
import { Gender } from '../models/gender.model.js';
import { Category } from '../models/category.model.js';


//GET ALL PRODUCTS
export const getAllProducts = async (req, res) => {

    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = 5; // Default to 10 products per page if not provided
    const skip = (page - 1) * limit;

    const products = await Product.find()
        .populate('gender')
        .populate('categoryId')
        .skip(skip)
        .limit(limit);

    const totalProducts = await Product.countDocuments();

    res.status(200).json({
        products,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts
    });
};



//GET PRODUCTS BY GENDER AND CATEGORY
export const getProductsByGenderAndCategory = async (req, res) => {
    const { gender, category } = req.params;
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = 5; // Default to 15 products per page
    const skip = (page - 1) * limit;

    // Fetch products based on gender and category, with pagination
    const products = await Product.find({
        'gender.gender': gender,
        'categoryId.categoryName': category
    })
        .populate('gender')
        .populate('categoryId')
        .skip(skip)
        .limit(limit);
    console.log(products, "******")

    if ((!products)) {
        res.status(404).json({ message: 'Product not found' })
    }
    // Get the total count of matching products
    const totalProducts = await Product.countDocuments({
        'gender.gender': gender,
        'categoryId.categoryName': category
    });

    res.status(200).json({
        products,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts
    });
};