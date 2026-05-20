import {
  addExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  addIncome,
  getAllIncomes,
  deleteIncome,
  getFinancialSummary,
} from "../../controllers/fees/AccountsController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";
import { fieldsUpload } from "../../middleware/uploadMiddleware.js";

const router = express.Router();

// Expense routes
router.post(
  "/expenses",
  authenticate,
  fieldsUpload([{ name: "attachments", maxCount: 5 }]),
  addExpense,
);
router.get("/expenses", authenticate, getAllExpenses);
router.get("/expenses/:id", authenticate, getExpenseById);
router.put("/expenses/:id", authenticate, updateExpense);
router.delete("/expenses/:id", authenticate, deleteExpense);

// Income routes
router.post("/incomes", authenticate, addIncome);
router.get("/incomes", authenticate, getAllIncomes);
router.delete("/incomes/:id", authenticate, deleteIncome);

// Financial summary
router.get("/summary", authenticate, getFinancialSummary);

export default router;
