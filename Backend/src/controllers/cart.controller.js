import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockOfVariant } from "../dao/product.dao.js";
import { createRazorpayOrder } from "../services/payment.service.js";
import { getCartDetails } from "../dao/cart.dao.js";
import paymentModel from "../models/payment.model.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
import { config } from "../config/config.js";



export const addToCart = async (req, res) => {
    const { productId, variantId } = req.params;
    const { quantity = 1 } = req.body;

    const product = await productModel.findOne({
        _id: productId,
        "variants._id": variantId
    });

    if (!product) {
        return res.status(404).json({
            message: "Product or variant not found",
            success: false
        });
    }

    const stock = await stockOfVariant(productId, variantId);

    const cart =
        (await cartModel.findOne({ user: req.user._id })) ||
        (await cartModel.create({ user: req.user._id }));


    // Check whether same product + variant already exists
    const isProductAlreadyInCart = cart.items.some(
        item =>
            item.product.toString() === productId &&
            item.variant?.toString() === variantId
    );


    // If item already exists
    if (isProductAlreadyInCart) {

        const cartItem = cart.items.find(
            item =>
                item.product.toString() === productId &&
                item.variant?.toString() === variantId
        );

        const quantityInCart = cartItem.quantity;


        if (quantityInCart + quantity > stock) {
            return res.status(400).json({
                message: `Only ${stock} items left in stock. You already have ${quantityInCart} items in your cart`,
                success: false
            });
        }


        cartItem.quantity += quantity;

        await cart.save();

        return res.status(200).json({
            message: "Cart updated successfully",
            success: true
        });
    }


    // New item
    if (quantity > stock) {
        return res.status(400).json({
            message: `Only ${stock} items left in stock`,
            success: false
        });
    }


    // Find variant so we can store variant price
    const variant = product.variants.find(
        variant => variant._id.toString() === variantId
    );

    const price = variant?.price || product.price;


    cart.items.push({
        product: productId,
        variant: variantId,
        quantity,
        price
    });

    await cart.save();


    return res.status(200).json({
        message: "Product added to cart successfully",
        success: true
    });
};



export const getCart = async (req, res) => {

    const user = req.user;

     let cart = await getCartDetails(user._id);

    if (!cart) {
        cart = await cartModel.create({
            user: user._id
        });
    }


    return res.status(200).json({
        message: "Cart fetched successfully",
        success: true,
        cart
    });
};


export const incrementCartItemQuantity = async (req, res) => {

    const { productId, variantId } = req.params;


    const product = await productModel.findOne({
        _id: productId,
        "variants._id": variantId
    });


    if (!product) {
        return res.status(404).json({
            message: "Product or variant not found",
            success: false
        });
    }


    const cart = await cartModel.findOne({
        user: req.user._id
    });


    if (!cart) {
        return res.status(404).json({
            message: "Cart not found",
            success: false
        });
    }


    const stock = await stockOfVariant(productId, variantId);


    const cartItem = cart.items.find(
        item =>
            item.product.toString() === productId &&
            item.variant?.toString() === variantId
    );


    if (!cartItem) {
        return res.status(404).json({
            message: "Cart item not found",
            success: false
        });
    }


    if (cartItem.quantity + 1 > stock) {
        return res.status(400).json({
            message: `Only ${stock} items left in stock. You already have ${cartItem.quantity} items in your cart`,
            success: false
        });
    }


    cartItem.quantity += 1;

    await cart.save();


    return res.status(200).json({
        message: "Cart item quantity incremented successfully",
        success: true
    });
};



export const decrementCartItemQuantity = async (req, res) => {

    const { productId, variantId } = req.params;


    const product = await productModel.findOne({
        _id: productId,
        "variants._id": variantId
    });


    if (!product) {
        return res.status(404).json({
            message: "Product or variant not found",
            success: false
        });
    }


    const cart = await cartModel.findOne({
        user: req.user._id
    });


    if (!cart) {
        return res.status(404).json({
            message: "Cart not found",
            success: false
        });
    }


    const cartItem = cart.items.find(
        item =>
            item.product.toString() === productId &&
            item.variant?.toString() === variantId
    );


    if (!cartItem) {
        return res.status(404).json({
            message: "Cart item not found",
            success: false
        });
    }


    // If quantity is 1, remove item
    if (cartItem.quantity <= 1) {

        const itemIndex = cart.items.findIndex(
            item =>
                item.product.toString() === productId &&
                item.variant?.toString() === variantId
        );

        cart.items.splice(itemIndex, 1);

    } else {

        cartItem.quantity -= 1;

    }


    await cart.save();


    return res.status(200).json({
        message: "Cart item quantity decremented successfully",
        success: true
    });
};



export const removeCartItem = async (req, res) => {

    const { productId, variantId } = req.params;


    const cart = await cartModel.findOne({
        user: req.user._id
    });


    if (!cart) {
        return res.status(404).json({
            message: "Cart not found",
            success: false
        });
    }


    const itemIndex = cart.items.findIndex(
        item =>
            item.product.toString() === productId &&
            item.variant?.toString() === variantId
    );


    if (itemIndex === -1) {
        return res.status(404).json({
            message: "Cart item not found",
            success: false
        });
    }


    cart.items.splice(itemIndex, 1);

    await cart.save();


    return res.status(200).json({
        message: "Cart item removed successfully",
        success: true
    });
};



export const createOrderController = async (req, res) => {

    const cart = await getCartDetails(req.user._id);

 console.log("CART:", cart);
    console.log("TOTAL PRICE:", cart?.totalPrice);
    console.log("CURRENCY:", cart?.currency);

    if (!cart || cart.items.length === 0) {
        return res.status(400).json({
            message: "Cart is empty",
            success: false
        });
    }

    const order = await createRazorpayOrder(
         cart.totalPrice,
         cart.currency
    );


    const payment = await paymentModel.create({

        user: req.user._id,

        razorpay: {
            orderId: order.id
        },

        price: {
            amount: cart.totalPrice,
            currency: cart.currency
        },

        orderItems: cart.items.map(item => ({

            title: item.product.title,

            productId: item.product._id,

            variantId: item.variant,

            quantity: item.quantity,

            images: item.product.images,

            description: item.product.description,

            price: item.currentPrice || item.price

        }))
    });


    return res.status(200).json({
        message: "Order created successfully",
        success: true,
        order
    });
};


export const verifyOrderController = async (req, res) => {

    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    } = req.body;


    const payment = await paymentModel.findOne({
        "razorpay.orderId": razorpay_order_id,
        status: "pending"
    });


    if (!payment) {
        return res.status(400).json({
            message: "Payment not found",
            success: false
        });
    }


    const isPaymentValid = validatePaymentVerification(
        {
            order_id: razorpay_order_id,
            payment_id: razorpay_payment_id
        },
        razorpay_signature,
        config.RAZORPAY_KEY_SECRET
    );


    if (!isPaymentValid) {

        payment.status = "failed";

        await payment.save();

        return res.status(400).json({
            message: "Payment verification failed",
            success: false
        });
    }


    payment.status = "paid";

    payment.razorpay.paymentId = razorpay_payment_id;

    payment.razorpay.signature = razorpay_signature;


    await payment.save();


    return res.status(200).json({
        message: "Payment verified successfully",
        success: true
    });
};

export const getOrderByIdController = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await paymentModel.findOne({
      "razorpay.orderId": orderId,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {
    console.error("Get order error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};