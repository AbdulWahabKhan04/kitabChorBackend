const Order = require("../models/Order");
const Teacher = require("../models/Teacher");

// Create a new order
const generateTrackingNumber = () => {
  const prefix = "KC"; // For KitabChor
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
  const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  return `${prefix}-${timestamp}-${random}`;
};

exports.createOrder = async (req, res) => {
  try {
    const trackingNumber = generateTrackingNumber();
    const order = new Order({
      ...req.body,
      deliveryTrackingNumber: trackingNumber,
      orderDate: new Date(), // optionally ensure this is saved
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: "Failed to create order", details: error.message });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("products.bookId");
    console.log(order)
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.status(200).json(order);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Failed to get order" });
  }
};

// Update order (with teacher earnings logic)
exports.updateOrder = async (req, res) => {
  try {
    const { paymentStatus, totalAmount, referBy, status, profit } = req.body;
    // console.log(referBy)
    const existingOrder = await Order.findById(req.params.id);
    if (!existingOrder) return res.status(404).json({ error: "Order not found" });

    const wasPending = existingOrder.paymentStatus !== "completed" && paymentStatus === "completed";

    // Update order with new data
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    // Award referral bonus if:
    // 1. Payment status just changed to completed (wasPending)
    // 2. Order has a valid referBy value
    // 3. Status is delivered
    // 4. Profit is a valid number
    if (
      wasPending &&
      referBy &&
      status === "delivered" &&
      profit &&
      !isNaN(profit)
    ) {
      const teacher = await Teacher.findOne({ referCode: referBy });
      console.log(teacher)
      if (teacher) {
        const bonus = parseFloat(profit) * 0.10;
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

exports.getOrdersByReferCode = async (req, res) => {
  const referCode = req.query.code;
  console.log(referCode)
  if (!referCode) {
    return res.status(400).json({ message: "Referral code is required" });
  }

  try {
    const orders = await Order.find({ referBy: referCode }).populate('user', 'name email');
    res.json(orders);
  } catch (error) {
    console.error("Error fetching referred orders:", error);
    res.status(500).json({ message: "Server error" });
  }
};
