
import { Router } from "express";

import {
    register,
    login,
    getMe,
    forgotPassword,
    resetPassword,
} from "../controllers/auth.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

router.get("/me", authMiddleware, getMe);

export default router;