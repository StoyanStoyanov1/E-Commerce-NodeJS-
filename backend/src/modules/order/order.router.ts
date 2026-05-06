import {Router} from "express";
import * as OrderController from "./order.controller.js";
import {authenticate} from "../../middleware/auth.middleware.js";

const router = Router();
router.post("/", authenticate, OrderController.createOrder);

export default router;