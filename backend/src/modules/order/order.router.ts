import {Router} from "express";
import * as OrderController from "./order.controller.js";
import {authenticate} from "../../middleware/auth.middleware.js";

const router = Router();
router.post("/", authenticate, OrderController.createOrder);

router.get("/:id", authenticate, OrderController.getOrderById);
router.get("/", authenticate, OrderController.getOrders);

export default router;