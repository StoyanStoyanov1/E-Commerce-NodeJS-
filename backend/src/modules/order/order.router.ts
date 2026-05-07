import {Router} from "express";
import * as OrderController from "./order.controller.js";
import {authenticate, authorize} from "../../middleware/auth.middleware.js";
import {CreateOrderSchema} from "./order.schema.js"
import {validate} from "../../middleware/validate.middleware.js";

const router = Router();
router.post("/", authenticate, validate(CreateOrderSchema), OrderController.createOrder);

router.get("/:id", authenticate, OrderController.getOrderById);
router.get("/", authenticate, OrderController.getOrders);

router.patch("/:orderId/status", authenticate, authorize("ADMIN"), OrderController.updateOrderStatus);

export default router;