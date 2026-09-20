import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                success: false,
                message: "No token provided",
            });
            return;
        }

        const token = authHeader.split(" ")[1];

        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            res.status(500).json({
                success: false,
                message: "JWT secret is not configured",
            });
            return;
        }

        const decoded = jwt.verify(token, jwtSecret) as JwtPayload & {
            userId: string;
        };

        const user = await User.findById(decoded.userId);

        if (!user) {
            res.status(401).json({
                success: false,
                message: "User not found",
            });
            return;
        }

        req.user = user;

        next();
    } catch (error) {
        if (
            error instanceof Error &&
            (
                error.name === "JsonWebTokenError" ||
                error.name === "TokenExpiredError"
            )
        ) {
            res.status(401).json({
                success: false,
                message: "Invalid or expired token",
            });
            return;
        }

        next(error);
    }
};

export default authMiddleware;