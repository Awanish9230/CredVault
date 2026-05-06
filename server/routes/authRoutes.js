const express = require('express');
const { login, getMe, seedAdmin, updateProfile, updatePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.post('/seed', seedAdmin); // Route to seed admin for local dev

module.exports = router;
