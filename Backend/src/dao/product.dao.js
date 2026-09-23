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


export const reserveStock = async (items) => {
    const reserved = [];

    for (const item of items) {
        //  STEP 1: Product fetch karo
        const product = await productModel.findOne({
            _id: item.productId,
            "variants._id": item.variantId
        });

        if (!product) {
            await releaseStock(reserved);
            throw new Error(`Product or variant not found`);
        }

        const variant = product.variants.id(item.variantId);
        if (!variant) {
            await releaseStock(reserved);
            throw new Error(`Variant not found`);
        }

        // STEP 2: Manual check
        const stock = variant.stock ?? 0;
        const reservedStock = variant.reservedStock ?? 0;
        const available = stock - reservedStock;

        if (available < item.quantity) {
            await releaseStock(reserved);
            throw new Error(`Only ${available} items available`);
        }

        // STEP 3: Simple atomic increment
        const updated = await productModel.findOneAndUpdate(
            {
                _id: item.productId,
                "variants._id": item.variantId
            },
            {
                $inc: { "variants.$.reservedStock": item.quantity }
            },
            { new: true }
        );

        // STEP 4: Post-check — agar kisi aur ne race mein oversell kiya
        const updatedVariant = updated.variants.id(item.variantId);
        if (updatedVariant.reservedStock > updatedVariant.stock) {
            // Rollback this update
            await productModel.updateOne(
                { _id: item.productId, "variants._id": item.variantId },
                { $inc: { "variants.$.reservedStock": -item.quantity } }
            );
            await releaseStock(reserved);
            throw new Error(`Race condition detected, please retry`);
        }

        reserved.push(item);
    }

    return reserved;
};

export const releaseStock = async (items) => {
    for (const item of items) {
        await productModel.findOneAndUpdate(
            {
                _id: item.productId,
                "variants._id": item.variantId
            },
            {
                $inc: { "variants.$.reservedStock": -item.quantity }
            }
        );
    }
};


export const commitStock = async (items) => {
    for (const item of items) {
        await productModel.findOneAndUpdate(
            {
                _id: item.productId,
                "variants._id": item.variantId
            },
            {
                $inc: {
                    "variants.$.stock": -item.quantity,
                    "variants.$.reservedStock": -item.quantity
                }
            }
        );
    }
};