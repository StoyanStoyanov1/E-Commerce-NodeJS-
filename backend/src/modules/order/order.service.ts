import prisma from "../../prisma/client.js";
import type {OrderCreate, OrderUpdate} from "./order.dto.js";
import {AppError} from "../../shared/errors/AppError.js";
import type {OrderStatus} from "@prisma/client";

export const createOrder = async (userId: string, dto: OrderCreate) => {
    const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
            cartItems: {
                include: {
                    product: true,
                },
            },
        },
    });

    if (!cart || cart.cartItems.length === 0) throw new AppError("Cart is empty", 400);

    const address = await prisma.address.findUnique({
        where: { id: dto.addressId, userId },
    });

    if (!address) throw new AppError("Address is not found!", 404);

    for (const item of cart.cartItems) {
        if (item.product.stock < item.quantity) throw new AppError(`Product ${item.product.name} has insufficient stock`, 400);
    }

    const totalPrice = cart.cartItems.reduce((total, item) => total + Number(item.product.price) * item.quantity, 0);

    return await prisma.$transaction(async (tx) => {
        const newOrder = await tx.order.create({
            data: {
                userId,
                addressId: dto.addressId,
                totalPrice,
                status: "PENDING",
                orderItems: {
                    create: cart.cartItems.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.product.price,
                    })),
                },
            },
            include: {
                orderItems: true,
            },
        });

        for (const item of cart.cartItems) {
            await tx.product.update({
                where: {id: item.productId},
                data: {stock: {decrement: item.quantity}},
            });
        }

        await tx.cartItem.deleteMany({
            where: {cartId: cart.id},
        });

        return newOrder;
    });
};

export const getOrders = async (userId: string) => {
    return prisma.order.findMany({
        where: { userId },
        include: {orderItems: true},
    });
};

export const getOrderById = async (userId: string, orderId: string) => {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {orderItems: true},
    });

    if (!order) throw new AppError("Order not found!", 400);
    if (order.userId !== userId) throw new AppError("Forbidden!", 403);

    return order;
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const order = await prisma.order.findUnique({where: { id: orderId},});

    if (!order) throw new AppError("Order not found!", 404);

    if (order.status === status) throw new AppError(`Order is already in ${status} status`, 400);

    return prisma.order.update({
        where: { id: orderId },
        data: { status },
    });

}
