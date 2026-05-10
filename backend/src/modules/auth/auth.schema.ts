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
export type RegisterDto = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});
export type LoginDto = z.infer<typeof LoginSchema>;

export const ForgotPasswordSchema = z.object({
    email: z.string().email(),
});
export type ForgotPasswordDto = z.infer<typeof ForgotPasswordSchema>;

export const RefreshSchema = z.object({
    refreshToken: z.string(),
});
export type RefreshTokenDto = z.infer<typeof RefreshSchema>;

export const ResetPasswordSchema = z.object({
    token: z.string(),
    newPassword: validatePassword,
});
export type ResetPasswordDto = z.infer<typeof ResetPasswordSchema>;

export const ChangePasswordSchema = z.object({
    currentPassword: z.string(),
    newPassword: validatePassword,
});
export type ChangePasswordDto = z.infer<typeof ChangePasswordSchema>;

export interface RegisterResult {
    id: string;
    email: string;
}

export interface ResetResultDto {
    accessToken: string;
    refreshToken: string;
}