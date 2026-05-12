import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import prisma from "../prisma/client.js";

const testUser = {
    email: "buyer@test.com",
    password: "Test1234!",
    firstName: "Buyer",
    lastName: "User",
    phoneNumber: "0888111111",
    birthday: "01-01-1990",
};

const sellerUser = {
    email: "seller@test.com",
    password: "Test1234!",
    firstName: "Seller",
    lastName: "User",
    phoneNumber: "0888222222",
    birthday: "01-01-1990",
};

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Category" CASCADE`;
});

const registerAndLogin = async (user: typeof testUser) => {
    await request(app).post("/api/auth/register").send(user);
    const res = await request(app)
        .post("/api/auth/login")
        .send({ email: user.email, password: user.password });
    return res.body.accessToken as string;
};

const createCategory = async (token: string) => {
    const res = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Test Category" });
    return res.body.id as string;
};

const createProduct = async (token: string, categoryId: string, stock = 10) => {
    const res = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "Test Product",
            description: "Test description",
            price: 19.99,
            stock,
            categoryIds: [categoryId],
        });
    return res.body.id as string;
};

describe("GET /api/cart", () => {
    it("should return empty cart for new user", async () => {
        const token = await registerAndLogin(testUser);

        const res = await request(app)
            .get("/api/cart")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.cartItems).toHaveLength(0);
    });

    it("should return 401 for unauthenticated request", async () => {
        const res = await request(app).get("/api/cart");
        expect(res.status).toBe(401);
    });
});

describe("POST /api/cart/items", () => {
    it("should add item to cart", async () => {
        const buyerToken = await registerAndLogin(testUser);
        const sellerToken = await registerAndLogin(sellerUser);
        const categoryId = await createCategory(sellerToken);
        const productId = await createProduct(sellerToken, categoryId);

        const res = await request(app)
            .post("/api/cart/items")
            .set("Authorization", `Bearer ${buyerToken}`)
            .send({ productId, quantity: 2 });

        expect(res.status).toBe(201);

        const cart = await request(app)
            .get("/api/cart")
            .set("Authorization", `Bearer ${buyerToken}`);

        expect(cart.body.cartItems).toHaveLength(1);
        expect(cart.body.cartItems[0].quantity).toBe(2);
    });

    it("should return 400 for invalid quantity", async () => {
        const buyerToken = await registerAndLogin(testUser);
        const sellerToken = await registerAndLogin(sellerUser);
        const categoryId = await createCategory(sellerToken);
        const productId = await createProduct(sellerToken, categoryId);

        const res = await request(app)
            .post("/api/cart/items")
            .set("Authorization", `Bearer ${buyerToken}`)
            .send({ productId, quantity: 0 });

        expect(res.status).toBe(400);
    });
});

describe("PUT /api/cart/items/:itemId", () => {
    it("should update cart item quantity", async () => {
        const buyerToken = await registerAndLogin(testUser);
        const sellerToken = await registerAndLogin(sellerUser);
        const categoryId = await createCategory(sellerToken);
        const productId = await createProduct(sellerToken, categoryId);

        await request(app)
            .post("/api/cart/items")
            .set("Authorization", `Bearer ${buyerToken}`)
            .send({ productId, quantity: 1 });

        const cart = await request(app)
            .get("/api/cart")
            .set("Authorization", `Bearer ${buyerToken}`);

        const itemId = cart.body.cartItems[0].id;

        const res = await request(app)
            .put(`/api/cart/items/${itemId}`)
            .set("Authorization", `Bearer ${buyerToken}`)
            .send({ quantity: 5 });

        expect(res.status).toBe(200);
        expect(res.body.quantity).toBe(5);
    });
});

describe("DELETE /api/cart/items/:itemId", () => {
    it("should remove item from cart", async () => {
        const buyerToken = await registerAndLogin(testUser);
        const sellerToken = await registerAndLogin(sellerUser);
        const categoryId = await createCategory(sellerToken);
        const productId = await createProduct(sellerToken, categoryId);

        await request(app)
            .post("/api/cart/items")
            .set("Authorization", `Bearer ${buyerToken}`)
            .send({ productId, quantity: 1 });

        const cart = await request(app)
            .get("/api/cart")
            .set("Authorization", `Bearer ${buyerToken}`);

        const itemId = cart.body.cartItems[0].id;

        const res = await request(app)
            .delete(`/api/cart/items/${itemId}`)
            .set("Authorization", `Bearer ${buyerToken}`);

        expect(res.status).toBe(204);

        const updatedCart = await request(app)
            .get("/api/cart")
            .set("Authorization", `Bearer ${buyerToken}`);

        expect(updatedCart.body.cartItems).toHaveLength(0);
    });
});

describe("DELETE /api/cart/clear", () => {
    it("should clear all items from cart", async () => {
        const buyerToken = await registerAndLogin(testUser);
        const sellerToken = await registerAndLogin(sellerUser);
        const categoryId = await createCategory(sellerToken);
        const productId = await createProduct(sellerToken, categoryId);

        await request(app)
            .post("/api/cart/items")
            .set("Authorization", `Bearer ${buyerToken}`)
            .send({ productId, quantity: 2 });

        const res = await request(app)
            .delete("/api/cart/clear")
            .set("Authorization", `Bearer ${buyerToken}`);

        expect(res.status).toBe(204);

        const cart = await request(app)
            .get("/api/cart")
            .set("Authorization", `Bearer ${buyerToken}`);

        expect(cart.body.cartItems).toHaveLength(0);
    });
});