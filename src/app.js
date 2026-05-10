import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Import routes
import blogPostRoutes from "./routes/BlogPostRoute.js";
// Use routes
app.use("/api/blogposts", blogPostRoutes);

// Connect to MongoDB
connectDB();
export default app;
