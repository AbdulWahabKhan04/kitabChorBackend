const mongoose = require("mongoose");

const instituteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  branchs: { type: [String], required: true }, // Array of branch names
  expressDelivery: { type: Boolean, default: false }, // Express delivery flag
}, { timestamps: true });

module.exports = mongoose.model("Institute", instituteSchema);
