import prisma from "../../prisma/client.js";
import {AppError} from "../../shared/errors/AppError.js";
import type {UpdateCategoryDto, CreateCategoryDto} from "./category.dto.js";

export const createCategory = async (dto: CreateCategoryDto) => {
    const isExist = await prisma.category.findFirst({
        where: {name: dto.name},
    });

    if (isExist) throw new AppError("Category with this name already exists", 400);

    if (dto.parentId) {
        const parent = await prisma.category.findUnique({
            where: {id: dto.parentId},
        });
        if (!parent) throw new AppError("Parent category not found", 404);
    }

    return  prisma.category.create({
        data: {
            name: dto.name,
            parentId: dto.parentId,
        }
    });

}