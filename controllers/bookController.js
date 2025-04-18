const Book = require("../models/Book");

exports.createBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }).limit(7);
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const updated = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Book not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Book not found" });
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBooksByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const books = await Book.find({ category }).sort({ createdAt: -1 }).limit(7);
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};