const Settings = require('../models/Settings');
const path = require('path');
const fs = require('fs');

exports.getSettings = async (req, res, next) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({});
        }
        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        next(error);
    }
};

exports.updateHeroImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload an image' });
        }

        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({});
        }

        if (settings.heroBackgroundImage) {
            const oldPath = path.join(__dirname, '..', settings.heroBackgroundImage);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        settings.heroBackgroundImage = `/uploads/${req.file.filename}`;
        await settings.save();

        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        next(error);
    }
};

exports.updateSettings = async (req, res, next) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({});
        }

        settings = await Settings.findOneAndUpdate({}, req.body, {
            returnDocument: 'after',
            runValidators: true
        });

        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        next(error);
    }
};
