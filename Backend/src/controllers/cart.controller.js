import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockOfVariant } from "../dao/product.dao.js";
import mongoose from "mongoose";

const getItemCurrentPrice = (item) => {
  if (!item) return null;
  const product = item.product;
  const variantId = item.variant?.toString();

  if (product?.variants?.length) {
    const currentVariant = product.variants.find(
      (variant) => variant._id?.toString() === variantId,
    );
    if (currentVariant?.price) return currentVariant.price;
  }

  if (product?.price) return product.price;
  return item.price ?? null;
};

const calculateCartTotal = (cart) => {
  if (!cart?.items?.length) return 0;

  return cart.items.reduce((total, item) => {
    const currentPrice = getItemCurrentPrice(item);
    const amount = Number(currentPrice?.amount ?? 0);
    const quantity = Number(item.quantity ?? 0);
    return total + amount * quantity;
  }, 0);
};

const buildCartResponse = async (cart) => {
  if (!cart) return null;

  await cart.populate("items.product");
  const cartObj = cart.toObject();
  cartObj.items = Array.isArray(cartObj.items)
    ? cartObj.items.map((item) => ({
        ...item,
        currentPrice: getItemCurrentPrice(item),
      }))
    : [];
  cartObj.totalPrice = calculateCartTotal(cartObj);
  return cartObj;
};

export const addToCart = async (req, res) => {
  const { productId, variantId } = req.params;
  const quantity = Number(req.body?.quantity) || 1;

  const product = await productModel.findOne({
    _id: productId,
    "variants._id": variantId,
  });

  if (!product) {
    return res.status(404).json({
      message: "Product or variant not found",
      success: false,
    });
  }

  const variant = product.variants.find((variant) => variant._id?.toString() === variantId?.toString());
  const price = variant?.price ?? product.price;
  const stock = await stockOfVariant(productId, variantId);

  let cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    cart = await cartModel.create({ user: req.user._id, items: [] });
  }

  const existingItemIndex = cart.items.findIndex(
    (item) =>
      item.product.toString() === productId &&
      item.variant?.toString() === variantId
  );

  if (existingItemIndex > -1) {
    const currentQtyInCart = cart.items[existingItemIndex].quantity;
    if (currentQtyInCart + quantity > stock) {
      return res.status(400).json({
        message: `Only ${stock} items left in stock. You already have ${currentQtyInCart} in your cart.`,
        success: false,
      });
    }

    cart.items[existingItemIndex].quantity += quantity;
  } else {
    if (quantity > stock) {
      return res.status(400).json({
        message: `Only ${stock} items left in stock`,
        success: false,
      });
    }

    cart.items.push({
      product: productId,
      variant: variantId,
      quantity,
      price,
    });
  }

  await cart.save();
  const responseCart = await buildCartResponse(cart);

  return res.status(200).json({
    message: "Cart updated successfully",
    success: true,
    cart: responseCart,
  });
};


export const getCart = async (req, res) => {
  const cart = await cartModel.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(req.user._id),
      },
    },

    {
      $unwind: "$items",
    },

    {
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "product",
      },
    },

    {
      $unwind: "$product",
    },

    {
      $addFields: {
        productVariants: "$product.variants",
      },
    },

    {
      $unwind: "$product.variants",
    },

    {
      $match: {
        $expr: {
          $eq: [
            "$items.variant",
            "$product.variants._id",
          ],
        },
      },
    },

    {
      $addFields: {
        currentPrice: {
          $ifNull: [
            "$product.variants.price",
            "$product.price",
          ],
        },
        itemTotal: {
          $multiply: [
            "$items.quantity",
            {
              $ifNull: [
                "$product.variants.price.amount",
                "$product.price.amount",
              ],
            },
          ],
        },
      },
    },

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
        variants: "$productVariants",
      },

      variant: "$items.variant",
    }
  }
},

    {
      $group: {
        _id: "$_id",

        user: {
          $first: "$user",
        },

        totalPrice: {
          $sum: "$itemTotal",
        },

        currency: {
          $first: "$currency",
        },

        items: {
          $push: "$item",
        },
      },
    },
  ]);

  if (cart.length === 0) {
    return res.status(200).json({
      success: true,
      message: "Cart is empty",
      cart: {
        items: [],
        totalPrice: 0,
        currency: "INR",
      },
    });
  }

  return res.status(200).json({
    success: true,
    message: "Cart fetched successfully",
    cart: cart[0],
  });
};

export const incrementCartItemQuantity = async (req, res) => {
  const { productId, variantId } = req.params;

  const product = await productModel.findOne({
    _id: productId,
    "variants._id": variantId,
  });

  if (!product) {
    return res.status(404).json({
      message: "Product or variant not found",
      success: false,
    });
  }

  const cart = await cartModel.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({
      message: "Cart not found",
      success: false,
    });
  }

  const stock = await stockOfVariant(productId, variantId);
  const cartItem = cart.items.find(
    (item) =>
      item.product.toString() === productId &&
      item.variant?.toString() === variantId
  );

  if (!cartItem) {
    return res.status(404).json({
      message: "Cart item not found",
      success: false,
    });
  }

  if (cartItem.quantity + 1 > stock) {
    return res.status(400).json({
      message: `Only ${stock} items left in stock. You already have ${cartItem.quantity} items in your cart`,
      success: false,
    });
  }

  cartItem.quantity += 1;
  await cart.save();
  const responseCart = await buildCartResponse(cart);

  return res.status(200).json({
    message: "Cart item quantity incremented successfully",
    success: true,
    cart: responseCart,
  });
};

export const decrementCartItemQuantity = async (req, res) => {
  const { productId, variantId } = req.params;

  const product = await productModel.findOne({
    _id: productId,
    "variants._id": variantId,
  });

  if (!product) {
    return res.status(404).json({
      message: "Product or variant not found",
      success: false,
    });
  }

  const cart = await cartModel.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({
      message: "Cart not found",
      success: false,
    });
  }

  const itemIndex = cart.items.findIndex(
    (item) =>
      item.product.toString() === productId &&
      item.variant?.toString() === variantId
  );

  if (itemIndex === -1) {
    return res.status(404).json({
      message: "Cart item not found",
      success: false,
    });
  }

  if (cart.items[itemIndex].quantity <= 1) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity -= 1;
  }

  await cart.save();
  const responseCart = await buildCartResponse(cart);

  return res.status(200).json({
    message: "Cart item quantity decremented successfully",
    success: true,
    cart: responseCart,
  });
};

export const removeCartItem = async (req, res) => {
  const { productId, variantId } = req.params;

  const cart = await cartModel.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({
      message: "Cart not found",
      success: false,
    });
  }

  const itemIndex = cart.items.findIndex(
    (item) =>
      item.product.toString() === productId &&
      item.variant?.toString() === variantId
  );

  if (itemIndex === -1) {
    return res.status(404).json({
      message: "Cart item not found",
      success: false,
    });
  }

  cart.items.splice(itemIndex, 1);
  await cart.save();
  const responseCart = await buildCartResponse(cart);

  return res.status(200).json({
    message: "Cart item removed successfully",
    success: true,
    cart: responseCart,
  });
};