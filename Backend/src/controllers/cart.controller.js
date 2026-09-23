import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockOfVariant } from "../dao/product.dao.js";
import { createRazorpayOrder } from "../services/payment.service.js";
import { getCartDetails } from "../dao/cart.dao.js";
import paymentModel from "../models/payment.model.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
import { config } from "../config/config.js";
import { reserveStock, releaseStock } from "../dao/product.dao.js";
import reservationModel from "../models/reservation.model.js";

const getUpdatedCart = async userId => {
    return (
        (await getCartDetails(userId)) || {
            totalPrice: 0,
            currency: null,
            items: []
        }
    );
};

export const addToCart = async (req, res) => {
    const { productId, variantId } = req.params;
    const { quantity } = req.body || {};
    const quantityValue = Number(quantity) || 1;

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


        if (quantityInCart + quantityValue > stock) {
            return res.status(400).json({
                message: `Only ${stock} items left in stock. You already have ${quantityInCart} items in your cart`,
                success: false
            });
        }


        cartItem.quantity += quantityValue;

        await cart.save();
        const updatedCart = await getUpdatedCart(req.user._id);

        return res.status(200).json({
            message: "Cart updated successfully",
            success: true,
            cart: updatedCart
        });
    }


    // New item
    if (quantityValue > stock) {
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
        quantity: quantityValue,
        price
    });

    await cart.save();
    const updatedCart = await getUpdatedCart(req.user._id);

    return res.status(200).json({
        message: "Product added to cart successfully",
        success: true,
        cart: updatedCart
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
    const updatedCart = await getUpdatedCart(req.user._id);

    return res.status(200).json({
        message: "Cart item quantity incremented successfully",
        success: true,
        cart: updatedCart
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
    const updatedCart = await getUpdatedCart(req.user._id);

    return res.status(200).json({
        message: "Cart item quantity decremented successfully",
        success: true,
        cart: updatedCart
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
    const updatedCart = await getUpdatedCart(req.user._id);

    return res.status(200).json({
        message: "Cart item removed successfully",
        success: true,
        cart: updatedCart
    });
};



export const createOrderController = async (req, res) => {
    try {
        const cart = await getCartDetails(req.user._id);

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                message: "Cart is empty",
                success: false
            });
        }

        // STEP 1: Reserve list 
        const itemsToReserve = cart.items.map((item) => ({
            productId: item.product._id,
            variantId: item.variant,
            quantity: item.quantity
        }));

        // STEP 2: Stock hold/reserve  (agar stock kam hoga toh yahi catch block me jayega)
        let reserved;
        try {
            reserved = await reserveStock(itemsToReserve);
        } catch (err) {
            return res.status(409).json({
                message: err.message || "Stock unavailable",
                success: false
            });
        }

        // STEP 3: Razorpay order creation  (fail hua toh rollback stock)
        let order;
        try {
            order = await createRazorpayOrder(
                cart.totalPrice,
                cart.currency
            );
        } catch (err) {
            await releaseStock(reserved);
            return res.status(500).json({
                message: "Payment gateway error",
                success: false
            });
        }

        // STEP 4: Payment document create  (existing logic intact)
        const payment = await paymentModel.create({
            user: req.user._id,
            razorpay: {
                orderId: order.id
            },
            price: {
                amount: cart.totalPrice,
                currency: cart.currency
            },
            orderItems: cart.items.map(item => {
                const variant = item.product.variants?.find(
                    v => v._id.toString() === item.variant.toString()
                );

                const variantAttributes = variant?.attributes;
                const variantLabel = variantAttributes
                    ? Array.isArray(variantAttributes)
                        ? variantAttributes.map(([key, value]) => `${key}: ${value}`).join(", ")
                        : variantAttributes instanceof Map
                            ? Array.from(variantAttributes.entries()).map(([key, value]) => `${key}: ${value}`).join(", ")
                            : Object.entries(variantAttributes).map(([key, value]) => `${key}: ${value}`).join(", ")
                    : undefined;

                const itemPrice = item.currentPrice || item.price;
                const itemTotal = (itemPrice?.amount || 0) * item.quantity;

                return {
                    title: item.product.title,
                    productId: item.product._id,
                    variantId: item.variant,
                    variant: variantLabel,
                    quantity: item.quantity,
                    images: item.product.images,
                    description: item.product.description,
                    price: itemPrice,
                    itemTotal
                };
            })
        });

        // STEP 5: Reservation track record  (10 minute validity)
        await reservationModel.create({
            user: req.user._id,
            payment: payment._id,
            items: reserved,
            status: "active",
            expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        });

        return res.status(200).json({
            message: "Order created successfully",
            success: true,
            order
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            success: false
        });
    }
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

    // Idempotency check
    if (payment.status === "paid") {
        return res.status(200).json({
            message: "Already processed",
            success: true
        });
    }

    // Verify signature
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

        //  Release reservation
        const reservation = await reservationModel.findOne({
            payment: payment._id,
            status: "active"
        });

        if (reservation) {
            await releaseStock(reservation.items);
            reservation.status = "released";
            await reservation.save();
        }

        return res.status(400).json({
            message: "Payment verification failed",
            success: false
        });
    }

    //  STEP 1: Find reservation
    const reservation = await reservationModel.findOne({
        payment: payment._id,
        status: "active"
    });

    if (!reservation) {
        return res.status(410).json({
            message: "Reservation expired. Please retry checkout.",
            success: false
        });
    }

    // STEP 2: Commit stock (actual decrement)
    await commitStock(reservation.items);
    reservation.status = "committed";
    await reservation.save();

    //  STEP 3: Update payment
    payment.status = "paid";
    payment.razorpay.paymentId = razorpay_payment_id;
    payment.razorpay.signature = razorpay_signature;
    await payment.save();

    // STEP 4: Clear cart
    await cartModel.findOneAndUpdate(
        { user: req.user._id },
        { $set: { items: [] } }
    );

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

export const getOrdersController = async (req, res) => {
  try {
    const orders = await paymentModel
      .find({
        user: req.user._id,
        status: "paid",
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};