const Order = require("../models/orderModel");
const Teacher = require("../models/teacherModel");

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: "Failed to create order", details: error.message });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user").populate("products.bookId");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user").populate("products.bookId");
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to get order" });
  }
};

// Update order (with teacher earnings logic)
exports.updateOrder = async (req, res) => {
  try {
    const { paymentStatus, totalAmount, referBy } = req.body;

    const existingOrder = await Order.findById(req.params.id);
    if (!existingOrder) return res.status(404).json({ error: "Order not found" });

    // If payment is being completed now
    const wasPending = existingOrder.paymentStatus !== "completed" && paymentStatus === "completed";

    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (wasPending && referBy) {
      const teacher = await Teacher.findOne({ referCode: referBy });
      if (teacher) {
        const bonus = totalAmount * 0.10;
        teacher.earnings += bonus;
        await teacher.save();
      }
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(400).json({ error: "Failed to update order", details: error.message });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Order not found" });
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete order" });
  }
};
