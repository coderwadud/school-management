import {
  issueBook,
  returnBook,
  getAllIssues,
  getOverdueBooks,
  deleteIssue,
} from "../../controllers/library/BookIssueController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, issueBook);
router.patch("/:id/return", authenticate, returnBook);
router.get("/", authenticate, getAllIssues);
router.get("/overdue", authenticate, getOverdueBooks);
router.delete("/:id", authenticate, deleteIssue);

export default router;
