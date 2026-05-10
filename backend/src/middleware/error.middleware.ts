import type { Request, Response, NextFunction } from 'express';
import {AppError} from "../shared/errors/AppError.js";
import logger from "../shared/logger/logger.js";

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {

    logger.error(err.message, {stack: err.stack, path: req.path, method: req.method});

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({message: err.message});
    }

    return res.status(500).json({ message: "Internal server error" });
}