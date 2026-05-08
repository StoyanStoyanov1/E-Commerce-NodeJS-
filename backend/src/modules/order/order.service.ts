import prisma from "../../prisma/client.js";
import type {OrderDto} from "./order.schema.js";
import {AppError} from "../../shared/errors/AppError.js";
import type {OrderStatus} from "@prisma/client";
import {type PaginationDto, paginate} from "../../shared/pagination/pagination.js";
import type {Order, Cart, Address} from "@prisma/client";

export const createOrder = async (userId: string, dto: OrderDto): Promise<Order> => {
    const cart: Promise<Cart> = await prisma.cart.findUnique({
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

    const address: Promise<Address> = await prisma.address.findUnique({
        where: { id: dto.addressId, userId },
    });

    if (!address) throw new AppError("Address is not found!", 404);

    for (const item of cart.cartItems) {
        if (item.product.stock < item.quantity) throw new AppError(`Product ${item.product.name} has insufficient stock`, 400);
    }

    const totalPrice: number = cart.cartItems.reduce((total, item) => total + Number(item.product.price) * item.quantity, 0);

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

export const getOrders = async (userId: string, page: number, limit: number): Promise<PaginationDto<Order>> => {
    const { take, skip } = paginate(page, limit);

    const [data, total] = await Promise.all([
        prisma.order.findMany({
            where: { userId },
            include: {orderItems: true},
            take,
            skip,
        }),
        prisma.order.count({ where: { userId } }),
    ]);

    return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    }
};

export const getOrderById = async (userId: string, orderId: string): Promise<Order> => {
    const order: Promise<Order> = await prisma.order.findUnique({
        where: { id: orderId },
        include: {orderItems: true},
    });

    if (!order) throw new AppError("Order not found!", 400);
    if (order.userId !== userId) throw new AppError("Forbidden!", 403);

    return order;
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<Order> => {
    const order: Promise<Order> = await prisma.order.findUnique({where: { id: orderId},});

    if (!order) throw new AppError("Order not found!", 404);

    if (order.status === status) throw new AppError(`Order is already in ${status} status`, 400);

    return prisma.order.update({
        where: { id: orderId },
        data: { status },
    });

}
