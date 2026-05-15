import { createStudent, getAllStudents, getStudentById } from "../../controllers/student/StudentController.js";
import express from "express";
import { fieldsUpload } from "../../middleware/uploadMiddleware.js";

const router = express.Router();

// Student create with multiple file uploads (studentPicture, fatherPicture, motherPicture)
router.post("/", 
    fieldsUpload([
        { name: 'studentPicture', maxCount: 1 },
        { name: 'fatherPicture', maxCount: 1 },
        { name: 'motherPicture', maxCount: 1 }
    ]), 
    createStudent
);
router.get("/", getAllStudents);
router.get("/:id", getStudentById);

export default router;
