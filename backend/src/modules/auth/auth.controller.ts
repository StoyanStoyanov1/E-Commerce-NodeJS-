import type { NextFunction, Request, Response } from 'express';
import * as authService from './auth.service.js';
import type { LoginDto, RegisterDto } from "./auth.dto.js";

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await authService.register(req.body as RegisterDto);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await authService.login(req.body as LoginDto);
        res.status(200).json(result);
    } catch (error) {
        next(error); 
    }
};