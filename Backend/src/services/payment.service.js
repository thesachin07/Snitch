import Razorpay from "razorpay";
import { config } from "../config/config.js";


const razorpayInstance = new Razorpay({
    key_id: config.RAZORPAY_KEY_ID,
    key_secret: config.RAZORPAY_KEY_SECRET
});


export const createRazorpayOrder = async (amount, currency) => {

    try {

        const options = {
            amount: Number(amount) * 100,
            currency: currency
        };

        // console.log("Razorpay options:", options);
        // console.log("Amount type:", typeof options.amount);
        // console.log("Currency type:", typeof options.currency);

        const order = await razorpayInstance.orders.create(options);

        return order;

    } catch (error) {

        console.error("Razorpay Error:", error);

        throw error;
    }
};