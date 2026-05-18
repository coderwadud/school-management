import {
  sendSMS,
  getSMSHistory,
  getSMSById,
  deleteSMSHistory,
} from "../../controllers/communication/SMSController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send", authenticate, sendSMS);
router.get("/", authenticate, getSMSHistory);
router.get("/:id", authenticate, getSMSById);
router.delete("/:id", authenticate, deleteSMSHistory);

export default router;
