import express from "express";
import { Product } from "../models/index.js";
const router = express.Router();

router.post(`/`, async (req, res) => {
    const product = new Product({
        name: req.body.name,
        image: req.body.image,
        countInStock: req.body.countInStock,
    });

    product.save()
    .then((createdProduct) => {
        res.status(201).json(createdProduct);
    })
    .catch((err) => {
        res.status(500).json({ error: err, success: false });
    });


});

router.get(`/`, async (req, res) => {
    Product.find()
    .then((productList) => {
        res.status(200).json(productList);
    })
    .catch((err) => {
        res.status(500).json({ error: err, success: false });
    });
});

export default router;