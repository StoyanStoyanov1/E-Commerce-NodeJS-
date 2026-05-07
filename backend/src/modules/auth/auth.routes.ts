import {Router} from 'express';
import * as AuthController from './auth.controller.js';
import { authenticate } from "../../middleware/auth.middleware.js";
import {RegisterSchema, LoginSchema, ChangePasswordSchema, ForgotPasswordSchema, ResetPasswordSchema, RefreshSchema} from "./auth.schema.js";
import {validate} from "../../middleware/validate.middleware.js";

const router = Router();

router.post("/login", validate(LoginSchema), AuthController.login);
router.post("/register", validate(RegisterSchema), AuthController.register);
router.post("/refresh",  validate(RefreshSchema),AuthController.refresh);
router.post("/logout", AuthController.logout);
router.post("/logout-all", authenticate, AuthController.logoutAll);
router.post("/change-password",authenticate, validate(ChangePasswordSchema), AuthController.changePassword);

router.post("/forgot-password",validate(ForgotPasswordSchema), AuthController.forgotPassword);
router.post("/reset-password", validate(ResetPasswordSchema), AuthController.resetPassword);

router.get("/verify-email", AuthController.verifyEmail);


export default router;