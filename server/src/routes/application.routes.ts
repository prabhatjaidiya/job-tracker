import { Router } from "express";

import {
    createApplication,
    getApplications,
    getApplication,
    updateApplication,
    deleteApplication,
    getApplicationStats,
} from "../controllers/application.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, createApplication);
router.get("/", authMiddleware, getApplications);
router.get("/stats", authMiddleware, getApplicationStats);
router.get("/:id", authMiddleware, getApplication);
router.put("/:id", authMiddleware, updateApplication);
router.delete("/:id", authMiddleware, deleteApplication);

export default router;