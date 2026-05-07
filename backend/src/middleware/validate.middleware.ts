import type { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import {AppError} from "../shared/errors/AppError.js";

export const validate = (schema: ZodSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const message = error.errors.map(e => e.message).join(', ');
                return next(new AppError(message, 400));
            }
            next(error);
        }
    }
}