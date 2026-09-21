import { body, query, validationResult } from "express-validator";

function validateRequest(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Validation error", errors: errors.array() });
    }

    next();
    
}


export const createProductValidator = [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("priceAmount").isNumeric().withMessage("Price amount must be a number"),
    body("priceCurrency").notEmpty().withMessage("Price currency is required"),
    validateRequest
    
]

export const addVariantValidator = [
    body("priceAmount").optional({ checkFalsy: true }).isNumeric().withMessage("Price amount must be a number"),
    body("priceCurrency").notEmpty().withMessage("Price currency is required"),
    body("stock").isNumeric().withMessage("Stock must be a number"),
    validateRequest
]


export const getAllProductsValidator = [
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be >= 1"),
    query("limit").optional().isInt({ min: 1, max: 50 }).withMessage("Limit 1-50"),
    query("category").optional().isIn(["men", "women", "kids"]).withMessage("Invalid category"),
    query("featured").optional().isIn(["true", "false"]).withMessage("Featured must be true/false"),
    query("sort").optional().isIn(["newest", "oldest", "price_asc", "price_desc"]).withMessage("Invalid sort"),
    validateRequest
];