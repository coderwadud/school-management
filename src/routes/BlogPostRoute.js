import express from "express";

const router = express.Router();

// Placeholder routes for blog posts
router.get("/", (req, res) => {
  res.status(200).json({ message: "Blog posts endpoint - Coming soon" });
});

export default router;
