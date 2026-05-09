import type {NextFunction, Request, Response} from "express";
import type {UpdateCartItemDTO, AddCartItemDTO} from "./cart.schema.js";
import * as cartService from "./cart.service.js";
import type {Cart} from "@prisma/client"

export const getCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId: string = req.user!.userId;
        const cart = await cartService.getCart(userId);
        res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
};

export const addCartItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const cart = await cartService.getCart(req.user!.userId);
        const cartId: string = cart.id;
        const body: AddCartItemDTO = req.body;
        await cartService.addCartItem(cartId, body);
        res.status(201).json(cart);
    } catch (error) {
        next(error);
    }
};

export const updateCartItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId: string = req.user!.userId;
        const itemId = req.params.itemId;
        const body: UpdateCartItemDTO = req.body as UpdateCartItemDTO;

        const updatedCartItems = await cartService.updateCartItem(userId, itemId, body);
        res.status(200).json(updatedCartItems);
    } catch (error) {
        next(error);
    }
};

export const deleteCartItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId: string = req.user!.userId;
        const itemId = req.params.itemId;
        await cartService.deleteCartItem(userId, itemId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const clearCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId: string = req.user!.userId;
        const cart = await cartService.getCart(userId);
        const cartId: string = cart.id;
        await cartService.clearCart(cartId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}
