import { createClass, getClasses, getClassById, updateClass, deleteClass, toggleClassStatus, getClassesOptions } from "../controllers/ClassController.js";
import express from "express";

const router = express.Router();

router.post("/", createClass);
router.get("/", getClasses);
router.get("/options", getClassesOptions);
router.get("/:id", getClassById);
router.put("/:id", updateClass);
router.delete("/:id", deleteClass);
router.patch("/:id/status", toggleClassStatus);

export default router;
