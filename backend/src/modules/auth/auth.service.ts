import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import prisma from "../../prisma/client.js";
import type { RegisterDto, LoginDto, RefreshTokenDto } from "./auth.dto.js";
import { AppError } from "../../shared/errors/AppError.js";

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

export const register = async (dto: RegisterDto) => {
    const existing = await prisma.user.findUnique({
        where: { email: dto.email },
    });

    if (existing) {
        throw new AppError("User already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await prisma.user.create({
        data: {
            email: dto.email,
            password: hashedPassword,
            role: { create: { name: "CUSTOMER" } },
        },
    });

    return { id: user.id, email: user.email };
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

export const refresh = async (dto: RefreshTokenDto) => {
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

    const accessToken = generateAccessToken(existing.userId, existing.user.role?.name);
    const newRefreshToken = generateRefreshToken();
    await saveRefreshToken(existing.userId, newRefreshToken);

    return { accessToken, refreshToken: newRefreshToken };
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