import { NextFunction, Request, Response } from "express";

const errorMiddleware = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    console.error(err);

    res.status(500).json({
        success: false,
        message: "Internal server error",
    });
};

export default errorMiddleware;