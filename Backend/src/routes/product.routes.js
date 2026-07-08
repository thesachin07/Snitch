import express from 'express';
import { authenticateSeller } from '../middlewares/auth.middleware'
import { createProduct } from '../controllers/product.controller.js';
import multer from 'multer';

const upload = multer(
    {
        storage: multer.memoryStorage(),
        limits: {
            fileSize: 5 * 1024 * 1024 // 5MB
        }
    }
);
const router = express.Router();

router.post("/", authenticateSeller, upload.array('images', 7), createProduct)




export default router;