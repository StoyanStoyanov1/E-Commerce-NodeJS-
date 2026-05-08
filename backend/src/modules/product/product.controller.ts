import type { Request, Response, NextFunction } from 'express';
import * as productService from "./product.service.js";
import type {CreateProductDto, UpdateProductDto, CreateProductImage} from './product.schema.js';
import type {ProductFiltersDto} from "../../shared/filters/productFilter.js"
import type {Product} from "@prisma/client";

export const createProduct = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const sellerId: string = req.user!.userId;
        const result = await productService.createProduct(req.body as CreateProductDto, sellerId);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const updateProduct = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const body: UpdateProductDto = req.body;
        const product = await productService.updateProduct(req.params.id, body);
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

export const deleteProduct = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await productService.deleteProduct(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const updateProductCategory = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const product = await productService.updateProductCategory(req.params.id, req.body.categoryIds);
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

export const getProducts = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const filters: ProductFiltersDto = {
            search: req.query.search as string,
            categoryId: req.query.categoryId as string,
            minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
            maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
            inStock: req.query.inStock === "true",
            sortBy: req.query.sortBy as "price" | "createdAt",
            sortOrder: req.query.sortOrder as "asc" | "desc",
        };

        const page: number = Number(req.query.page) || 1;
        const limit: number = Number(req.query.limit) || 10;
        const result = await productService.getProducts(page, limit, filters);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export const getProductById = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const product = await productService.getProductById(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

export const createProductImage = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const body: CreateProductDto = req.body;
        const image = await productService.addProductImage(req.params.id, body);
        res.status(201).json(image);
    } catch (error) {
        next(error);
    }
};

export const deleteProductImage = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {id, imageId} = req.params;
        await productService.deleteProductImage(id, imageId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const changePrimaryProductImage = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {id, imageId} = req.params;
        const productImage = await productService.changePrimaryProductImage(id, imageId);
        res.status(200).json(productImage);
    } catch (error) {
        next(error);
    }

};

