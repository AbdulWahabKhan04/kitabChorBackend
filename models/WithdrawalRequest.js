// models/WithdrawalRequest.js
const mongoose = require("mongoose");

const withdrawalRequestSchema = new mongoose.Schema(
  {
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["easypaisa", "jazzcash", "bank transfer"], required: true },
    accountTitle: { type: String, required: true },
    accountNo: { type: String, required: true },
    note: { type: String, default: "" },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WithdrawalRequest", withdrawalRequestSchema);
