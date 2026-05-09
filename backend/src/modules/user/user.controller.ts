import type {NextFunction, Request, Response} from "express";
import * as userService from "./user.service.js";
import type {UpdateProfileDto, UpdateAddressDto, CreateAddressDto} from "./user.schema.js";
import prisma from "../../prisma/client.js";

export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId: string = req.user!.userId;
        const body: UpdateProfileDto = req.body;
        const result = await userService.updateProfile(userId, body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const getAddresses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId: string = req.user!.userId;
        const result = await userService.getAddresses(userId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const createAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId: string = req.user!.userId;
        const body: CreateAddressDto = req.body;
        const result = await userService.createAddress(userId, body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const updateAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId: string = req.user!.userId;
        const body: UpdateAddressDto = req.body;
        const id: string = req.params.id as string;
        const result = await userService.updateAddress(userId, id, body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const deleteAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId: string = req.user!.userId;
        const id: string = req.params.id as string;
        await userService.deleteAddress(userId, id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const setDefaultAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId: string = req.user!.userId;
        const id: string = req.params.id as string;
        const result = await userService.setDefaultAddress(userId, id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId: string = req.user!.userId;
        const result = await userService.getMe(userId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}