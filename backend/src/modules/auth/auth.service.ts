import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/client.js";
import type {RegisterDto, LoginDto} from "./auth.dto.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const register = async (dto: RegisterDto) => {
    const existing = await prisma.user.findUnique({
        where: { email: dto.email },
    });

    if (existing) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await prisma.user.create({
        data: {
            email: dto.email,
            password: hashedPassword,
            role: {
                create: {
                    name: "CUSTOMER",
                },
            },
        },
    });

    return { id: user.id, email: user.email };
};

export const login = async (dto: LoginDto) => {
    const user = await prisma.user.findUnique({
        where: { email: dto.email },
        include: { role: true },
    });

    if (!user) {
        throw new Error("Incorrect email or password");
    }

    const isValid = await bcrypt.compare(dto.password, user.password);

    if (!isValid) {
        throw new Error("Incorrect email or password");
    }

    const token = jwt.sign(
        { userId: user.id, role: user.role?.name },
        JWT_SECRET,
        { expiresIn: "15m" }
    );

    return { token, userId: user.id, role: user.role?.name };
};