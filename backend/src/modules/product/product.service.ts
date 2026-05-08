import prisma from "../../prisma/client.js";
import type {CreateProductDto, UpdateProductDto, CreateProductImage} from "./product.schema.js";
import { AppError } from "../../shared/errors/AppError.js";
import {paginate, type PaginationDto} from "../../shared/pagination/pagination.js"
import {productFilter, type ProductFiltersDto} from "../../shared/filters/productFilter.js";
import type {Product, ProductImage} from "@prisma/client";

export const createProduct = async (dto: CreateProductDto, sellerId: string): Promise<Product> => {
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

export const updateProduct = async (productId: string, dto: UpdateProductDto): Promise<Product> => {
    const product: Promise<Product> = await prisma.product.findUnique({ where: { id: productId } });

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

export const deleteProduct = async (productId: string): Promise<void> => {
    const product: Promise<Product> = await prisma.product.findUnique({ where: { id: productId } });

    if (!product) throw new AppError("Product not found", 404);

    await prisma.product.delete({ where: { id: productId } });
};

export const updateProductCategory = async (productId: string, categoryIds: string[]): Promise<Product> => {
    const product: Promise<Product> = await prisma.product.findUnique({ where: { id: productId } });
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

export const getProducts = async (page: number, limit: number, filters: ProductFiltersDto): Promise<PaginationDto<Product>> => {
    const { take, skip } = paginate(page, limit);

    const where: ProductFiltersDto = productFilter(filters);

    const orderBy = {[filters.sortBy || "createdAt"]: filters.sortOrder || "desc"};

    const [data, total] = await Promise.all([
        prisma.product.findMany({
            where,
            orderBy,
            take,
            skip,
            include: {
                categories: {
                    include: { category: true },
                },
                images: true,
            },
        }),
        prisma.product.count({ where }),
    ]);

    return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};

export const getProductById = async (productId: string): Promise<Product> => {
    const product: Promise<Product> = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new AppError("Product not found", 404);
    return product;
};

export const addProductImage = async (productId: string, dto: CreateProductImage): Promise<ProductImage> => {
    const product: Promise<Product> = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new AppError("Product not found", 404);

    if (dto.isPrimary) {
        await prisma.productImage.updateMany({
            where: {productId, isPrimary: true},
            data: {isPrimary: false}
        })
    }

    const hasImages: Promise<ProductImage> = await prisma.productImage.findFirst({where: {productId}});

    return prisma.productImage.create({
        data: {
            productId,
            url: dto.url,
            isPrimary: !hasImages ? true : dto.isPrimary,
        }
    })
}

export const deleteProductImage = async (productId: string, imageId: string): Promise<void> => {
    const image: Promise<ProductImage> = await prisma.productImage.findUnique({ where: { id: productId } });

    if (!image) throw new AppError("Image not found", 404);
    if (image.productId !== productId) throw new AppError("Forbidden", 404);
    if (image.isPrimary) throw new AppError("Cannot delete primary image", 404);

    await prisma.productImage.delete({where: {id: productId}});
}

export const changePrimaryProductImage = async (productId: string, imageId: string): Promise<void> => {
    const product: Promise<Product> = await prisma.product.findUnique({ where: { id: productId } });

    if (!product) throw new AppError("Product not found", 404);
    const productImage: Promise<ProductImage> = await prisma.productImage.findUnique({ where: { id: imageId } });

    if (!productImage) throw new AppError("Image not found", 404);
    if (productImage.productId !== productId) throw new AppError("Forbidden", 404);
    if (productImage.isPrimary) return;

    await prisma.productImage.updateMany({
        where: {productId, isPrimary: true},
        data: {isPrimary: false}
    });

    await prisma.productImage.update({
        where: {id: imageId},
        data: {isPrimary: true},
    });

}