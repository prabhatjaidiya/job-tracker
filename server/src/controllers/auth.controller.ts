import { Request, Response } from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateResetToken } from "../utils/passwordReset.js";
import { sendPasswordResetEmail } from "../services/email.service.js";
import { createHash } from "node:crypto";

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({
                message: "Name, email and password are required",
            });
            return;
        }

        if (password.length < 6) {
            res.status(400).json({
                message: "Password must be at least 6 characters",
            });
            return;
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            res.status(400).json({
                message: "User already exists",
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error",
        });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                message: "Email and password are required",
            });
            return;
        }

        const user = await User.findOne({ email });

        if (!user) {
            res.status(401).json({
                message: "Invalid email or password",
            });
            return;
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            res.status(401).json({
                message: "Invalid email or password",
            });
            return;
        }

        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            res.status(500).json({
                message: "JWT secret is not configured",
            });
            return;
        }

        const token = jwt.sign(
            { userId: user._id.toString() },
            jwtSecret,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error",
        });
    }
};


export const forgotPassword = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const email =
            typeof req.body.email === "string"
                ? req.body.email.trim().toLowerCase()
                : "";

        if (!email) {
            res.status(400).json({
                message: "Email is required",
            });
            return;
        }

        const genericMessage =
            "If an account with that email exists, a reset link has been sent.";

        const user = await User.findOne({ email });

        if (!user) {
            res.status(200).json({ message: genericMessage });
            return;
        }

        const { resetToken, hashedToken } = generateResetToken();

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = new Date(
            Date.now() + 15 * 60 * 1000
        );

        await user.save();

        const clientUrl = process.env.CLIENT_URL;

        if (!clientUrl) {
            throw new Error("CLIENT_URL is not configured");
        }

        const resetUrl =
            `${clientUrl.replace(/\/$/, "")}/reset-password/${resetToken}`;

        await sendPasswordResetEmail(user.email, resetUrl);

        res.status(200).json({ message: genericMessage });
    } catch (error) {
        console.error("Forgot password error:", error);

        res.status(500).json({
            message: "Unable to process password reset request",
        });
    }
};


export const resetPassword = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (typeof token !== "string" || !token) {
            res.status(400).json({
                message: "Reset token is required",
            });
            return;
        }

        if (typeof password !== "string" || password.length < 6) {
            res.status(400).json({
                message: "Password must be at least 6 characters",
            });
            return;
        }

        const hashedToken = createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: new Date() },
        });

        if (!user) {
            res.status(400).json({
                message: "Reset link is invalid or has expired",
            });
            return;
        }

        user.password = await bcrypt.hash(password, 10);

        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({
            message: "Password has been reset successfully",
        });
    } catch (error) {
        console.error("Reset password error:", error);

        res.status(500).json({
            message: "Unable to reset password",
        });
    }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
        },
    });
};