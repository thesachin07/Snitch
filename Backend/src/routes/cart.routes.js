import express from 'express';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { validateAddToCart } from '../validators/vart.validator.js';

const router = express.Router();

router.post('/add/:productId/:variantId', authenticateUser, validateAddToCart)

export default router;