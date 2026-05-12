import { createSchool, getSchools, getSchoolById, getSchoolOptions, deleteSchool, updateSchool, getBranchesBySchoolId } from "../../controllers/academic/SchoolController.js";
import express from "express";
const router = express.Router();
// POST /api/v1/schools
router.post("/", createSchool);
// GET /api/v1/schools/options
router.get("/options", getSchoolOptions);
// GET /api/v1/schools
router.get("/", getSchools);
// GET /api/v1/schools/:id
router.get("/:id", getSchoolById);
// PUT /api/v1/schools/:id
router.put("/:id", updateSchool);
// DELETE /api/v1/schools/:id
router.delete("/:id", deleteSchool);
// GET /api/v1/schools/:id/branches
router.get("/:schoolId/branches", getBranchesBySchoolId);


export default router;