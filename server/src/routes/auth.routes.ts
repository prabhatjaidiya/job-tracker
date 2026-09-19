
import { Router } from "express";

import {
    register,
    login,
    getMe,
    forgotPassword,
    resetPassword,
    updateProfile,
    changePassword,
    uploadProfilePhoto,
} from "../controllers/auth.controller.js";
import upload from "../middleware/upload.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

router.patch("/change-password", authMiddleware, changePassword);

router.patch("/profile", authMiddleware, updateProfile);

router.patch("/profile/photo", authMiddleware, upload.single("profilePhoto"), uploadProfilePhoto);

router.get("/me", authMiddleware, getMe);

export default router;