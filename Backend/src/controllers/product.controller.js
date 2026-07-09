import productionModel from "../models/product.model.js";

export async function createProduct(req, ress) {
    const { title, description, price, currency } = req.body;
const seller = req.user;
} 