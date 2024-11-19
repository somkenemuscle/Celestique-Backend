
export const buildProductQuery = ({ sortPrice, color, size }) => {
    const filters = {};
    const sortOptions = {};

    // Case-insensitive color filter
    if (color) {
        filters.colors = { $in: [new RegExp(color, 'i')] };
    }

    // Case-insensitive size filter
    if (size) {
        filters.sizes = { $in: [new RegExp(size, 'i')] };
    }

    // Sorting by price (ascending or descending)
    if (sortPrice === 'asc') {
        sortOptions.price = 1; // Low to high
    } else if (sortPrice === 'desc') {
        sortOptions.price = -1; // High to low
    }

    return { filters, sortOptions };
};
