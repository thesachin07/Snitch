import Razorpay from "razorpay";
import { config } from "../config/config.js";

const razorpayInstance = new Razorpay({
    key_id: config.RAZORPAY_KEY_ID,
    key_secret: config.RAZORPAY_KEY_SECRET
});

export const createRazorpayOrder = async (amount, currency) => {
    try {
        const options = {
            amount: amount * 100, // Razorpay expects amount in paise
            currency: currency
        };
        const order = await razorpayInstance.orders.create(options);
        return order;
    } catch (error) {
        throw new Error("Error creating Razorpay order");
    }
};  