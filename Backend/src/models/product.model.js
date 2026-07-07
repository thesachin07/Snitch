import mongoose from 'mongoose';

 const ProductSchema = new mongoose.Schema({
    title: { 
        type: String,
        required: true   
    },

    description: {
        type: String,
        required: true 
    },
        
    price: {
       amount: { type: Number, required: true },
        currency: { type: String, enum: ['USD', 'EUR', 'GBP'], required: true },
        default: "INR"
    },

    images: [
        {
            url: {
                type: String,
                required: true
            },
            alt: {
                type: String,
                required: true
            }
        }
    ]
 }, { timestamps: true }
)

const productModel = mongoose.model('product', productSchema);

export default productModel;