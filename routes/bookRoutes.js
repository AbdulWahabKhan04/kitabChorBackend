const express = require("express");
const router = express.Router();
const {
  createBook, getAllBooks, getBookById,
  updateBook, deleteBook,
  getBooksByCategory
} = require("../controllers/bookController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const Book = require("../models/Book");

// Public
router.get("/", getAllBooks);
router.get("/book/:id", getBookById);

// Search books
router.get("/search",async (req, res) => {
  const query = req.query.query.trim().toLowerCase();
  try {
    // Searching for books based on title, author, or courseCode
    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } },
        { courseCode: { $regex: query, $options: "i" } },
      ],
    }).exec();

    // Return found books
    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error searching books" });
  }
});

router.get('/related', getRelatedBooks = async (req, res) => {
  try {
    const { category, subject, excludeId } = req.query;
    
    if (!category || !subject) {
      return res.status(400).json({ message: 'Category and subject parameters are required' });
    }

    const query = {
      $and: [
        { $or: [
          { category: new RegExp(category, 'i') },
          { relatedSubject: new RegExp(subject, 'i') }
        ]},
        { _id: { $ne: excludeId } }
      ]
    };

    const relatedBooks = await Book.find(query)
      .limit(8) // Limit to 8 related books
      .select('title author bookImage ourPrice priceNew courseCode'); // Only select necessary fields

    res.json(relatedBooks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get books by category
router.get("/category/:category", getBooksByCategory);

// Admin only
router.post("/", protect, adminOnly, createBook);
router.put("/:id", protect, adminOnly, updateBook);
router.delete("/:id", protect, adminOnly, deleteBook);

module.exports = router;
