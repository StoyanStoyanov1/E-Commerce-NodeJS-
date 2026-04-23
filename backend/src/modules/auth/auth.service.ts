import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import prisma from "../../prisma/client.js";
import type { RegisterDto, LoginDto, RefreshTokenDto, ChangePasswordDto} from "./auth.dto.js";
import { AppError } from "../../shared/errors/AppError.js";
import { sendVerificationEmail } from "../../shared/email/email.service.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY_DAYS = 7;

const generateAccessToken = (userId: string, role: string | undefined) => {
    return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
};

const generateRefreshToken = () => {
    return crypto.randomBytes(64).toString("hex");
};

const saveRefreshToken = async (userId: string, token: string) => {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

    return prisma.refreshToken.create({
        data: { token, userId, expiresAt },
    });
};


export const login = async (dto: LoginDto) => {
    const user = await prisma.user.findUnique({
        where: { email: dto.email },
        include: { role: true },
    });

    if (!user) throw new AppError("Incorrect email or password", 401);

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) throw new AppError("Incorrect email or password", 401);

    const accessToken = generateAccessToken(user.id, user.role?.name);
    const refreshToken = generateRefreshToken();
    await saveRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken, userId: user.id, role: user.role?.name };
};

export const logout = async (dto: RefreshTokenDto) => {
    const existing = await prisma.refreshToken.findUnique({
        where: { token: dto.refreshToken },
    });

    if (!existing || existing.isRevoked) throw new AppError("Invalid refresh token", 401);

    await prisma.refreshToken.update({
        where: { id: existing.id },
        data: { isRevoked: true },
    });
};

export const logoutAll = async (userId: string) => {
    await prisma.refreshToken.updateMany({
        where: { userId, isRevoked: false },
        data: { isRevoked: true },
    });
};

export const changePassword = async (userId: string, dto: ChangePasswordDto) => {
    const user = await prisma.user.findUnique({
        where: {id: userId},
    })

    if (!user) throw new AppError("User not found", 401);

    const isValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isValid) throw new AppError("Incorrect password", 401);

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await prisma.user.update({
        where: {id: userId},
        data: {password: hashedPassword},
    })
}

export const register = async (dto: RegisterDto) => {
    const existing = await prisma.user.findUnique({
        where: { email: dto.email },
    });

    if (existing) throw new AppError("User already exists", 409);

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await prisma.user.create({
        data: {
            email: dto.email,
            password: hashedPassword,
            role: { create: { name: "CUSTOMER" } },
        },
    });

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await prisma.emailVerification.create({
        data: { token, userId: user.id, expiresAt },
    });

    await sendVerificationEmail(user.email, token);

    return { id: user.id, email: user.email };
};

export const verifyEmail = async (token: string) => {
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


