import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import prisma from "../prisma/client.js";

const testUser = {
    email: "user@test.com",
    password: "Test1234!",
    firstName: "Test",
    lastName: "User",
    phoneNumber: "0888111111",
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

describe("POST /api/categories", () => {
    it("should create a category successfully", async () => {
        const token = await registerAndLogin(testUser);

        const res = await request(app)
            .post("/api/categories")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Electronics" });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("id");
        expect(res.body.name).toBe("Electronics");
    });

    it("should create a subcategory with parentId", async () => {
        const token = await registerAndLogin(testUser);

        const parent = await request(app)
            .post("/api/categories")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Electronics" });

        const res = await request(app)
            .post("/api/categories")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Phones", parentId: parent.body.id });

        expect(res.status).toBe(201);
        expect(res.body.parentId).toBe(parent.body.id);
    });

    it("should return 401 for unauthenticated request", async () => {
        const res = await request(app)
            .post("/api/categories")
            .send({ name: "Electronics" });

        expect(res.status).toBe(401);
    });

    it("should return 400 for too short name", async () => {
        const token = await registerAndLogin(testUser);

        const res = await request(app)
            .post("/api/categories")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "A" });

        expect(res.status).toBe(400);
    });
});

describe("GET /api/categories/all", () => {
    it("should return all categories", async () => {
        const token = await registerAndLogin(testUser);

        await request(app)
            .post("/api/categories")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Electronics" });

        await request(app)
            .post("/api/categories")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Clothing" });

        const res = await request(app).get("/api/categories/all");

        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    });
});

describe("GET /api/categories/name/:name", () => {
    it("should find category by name", async () => {
        const token = await registerAndLogin(testUser);

        await request(app)
            .post("/api/categories")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Electronics" });

        const res = await request(app).get("/api/categories/name/Electronics");

        expect(res.status).toBe(200);
        expect(res.body.name).toBe("Electronics");
    });
});

describe("PUT /api/categories/:id", () => {
    it("should update a category", async () => {
        const token = await registerAndLogin(testUser);

        const createRes = await request(app)
            .post("/api/categories")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Electronics" });

        const res = await request(app)
            .put(`/api/categories/${createRes.body.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Updated Electronics" });

        expect(res.status).toBe(200);
        expect(res.body.name).toBe("Updated Electronics");
    });
});

describe("DELETE /api/categories/:id", () => {
    it("should delete a category", async () => {
        const token = await registerAndLogin(testUser);

        const createRes = await request(app)
            .post("/api/categories")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Electronics" });

        const res = await request(app)
            .delete(`/api/categories/${createRes.body.id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(204);
    });

    it("should return 401 for unauthenticated request", async () => {
        const token = await registerAndLogin(testUser);

        const createRes = await request(app)
            .post("/api/categories")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Electronics" });

        const res = await request(app)
            .delete(`/api/categories/${createRes.body.id}`);

        expect(res.status).toBe(401);
    });
});