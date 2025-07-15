const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Üye Olma (Signup)
router.post('/register', async (req, res) => {
  try {
    const { name, surname, email, password } = req.body;
    if (!name || !surname || !email || !password) {
      return res.status(400).json({ message: 'Tüm alanlar zorunlu' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Bu email ile kayıtlı kullanıcı var' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, surname, email, password: hashedPassword });
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, surname: user.surname, email: user.email, profileImage: user.profileImage } });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

// Giriş Yapma (Login)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email ve şifre zorunlu' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Kullanıcı bulunamadı' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Şifre hatalı' });
    }
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, surname: user.surname, email: user.email, profileImage: user.profileImage } });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

module.exports = router; 