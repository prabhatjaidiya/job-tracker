import { createHash, randomBytes } from "node:crypto";

export const generateResetToken = () => {
    const resetToken = randomBytes(32).toString("hex");

    const hashedToken = createHash("sha256")
        .update(resetToken)
        .digest("hex");

    return {
        resetToken,
        hashedToken,
    };
};