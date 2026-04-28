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

export const updateCategory = async (categoryId: string, dto: UpdateCategoryDto) => {
    const category = await prisma.category.findUnique({where: {id: categoryId}});

    if (!category) throw new AppError("Category not found", 404);
    if (dto.parentId) {
        if (dto.parentId === categoryId) throw new AppError("Category cannot be its own parent", 400);

        const parent = await prisma.category.findUnique({
            where: {id: dto.parentId},
        });
        if (!parent) throw new AppError("Parent category not found", 404);
    }

    if (category.name === dto.name && category.parentId === dto.parentId) {
        return category;
    }

    return prisma.category.update({
        where: {id: categoryId},
        data: {
            name: dto.name,
            parentId: dto.parentId,
        }
    });
}