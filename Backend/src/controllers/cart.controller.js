import cartModel from "../models/cart.model";
import productModel from "../models/product.model";


export const addToCart = async (req, res) => {

    const { productId, variantId } = req.params

    const product = await productModel.findOne({
        _id: productId,
        "variants._id": variantId
    })
if(!product){
    return res.status(404).json({
        message: "Prosuct or variant not found",
        success: false
    })
}

}