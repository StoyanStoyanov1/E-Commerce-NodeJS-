import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import prisma from "../prisma/client.js";

const validUser = {
    email: "test@test.com",
    password: "Test1234!",
    firstName: "Test",
    lastName: "User",
    phoneNumber: "0888123456",
    birthday: "01-01-1990",
};

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE`;
});

describe("POST /api/auth/register", () => {
    it("should register a user successfully", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send(validUser);

        expect(res.status).toBe(201);
    });

    it("should return 400 for invalid email", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({ ...validUser, email: "not-an-email" });

        expect(res.status).toBe(400);
    });

    it("should return 409 for duplicate email", async () => {
        await request(app)
            .post("/api/auth/register")
            .send(validUser);

        const res = await request(app)
            .post("/api/auth/register")
            .send(validUser);

        expect(res.status).toBe(409);
    });
});

describe("POST /api/auth/login", () => {
    it("should return 401 for wrong password", async () => {
        await request(app)
            .post("/api/auth/register")
            .send(validUser);

        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: validUser.email,
                password: "WrongPassword!",
            });

        expect(res.status).toBe(401);
    });
});

describe("POST /api/auth/login", () => {
    it("should return 401 for wrong password", async () => {
        await request(app).post("/api/auth/register").send(validUser);

        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: validUser.email, password: "WrongPassword!" });

        expect(res.status).toBe(401);
    });

    it("should login successfully and return tokens", async () => {
        await request(app).post("/api/auth/register").send(validUser);

        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: validUser.email, password: validUser.password });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("accessToken");
        expect(res.body).toHaveProperty("refreshToken");
    });

    it("should return 401 for non-existing user", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: "nobody@test.com", password: "Test1234!" });

        expect(res.status).toBe(401);
    });
});

describe("POST /api/auth/refresh", () => {
    it("should return new tokens with valid refresh token", async () => {
        await request(app).post("/api/auth/register").send(validUser);

        const loginRes = await request(app)
            .post("/api/auth/login")
            .send({ email: validUser.email, password: validUser.password });

        const res = await request(app)
            .post("/api/auth/refresh")
            .send({ refreshToken: loginRes.body.refreshToken });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("accessToken");
        expect(res.body).toHaveProperty("refreshToken");
    });

    it("should return 401 for invalid refresh token", async () => {
        const res = await request(app)
            .post("/api/auth/refresh")
            .send({ refreshToken: "invalid-token" });

        expect(res.status).toBe(401);
    });
});

describe("POST /api/auth/logout", () => {
    it("should logout successfully", async () => {
        await request(app).post("/api/auth/register").send(validUser);

        const loginRes = await request(app)
            .post("/api/auth/login")
            .send({ email: validUser.email, password: validUser.password });

        const res = await request(app)
            .post("/api/auth/logout")
            .send({ refreshToken: loginRes.body.refreshToken });

        expect(res.status).toBe(204);
    });

    it("should return 401 after using revoked refresh token", async () => {
        await request(app).post("/api/auth/register").send(validUser);

        const loginRes = await request(app)
            .post("/api/auth/login")
            .send({ email: validUser.email, password: validUser.password });

        await request(app)
            .post("/api/auth/logout")
            .send({ refreshToken: loginRes.body.refreshToken });

        const res = await request(app)
            .post("/api/auth/refresh")
            .send({ refreshToken: loginRes.body.refreshToken });

        expect(res.status).toBe(401);
    });
});