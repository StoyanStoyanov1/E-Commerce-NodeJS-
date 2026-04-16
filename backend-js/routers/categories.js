import {Category} from "../models/index.js";
import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const categoryList = await Category.find();

        if (categoryList.length === 0) {
            return res.status(404).json({ message: "No categories found" });
        }

        res.status(200).send(categoryList);
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findById(categoryId);

        if (!category) {
            res.status(404).json({message: "No category found with this id"});
        }

        res.status(200).send(category);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
})

router.post("/", async (req, res) => {
    try {
        let category = new Category({
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color,
        });

        category = await category.save();

        res.status(201).send(category);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Category could not be created",
            error: error.message
        });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findByIdAndUpdate(
            categoryId,
            {
                name: req.body.name,
                icon: req.body.icon,
                color: req.body.color,
            },
            { new: true }
        );

        if (!category) {
            res.status(400).json({message: "The category cannot be updated!"});
        }

        res.status(200).send(category);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Category could not be updated",
            error: error.message
        });
    }
})

router.delete("/:id", async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);

        if (category) {
            return res.status(200).json({success: true, message: 'Category deleted successfully!'});
        } else {
            return res.status(404).json({success: false, message: "Category not found!"});
        }
    } catch (err) {
        return res.status(400).json({success: false, error: err});
    }
});
export default router;