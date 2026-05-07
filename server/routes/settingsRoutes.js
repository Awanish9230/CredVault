const express = require('express');
const multer = require('multer');
const path = require('path');
const { getSettings, updateHeroImage, updateSettings, getHeroImage } = require('../controllers/settingsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Use memory storage for GridFS
const storage = multer.memoryStorage();

const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Error: Images Only!'));
        }
    }
});

router.get('/', getSettings);
router.get('/image/:id', getHeroImage);
router.put('/', protect, updateSettings);
router.put('/hero-image', protect, upload.single('heroImage'), updateHeroImage);

module.exports = router;

