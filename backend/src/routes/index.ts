import { Router } from 'express';
import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/user/user.routes.js";
import categoryRoutes from "../modules/category/category.routes.js";

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/category', categoryRoutes);

export default router;