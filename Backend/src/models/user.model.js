import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    contact: { type: String, default: null },
    password: { type: String, default: null },
    googleId: { type: String, default: null },
    fullname: { type: String, required: true },
    role: {
        type: String,
        enum: ["seller", "buyer"],
        default: "buyer",
    },
});


userSchema.pre("save", async function (next) {
    if (!this.password || !this.isModified("password")) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10);

    next();
});

userSchema.methods.comparePassword = async function (password) {
    if (!this.password) return false;
    return await bcrypt.compare(password, this.password);
};

const userModel = mongoose.model("user", userSchema);

export default userModel;