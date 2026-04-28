import type { NextFunction, Request, Response } from "express";
import * as categoryService from "./category.service.js";
import type {CreateCategoryDto, UpdateCategoryDto} from "./category.dto.js";
import prisma from "../../prisma/client.js";

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await categoryService.createCategory(req.body as CreateCategoryDto);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await categoryService.updateCategory(req.params.id, req.body as UpdateCategoryDto);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}
