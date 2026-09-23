import cron from "node-cron";
import reservationModel from "../models/reservation.model.js";
import { releaseStock } from "../dao/product.dao.js";

export const startReservationJob = () => {
   
    cron.schedule("* * * * *", async () => {
        try {
            const now = new Date();

            // Expired + active reservations dhundo
            const expired = await reservationModel.find({
                status: "active",
                expiresAt: { $lte: now }
            });

            if (expired.length === 0) return;

            console.log(` Releasing ${expired.length} expired reservations...`);

            for (const res of expired) {
                await releaseStock(res.items);
                res.status = "released";
                await res.save();
            }

            console.log(` Released ${expired.length} reservations`);
        } catch (err) {
            console.error("Reservation job error:", err);
        }
    });

    console.log("⏰ Reservation cleanup job started");
};