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
import sessionRoutes from "./routes/SessionRoute.js";
import shiftRoutes from "./routes/ShiftRoute.js";
import mediumRoutes from "./routes/MediumRoute.js";
import classRoutes from "./routes/ClassRoute.js";
import groupRoutes from "./routes/GroupRoute.js";
// Use routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/blogposts", blogPostRoutes);
// Use school routes
app.use("/api/v1/schools", schoolRoutes);
app.use("/api/v1/branches", branchRoutes);
app.use("/api/v1/sessions", sessionRoutes);
app.use("/api/v1/shifts", shiftRoutes);
app.use("/api/v1/mediums", mediumRoutes);
app.use("/api/v1/classes", classRoutes);
app.use("/api/v1/groups", groupRoutes);
// Connect to MongoDB
connectDB();
export default app;
