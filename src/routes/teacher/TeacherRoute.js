import { createTeacher, getAllTeachers, getTeacherById, updateTeacher, deleteTeacher, toggleTeacherStatus, getTeacherOptions } from "../../controllers/teacher/TeacherController.js";
import express from "express";
const router = express.Router();

router.post("/", createTeacher);
router.get("/", getAllTeachers);
router.get("/options", getTeacherOptions);
router.get("/:id", getTeacherById);
router.put("/:id", updateTeacher);
router.delete("/:id", deleteTeacher);
router.patch("/:id/status", toggleTeacherStatus);
export default router;