import {Router} from "express";
import * as ProductController from "./product.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/", ProductController.getProducts);
router.get("/:id", ProductController.getProductById);
router.post("/", authenticate, ProductController.createProduct);
router.put("/:id", authenticate, ProductController.updateProduct);
router.put("/:id/categories", authenticate, ProductController.updateProductCategory);
router.delete("/:id", authenticate, ProductController.deleteProduct);

export default router;