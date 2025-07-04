// controllers/orderController.js
const { Order, User } = require("../models");

// Create Order After Successful Payment
exports.createOrder = async (req, res) => {
  try {
    const { totalAmount, paymentIntentId, shippingAddress, items } = req.body;
    const clerkUserId = req.auth.userId;
    
    // Find user in the database
    const dbUser = await User.findOne({ where: { clerkId: clerkUserId } });
    if (!dbUser) {
      return res.status(404).json({ error: "User not found in DB" });
    }
    
    // Create new order
    const order = await Order.create({
      userId: dbUser.id,
      totalAmount,
      paymentIntentId,
      status: "pending",
      shippingAddress: JSON.stringify(shippingAddress),
      items: JSON.stringify(items),
    });
    
    console.log("Order created successfully:", order.id);
    res.status(201).json(order);
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({
      error: 'Order creation failed',
      details: error.message,
    });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const clerkUserId = req.auth?.userId;

    if (!clerkUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find the user in the database
    const dbUser = await User.findOne({ where: { clerkId: clerkUserId } });
    if (!dbUser) {
      return res.status(404).json({ error: "User not found in DB" });
    }

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user is admin or order belongs to user
    if (dbUser.role !== 'admin' && order.userId !== dbUser.id) {
      return res.status(403).json({ message: "Unauthorized to update this order" });
    }

    await order.update({ status });
    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
};

// Get all orders (Admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const clerkUserId = req.auth?.userId;
    
    // Find the user in the database
    const dbUser = await User.findOne({ where: { clerkId: clerkUserId } });
    if (!dbUser) {
      return res.status(404).json({ error: "User not found in DB" });
    }

    if (dbUser.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const orders = await Order.findAll({
      include: [{
        model: User,
        as: "user",
        attributes: ["id", "name", "email"],
      }],
      order: [["createdAt", "DESC"]],
    });

    // Parse JSON strings to objects for response
    const formattedOrders = orders.map(order => {
      const plainOrder = order.get({ plain: true });
      if (plainOrder.shippingAddress) {
        try {
          plainOrder.shippingAddress = JSON.parse(plainOrder.shippingAddress);
        } catch (e) {
          plainOrder.shippingAddress = {};
        }
      }
      if (plainOrder.items) {
        try {
          plainOrder.items = JSON.parse(plainOrder.items);
        } catch (e) {
          plainOrder.items = [];
        }
      }
      return plainOrder;
    });

    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ 
      error: "Internal Server Error",
      details: error.message 
    });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const clerkUserId = req.auth?.userId;
    
    // Find the user in the database
    const dbUser = await User.findOne({ where: { clerkId: clerkUserId } });
    if (!dbUser) {
      return res.status(404).json({ error: "User not found in DB" });
    }

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user is admin or order belongs to user
    if (dbUser.role !== 'admin' && order.userId !== dbUser.id) {
      return res.status(403).json({ message: "Unauthorized to view this order" });
    }

    // Parse JSON strings to objects for response
    const plainOrder = order.get({ plain: true });
    if (plainOrder.shippingAddress) {
      try {
        plainOrder.shippingAddress = JSON.parse(plainOrder.shippingAddress);
      } catch (e) {
        plainOrder.shippingAddress = {};
      }
    }
    if (plainOrder.items) {
      try {
        plainOrder.items = JSON.parse(plainOrder.items);
      } catch (e) {
        plainOrder.items = [];
      }
    }

    res.status(200).json(plainOrder);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
};

module.exports = exports;