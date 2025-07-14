const express = require('express');
const User = require('../models/User');
const Rating = require('../models/Rating');
const Review = require('../models/Review');
const ReadingList = require('../models/ReadingList');
const Book = require('../models/Book');
const auth = require('../middleware/auth');

const router = express.Router();

// Profil (kendi bilgileri)
router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
  const ratings = await Rating.find({ user: user._id }).populate('book', 'title author coverImage');
  const reviews = await Review.find({ user: user._id }).populate('book', 'title author coverImage');
  const readingLists = await ReadingList.find({ user: user._id }).populate('books', 'title author coverImage publishDate pageCount summary category averageRating');
  res.json({ user, ratings, reviews, readingLists });
});

// Profil güncelleme
router.put('/me', auth, async (req, res) => {
  const { name, surname, about, profileImage } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, surname, about, profileImage },
    { new: true }
  ).select('-password');
  res.json(user);
});

// Okuma listesi oluşturma
router.post('/me/reading-lists', auth, async (req, res) => {
  const { name, bookIds } = req.body;
  if (!name) return res.status(400).json({ message: 'Liste adı zorunlu' });
  const readingList = await ReadingList.create({
    name,
    user: req.user.id,
    books: bookIds || [],
  });
  res.json(readingList);
});

// Okuma listesi güncelleme
router.put('/me/reading-lists/:id', auth, async (req, res) => {
  const { name, bookIds } = req.body;
  if (!name) return res.status(400).json({ message: 'Liste adı zorunlu' });

  // Mevcut kitapları bul ve birleştir
  const readingList = await ReadingList.findOne({ _id: req.params.id, user: req.user.id });
  if (!readingList) return res.status(404).json({ message: 'Okuma listesi bulunamadı' });
  let mergedBookIds = bookIds || [];
  if (Array.isArray(readingList.books)) {
    const currentIds = readingList.books.map(b => b.toString());
    mergedBookIds = Array.from(new Set([...currentIds, ...(bookIds || [])]));
  }

  readingList.name = name;
  readingList.books = mergedBookIds;
  await readingList.save();
  await readingList.populate('books', 'title author coverImage publishDate pageCount summary category averageRating');
  res.json(readingList);
});

// Okuma listesi silme
router.delete('/me/reading-lists/:id', auth, async (req, res) => {
  const readingList = await ReadingList.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!readingList) return res.status(404).json({ message: 'Okuma listesi bulunamadı' });
  res.json({ message: 'Okuma listesi silindi' });
});

module.exports = router; 