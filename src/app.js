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
import authRoutes from "./routes/AuthRoute.js";
// Import school routes
import schoolRoutes from "./routes/SchoolRoute.js";
import branchRoutes from "./routes/BranchRoute.js";
// Use routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/blogposts", blogPostRoutes);
// Use school routes
app.use("/api/v1/schools", schoolRoutes);
app.use("/api/v1/branches", branchRoutes);

// Connect to MongoDB
connectDB();
export default app;
