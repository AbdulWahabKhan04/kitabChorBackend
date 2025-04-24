const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const Order = require("../models/Order");

// CRUD routes
router.get('/byReferCode/', orderController.getOrdersByReferCode); 
router.post("/", orderController.createOrder);
router.get("/", orderController.getAllOrders);
router.get("/:id", orderController.getOrderById);
router.put("/:id", orderController.updateOrder);
router.delete("/:id", orderController.deleteOrder);
router.get('/track/:trackingNumber', async (req, res) => {
    try {
      const order = await Order.findOne({ deliveryTrackingNumber: req.params.trackingNumber })
        .populate('products.bookId');
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      res.json(order);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  

module.exports = router;
