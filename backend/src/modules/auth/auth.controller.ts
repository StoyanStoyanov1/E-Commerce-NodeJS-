import type { NextFunction, Request, Response } from 'express';
import * as authService from './auth.service.js';
import type {ChangePasswordDto, LoginDto, RefreshTokenDto, RegisterDto, ForgotPasswordDto, ResetPasswordDto} from "./auth.schema.js";

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const body: RegisterDto = req.body;

        const result: object = await authService.register(body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const body: LoginDto = req.body;
        const result: object = await authService.login(body);
        res.status(200).json(result);
    } catch (error) {
        next(error); 
    }
};

export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const body: RefreshTokenDto = req.body;
        const result = await authService.refresh(body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const body: RefreshTokenDto = req.body;
        await authService.logout(body);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const logoutAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const body: {userId: string} = req.body;

        const userId: string = req.user!.userId;
        await authService.logoutAll(userId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId: string = req.user!.userId;
        const body: ChangePasswordDto = req.body;

        await authService.changePassword(userId, body);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { token } = req.query as { token : string };
        await authService.verifyEmail(token);
        res.status(200).json({message: "Email verified successfully"});
    } catch (error) {
        next(error);
    }
};


export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const body: ForgotPasswordDto = req.body;
        await authService.forgotPassword(body);
        res.status(200).json({ message: "If this email exists, a reset link has been sent" });
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const body: ResetPasswordDto = req.body;
        await authService.resetPassword(body);
        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        next(error);
    }
};

