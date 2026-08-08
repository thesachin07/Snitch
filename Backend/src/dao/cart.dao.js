import mongoose from "mongoose";
import cartModel from "../models/cart.model.js";


export const getCartDetails = async (userId) => {

    const cart = await cartModel.aggregate([

        // Find user's cart
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId)
            }
        },

        // One cart item at a time
        {
            $unwind: "$items"
        },

        // Get product details
        {
            $lookup: {
                from: "products",
                localField: "items.product",
                foreignField: "_id",
                as: "product"
            }
        },

        {
            $unwind: "$product"
        },

        // Keep all product variants
        {
            $addFields: {
                productVariants: "$product.variants"
            }
        },

        // Find the specific variant
        {
            $unwind: "$product.variants"
        },

        {
            $match: {
                $expr: {
                    $eq: [
                        "$items.variant",
                        "$product.variants._id"
                    ]
                }
            }
        },

        // Get current price and item total
        {
            $addFields: {

                currentPrice: {
                    $ifNull: [
                        "$product.variants.price",
                        "$product.price"
                    ]
                },

                itemTotal: {
                    $multiply: [
                        "$items.quantity",
                        {
                            $ifNull: [
                                "$product.variants.price.amount",
                                "$product.price.amount"
                            ]
                        }
                    ]
                }
            }
        },

        // Shape response
        {
            $project: {

                user: 1,

                itemTotal: 1,

                currency: "$currentPrice.currency",

                item: {

                    _id: "$items._id",

                    quantity: "$items.quantity",

                    price: "$items.price",

                    currentPrice: "$currentPrice",

                    product: {

                        _id: "$product._id",

                        title: "$product.title",

                        slug: "$product.slug",

                        brand: "$product.brand",

                        description: "$product.description",

                        price: "$product.price",

                        images: "$product.images",

                        variants: "$productVariants"
                    },

                    variant: "$items.variant"
                }
            }
        },

        // Put cart items back together
        {
            $group: {

                _id: "$_id",

                user: {
                    $first: "$user"
                },

                totalPrice: {
                    $sum: "$itemTotal"
                },

                currency: {
                    $first: "$currency"
                },

                items: {
                    $push: "$item"
                }
            }
        }
    ]);

    return cart[0] || null;
};