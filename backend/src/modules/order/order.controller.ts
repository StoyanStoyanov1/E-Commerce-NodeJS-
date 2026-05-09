import type { Request, Response, NextFunction } from 'express';
import * as OrderService from '../order/order.service.js';
import type {OrderDto} from "./order.schema.js";

export const createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user: string = req.user!.userId;
        const body: OrderDto = req.body;
        const order = await OrderService.createOrder(user, body);
        res.status(201).json(order);
    } catch (error) {
        next(error)
    }
};

export const getOrders = async (req: Request, res: Response, next: NextFunction): Promise<void>  => {
    try {
        const page: number = Number(req.query.page) || 1;
        const limit: number = Number(req.query.limit) || 10;
        const userId: string = req.user!.userId;
        const orders = await OrderService.getOrders(userId, page, limit);
        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId: string = req.user!.userId;
        const order = await OrderService.getOrderById(userId, req.params.id);
        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const status = req.body.status;
        const order = await OrderService.updateOrderStatus(req.params.orderId, status);
        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
}


