import { Product } from '../models/product.model.js';
import { Gender } from '../models/gender.model.js';
import { Category } from '../models/category.model.js';
import { findResource } from '../utils/findResource.js';

// GET ALL PRODUCTS
export const getAllProducts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    // Fetch all products 
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


// GET PRODUCTS BY GENDER AND CATEGORY
export const getProductsByGenderAndCategory = async (req, res) => {
    const { gender, categoryName } = req.params;
    const page = parseInt(req.query.page) || 1;  // Default to page 1
    const limit = 5;  // Default to 5 products per page
    const skip = (page - 1) * limit;

    // Fetch gender and category concurrently (in parallel)
    const [genderDoc, categoryDoc] = await Promise.all([
        findResource(Gender, { gender }, 'Gender'),
        findResource(Category, { categoryName }, 'Category')
    ]);

    if (!genderDoc) return res.status(404).json({ message: 'Gender not found' });
    if (!categoryDoc) return res.status(404).json({ message: 'Category not found' });

    // Find products by gender and category using their ObjectIds
    const products = await Product.find({
        gender: genderDoc._id,
        categoryId: categoryDoc._id
    })
        .populate('gender')
        .populate('categoryId')
        .skip(skip)
        .limit(limit);

    if (products.length === 0) {
        return res.status(404).json({ message: 'No products found' });
    }

    // Get total count of matching products
    const totalProducts = await Product.countDocuments({
        gender: genderDoc._id,
        categoryId: categoryDoc._id
    });

    res.status(200).json({
        products,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts
    });
};
