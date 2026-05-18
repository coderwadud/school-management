import {
  createHomework,
  getAllHomework,
  getHomeworkById,
  updateHomework,
  deleteHomework,
} from "../../controllers/homework/HomeworkController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";
import { fieldsUpload } from "../../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getAllHomework);
router.get("/:id", getHomeworkById);
router.post(
  "/",
  authenticate,
  fieldsUpload([{ name: "attachments", maxCount: 5 }]),
  createHomework,
);
router.put("/:id", authenticate, updateHomework);
router.delete("/:id", authenticate, deleteHomework);

export default router;
