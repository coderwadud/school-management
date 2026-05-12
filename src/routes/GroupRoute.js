import {createGroup, getGroups, getGroupById, updateGroup, deleteGroup, toggleGroupStatus, getGroupsOptions } from "../controllers/GroupController.js";
import express from "express";
const router = express.Router();
router.post("/", createGroup);
router.get("/", getGroups);
router.get("/options", getGroupsOptions);
router.get("/:id", getGroupById);
router.put("/:id", updateGroup);
router.delete("/:id", deleteGroup);
router.patch("/:id/status", toggleGroupStatus);

export default router;