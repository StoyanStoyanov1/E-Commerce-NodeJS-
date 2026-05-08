import prisma from "../../prisma/client.js";
import {AppError} from "../../shared/errors/AppError.js";
import type {UpdateCategoryDto, CreateCategoryDto, GetCategoriesResult} from "./category.schema.js";
import {paginate} from "../../shared/pagination/pagination.js";
import type {Category} from "@prisma/client";

export const createCategory = async (dto: CreateCategoryDto): Promise<Category> => {
    const isExist: Promise<Category> = await prisma.category.findFirst({
        where: {name: dto.name},
    });

    if (isExist) throw new AppError("Category with this name already exists", 400);

    if (dto.parentId) {
        const parent: Promise<Category> = await prisma.category.findUnique({
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

export const updateCategory = async (categoryId: string, dto: UpdateCategoryDto): Promise<Category> => {
    const category: Promise<Category> = await prisma.category.findUnique({where: {id: categoryId}});

    if (!category) throw new AppError("Category not found", 404);
    if (dto.parentId) {
        if (dto.parentId === categoryId) throw new AppError("Category cannot be its own parent", 400);

        const parent: Promise<Category> = await prisma.category.findUnique({
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
};

export const deleteCategory = async (categoryId: string): Promise<void> => {
    const category: Promise<Category> = await prisma.category.findUnique({where: {id: categoryId}});

    if (!category) throw new AppError("Category not found", 404);

    await prisma.category.updateMany({
        where: {parentId: categoryId},
        data: {parentId: null},
    });

    await prisma.category.delete({where: {id: categoryId}});

};

export const getCategories = async (page: number, limit: number): Promise<GetCategoriesResult> => {
    const { take, skip } =  paginate(page, limit);

    const [data, total] = await Promise.all([
        prisma.category.findMany({take, skip}),
        prisma.category.count(),
    ])

    return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};

export const getCategoryById = async (categoryId: string): Promise<Category> => {
    const category: Promise<Category> = await prisma.category.findUnique({where: {id: categoryId}});
    if (!category) throw new AppError("Category not found", 404);
    return category;
};


export const getCategoryByName = async (name: string): Promise<Category> => {
    const category: Promise<Category> = await prisma.category.findFirst({where: {name: name}});
    if (!category) throw new AppError("Category not found", 404);
    return category;
}