const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  summary: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  publishDate: { type: Date },
  pageCount: { type: Number },
  averageRating: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Book', BookSchema); 