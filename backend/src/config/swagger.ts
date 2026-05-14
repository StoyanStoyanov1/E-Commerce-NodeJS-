import swaggerJsdoc from "swagger-jsdoc";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "SuperWorker API",
            version: "1.0.0",
            description: "E-Commerce REST API",
        },
        servers: [
            {
                url: "http://localhost:5000/api",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
    apis: [
        join(__dirname, "../modules/**/*.routes.ts"),
        join(__dirname, "../modules/**/*.docs.ts"),
    ],
};

export const swaggerSpec = swaggerJsdoc(options);