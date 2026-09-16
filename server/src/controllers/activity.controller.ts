import { Request, Response } from "express";
import mongoose from "mongoose";
import Activity from "../models/Activity.js";
import JobApplication from "../models/JobApplication.js";

export const getActivities = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params as { id: string };

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid application ID",
            });
        }

        const application = await JobApplication.findOne({
            _id: id,
            user: req.user.id,
        });

        if (!application) {
            return res.status(404).json({
                message: "Application not found",
            });
        }

        const activities = await Activity.find({
            application: id,
            user: req.user.id,
        }).sort({ createdAt: -1 });

        return res.status(200).json(activities);
    } catch (error) {
        console.error("Get activities error:", error);

        return res.status(500).json({
            message: "Server error",
        });
    }
};

export const createActivity = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params as { id: string };
        const { type, description } = req.body;

        // Validate application ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid application ID",
            });
        }

        // Validate required fields
        if (!type || !description) {
            return res.status(400).json({
                message: "Type and description are required",
            });
        }

        // Check application ownership
        const application = await JobApplication.findOne({
            _id: id,
            user: req.user.id,
        });

        if (!application) {
            return res.status(404).json({
                message: "Application not found",
            });
        }

        // Create activity
        const activity = await Activity.create({
            application: id,
            user: req.user.id,
            type,
            description,
        });

        return res.status(201).json(activity);
    } catch (error) {
        console.error("Create activity error:", error);

        return res.status(500).json({
            message: "Server error",
        });
    }
};