export const paginate = (page, limit = 5) => {
    const skip = (page - 1) * limit;
    return { skip, limit };
};
