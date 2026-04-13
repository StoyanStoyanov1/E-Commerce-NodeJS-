import { User } from "../models/index.js";
import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const userList = await User.find();

        if (userList.length === 0) {
            return res.status(404).send("Not Found Users");
        }

        res.status(200).send(userList);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
})

export default router;
