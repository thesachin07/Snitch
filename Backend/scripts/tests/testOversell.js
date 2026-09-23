import mongoose from "mongoose";
import dns from "dns";
import { config } from "../../src/config/config.js";
import productModel from "../../src/models/product.model.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const testOversell = async () => {
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log("✅ Connected\n");

        // Find a product with a variant
        const product = await productModel.findOne({ "variants.0": { $exists: true } });

        if (!product) {
            console.log("❌ No product found");
            process.exit(1);
        }

        const variant = product.variants[0];

        // Set stock to 3
        await productModel.updateOne(
            { _id: product._id, "variants._id": variant._id },
            {
                $set: {
                    "variants.$.stock": 3,
                    "variants.$.reservedStock": 0
                }
            }
        );

        console.log(`📦 Test setup:`);
        console.log(`   Product: ${product.title}`);
        console.log(`   Variant: ${variant._id}`);
        console.log(`   Stock: 3\n`);

        // Simulate 10 parallel reserve requests (2 qty each)
        const requests = Array.from({ length: 10 }, (_, i) => i + 1);

        console.log("🚀 Firing 10 parallel reserves (2 qty each)...\n");

        const { reserveStock } = await import("../../src/dao/product.dao.js");

        const results = await Promise.allSettled(
            requests.map(async (reqNum) => {
                return await reserveStock([
                    {
                        productId: product._id,
                        variantId: variant._id,
                        quantity: 2
                    }
                ]);
            })
        );

        const success = results.filter(r => r.status === "fulfilled").length;
        const failed = results.filter(r => r.status === "rejected").length;

        console.log(`\n════════════════════════════════════════`);
        console.log(`✅ Success: ${success} (expected: 1)`);
        console.log(`❌ Failed:  ${failed} (expected: 9)`);
        console.log(`════════════════════════════════════════\n`);

        // Check final reservedStock
        const finalProduct = await productModel.findById(product._id);
        const finalVariant = finalProduct.variants.id(variant._id);

        console.log(`📊 Final state:`);
        console.log(`   Stock: ${finalVariant.stock}`);
        console.log(`   ReservedStock: ${finalVariant.reservedStock}`);
        console.log(`   Available: ${finalVariant.stock - finalVariant.reservedStock}`);

        if (success === 1 && failed === 9 && finalVariant.reservedStock === 2) {
            console.log("\n🎉 TEST PASSED — No oversell!");
        } else {
            console.log("\n❌ TEST FAILED — Check logic");
        }

        // Cleanup
        await productModel.updateOne(
            { _id: product._id, "variants._id": variant._id },
            {
                $set: {
                    "variants.$.stock": 3,
                    "variants.$.reservedStock": 0
                }
            }
        );

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error("❌", err);
        process.exit(1);
    }
};

testOversell();