import { createStudent, getAllStudents, getStudentById } from "../../controllers/student/StudentController.js";
import express from "express";

const router = express.Router();

router.post("/", createStudent);
router.get("/", getAllStudents);
router.get("/:id", getStudentById);

export default router;
