const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    referBy: {
      type: String,
    },
    products: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",  // Reference to Product model if you have one
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["easypaisa", "jazzcash", "cash on delivery","bank transfer"],
      required: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    contactInfo: {
      phone: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    deliveryDate: {
      type: Date,
    },
    deliveryTrackingNumber: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
