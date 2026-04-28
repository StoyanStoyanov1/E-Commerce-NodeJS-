import {Router} from 'express';
import * as CategoryController from "./category.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/", authenticate, CategoryController.createCategory);
router.put("/:id", authenticate, CategoryController.updateCategory);
router.delete("/:id", authenticate, CategoryController.deleteCategory);
router.get("/all", CategoryController.getCategories);
router.get("/id/:id", authenticate, CategoryController.getCategoryById);
router.get("/name/:name", CategoryController.getCategoryByName);

export default router;