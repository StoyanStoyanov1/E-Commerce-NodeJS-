import type { NextFunction, Request, Response } from "express";
import * as categoryService from "./category.service.js";
import type {CreateCategoryDto, UpdateCategoryDto} from "./category.schema.js";

export const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const body: CreateCategoryDto = req.body;
        const result = await categoryService.createCategory(body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const categoryId = req.params.id;
        const body: UpdateCategoryDto = req.body;
        const result = await categoryService.updateCategory(categoryId, body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await  categoryService.deleteCategory(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const page: number = Number(req.query.page) || 1;
        const limit: number = Number(req.query.limit) || 10;
        const result = await categoryService.getCategories(page, limit);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const getCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await categoryService.getCategoryById(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const getCategoryByName = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await categoryService.getCategoryByName(req.params.name);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}