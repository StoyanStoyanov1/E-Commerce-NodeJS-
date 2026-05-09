import {Router} from 'express';
import * as AuthController from './auth.controller.js';
import { authenticate } from "../../middleware/auth.middleware.js";
import {RegisterSchema, LoginSchema, ChangePasswordSchema, ForgotPasswordSchema, ResetPasswordSchema, RefreshSchema} from "./auth.schema.js";
import {validate} from "../../middleware/validate.middleware.js";
import {authLimiter} from "../../middleware/rateLimit.middleware.js";

const router = Router();

router.post("/login", authLimiter, validate(LoginSchema), AuthController.login);
router.post("/register", authLimiter, validate(RegisterSchema), AuthController.register);
router.post("/refresh", authLimiter, validate(RefreshSchema), AuthController.refresh);
router.post("/logout", authLimiter, AuthController.logout);
router.post("/logout-all", authenticate, AuthController.logoutAll);
router.post("/change-password",authenticate, validate(ChangePasswordSchema), AuthController.changePassword);

router.post("/forgot-password",authLimiter, validate(ForgotPasswordSchema), AuthController.forgotPassword);
router.post("/reset-password", authLimiter, validate(ResetPasswordSchema), AuthController.resetPassword);

router.get("/verify-email", AuthController.verifyEmail);


export default router;