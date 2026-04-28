import prisma from "../../prisma/client.js";
import type { CreateProductDto, UpdateProductDto } from "./product.dto.js";
import { AppError } from "../../shared/errors/AppError.js";

export const createProduct = async (dto: CreateProductDto, sellerId: string) => {
    const categories = await prisma.category.findMany({
        where: { id: { in: dto.categoryIds } },
    });

    if (categories.length !== dto.categoryIds.length) {
        throw new AppError("One or more categories not found", 404);
    }

    return prisma.product.create({
        data: {
            name: dto.name,
            description: dto.description,
            price: dto.price,
            stock: dto.stock,
            sellerId,
            categories: {
                create: dto.categoryIds.map(categoryId => ({ categoryId })),
            },
        },
        include: {
            categories: {
                include: {category: true},
            },
            images: true,
        }
    });
};

export const updateProduct = async (productId: string, dto: UpdateProductDto) => {
    const product = await prisma.product.findUnique({ where: { id: productId } });

    if (!product) throw new AppError("Product not found", 404);

    return prisma.product.update({
        where: { id: productId },
        data: {
            name: dto.name,
            description: dto.description,
            price: dto.price,
            stock: dto.stock,
        },
    });
};

export const deleteProduct = async (productId: string) => {
    const product = await prisma.product.findUnique({ where: { id: productId } });

    if (!product) throw new AppError("Product not found", 404);

    await prisma.product.delete({ where: { id: productId } });
};

export const updateProductCategory = async (productId: string, categoryIds: string[]) => {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new AppError("Product not found", 404);

    const categories = await prisma.category.findMany({
        where: { id: { in: categoryIds } },
    });

    if (categories.length !== categoryIds.length) {
        throw new AppError("One or more categories not found", 404);
    }

    await prisma.productCategory.deleteMany({ where: { productId } });

    return prisma.productCategory.createMany({
        data: categoryIds.map(categoryId => ({ productId, categoryId })),
    });
};

export const getProducts = async () => {
    return prisma.product.findMany({
        include: {
            categories: {
                include: {
                    category: true,
                },
            },
            images: true,
        },
    });
};

export const getProductById = async (productId: string) => {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new AppError("Product not found", 404);
    return product;
};