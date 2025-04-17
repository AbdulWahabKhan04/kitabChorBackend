const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

// Example protected route
router.get("/me", protect, (req, res) => {
  res.json({ message: "You are logged in", userId: req.userId });
});

module.exports = router;
