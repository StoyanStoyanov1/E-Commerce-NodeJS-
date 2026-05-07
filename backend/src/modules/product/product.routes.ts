import {Router} from "express";
import * as ProductController from "./product.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import {CreateProductSchema, UpdateProductSchema, CreateProductImageSchema} from "./product.schema.js"
import {validate} from "../../middleware/validate.middleware.js";

const router = Router();

router.get("/", ProductController.getProducts);
router.get("/:id", ProductController.getProductById);

router.post("/", authenticate, validate(CreateProductSchema), ProductController.createProduct);
router.post("/:id/images", authenticate, validate(CreateProductImageSchema), ProductController.createProductImage);

router.put("/:id/images/:imageId", authenticate, ProductController.changePrimaryProductImage);
router.put("/:id", authenticate, validate(UpdateProductSchema), ProductController.updateProduct);
router.put("/:id/categories", authenticate, ProductController.updateProductCategory);

router.delete("/:id/images/:imageId", authenticate, ProductController.deleteProductImage);
router.delete("/:id", authenticate, ProductController.deleteProduct);


export default router;