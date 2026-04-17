import express from "express";
import router from "./routes/index.js";
import {errorHandler} from "./middleware/error.middleware.js";

const app = express();

app.use(express.json());
app.use(router);


//middlewares
app.use(errorHandler)

export default app;