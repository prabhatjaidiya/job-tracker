import mongoose from "mongoose";
import JobApplication from "../models/JobApplication.js";

const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGODB_URI;

        if (!mongoURI) {
            throw new Error("MONGODB_URI is not defined");
        }

        await mongoose.connect(mongoURI);

        console.log("MongoDB connected");

        await JobApplication.syncIndexes();

        console.log("JobApplication indexes synchronized");

        const indexes = await mongoose.connection
            .collection("jobapplications")
            .indexes();

        console.log("JobApplication indexes:", indexes);
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};

export default connectDB;