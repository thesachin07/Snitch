import mongoose from "mongoose";
import dns from "dns";
import { config } from "../src/config/config.js";
import productModel from "../src/models/product.model.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const main = async () => {
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log("✅ Connected\n");

        const categories = ["men", "women", "kids"];
        let totalMarked = 0;

        for (const cat of categories) {
            const products = await productModel.find({ category: cat }).limit(3);
            const ids = products.map((p) => p._id);

            const result = await productModel.updateMany(
                { _id: { $in: ids } },
                { $set: { isFeatured: true } }
            );

            console.log(`   ${cat}: ${result.modifiedCount} marked`);
            totalMarked += result.modifiedCount;
        }

        const count = await productModel.countDocuments({ isFeatured: true });
        console.log(`\n✅ Total featured: ${count}`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error("❌", err);
        process.exit(1);
    }
};

main();