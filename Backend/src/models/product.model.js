import mongoose from "mongoose";
import priceSchema from "./price.schema.js";

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    category: {
  type: String,
  enum: ["men", "women", "kids"],
  required: true,
},

isFeatured: {      
  type: Boolean,
  default: false,
},

    description: {
      type: String,
      required: true,
    },
    
     seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },

    price: {
      type: priceSchema,
      required: true
    },

    images: [
      {
        url: {
          type: String,
          required: true,
        },
      },
    ],

   variants: [
        {
            images: [
                {
                    url: {
                        type: String,
                        required: true
                    }
                }
            ],
            stock: {
                type: Number,
                default: 0
            },

             reservedStock: {
            type: Number,
            default: 0,
            min: 0
        },
            attributes: {
                type: Map,
                of: String
            },
            price: {
              type: priceSchema,
            }
        },
    ]
  },
  { timestamps: true },
);


ProductSchema.index({ category: 1, createdAt: -1 });
ProductSchema.index({ isFeatured: 1, createdAt: -1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ "price.amount": 1 });

const productModel = mongoose.model("product", ProductSchema);
export default productModel;

