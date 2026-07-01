import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}))

app.get("/", (req, res) => {
    res.status(200).json({message: "Server is running"});
})

app.use("/api/auth", authRouter);
export default app;