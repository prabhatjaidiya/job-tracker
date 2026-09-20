import { ErrorRequestHandler } from "express";

const errorMiddleware: ErrorRequestHandler = (
    err,
    _req,
    res,
    _next
) => {
    console.error(err);

    if (res.headersSent) {
        return;
    }

    if (err instanceof SyntaxError && "body" in err) {
        res.status(400).json({
            success: false,
            message: "Invalid JSON request body",
        });
        return;
    }

    if (err.name === "ValidationError") {
        res.status(400).json({
            success: false,
            message: "Validation failed",
        });
        return;
    }

    if (err.code === 11000) {
        res.status(409).json({
            success: false,
            message: "A record with this value already exists",
        });
        return;
    }

    const statusCode =
        typeof err.status === "number" &&
            err.status >= 400 &&
            err.status < 600
            ? err.status
            : 500;

    const message =
        statusCode === 500
            ? "Internal server error"
            : err.message || "Request failed";

    res.status(statusCode).json({
        success: false,
        message,
    });
};

export default errorMiddleware;