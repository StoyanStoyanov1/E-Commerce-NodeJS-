import type { Request, Response, NextFunction } from 'express';
import * as productService from "./product.service.js";
import type {CreateProductDto, UpdateProductDto, CreateProductImage} from './product.schema.js';
import type {ProductFiltersDto} from "../../shared/filters/productFilter.js"


export const createProduct = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const sellerId: string = req.user!.userId;
        const body: CreateProductDto = req.body;
        const result = await productService.createProduct(body, sellerId);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const updateProduct = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const body: UpdateProductDto = req.body;
        const id = req.params.id as string;
        const sellerId: string = req.user!.userId;
        const product = await productService.updateProduct(id, body, sellerId);
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

export const deleteProduct = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id= req.params.id as string;
        await productService.deleteProduct(id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const updateProductCategory = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const categoryIds: string[] = req.body.categoryIds;
        const id = req.params.id as string;
        const product = await productService.updateProductCategory(id, categoryIds);
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
        const id = req.params.id as string;
        const product = await productService.getProductById(id);
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

export const createProductImage = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const body: CreateProductImage = req.body;
        const id= req.params.id as string;
        const image = await productService.addProductImage(id, body);
        res.status(201).json(image);
    } catch (error) {
        next(error);
    }
};

export const deleteProductImage = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {id, imageId} = req.params as {id: string, imageId: string};
        await productService.deleteProductImage(id, imageId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const changePrimaryProductImage = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {id, imageId} = req.params as {id: string, imageId: string};
        const productImage = await productService.changePrimaryProductImage(id, imageId);
        res.status(200).json(productImage);
    } catch (error) {
        next(error);
    }

};

