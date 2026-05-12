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
    await prisma.$executeRaw`TRUNCATE TABLE "City" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Country" CASCADE`;
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

const addToCart = async (token: string, productId: string, quantity = 1) => {
    await request(app)
        .post("/api/cart/items")
        .set("Authorization", `Bearer ${token}`)
        .send({ productId, quantity });
};

const createAddress = async (token: string) => {
    const country = await prisma.country.create({
        data: { name: "Bulgaria" },
    });

    const city = await prisma.city.create({
        data: {
            name: "Sofia",
            postCode: "1000",
            countryId: country.id,
        },
    });

    const res = await request(app)
        .post("/api/users/me/addresses")
        .set("Authorization", `Bearer ${token}`)
        .send({
            street: "Test Street 1",
            cityId: city.id,
        });

    return res.body.id as string;
};

describe("POST /api/orders", () => {
    it("should create an order successfully", async () => {
        const buyerToken = await registerAndLogin(testUser);
        const sellerToken = await registerAndLogin(sellerUser);
        const categoryId = await createCategory(sellerToken);
        const productId = await createProduct(sellerToken, categoryId);

        await addToCart(buyerToken, productId);
        const addressId = await createAddress(buyerToken);

        const res = await request(app)
            .post("/api/orders")
            .set("Authorization", `Bearer ${buyerToken}`)
            .send({ addressId });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("id");
        expect(res.body.status).toBe("PENDING");
    });

    it("should return 400 for empty cart", async () => {
        const buyerToken = await registerAndLogin(testUser);
        const addressId = await createAddress(buyerToken);

        const res = await request(app)
            .post("/api/orders")
            .set("Authorization", `Bearer ${buyerToken}`)
            .send({ addressId });

        expect(res.status).toBe(400);
    });

    it("should return 400 for insufficient stock", async () => {
        const buyerToken = await registerAndLogin(testUser);
        const sellerToken = await registerAndLogin(sellerUser);
        const categoryId = await createCategory(sellerToken);
        const productId = await createProduct(sellerToken, categoryId, 1);

        await addToCart(buyerToken, productId, 5);
        const addressId = await createAddress(buyerToken);

        const res = await request(app)
            .post("/api/orders")
            .set("Authorization", `Bearer ${buyerToken}`)
            .send({ addressId });

        expect(res.status).toBe(400);
    });

    it("should decrement stock after order", async () => {
        const buyerToken = await registerAndLogin(testUser);
        const sellerToken = await registerAndLogin(sellerUser);
        const categoryId = await createCategory(sellerToken);
        const productId = await createProduct(sellerToken, categoryId, 10);

        await addToCart(buyerToken, productId, 3);
        const addressId = await createAddress(buyerToken);

        await request(app)
            .post("/api/orders")
            .set("Authorization", `Bearer ${buyerToken}`)
            .send({ addressId });

        const product = await prisma.product.findUnique({ where: { id: productId } });
        expect(product!.stock).toBe(7);
    });
});

describe("PATCH /api/orders/:id/cancel", () => {
    it("should cancel a pending order and restore stock", async () => {
        const buyerToken = await registerAndLogin(testUser);
        const sellerToken = await registerAndLogin(sellerUser);
        const categoryId = await createCategory(sellerToken);
        const productId = await createProduct(sellerToken, categoryId, 10);

        await addToCart(buyerToken, productId, 2);
        const addressId = await createAddress(buyerToken);

        const orderRes = await request(app)
            .post("/api/orders")
            .set("Authorization", `Bearer ${buyerToken}`)
            .send({ addressId });

        const res = await request(app)
            .patch(`/api/orders/${orderRes.body.id}/cancel`)
            .set("Authorization", `Bearer ${buyerToken}`);

        expect(res.status).toBe(200);
        expect(res.body.status).toBe("CANCELLED");

        const product = await prisma.product.findUnique({ where: { id: productId } });
        expect(product!.stock).toBe(10);
    });

    it("should return 403 when cancelling another user's order", async () => {
        const buyerToken = await registerAndLogin(testUser);
        const sellerToken = await registerAndLogin(sellerUser);
        const categoryId = await createCategory(sellerToken);
        const productId = await createProduct(sellerToken, categoryId, 10);

        await addToCart(buyerToken, productId);
        const addressId = await createAddress(buyerToken);

        const orderRes = await request(app)
            .post("/api/orders")
            .set("Authorization", `Bearer ${buyerToken}`)
            .send({ addressId });

        const res = await request(app)
            .patch(`/api/orders/${orderRes.body.id}/cancel`)
            .set("Authorization", `Bearer ${sellerToken}`);

        expect(res.status).toBe(403);
    });
});