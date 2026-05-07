const express = require('express');
const multer = require('multer');
const path = require('path');
const { getSettings, updateHeroImage, updateSettings } = require('../controllers/settingsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `hero-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    }
});

router.get('/', getSettings);
router.put('/', protect, updateSettings);
router.put('/hero-image', protect, upload.single('heroImage'), updateHeroImage);

module.exports = router;
