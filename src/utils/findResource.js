// Utility function for finding a resource (Gender or Category)
export const findResource = async (model, query, resourceName) => {
    const resource = await model.findOne(query);
    if (!resource) throw new Error(`${resourceName} not found`);
    return resource;
};


