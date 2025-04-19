const mongoose = require("mongoose");

// Helper function to generate a 6-character alphanumeric refer code
const generateReferCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    institute: {
      type: String,
      required: true,
    },
    earnings: {
      type: Number,
      default: 0,
    },
    paidPreviously: {
      type: Number,
      default: 0,
    },
    withdrawalRequest: {
      type: Boolean,
      default: false,
    },
    referCode: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

// Generate refer code before saving if not present
teacherSchema.pre("save", async function (next) {
  if (!this.referCode) {
    let unique = false;
    let code = "";
    while (!unique) {
      code = generateReferCode();
      const existing = await mongoose.models.Teacher.findOne({ referCode: code });
      if (!existing) unique = true;
    }
    this.referCode = code;
  }
  next();
});

module.exports = mongoose.model("Teacher", teacherSchema);
