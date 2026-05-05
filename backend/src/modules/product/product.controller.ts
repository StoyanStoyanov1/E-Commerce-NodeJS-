import type { Request, Response, NextFunction } from 'express';
import * as productService from "./product.service.js";
import type {CreateProductDto, UpdateProductDto, CreateProductImage} from './product.dto.js';

export const createProduct = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const sellerId = req.user!.userId;
        const result = await productService.createProduct(req.body as CreateProductDto, sellerId);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const updateProduct = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await productService.updateProduct(req.params.id, req.body as UpdateProductDto);
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

export const deleteProduct = async(req: Request, res: Response, next: NextFunction) => {
    try {
        await productService.deleteProduct(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const updateProductCategory = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await productService.updateProductCategory(req.params.id, req.body.categoryIds);
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

export const getProducts = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await productService.getProducts();
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
}

export const getProductById = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await productService.getProductById(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

export const createProductImage = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const image = await productService.addProductImage(req.params.id, req.body as CreateProductImage);
        res.status(201).json(image);
    } catch (error) {
        next(error);
    }
};

export const deleteProductImage = async(req: Request, res: Response, next: NextFunction) => {
    try {
        await productService.deleteProductImage(req.params.id, req.params.imageId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const changePrimaryProductImage = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const productImage = await productService.changePrimaryProductImage(req.params.id, req.params.imageId);
        res.status(200).json(productImage);
    } catch (error) {
        next(error);
    }

};

