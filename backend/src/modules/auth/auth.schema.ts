import { z } from 'zod';
import {formatDate, validatePassword} from "../../shared/validation/user.validation.js"




export const RegisterSchema = z.object({
    email: z.string().email(),
    password: validatePassword,
    firstName: z.string().min(2).max(18),
    middleName: z.string().min(2).max(18).optional(),
    lastName: z.string().min(2).max(18),
    phoneNumber: z.string().min(2).max(18),
    birthday: formatDate,
});

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const ForgotPasswordSchema = z.object({
    email: z.string().email(),
});

export const RefreshSchema = z.object({
    refreshToken: z.string(),
});

export const ResetPasswordSchema = z.object({
    token: z.string(),
    newPassword: validatePassword,
});

export const ChangePasswordSchema = z.object({
    currentPassword: z.string(),
    newPassword: validatePassword,
});