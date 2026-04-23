import type { NextFunction, Request, Response } from 'express';
import * as authService from './auth.service.js';
import type {ChangePasswordDto, LoginDto, RefreshTokenDto, RegisterDto, ForgotPasswordDto, ResetPasswordDto} from "./auth.dto.js";

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

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await authService.refresh(req.body as RefreshTokenDto);
        res.status(200).json(res);
    } catch (error) {
        next(error);
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await authService.logout(req.body as RefreshTokenDto);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const logoutAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.body as { userId: string };
        await authService.logoutAll(userId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await authService.changePassword(req.user!.userId, req.body as ChangePasswordDto)
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.query as { token : string };
        await authService.verifyEmail(token);
        res.status(200).json({message: "Email verified successfully"});
    } catch (error) {
        next(error);
    }
};


export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await authService.forgotPassword(req.body as ForgotPasswordDto);
        res.status(200).json({ message: "If this email exists, a reset link has been sent" });
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await authService.resetPassword(req.body as ResetPasswordDto);
        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        next(error);
    }
};

