import {Router} from 'express';
import * as CategoryController from "./category.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/",  CategoryController.createCategory);
router.put("/:id",  CategoryController.updateCategory);
router.delete("/:id",  CategoryController.deleteCategory);
router.get("/all", CategoryController.getCategories);
router.get("/id/:id", CategoryController.getCategoryById);
router.get("/name/:name", CategoryController.getCategoryByName);

export default router;