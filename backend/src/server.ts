import express, { Express, Request, Response } from "express";
import { env } from "./config/env";
import { ensureAdminUser } from "./services/bootstrap.service";

const app: Express = express()

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!")
})

app.listen(env.port, () => {
    await ensureAdminUser();
    console.log("Server running on port: 3000")
})