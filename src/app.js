import express from "express";

const app = express();
// app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

app.get("/", (req, res) => {
    res.status(200).json({message: "Server is running"});
})
export default app;