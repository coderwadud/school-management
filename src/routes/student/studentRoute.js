import { createStudent } from "../../controllers/student/StudentController.js";
import express from "express";

const router = express.Router();

router.post("/", createStudent);

export default router;
