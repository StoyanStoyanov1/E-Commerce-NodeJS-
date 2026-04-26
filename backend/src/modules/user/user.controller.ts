import type { NextFunction, Request, Response } from "express";
import * as userService from "./user.service.js";

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await userService.getMe(req.user!.userId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}