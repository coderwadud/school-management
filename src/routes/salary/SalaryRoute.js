import {
  paySalary,
  getAllSalaryPayments,
  getSalaryPaymentById,
  getEmployeeSalaryHistory,
  getPendingSalaries,
  updateSalaryPayment,
  deleteSalaryPayment,
} from "../../controllers/salary/SalaryController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, paySalary);
router.get("/", authenticate, getAllSalaryPayments);
router.get("/pending", authenticate, getPendingSalaries);
router.get(
  "/employee/:employeeType/:employeeId",
  authenticate,
  getEmployeeSalaryHistory,
);
router.get("/:id", authenticate, getSalaryPaymentById);
router.put("/:id", authenticate, updateSalaryPayment);
router.delete("/:id", authenticate, deleteSalaryPayment);

export default router;
