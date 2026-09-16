import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
    {
        application: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "JobApplication",
            required: true,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        type: {
            type: String,
            enum: [
                "APPLICATION_CREATED",
                "STATUS_CHANGE",
                "APPLICATION_UPDATED",
                "NOTE_ADDED",
            ],
            required: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;