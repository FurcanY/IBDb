const express = require('express');
const Book = require('../models/Book');
const Review = require('../models/Review');
const Rating = require('../models/Rating');
const auth = require('../middleware/auth');

const router = express.Router();

// Kitap arama
router.get('/search', async (req, res) => {
  const query = req.query.query || '';
  const regex = new RegExp(query, 'i');
  const books = await Book.find({
    $or: [
      { title: regex },
      { author: regex },
      { category: regex },
    ],
  });
  res.json(books);
});

// Popüler kitaplar (en yüksek ortalama puan)
router.get('/popular', async (req, res) => {
  const category = req.query.category;
  const filter = category ? { category } : {};
  const books = await Book.find(filter).sort({ averageRating: -1 }).limit(10);
  res.json(books);
});

// Kitap detayı (yorum ve ortalama puan dahil)
router.get('/:id', async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: 'Kitap bulunamadı' });
  const reviews = await Review.find({ book: book._id }).populate('user', 'name surname profileImage');

  let userRating = null;
  // JWT varsa ve geçerliyse, userId ile bu kitaba ait rating'i bul
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    try {
      const jwt = require('jsonwebtoken');
      const user = jwt.verify(token, process.env.JWT_SECRET);
      const rating = await Rating.findOne({ book: book._id, user: user.id });
      if (rating) userRating = rating.value;
    } catch (e) {
      // token hatalıysa userRating null kalır
    }
  }

  res.json({ ...book.toObject(), reviews, userRating });
});

// Kitap puanlama
router.post('/:id/rate', auth, async (req, res) => {
  const { value } = req.body;
  if (!value || value < 1 || value > 5) return res.status(400).json({ message: 'Puan 1-5 arası olmalı' });
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: 'Kitap bulunamadı' });
  let rating = await Rating.findOne({ book: book._id, user: req.user.id });
  if (rating) return res.status(400).json({ message: 'Daha önce puan verdiniz, güncellemek için PUT kullanın' });
  rating = await Rating.create({ book: book._id, user: req.user.id, value });
  // Ortalama puanı güncelle
  const ratings = await Rating.find({ book: book._id });
  const avg = ratings.reduce((acc, r) => acc + r.value, 0) / ratings.length;
  book.averageRating = avg;
  await book.save();
  res.json({ message: 'Puan kaydedildi', averageRating: avg });
});

// Kitap puan güncelleme
router.put('/:id/rate', auth, async (req, res) => {
  const { value } = req.body;
  if (!value || value < 1 || value > 5) return res.status(400).json({ message: 'Puan 1-5 arası olmalı' });
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: 'Kitap bulunamadı' });
  let rating = await Rating.findOne({ book: book._id, user: req.user.id });
  if (!rating) return res.status(404).json({ message: 'Daha önce puan vermediniz' });
  rating.value = value;
  await rating.save();
  // Ortalama puanı güncelle
  const ratings = await Rating.find({ book: book._id });
  const avg = ratings.reduce((acc, r) => acc + r.value, 0) / ratings.length;
  book.averageRating = avg;
  await book.save();
  res.json({ message: 'Puan güncellendi', averageRating: avg });
});

// Kitap incelemesi ekleme
router.post('/:id/reviews', auth, async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ message: 'İnceleme içeriği zorunlu' });
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: 'Kitap bulunamadı' });
  const review = await Review.create({ book: book._id, user: req.user.id, content });
  res.json(review);
});

// Kitap incelemesi güncelleme
router.put('/:id/reviews/:reviewId', auth, async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ message: 'İnceleme içeriği zorunlu' });
  const review = await Review.findById(req.params.reviewId);
  if (!review) return res.status(404).json({ message: 'İnceleme bulunamadı' });
  if (review.user.toString() !== req.user.id) return res.status(403).json({ message: 'Sadece kendi incelemenizi güncelleyebilirsiniz' });
  review.content = content;
  await review.save();
  res.json(review);
});

// Kitap incelemesi silme
router.delete('/:id/reviews/:reviewId', auth, async (req, res) => {
  const review = await Review.findById(req.params.reviewId);
  if (!review) return res.status(404).json({ message: 'İnceleme bulunamadı' });
  if (review.user.toString() !== req.user.id) return res.status(403).json({ message: 'Sadece kendi incelemenizi silebilirsiniz' });
  await review.deleteOne();
  res.json({ message: 'İnceleme silindi' });
});

module.exports = router; 