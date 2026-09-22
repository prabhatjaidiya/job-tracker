import express from "express";
import cors from "cors";

import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import applicationRoutes from "./routes/application.routes.js";

import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);

app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

app.use(errorMiddleware);

export default app;