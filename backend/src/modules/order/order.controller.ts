import type { Request, Response, NextFunction } from 'express';
import * as OrderService from '../order/order.service.js';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order = await OrderService.createOrder(req.user!.userId, req.body);
        res.status(201).json(order);
    } catch (error) {
        next(error)
    }
}

