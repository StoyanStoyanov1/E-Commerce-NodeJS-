import express from "express";
import router from "./routes/index.js";
import {errorHandler} from "./middleware/error.middleware.js";
import morgan from "morgan";
import logger from "./shared/logger/logger.js";
import {globalLimiter} from "./middleware/rateLimit.middleware.js";
import helmet from "helmet";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec} from "./config/swagger.js";

const app = express();
const morganStream = {
    write: (message: string) => logger.http(message.trim()),
};

app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL ||  "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}))

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(globalLimiter);
app.use(express.json());
app.use(morgan("dev", { stream: morganStream }));

app.use("/api", router);


//middlewares
app.use(errorHandler)

export default app;