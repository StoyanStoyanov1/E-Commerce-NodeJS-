import prisma from "../../prisma/client.js";
import { AppError } from "../../shared/errors/AppError.js";

export const getMe = async (userId: number) => {
    const user = await prisma.user.findUnique({
        where: {id: userId},
        select: {
            id: true,
            email: true,
            isAktiv: true,
            createdAt: true,
            role: {select: {name: true}},
            profile: true,
            addresses: true,
        }
    });

    if (!user) {
        throw new AppError("User not found", 404);
    }

    return user;
    
}