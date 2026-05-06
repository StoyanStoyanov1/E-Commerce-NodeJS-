import type { Request, Response, NextFunction } from 'express';
import * as OrderService from '../order/order.service.js';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order = await OrderService.createOrder(req.user!.userId, req.body);
        res.status(201).json(order);
    } catch (error) {
        next(error)
    }
};

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await OrderService.getOrders(req.user!.userId);
        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order = await OrderService.getOrderById(req.user!.userId, req.params.id);
        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order = await OrderService.updateOrderStatus(req.params.orderId, req.body.status);
        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
}


