import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./db/dbConfig"
import AuthRouter from "./routes/AuthRouter";
import DataRouter from "./routes/DataRouter";
connectDB();
const app = express();
app.use(cors({
  origin: "http://localhost:5173", // Frontend URL
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", AuthRouter);
app.use("/api/data", DataRouter);
app.listen(3000, () => {
    console.log("server established!!")
})
