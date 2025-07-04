const express = require("express");
const { requireAuth } = require("@clerk/express");
const { User, Order } = require("../models");

const router = express.Router();

// ✅ User: Get orders for the current user

router.get("/", requireAuth(), async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    const dbUser = await User.findOne({ where: { clerkId: clerkUserId } });
    if (!dbUser) return res.status(404).json({ error: "User not found in DB" });

    const orders = await Order.findAll({
      where: { userId: dbUser.id },
      order: [["createdAt", "DESC"]],
      raw: true,
    });

    const formatted = orders.map(order => ({
      ...order,
      shippingAddress: order.shippingAddress ? JSON.parse(order.shippingAddress) : null
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("User orders fetch error:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

// ✅ User: Get order by ID (with ownership check)
router.get("/:id", requireAuth(), async (req, res) => {
  try {
    const { id } = req.params;
    const clerkUserId = req.auth.userId;

    const dbUser = await User.findOne({ where: { clerkId: clerkUserId } });
    if (!dbUser) return res.status(404).json({ error: "User not found" });

    const order = await Order.findOne({ where: { id, userId: dbUser.id }, raw: true });
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (order.shippingAddress) order.shippingAddress = JSON.parse(order.shippingAddress);
    res.status(200).json(order);
  } catch (error) {
    console.error("Order by ID fetch error:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

// ✅ Admin: Get all orders
// Admin: Get all orders
router.get("/admin/all", async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: User, as: "user", attributes: ["name", "email"] }],
      order: [["createdAt", "DESC"]],
    });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: "No orders found" });
    }

    const formatted = orders.map(order => {
      const orderJson = order.toJSON();
      return {
        ...orderJson,
        customerName: orderJson.user?.name || "N/A",
        customerEmail: orderJson.user?.email || "N/A",
        shippingAddress: orderJson.shippingAddress ? JSON.parse(orderJson.shippingAddress) : null,
        items: orderJson.items ? JSON.parse(orderJson.items) : [],
      };
    });
    res.status(200).json(formatted);
  } catch (error) {
    console.error("❌ Admin orders fetch error:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});



// ✅ Admin: Update order status
router.put("/admin/:id/status", requireAuth(), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = status;
    await order.save();

    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    console.error("Order status update error:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

module.exports = router;
