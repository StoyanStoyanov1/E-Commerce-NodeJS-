import type {NextFunction, Request, Response} from "express";
import type {UpdateCartItemDTO, AddCartItemDTO} from "./cart.dto.js";
import * as cartService from "./cart.service.js";

export const getCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const cart = await cartService.getCart(userId);
        res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
};

export const addCartItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cart = await cartService.getCart(req.user!.userId);
        await cartService.addCartItem(cart.id, req.body as AddCartItemDTO);
        res.status(201).json(cart);
    } catch (error) {
        next(error);
    }
};

export const updateCartItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updatedCartItems = await cartService.updateCartItem(req.user!.userId, req.params.itemId, req.body as UpdateCartItemDTO);
        res.status(200).json(updatedCartItems);
    } catch (error) {
        next(error);
    }
};

export const deleteCartItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await cartService.deleteCartItem(req.user!.userId, req.params.itemId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const clearCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cart = await cartService.getCart(req.user!.userId);
        await cartService.clearCart(cart.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}
