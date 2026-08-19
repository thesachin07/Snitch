import express from 'express';
import { authenticateSeller } from '../middlewares/auth.middleware.js'
import { createProduct, getSellerProducts, getAllProducts, getProductDetails,  addProductVariant, updateProduct, deleteProduct, updateProductVariant, deleteProductVariant } from '../controllers/product.controller.js';
import multer from 'multer';
import { createProductValidator, addVariantValidator } from '../validator/product.validator.js';

const upload = multer(
    {
        storage: multer.memoryStorage(),
        limits: {
            fileSize: 5 * 1024 * 1024 // 5MB
        }
    }
);
const router = express.Router();

router.post("/", authenticateSeller, upload.array('images', 7), createProductValidator, createProduct)

router.get("/seller", authenticateSeller, getSellerProducts);

router.get("/", getAllProducts)

router.get("/detail/:id", getProductDetails)

router.post("/:productId/variants", authenticateSeller, upload.array('images', 7), addVariantValidator, addProductVariant)

router.patch("/:productId", authenticateSeller, upload.array('images', 7), updateProduct)

router.delete("/:productId", authenticateSeller, deleteProduct)

router.patch("/:productId/variants/:variantId", authenticateSeller, upload.array('images', 7), updateProductVariant)

router.delete("/:productId/variants/:variantId", authenticateSeller, deleteProductVariant)

export default router;

