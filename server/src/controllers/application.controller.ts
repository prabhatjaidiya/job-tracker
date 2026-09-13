import { Request, Response } from "express";
import mongoose from "mongoose";
import JobApplication from "../models/JobApplication.js";

export const createApplication = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const application = await JobApplication.create({
            ...req.body,
            user: req.user._id,
        });

        res.status(201).json({
            success: true,
            data: application,
        });
    } catch (error) {
        console.error(error);

        res.status(400).json({
            success: false,
            message: "Failed to create application",
        });
    }
};

export const getApplications = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const applications = await JobApplication.find({
            user: req.user._id,
        });

        res.status(200).json({
            success: true,
            data: applications,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch applications",
        });
    }
};

export const getApplication = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            res.status(404).json({
                success: false,
                message: "Application not found",
            });
            return;
        }

        const application = await JobApplication.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!application) {
            res.status(404).json({
                success: false,
                message: "Application not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: application,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch application",
        });
    }
};

export const updateApplication = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const application = await JobApplication.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user._id,
            },
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!application) {
            res.status(404).json({
                success: false,
                message: "Application not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: application,
        });
    } catch (error) {
        console.error(error);

        res.status(400).json({
            success: false,
            message: "Failed to update application",
        });
    }
};

export const deleteApplication = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const application = await JobApplication.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!application) {
            res.status(404).json({
                success: false,
                message: "Application not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Application deleted successfully",
        });
    } catch (error) {
        console.error(error);

        res.status(400).json({
            success: false,
            message: "Failed to delete application",
        });
    }
};

export const getApplicationStats = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const stats = await JobApplication.aggregate([
            {
                $match: {
                    user: req.user._id,
                },
            },
            {
                $facet: {
                    statusStats: [
                        {
                            $group: {
                                _id: "$status",
                                count: { $sum: 1 },
                            },
                        },
                    ],

                    applicationTrend: [
                        {
                            $match: {
                                appliedDate: { $exists: true, $ne: null },
                            },
                        },
                        {
                            $group: {
                                _id: {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: "$appliedDate",
                                    },
                                },
                                applications: { $sum: 1 },
                            },
                        },
                        {
                            $sort: {
                                _id: 1,
                            },
                        },
                    ],
                },
            },
        ]);

        type StatsKey =
            | "applied"
            | "interviews"
            | "assessments"
            | "offers"
            | "rejected"
            | "withdrawn";

        const statusMap: Record<string, StatsKey> = {
            Applied: "applied",
            Interview: "interviews",
            Assessment: "assessments",
            Offer: "offers",
            Rejected: "rejected",
            Withdrawn: "withdrawn",
        };

        const formattedStats = stats[0].statusStats.reduce(
            (acc: {
                totalApplications: number;
                applied: number;
                interviews: number;
                assessments: number;
                offers: number;
                rejected: number;
                withdrawn: number;
            }, stat: { _id: string; count: number }) => {
                const status = statusMap[stat._id];

                if (status) {
                    acc[status] = stat.count;
                }

                acc.totalApplications += stat.count;

                return acc;
            },
            {
                totalApplications: 0,
                applied: 0,
                interviews: 0,
                assessments: 0,
                offers: 0,
                rejected: 0,
                withdrawn: 0,
            }
        );

        const applicationTrend = stats[0].applicationTrend.map(
            (item: {
                _id: string;
                applications: number;
            }) => ({
                date: item._id,
                applications: item.applications,
            })
        );

        res.status(200).json({
            success: true,
            data: {
                ...formattedStats,
                applicationTrend,
            },
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch application stats",
        });
    }
};