import { Router } from 'express';
import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/user/user.routes.js";
import categoryRoutes from "../modules/category/category.routes.js";
import productRoutes from "../modules/product/product.routes.js";

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);

export default router;