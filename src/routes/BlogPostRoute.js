import { createBlogPost } from "../controllers/BlogPostController.js";
import express from "express";
const router = express.Router();

// Route to create a new blog post
router.post("/", createBlogPost);

export default router;
