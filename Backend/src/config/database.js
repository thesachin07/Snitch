import mongoose from "mongoose";
import dns from "dns";
import {config} from "./config.js";


dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
            family: 4,
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        if (error.code === "ECONNREFUSED" && config.MONGO_URI?.startsWith("mongodb+srv://")) {
            console.error(
                "MongoDB SRV lookup failed. Check your network/DNS or use a direct mongodb:// connection string instead of mongodb+srv://."
            );
        }
        process.exit(1);
    }
};

export default connectDB;