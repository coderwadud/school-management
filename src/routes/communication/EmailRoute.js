import {
  sendEmail,
  getEmailHistory,
  getEmailById,
  deleteEmailHistory,
} from "../../controllers/communication/EmailController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send", authenticate, sendEmail);
router.get("/", authenticate, getEmailHistory);
router.get("/:id", authenticate, getEmailById);
router.delete("/:id", authenticate, deleteEmailHistory);

export default router;
