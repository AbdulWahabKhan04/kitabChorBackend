const express = require("express");
const router = express.Router();
const {
  createBook, getAllBooks, getBookById,
  updateBook, deleteBook,
  getBooksByCategory
} = require("../controllers/bookController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

// Public
router.get("/", getAllBooks);
router.get("/book/:id", getBookById);

// Get books by category
router.get("/category/:category", getBooksByCategory);

// Admin only
router.post("/", protect, adminOnly, createBook);
router.put("/:id", protect, adminOnly, updateBook);
router.delete("/:id", protect, adminOnly, deleteBook);

module.exports = router;
