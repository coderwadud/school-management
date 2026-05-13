import express from "express";
const router = express.Router();

// Import school routes
import authRoutes from "../routes/AuthRoute.js";
import blogPostRoutes from "../routes/BlogPostRoute.js";
import schoolRoutes from "../routes/academic/SchoolRoute.js";
import branchRoutes from "../routes/academic/BranchRoute.js";
import sessionRoutes from "../routes/academic/SessionRoute.js";
import shiftRoutes from "../routes/academic/ShiftRoute.js";
import mediumRoutes from "../routes/academic/MediumRoute.js";
import classRoutes from "../routes/academic/ClassRoute.js";
import groupRoutes from "../routes/academic/GroupRoute.js";
import teacherRoutes from "../routes/teacher/TeacherRoute.js";
import sectionRoutes from "../routes/academic/SectionRoute.js";

// Use routes
router.use("/auth", authRoutes);
router.use("/blogposts", blogPostRoutes);
// Use school routes
router.use("/schools", schoolRoutes);
router.use("/branches", branchRoutes);
router.use("/sessions", sessionRoutes);
router.use("/shifts", shiftRoutes);
router.use("/mediums", mediumRoutes);
router.use("/classes", classRoutes);
router.use("/groups", groupRoutes);
router.use("/teachers", teacherRoutes);
router.use("/sections", sectionRoutes);
export default router;
