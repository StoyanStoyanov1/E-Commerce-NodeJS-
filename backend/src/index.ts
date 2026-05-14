import dotenv from "dotenv";
import app from "./app.js";
import { validateEnv} from "./config/env.js";

dotenv.config();
validateEnv();

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});