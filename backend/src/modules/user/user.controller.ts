import type { NextFunction, Request, Response } from "express";
import * as userService from "./user.service.js";
import type { UpdateProfileDto, UpdateAddressDto, CreateAddressDto} from "./user.dto.js";

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await userService.updateProfile(req.user!.userId, req.body as UpdateProfileDto);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const getAddresses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await userService.getAddresses(req.user!.userId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const createAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await userService.createAddress(req.user!.userId, req.body as CreateAddressDto);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const updateAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await userService.updateAddress(req.user!.userId, req.params.id, req.body as UpdateAddressDto);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await userService.deleteAddress(req.user!.userId, req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const setDefaultAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await userService.setDefaultAddress(req.user!.userId, req.params.id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await userService.getMe(req.user!.userId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}