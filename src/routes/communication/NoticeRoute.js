import {
  createNotice,
  getAllNotices,
  getNoticeById,
  updateNotice,
  deleteNotice,
  toggleNoticePin,
} from "../../controllers/communication/NoticeController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";
import { fieldsUpload } from "../../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getAllNotices);
router.get("/:id", getNoticeById);
router.post(
  "/",
  authenticate,
  fieldsUpload([{ name: "attachments", maxCount: 5 }]),
  createNotice,
);
router.put(
  "/:id",
  authenticate,
  fieldsUpload([{ name: "attachments", maxCount: 5 }]),
  updateNotice,
);
router.delete("/:id", authenticate, deleteNotice);
router.patch("/:id/pin", authenticate, toggleNoticePin);

export default router;
