import express from 'express';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { validateAddToCart, validateIncremetCartItemsQuantity } from '../validator/cart.validator.js';
import {
  addToCart,
  getCart,
  incrementCartItemQuantity,
  decrementCartItemQuantity,
  removeCartItem,
 createOrderController,
  verifyOrderController,
} from '../controllers/cart.controller.js';

const router = express.Router();

router.post('/add/:productId/:variantId', authenticateUser, validateAddToCart, addToCart);

router.get('/', authenticateUser, getCart);

router.patch("/quantity/increment/:productId/:variantId", authenticateUser, validateIncremetCartItemsQuantity, incrementCartItemQuantity);

router.patch("/quantity/decrement/:productId/:variantId",
  authenticateUser,
  validateIncremetCartItemsQuantity,
  decrementCartItemQuantity,
);

router.delete("/remove/:productId/:variantId",
  authenticateUser,
  validateIncremetCartItemsQuantity,
  removeCartItem,
);

router.post("/payment/create/order", authenticateUser, createOrderController);

router.post("/payment/verify/order", authenticateUser, verifyOrderController);

export default router;

