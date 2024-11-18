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

//GET A SPECIFIC PRODUCT BY ITS ID
export const getProductById = async (req, res) => {
    const { productId } = req.params

    const product = await Product.findById(productId)
        .populate('gender')
        .populate('categoryId')
    res.status(200).json({ product })
}

export const filterProducts = async (req, res) => {
    const { categoryName, sortPrice, color, genderName, size, page = 1 } = req.query;
    const limit = 5;
    const skip = (parseInt(page) - 1) * limit;

    const query = {};
    // If categoryName is specified, add it to the query filter
    if (categoryName) {
        const categoryDoc = await Category.findOne({ categoryName });
        if (!categoryDoc) {
            return res.status(404).json({ message: "Category not found" });
        }
        query.categoryId = categoryDoc._id; // Use the ObjectId of the gender
    }

    // If genderName is specified, add it to the query filter
    if (genderName) {
        const genderDoc = await Gender.findOne({ gender: genderName });
        if (!genderDoc) {
            return res.status(404).json({ message: "gender not found" });        
        }
        query.gender = genderDoc._id; // Use the ObjectId of the gender
    }


    // Filter products by color if specified
    if (color) {
        query.colors = color; // Filter by the specified color
    }

    // Filter products by sizes if specified
    if (size) {
        query.sizes = size; // Filter by the specified color
    }

    // Set sorting options
    let sortOptions = {};

    // Sorting by price (ascending or descending)
    if (sortPrice === 'asc') {
        sortOptions.price = 1;  // Ascending order
    } else if (sortPrice === 'desc') {
        sortOptions.price = -1; // Descending order
    }


    const totalProducts = await Product.countDocuments(query);


    // Fetch products based on the constructed query

    const products = await Product.find(query)
        .populate('gender')
        .populate('categoryId')
        .skip(skip)
        .limit(limit)
        .sort(sortOptions);

    res.status(200).json({
        success: true, products, currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts
    });
}
