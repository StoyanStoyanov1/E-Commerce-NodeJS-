import {Router} from 'express';
import * as CategoryController from "./category.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/",  CategoryController.createCategory);

export default router;