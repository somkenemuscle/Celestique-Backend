import slugify from 'slugify';
import { Product } from '../models/product.model.js';


// Helper function to generate unique slugs
async function generateUniqueSlug(name) {
    let slug = slugify(name, { lower: true, strict: true });
    let existingSlug = await Product.findOne({ slug });

    let count = 1;
    while (existingSlug) {
        slug = `${slugify(name, { lower: true, strict: true })}-${count}`;
        existingSlug = await Product.findOne({ slug });
        count++;
    }
    return slug;
}

export default generateUniqueSlug;