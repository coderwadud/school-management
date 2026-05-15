import {
  createSchool,
  getSchools,
  getSchoolById,
  getSchoolOptions,
  deleteSchool,
  updateSchool,
} from "../../controllers/academic/SchoolController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Public routes (School registration and getting list)
router.post("/", createSchool);
router.get("/options", getSchoolOptions);
router.get("/", getSchools);
router.get("/:id", getSchoolById);

// Protected routes (requires authentication)
router.put("/:id", authenticate, updateSchool);
router.delete("/:id", authenticate, deleteSchool);

export default router;
