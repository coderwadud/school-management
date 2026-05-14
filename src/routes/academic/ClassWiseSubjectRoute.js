import { createClassWiseSubjects, getClassWiseSubjects } from "../../controllers/academic/ClassWiseSubjects.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";
const router = express.Router();

router.post("/", authenticate, createClassWiseSubjects);
router.get("/", getClassWiseSubjects);

export default router;