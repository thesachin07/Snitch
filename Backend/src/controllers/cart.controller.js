import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockOfVariant } from "../dao/product.dao.js";

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
      price: product.price,
    });
  }

  await cart.save();

  return res.status(200).json({
    message: "Cart updated successfully",
    success: true,
    cart,
  });
};

export const getCart = async (req, res) => {
  const user = req.user;

  let cart = await cartModel.findOne({ user: user._id }).populate("items.product");

  if (!cart) {
    cart = await cartModel.create({ user: user._id, items: [] });
  }

  return res.status(200).json({
    message: "Cart fetched successfully",
    success: true,
    cart,
  });
};