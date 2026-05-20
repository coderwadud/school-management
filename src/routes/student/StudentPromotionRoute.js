import {
  promoteStudents,
  transferStudent,
  generateTC,
  getPromotionEligibleStudents,
} from "../../controllers/student/StudentPromotionController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/promote", authenticate, promoteStudents);
router.post("/transfer/:studentId", authenticate, transferStudent);
router.get("/tc/:studentId", authenticate, generateTC);
router.get("/eligible", authenticate, getPromotionEligibleStudents);

export default router;
