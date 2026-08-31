import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
    {
        company: {
            type: String,
            required: true,
        },

        position: {
            type: String,
            required: true,
        },

        location: {
            type: String,
            required: true,
        },

        jobType: {
            type: String,
            enum: ["Full-time", "Internship", "Part-time", "Contract"],
            required: true,
        },

        status: {
            type: String,
            enum: [
                "Applied",
                "Interview",
                "Assessment",
                "Offer",
                "Rejected",
                "Withdrawn",
            ],
            required: true,
        },

        salary: {
            type: Number,
        },

        jobUrl: {
            type: String,
        },

        appliedDate: {
            type: Date,
        },

        deadline: {
            type: Date,
        },

        description: {
            type: String,
        },

        notes: {
            type: String,
        },

        contact: {
            type: String,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const JobApplication = mongoose.model(
    "JobApplication",
    jobApplicationSchema
);

export default JobApplication;