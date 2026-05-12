/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
    resolve: {
        alias: {
            "@prisma/client": "@prisma/client",
        },
    },
    test: {
        globals: true,
        environment: "node",
        setupFiles: ["./src/tests/setup.ts"],
        env: {
            NODE_ENV: "test",
        },
        fileParallelism: false,
    },
});