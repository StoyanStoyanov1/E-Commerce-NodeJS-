import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import prisma from "../../prisma/client.js";
import type { RegisterDto, LoginDto, RefreshTokenDto, ChangePasswordDto, ResetPasswordDto, ForgotPasswordDto, RegisterResult, ResetResultDto} from "./auth.schema.js";
import { AppError } from "../../shared/errors/AppError.js";
import { sendPasswordResetEmail, sendVerificationEmail } from "../../shared/email/email.service.js";
import type {RefreshToken, User, PasswordReset} from "@prisma/client";

const JWT_SECRET: string = process.env.JWT_SECRET || "secret";
const ACCESS_TOKEN_EXPIRY: string = "1d";
const REFRESH_TOKEN_EXPIRY_DAYS: number = 7;

const generateAccessToken = (userId: string, role: string | undefined): string => {
    return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
};

const generateRefreshToken = (): string => {
    return crypto.randomBytes(64).toString("hex");
};

const saveRefreshToken = async (userId: string, token: string): Promise<RefreshToken> => {
    const expiresAt: Date = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

    return prisma.refreshToken.create({
        data: { token, userId, expiresAt },
    });
};


export const login = async (dto: LoginDto) => {
    const user: Promise<RefreshToken> = await prisma.user.findUnique({
        where: { email: dto.email },
        include: { role: true },
    });

    if (!user) throw new AppError("Incorrect email or password", 401);

    const isValid: boolean = await bcrypt.compare(dto.password, user.password);
    if (!isValid) throw new AppError("Incorrect email or password", 401);

    const accessToken: string = generateAccessToken(user.id, user.role?.name);
    const refreshToken: string = generateRefreshToken();
    await saveRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken, userId: user.id, role: user.role?.name };
};

export const logout = async (dto: RefreshTokenDto): Promise<RefreshTokenDto> => {
    const existing: Promise<RefreshToken> = await prisma.refreshToken.findUnique({
        where: { token: dto.refreshToken },
    });

    if (!existing || existing.isRevoked) throw new AppError("Invalid refresh token", 401);

    await prisma.refreshToken.update({
        where: { id: existing.id },
        data: { isRevoked: true },
    });
};

export const logoutAll = async (userId: string): Promise<void> => {
    await prisma.refreshToken.updateMany({
        where: { userId, isRevoked: false },
        data: { isRevoked: true },
    });
};

export const changePassword = async (userId: string, dto: ChangePasswordDto): Promise<ChangePasswordDto> => {
    const user: Promise<User> = await prisma.user.findUnique({
        where: {id: userId},
    })

    if (!user) throw new AppError("User not found", 401);

    const isValid: boolean = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isValid) throw new AppError("Incorrect password", 401);

    const hashedPassword: string = await bcrypt.hash(dto.newPassword, 10);

    await prisma.user.update({
        where: {id: userId},
        data: {password: hashedPassword},
    })
}

export const register = async (dto: RegisterDto): Promise<RegisterResult> => {
    const existing: Promise<User> = await prisma.user.findUnique({
        where: { email: dto.email },
    });

    if (existing) throw new AppError("User already exists", 409);

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user: Promise<User> = await prisma.user.create({
        data: {
            email: dto.email,
            password: hashedPassword,
            role: { create: { name: "CUSTOMER" } },
            profile: {
                create: {
                    firstName: dto.firstName,
                    middleName: dto.middleName,
                    lastName: dto.lastName,
                    phoneNumber: dto.phoneNumber,
                    birthDate: new Date(dto.birthDate),
                },
            },
            cart: {
                create: {}
            }

        },
    });

    const token: string = crypto.randomBytes(32).toString("hex");
    const expiresAt: Date = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await prisma.emailVerification.create({
        data: { token, userId: user.id, expiresAt },
    });

    await sendVerificationEmail(user.email, token);

    return { id: user.id, email: user.email };
};

export const verifyEmail = async (token: string): Promise<void> => {
    const verification = await prisma.emailVerification.findUnique({
        where: { token },
    });

    if (!verification) throw new AppError("Invalid verification token", 400);
    if (verification.isUsed) throw new AppError("Token already used", 400);
    if (verification.expiresAt < new Date()) throw new AppError("Token has expired", 400);

    await prisma.emailVerification.update({
        where: { id: verification.id },
        data: { isUsed: true },
    });

    await prisma.user.update({
        where: { id: verification.userId },
        data: { isAktiv: true },
    });
};

export const forgotPassword = async (dto: ForgotPasswordDto): Promise<void> => {
    const user: Promise<User> = await prisma.user.findUnique({
        where: { email: dto.email },
    });

    if (!user) return;

    const token: string = crypto.randomBytes(32).toString("hex");
    const expiresAt: Date = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await prisma.passwordReset.create({
        data: { token, userId: user.id, expiresAt },
    });

    await sendPasswordResetEmail(user.email, token);
};

export const resetPassword = async (dto: ResetPasswordDto): Promise<void> => {
    const reset: Promise<PasswordReset> = await prisma.passwordReset.findUnique({
        where: { token: dto.token },
    });

    if (!reset) throw new AppError("Invalid reset token", 400);
    if (reset.isUsed) throw new AppError("Token already used", 400);
    if (reset.expiresAt < new Date()) throw new AppError("Token has expired", 400);

    const hashedPassword: string = await bcrypt.hash(dto.newPassword, 10);

    await prisma.user.update({
        where: { id: reset.userId },
        data: { password: hashedPassword },
    });

    await prisma.passwordReset.update({
        where: { id: reset.id },
        data: { isUsed: true },
    });

    await logoutAll(reset.userId);
};

export const refresh = async (dto: RefreshTokenDto): Promise<ResetResultDto> => {
    const existing = await prisma.refreshToken.findUnique({
        where: { token: dto.refreshToken },
        include: { user: { include: { role: true } } },
    });

    if (!existing) throw new AppError("Invalid refresh token", 401);
    if (existing.isRevoked) throw new AppError("Refresh token has been revoked", 401);
    if (existing.expiresAt < new Date()) throw new AppError("Refresh token has expired", 401);

    await prisma.refreshToken.update({
        where: { id: existing.id },
        data: { isRevoked: true },
    });

    const accessToken: string = generateAccessToken(existing.userId, existing.user.role?.name);
    const newRefreshToken: string = generateRefreshToken();
    await saveRefreshToken(existing.userId, newRefreshToken);

    return { accessToken, refreshToken: newRefreshToken };
};