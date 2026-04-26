import { Router } from "express";
import * as UserController from "./user.controller.js";
import { authenticate} from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/me", authenticate, UserController.getMe);

export default router;
