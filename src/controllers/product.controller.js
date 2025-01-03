import { Product } from '../models/product.model.js';
import { Gender } from '../models/gender.model.js';
import { Category } from '../models/category.model.js';
import { findResource } from '../utils/findResource.js';
import { paginate } from '../utils/pagination.js';
import { buildProductQuery } from '../utils/filterProducts.js';


//GET PRODUCTS BY FILTERS
export const filterProducts = async (req, res) => {
    const { sortPrice, color, size, page } = req.query;
    const { skip, limit } = paginate(parseInt(page) || 1, 8);

    // Build the query dynamically
    const { filters, sortOptions } = buildProductQuery({ sortPrice, color, size });

    // Fetch products with filters and sorting
    const totalProducts = await Product.countDocuments(filters);
    const products = await Product.find(filters)
        .populate('categoryId')
        .populate('gender')
        .skip(skip)
        .limit(limit)
        .sort(sortOptions);

    if (products.length === 0) {
        return res.status(404).json({ message: 'No products found' });
    }

    res.status(200).json({
        success: true,
        products,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts,
    });
};


//GET PRODUCTS BY GENDER & CATEGORY
export const getProductsByGenderAndCategory = async (req, res) => {
    const { gender, categoryName } = req.params;
    const { sortPrice, color, size, page } = req.query;
    const { skip, limit } = paginate(parseInt(page) || 1, 8);

    if (!gender || !categoryName) {
        return res.status(400).json({ message: 'Gender and Category params are required' });
    }

    // Build the query dynamically
    const { filters, sortOptions } = buildProductQuery({ sortPrice, color, size });

    // Fetch gender and category concurrently (in parallel)
    const [genderDoc, categoryDoc] = await Promise.all([
        // Using case-insensitive regex to find gender
        findResource(Gender, { gender: { $regex: new RegExp('^' + gender + '$', 'i') } }, 'Gender'),
        // Using case-insensitive regex to find category
        findResource(Category, { categoryName: { $regex: new RegExp('^' + categoryName + '$', 'i') } }, 'Category')
    ]);

    if (!genderDoc) return res.status(404).json({ message: 'Gender not found' });
    if (!categoryDoc) return res.status(404).json({ message: 'Category not found' });

    // Add gender and category filters to the dynamic filters
    filters.gender = genderDoc._id;
    filters.categoryId = categoryDoc._id;

    // Find products by gender and category using their ObjectIds
    const products = await Product.find(filters)
        .populate('gender')
        .populate('categoryId')
        .skip(skip)
        .limit(limit)
        .sort(sortOptions);

    if (products.length === 0) {
        return res.status(404).json({ message: 'No products found' });
    }

    // Get total count of matching products
    const totalProducts = await Product.countDocuments(filters);

    res.status(200).json({
        products,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts
    });
};


//GET PRODUCTS BY GENDER
export const getProductsByGender = async (req, res) => {
    const { gender } = req.params;
    const { sortPrice, color, size, page } = req.query;
    const { skip, limit } = paginate(parseInt(page) || 1, 5);

    if (!gender) {
        return res.status(400).json({ message: 'Gender param is required' });
    }

    // Use a case-insensitive regular expression to find gender
    const genderDoc = await Gender.findOne({ gender: { $regex: new RegExp('^' + gender + '$', 'i') } });

    if (!genderDoc) {
        return res.status(404).json({ message: 'Gender not found' });
    }

    // Build the query dynamically
    const { filters, sortOptions } = buildProductQuery({ sortPrice, color, size });

    // Add the gender filter
    filters.gender = genderDoc._id;

    // Find products that match the gender and optional filters
    const products = await Product.find(filters)
        .populate('gender')
        .populate('categoryId')
        .sort(sortOptions) // Apply sorting options
        .skip(skip)
        .limit(limit);

    if (products.length === 0) {
        return res.status(404).json({ message: 'No products found for the specified gender' });
    }

    // Get the total count of matching products
    const totalProducts = await Product.countDocuments(filters);

    res.status(200).json({
        products,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts,
    });
};


//GET A SPECIFIC PRODUCT BY ITS SLUG
export const getProductBySlug = async (req, res) => {
    const { slug } = req.params

    if (!slug) {
        return res.status(400).json({ message: 'Slug param is required' });
    }

    const product = await Product.findOne({ slug })
        .populate('gender')
        .populate('categoryId');

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ product })
}




// GET A SPECIFIC PRODUCT BY SEARCHING BY ITS NAME
export const findProductBySearch = async (req, res) => {
    const { query, page } = req.query;
    const { skip, limit } = paginate(parseInt(page) || 1, 5);

    // Check if a query string is provided
    if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
    }

    // Use regex for partial matching of product names
    const regex = new RegExp(query, 'i'); // 'i' for case-insensitive search

    // Fetch products that match the search query as a substring
    const products = await Product.find({
        name: { $regex: regex } // Partial match on the product name
    })
        .populate('gender') // Populate gender field
        .populate('categoryId') // Populate category field
        .skip(skip) // Skip to the correct page
        .limit(limit); // Limit the number of products per page

    // Get the total number of matching products (for pagination info)
    const totalProducts = await Product.countDocuments({
        name: { $regex: regex } // Count products matching the partial query
    });

    // If no products are found, return a 404 response
    if (products.length === 0) {
        return res.status(404).json({ message: 'No products found' });
    }

    // Return the found products with pagination info
    return res.status(200).json({
        success: true,
        results: products.length,
        totalResults: totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: page,
        products,
    });
};


