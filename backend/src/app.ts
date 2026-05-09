import express from "express";
import router from "./routes/index.js";
import {errorHandler} from "./middleware/error.middleware.js";
import morgan from "morgan";
import logger from "./shared/logger/logger.js";

const app = express();
const morganStream = {
    write: (message: string) => logger.http(message.trim()),
};

app.use(express.json());
app.use(morgan("dev", { stream: morganStream }));

app.use(router);


//middlewares
app.use(errorHandler)

export default app;