import nodemailer from "nodemailer";

const createTransporter = () => {
    const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } =
        process.env;

    if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS) {
        throw new Error("Email configuration is incomplete");
    }

    return nodemailer.createTransport({
        host: EMAIL_HOST,
        port: Number(EMAIL_PORT),
        secure: Number(EMAIL_PORT) === 465,
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS,
        },
    });
};

export const sendPasswordResetEmail = async (
    email: string,
    resetUrl: string
): Promise<void> => {
    const transporter = createTransporter();

    await transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: email,
        subject: "Reset your Job Tracker password",
        text: `Use this link to reset your password: ${resetUrl}\n\nThis link expires in 15 minutes. If you didn't request this, you can ignore this email.`,
        html: `
            <p>You requested a password reset for your Job Tracker account.</p>
            <p><a href="${resetUrl}">Reset your password</a></p>
            <p>This link expires in 15 minutes. If you didn't request this, you can ignore this email.</p>
        `,
    });
};