import productModel from '../models/product.model.js';

export const stockOfVariant = async (productId, variantId) => {
    const product = await productModel.findOne({
        _id: productId,
        "variants._id": variantId
    });

    if (!product) return 0;

    const variant = product.variants.find(
        v => v._id.toString() === variantId
    );

    return variant?.stock ?? 0;
};


export const getPaginatedProducts = async ({
    page = 1,
    limit = 9,
    category,
    featured,
    sort
} = {}) => {
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 9));
    const skip = (pageNum - 1) * limitNum;

    // Filter
    const filter = {};
    if (category) filter.category = category;
    if (featured === true || featured === "true") filter.isFeatured = true;

    // Sort
    let sortOption = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { "price.amount": 1 };
    if (sort === "price_desc") sortOption = { "price.amount": -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };

    // Parallel: find + count
    const [products, total] = await Promise.all([
        productModel
            .find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(limitNum)
            .lean(),
        productModel.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limitNum);

    return {
        products,
        pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages,
            hasNext: pageNum < totalPages,
            hasPrev: pageNum > 1
        }
    };
};