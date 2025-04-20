const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const User = require("../models/User");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/",protect,adminOnly, async(req, res) => {
  const users = await User.find({}).select("-password");
  res.status(200).json(users);
}
);

// Example protected route
router.get("/me", protect, (req, res) => {
  res.json({ message: "You are logged in", userId: req.userId });
});

module.exports = router;
