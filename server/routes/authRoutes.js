const express = require('express');
const { login, getMe, seedAdmin } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/seed', seedAdmin); // Route to seed admin for local dev

module.exports = router;
