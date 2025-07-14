const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  value: { type: Number, required: true, min: 1, max: 5 },
}, { timestamps: true });

RatingSchema.index({ book: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Rating', RatingSchema); 