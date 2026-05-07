import { z } from 'zod';

const validatePassword = z.string().regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character"
);

const formatDate = z.string().regex(/^\d{2}-\d{2}-\d{4}$/, "Date must be in format DD-MM-YYYY")

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