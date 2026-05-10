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