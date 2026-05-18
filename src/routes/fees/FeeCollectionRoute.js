import {
  collectFee,
  getAllFeeCollections,
  getFeeCollectionById,
  getStudentFeeHistory,
  getDueFees,
  getDailyCollection,
  deleteFeeCollection,
} from "../../controllers/fees/FeeCollectionController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, collectFee);
router.get("/", authenticate, getAllFeeCollections);
router.get("/daily", authenticate, getDailyCollection);
router.get("/due", authenticate, getDueFees);
router.get("/student/:studentId", authenticate, getStudentFeeHistory);
router.get("/:id", authenticate, getFeeCollectionById);
router.delete("/:id", authenticate, deleteFeeCollection);

export default router;
