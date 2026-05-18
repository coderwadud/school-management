import {
  addBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  toggleBookStatus,
  getBookOptions,
} from "../../controllers/library/BookController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";
import { fieldsUpload } from "../../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getAllBooks);
router.get("/options", getBookOptions);
router.get("/:id", getBookById);
router.post(
  "/",
  authenticate,
  fieldsUpload([{ name: "bookCover", maxCount: 1 }]),
  addBook,
);
router.put(
  "/:id",
  authenticate,
  fieldsUpload([{ name: "bookCover", maxCount: 1 }]),
  updateBook,
);
router.delete("/:id", authenticate, deleteBook);
router.patch("/:id/status", authenticate, toggleBookStatus);

export default router;
