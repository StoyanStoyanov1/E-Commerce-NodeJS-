import { beforeAll, afterAll } from "vitest";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });
console.log("NODE_ENV:", process.env.NODE_ENV);

import prisma from "../prisma/client.js";

beforeAll(async () => {
    await prisma.$connect();
});

afterAll(async () => {
    await prisma.$disconnect();
});