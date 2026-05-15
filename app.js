import dotenv from "dotenv";
import express from "express";
import connectDB from "./src/config/db.js";
import cors from "cors";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Import routes
import appRoute from "./src/routes/appRoute.js";

// Use routes
app.use("/api/v1", appRoute);
// Connect to MongoDB
connectDB();
export default app;
