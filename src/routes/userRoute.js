import express from "express";
import { getUsers, createUser, updateUser, deleteUser , getProfile } from "../controllers/userController.js";

import { protect } from "../middlewars/authMiddlewars.js";
import { authorizeRoles } from "../middlewars/roleMiddlewars.js";
import { getUserById } from "../controllers/userController.js";

const router = express.Router();

// Profile
router.get("/me", protect, getProfile);

// Get user by ID
router.get("/:id", protect, authorizeRoles("admin", "manager"), getUserById);

// Admin & Manager
router.get("/", protect, authorizeRoles("admin", "manager"), getUsers);

// Admin only
router.post("/", protect, authorizeRoles("admin"), createUser);
router.put("/:id", protect, authorizeRoles("admin", "manager"), updateUser);
router.delete("/:id", protect, authorizeRoles("admin"), deleteUser);

export default router;