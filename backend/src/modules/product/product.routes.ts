import {Router} from "express";
import * as ProductController from "./product.controller.js";

const router = Router();

router.get("/", ProductController.getProducts);
router.get("/:id", ProductController.getProductById);
router.post("/", ProductController.createProduct);
router.put("/:id", ProductController.updateProduct);
router.put("/:id/categories", ProductController.updateProductCategory);
router.delete("/:id", ProductController.deleteProduct);

export default router;