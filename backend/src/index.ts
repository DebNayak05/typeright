import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./db/dbConfig"
import AuthRouter from "./routes/AuthRouter";
connectDB();
const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", AuthRouter);
app.listen(3000, () => {
    console.log("server established!!")
})
