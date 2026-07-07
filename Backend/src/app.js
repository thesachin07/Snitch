import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import productRouter from "./routes/product.routes.js";
import cors from "cors";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "./config/config.js";

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}))

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("Google Strategy Executed");
      console.log(profile);

      return done(null, profile);
    }
  )
);

app.use(passport.initialize());
app.get("/", (req, res) => {
    res.status(200).json({message: "Server is running"});
})

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
export default app;