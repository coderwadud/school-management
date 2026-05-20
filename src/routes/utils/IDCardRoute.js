import {
  generateStudentIDCard,
  generateBulkIDCards,
  generateClassIDCards,
} from "../../controllers/utils/IDCardController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/student/:studentId", authenticate, generateStudentIDCard);
router.post("/bulk", authenticate, generateBulkIDCards);
router.get("/class", authenticate, generateClassIDCards);

export default router;
