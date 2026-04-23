import {Router} from 'express';
import * as AuthController from './auth.controller.js';
import { authenticate } from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.post("/refresh", AuthController.refresh);
router.post("/logout", AuthController.logout);
router.post("/logout-all", authenticate, AuthController.logoutAll);
router.post("/change-password",authenticate, AuthController.changePassword);

router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);

router.get("/verify-email", AuthController.verifyEmail);


export default router;