const Order = require("../models/Order");

// User marks received
exports.markReceived = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);
        if (!order) return res.send("Order not found");

        order.userReceived = true;
        if (order.adminProcessed && order.userReceived) {
            order.status = "Completed";
        }
        await order.save();
        res.redirect("/user/orders"); // your user orders page
    } catch (err) {
        console.log(err);
        res.send("Error confirming order");
    }
};
