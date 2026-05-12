import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import prisma from "../prisma/client.js";

const sellerUser = {
    email: "seller@test.com",
    password: "Test1234!",
    firstName: "Seller",
    lastName: "User",
    phoneNumber: "0888111111",
    birthday: "01-01-1990",
};

const otherUser = {
    email: "other@test.com",
    password: "Test1234!",
    firstName: "Other",
    lastName: "User",
    phoneNumber: "0888222222",
    birthday: "01-01-1990",
};

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Category" CASCADE`;
});

const registerAndLogin = async (user: typeof sellerUser) => {
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

const createValidProduct = (categoryId: string) => ({
    name: "Test Product",
    description: "Test description",
    price: 19.99,
    stock: 10,
    categoryIds: [categoryId],
});

describe("POST /api/products", () => {
    it("should create a product successfully", async () => {
        const token = await registerAndLogin(sellerUser);
        const categoryId = await createCategory(token);

        const res = await request(app)
            .post("/api/products")
            .set("Authorization", `Bearer ${token}`)
            .send(createValidProduct(categoryId));

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("id");
    });

    it("should return 401 for unauthenticated request", async () => {
        const res = await request(app)
            .post("/api/products")
            .send({ name: "Test", description: "Test", price: 10, stock: 1, categoryIds: [] });

        expect(res.status).toBe(401);
    });
});

describe("PUT /api/products/:id", () => {
    it("should update own product successfully", async () => {
        const token = await registerAndLogin(sellerUser);
        const categoryId = await createCategory(token);

        const createRes = await request(app)
            .post("/api/products")
            .set("Authorization", `Bearer ${token}`)
            .send(createValidProduct(categoryId));

        const res = await request(app)
            .put(`/api/products/${createRes.body.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Updated Product" });

        expect(res.status).toBe(200);
    });

    it("should return 403 when updating another user's product", async () => {
        const sellerToken = await registerAndLogin(sellerUser);
        const otherToken = await registerAndLogin(otherUser);
        const categoryId = await createCategory(sellerToken);

        const createRes = await request(app)
            .post("/api/products")
            .set("Authorization", `Bearer ${sellerToken}`)
            .send(createValidProduct(categoryId));

        const res = await request(app)
            .put(`/api/products/${createRes.body.id}`)
            .set("Authorization", `Bearer ${otherToken}`)
            .send({ name: "Hacked Product" });

        expect(res.status).toBe(403);
    });
});

describe("DELETE /api/products/:id", () => {
    it("should delete own product successfully", async () => {
        const token = await registerAndLogin(sellerUser);
        const categoryId = await createCategory(token);

        const createRes = await request(app)
            .post("/api/products")
            .set("Authorization", `Bearer ${token}`)
            .send(createValidProduct(categoryId));

        const res = await request(app)
            .delete(`/api/products/${createRes.body.id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(204);
    });

    it("should return 403 when deleting another user's product", async () => {
        const sellerToken = await registerAndLogin(sellerUser);
        const otherToken = await registerAndLogin(otherUser);
        const categoryId = await createCategory(sellerToken);

        const createRes = await request(app)
            .post("/api/products")
            .set("Authorization", `Bearer ${sellerToken}`)
            .send(createValidProduct(categoryId));

        const res = await request(app)
            .delete(`/api/products/${createRes.body.id}`)
            .set("Authorization", `Bearer ${otherToken}`);

        expect(res.status).toBe(403);
    });
});