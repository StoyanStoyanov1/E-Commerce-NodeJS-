import express from 'express';
import {Order, OrderItem} from "../models/index.js";
import orderItem from "../models/orderItem.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const orderList = await Order.find().populate("user", "name").sort({"dateOrdered": -1});

        if (orderList.length === 0) {
            return res.status(404).json({success: false, message: "No order found."});
        }

        res.status(200).send(orderList);

    } catch (error) {
        res.status(500).json({error, message: error.message});
    }
});

router.get("/:id", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("user", "name")
            .populate({ path: "orderItems", populate: {
                path: "product", populate: "category"
                }})

        if (!order) {
            return res.status(404).json({success: false, message: "No order found."});
        }

        res.status(200).send(order);

    } catch (error) {
        res.status(500).json({error, message: error.message});
    }
});

router.post("/", async (req, res) => {
    try {
        const orderItemsIds = Promise.all(req.body.orderItems.map(async item => {
            let newOrderItem = OrderItem({
                quantity: item.quantity,
                product: item.product,
            });

            newOrderItem = await newOrderItem.save();

            return newOrderItem._id;
        }));

        const orderItemsIdsResolved = await orderItemsIds;

        const totalPrices = await Promise.all(orderItemsIdsResolved.map(async itemId => {
            const orderItem = await OrderItem.findById(itemId).populate("product", "price");
            return product.price * orderItem.quantity;

        }))

        const totalPrice = totalPrices.reduce((a, b) => a + b.price, 0);

        let order = new Order({
            orderItems: orderItemsIdsResolved,
            shippingAddress1: req.body.shippingAddress1,
            shippingAddress2: req.body.shippingAddress2,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            totalPrice: totalPrice,
            user: req.body.user,
        });

        order = await order.save();

        if (!order) return res.status(400).json({success: false, message: "The order cannot be created."});

        res.status(200).send(order);
    } catch (error) {
        res.status(500).json({error, message: error.message});
    }
});

router.put("/:id", async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, {
            status: req.body.status,
        },
            {new: true}
        );

        if (!order) {
            return res.status(400).json({success: false, message: "The order cannot be updated."});
        }

        res.status(200).send(order);

    } catch (error) {
        res.status(500).json({error, message: error.message});
    }

});

router.delete("/:id", async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) {
            return res.status(400).json({success: false, message: "The order is not found."});
        }
        await order.orderItems.map(async item => {
            await OrderItem.findByIdAndDelete(item);
        })

        return res.status(200).json({success: true, message: "The order is deleted."});

    } catch (error) {
        res.status(500).json({error, message: error.message});
    }
});

router.get('get/totalsales', async (req, res) => {
    const totalSales = await Order.aggregate([
        {$group: {_id: null, totalSales: {$sum: "$totalPrice"}}}
    ]);

    if (!totalSales) return res.status(400).send("The order sales cannot be generated.");

    res.status(200).send({totalSales: totalSales.pop().totalSales});
});

router.get('/get/count', async (req, res) => {
    const orderCount = await Order.countDocuments(count => count);

    if (!orderCount) return res.status(500).json({success: false});

    res.status(200).send({orderCount: orderCount});
});

router.get("/get/usersorders/:userId", async (req, res) => {
    try {
        const userOrderList = await Order.find({user: req.params.userId})
            .populate({
                path: "orderItems", populate: {
                    path: "product", populate: "category",
                }
            }).sort({"dateOrdered": -1});

        if (!userOrderList) {
            return res.status(404).json({success: false, message: "No order found for the user."});
        }

        res.status(200).send(userOrderList);

    } catch (error) {
        res.status(500).json({error, message: error.message});
    }
});

export default router;