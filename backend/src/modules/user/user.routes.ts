import { Router } from "express";
import * as UserController from "./user.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/me", authenticate, UserController.getMe);
router.put("/me/profile", authenticate, UserController.updateProfile);

router.get("/me/addresses", authenticate, UserController.getAddresses);
router.post("/me/addresses", authenticate, UserController.createAddress);
router.put("/me/addresses/:id", authenticate, UserController.updateAddress);
router.delete("/me/addresses/:id", authenticate, UserController.deleteAddress);
router.patch("/me/addresses/:id/default", authenticate, UserController.setDefaultAddress);

export default router;