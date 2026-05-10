import prisma from "../../prisma/client.js";
import {AppError} from "../../shared/errors/AppError.js";
import type {UpdateCategoryDto, CreateCategoryDto} from "./category.schema.js";
import {paginate} from "../../shared/pagination/pagination.js";
import logger from "../../shared/logger/logger.js";
import { getCache, setCache, deleteCacheByPattern, deleteCache } from "../../shared/cache/cache.service.js";


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

    const newCategory = await prisma.category.create({
        data: {
            name: dto.name,
            parentId: dto.parentId,
        }
    });

    logger.info("Created new category", newCategory);
    deleteCacheByPattern("categories:*")

    return newCategory;

}

export const updateCategory = async (categoryId: string, dto: UpdateCategoryDto) => {
    const category  = await prisma.category.findUnique({where: {id: categoryId}});

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

    const updatedCategory = await prisma.category.update({        where: {id: categoryId},
        data: {
            name: dto.name,
            parentId: dto.parentId,
        }
    });
    logger.info("Updated category", updatedCategory);
    
    await deleteCache(`category:${categoryId}`);
    await deleteCacheByPattern("category:name:*");
    await deleteCacheByPattern("categories:*");

    return updatedCategory;
};

export const deleteCategory = async (categoryId: string) => {
    const category = await prisma.category.findUnique({where: {id: categoryId}});

    if (!category) throw new AppError("Category not found", 404);

    await prisma.category.updateMany({
        where: {parentId: categoryId},
        data: {parentId: null},
    });

    await prisma.category.delete({where: {id: categoryId}});
    await deleteCache(`category:${categoryId}`);
    await deleteCacheByPattern("category:name:*");
    await deleteCacheByPattern("categories:*");

    logger.info("Deleted category", categoryId);

};

export const getCategories = async (page: number, limit: number) => {
    const cacheKey = `categories:${page}:${limit}`;

    const cached = await getCache(cacheKey);
    if (cached) return cached;

    const { take, skip } =  paginate(page, limit);

    const [data, total] = await Promise.all([
        prisma.category.findMany({take, skip}),
        prisma.category.count(),
    ])

    logger.info("Cache miss", { cacheKey });

    const result = {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };

    await setCache(cacheKey, result);

    return result;
};

export const getCategoryById = async (categoryId: string) => {
    const cacheKey = `category:${categoryId}`;

    const cached = await getCache(cacheKey);
    if (cached) {
        logger.info("Cache hit", { cacheKey });
        return cached;
    }

    logger.info("Cache miss", { cacheKey });

    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) throw new AppError("Category not found", 404);

    await setCache(cacheKey, category);

    return category;
};

export const getCategoryByName = async (name: string) => {
    const cacheKey = `category:name:${name}`;

    const cached = await getCache(cacheKey);
    if (cached) {
        logger.info("Cache hit", { cacheKey });
        return cached;
    }

    logger.info("Cache miss", { cacheKey });

    const category = await prisma.category.findFirst({ where: { name } });
    if (!category) throw new AppError("Category not found", 404);

    await setCache(cacheKey, category);

    return category;
};