const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: { type: String },
  relatedSubject: { type: String, required: true },
  courseCode: { type: String, required: true },
  bookImage: { type: String, required: true },
  priceNew: { type: Number, required: true },
  ourPrice: { type: Number, required: true },
  language: { type: String, required: true },
  noOfPages: { type: Number, required: true },
  editionDate: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Book", bookSchema);
