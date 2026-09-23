import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        index: true
    },
    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "payment",
        required: true,
        index: true
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product",
                required: true
            },
            variantId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ],
    status: {
        type: String,
        enum: ["active", "committed", "released"],
        default: "active",
        index: true
    },
    expiresAt: {
        type: Date,
        required: true,
        
    }
}, { timestamps: true });

reservationSchema.index({ expiresAt: 1 });

const reservationModel = mongoose.model("reservation", reservationSchema);
export default reservationModel;