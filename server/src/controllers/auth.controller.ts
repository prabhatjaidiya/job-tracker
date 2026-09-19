import { Request, Response } from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateResetToken } from "../utils/passwordReset.js";
import { sendPasswordResetEmail } from "../services/email.service.js";
import { createHash } from "node:crypto";
import cloudinary from "../config/cloudinary.js";

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

        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({
            email: normalizedEmail,
        }).select("+password");

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
                profilePhoto: user.profilePhoto || "",
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error",
        });
    }
};

export const updateProfile = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user._id;

        const name =
            typeof req.body.name === "string"
                ? req.body.name.trim()
                : "";

        const email =
            typeof req.body.email === "string"
                ? req.body.email.trim().toLowerCase()
                : "";

        if (!name || !email) {
            res.status(400).json({
                message: "Name and email are required",
            });
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            res.status(400).json({
                message: "Please provide a valid email address",
            });
            return;
        }

        const existingUser = await User.findOne({
            email,
            _id: { $ne: userId },
        });

        if (existingUser) {
            res.status(409).json({
                message: "Email is already in use",
            });
            return;
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { name, email },
            {
                new: true,
                runValidators: true,
            }
        ).select("_id name email createdAt");

        if (!user) {
            res.status(404).json({
                message: "User not found",
            });
            return;
        }

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePhoto: user.profilePhoto || "",
                createdAt: user.createdAt,
            },
        });
    } catch (error: any) {
        // Handles a duplicate email race condition
        if (error?.code === 11000) {
            res.status(409).json({
                message: "Email is already in use",
            });
            return;
        }

        console.error("Update profile error:", error);

        res.status(500).json({
            message: "Unable to update profile",
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

export const uploadProfilePhoto = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user._id;

        // Check whether a file was uploaded
        if (!req.file) {
            res.status(400).json({
                message: "Please select a profile photo",
            });
            return;
        }

        const file = req.file;

        // Upload the image buffer to Cloudinary
        const uploadResult = await new Promise<{
            secure_url: string;
        }>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "job-tracker/profile-photos",
                    public_id: userId.toString(),
                    overwrite: true,
                    resource_type: "image",
                    transformation: [
                        {
                            width: 400,
                            height: 400,
                            crop: "fill",
                            gravity: "face",
                        },
                    ],
                },
                (error, result) => {
                    if (error || !result) {
                        reject(
                            error ?? new Error("Cloudinary upload failed")
                        );
                        return;
                    }

                    resolve({
                        secure_url: result.secure_url,
                    });
                }
            );

            stream.end(file.buffer);
        });

        // Save the image URL to the user's MongoDB document
        const user = await User.findByIdAndUpdate(
            userId,
            {
                profilePhoto: uploadResult.secure_url,
            },
            {
                new: true,
                runValidators: true,
            }
        ).select("_id name email profilePhoto createdAt");

        if (!user) {
            res.status(404).json({
                message: "User not found",
            });
            return;
        }

        res.status(200).json({
            message: "Profile photo uploaded successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePhoto: user.profilePhoto,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error("Profile photo upload error:", error);

        res.status(500).json({
            message: "Unable to upload profile photo",
        });
    }
};

export const changePassword = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user._id;

        const { currentPassword, newPassword } = req.body;

        // Validate required fields
        if (!currentPassword || !newPassword) {
            res.status(400).json({
                message: "Current password and new password are required",
            });
            return;
        }

        if (
            typeof currentPassword !== "string" ||
            typeof newPassword !== "string"
        ) {
            res.status(400).json({
                message: "Passwords must be valid strings",
            });
            return;
        }

        if (newPassword.length < 6) {
            res.status(400).json({
                message: "New password must be at least 6 characters",
            });
            return;
        }

        if (currentPassword === newPassword) {
            res.status(400).json({
                message: "New password must be different from current password",
            });
            return;
        }

        // Retrieve the current password hash
        const user = await User.findById(userId).select("+password");

        if (!user) {
            res.status(404).json({
                message: "User not found",
            });
            return;
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isPasswordValid) {
            res.status(401).json({
                message: "Current password is incorrect",
            });
            return;
        }

        // Hash and save new password
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({
            message: "Password changed successfully",
        });
    } catch (error) {
        console.error("Change password error:", error);

        res.status(500).json({
            message: "Unable to change password",
        });
    }
};

export const getMe = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            res.status(404).json({
                message: "User not found",
            });
            return;
        }

        res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePhoto: user.profilePhoto || "",
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error("Get profile error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};