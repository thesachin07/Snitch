import mongoose from "mongoose";
import dns from "dns";
import { config } from "../../src/config/config.js";
import productModel from "../../src/models/product.model.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const main = async () => {
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log("✅ Connected\n");

        // Find products jinke variants mein reservedStock nahi hai
        const products = await productModel.find({});

        let updated = 0;

        for (const product of products) {
            let needsSave = false;

            product.variants.forEach((variant) => {
                if (variant.reservedStock === undefined || variant.reservedStock === null) {
                    variant.reservedStock = 0;
                    needsSave = true;
                }
            });

            if (needsSave) {
                await product.save();
                updated++;
            }
        }

        console.log(`✅ Updated ${updated} products\n`);

        // Verify
        const sample = await productModel.findOne({ "variants.0": { $exists: true } });
        if (sample) {
            console.log("📋 Sample variant check:");
            console.log(`   Title: ${sample.title}`);
            console.log(`   Stock: ${sample.variants[0].stock}`);
            console.log(`   ReservedStock: ${sample.variants[0].reservedStock}`);
        }

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error("❌", err);
        process.exit(1);
    }
};

main();