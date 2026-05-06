import prisma from "../../prisma/client.js";
import type {AddCartItemDTO, UpdateCartItemDTO} from "./cart.dto.js";
import {AppError} from "../../shared/errors/AppError.js";

export const getCart = async (userId: string) => {
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

    if (!cart) {
        return prisma.cart.create({
            data: { userId },
            include: {
                cartItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    }

    return cart;
};

export const addCartItem = async (cartId: string, dto: AddCartItemDTO) => {
    return prisma.cartItem.upsert({
        where: {
            cartId_productId: {
                cartId: cartId,
                productId: dto.productId,
            },
        },
        update: {
            quantity: { increment: dto.quantity },
        },
        create: {
            cartId: cartId,
            productId: dto.productId,
            quantity: dto.quantity,
        },
    });
}

export const updateCartItem = async (userId: string, cartItemId: string, dto: UpdateCartItemDTO) => {
    const cartItem = await prisma.cartItem.findUnique({
        where: { id: cartItemId },
        include: {cart: true}
    });

    if (!cartItem) throw new AppError("No found cart item", 404);
    if (cartItem.cart.userId !== userId) throw new AppError("Forbidden", 403);

    return prisma.cartItem.update({
        where: {id: cartItemId},
        data: {quantity: dto.quantity},
    })


};

export const deleteCartItem = async (userId: string, cartItemId: string) => {
    const cartItem = await prisma.cartItem.findUnique({
        where: { id: cartItemId },
        include: { cart: true },
    });

    if (!cartItem) throw new AppError("Cart item not found", 404);
    if (cartItem.cart.userId !== userId) throw new AppError("Forbidden", 403);

    await prisma.cartItem.delete({
        where: { id: cartItemId },
    });
};

export const clearCart = async (cartItemId: string) => {
    await prisma.cartItem.deleteMany({
        where: { cartId: cartItemId },
    });
}