import {Router} from "express";
import {getCart, addCartItem, deleteCartItem, updateCartItem, clearCart} from "./cart.controller.js";
import {authenticate} from "../../middleware/auth.middleware.js";
import {AddCartSchema, UpdateCartSchema} from "./cart.schema.js"
import {validate} from "../../middleware/validate.middleware.js";

const router = Router();

router.get("/", authenticate, getCart);
router.post("/items", authenticate, validate(AddCartSchema), addCartItem);
router.put("/items/:itemId", authenticate, validate(UpdateCartSchema), updateCartItem);
router.delete("/items/:itemId", authenticate, deleteCartItem);
router.delete("/clear", authenticate, clearCart);

export default router;