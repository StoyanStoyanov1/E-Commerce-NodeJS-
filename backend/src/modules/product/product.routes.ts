import {Router} from "express";
import * as ProductController from "./product.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import {CreateProductSchema, UpdateProductSchema, CreateProductImageSchema} from "./product.schema.js"
import {validate} from "../../middleware/validate.middleware.js";

const router = Router();

router.get("/", ProductController.getProducts);
router.get("/:id", ProductController.getProductById);

router.post("/", authenticate, authorize("SELLER", "ADMIN"), validate(CreateProductSchema), ProductController.createProduct);
router.post("/:id/images", authenticate, authorize("SELLER", "ADMIN"), validate(CreateProductImageSchema), ProductController.createProductImage);

router.put("/:id/images/:imageId", authenticate, authorize("SELLER", "ADMIN"), ProductController.changePrimaryProductImage);
router.put("/:id", authenticate, authorize("SELLER", "ADMIN"), validate(UpdateProductSchema), ProductController.updateProduct);
router.put("/:id/categories", authenticate, authorize("SELLER", "ADMIN"), ProductController.updateProductCategory);

router.delete("/:id/images/:imageId", authenticate, authorize("SELLER", "ADMIN"), ProductController.deleteProductImage);
router.delete("/:id", authenticate, authorize("SELLER", "ADMIN"), ProductController.deleteProduct);


export default router;