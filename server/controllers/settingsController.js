const Settings = require('../models/Settings');
const { getBucket } = require('../config/db');
const mongoose = require('mongoose');
const { Readable } = require('stream');

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

        const bucket = getBucket();
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({});
        }

        // Delete old image if exists
        if (settings.heroBackgroundImageId) {
            try {
                await bucket.delete(new mongoose.Types.ObjectId(settings.heroBackgroundImageId));
            } catch (err) {
                console.error("Old image not found in GridFS, skipping deletion");
            }
        }

        // Upload new image
        const readableStream = new Readable();
        readableStream.push(req.file.buffer);
        readableStream.push(null);

        const uploadStream = bucket.openUploadStream(req.file.originalname, {
            contentType: req.file.mimetype
        });

        readableStream.pipe(uploadStream);

        uploadStream.on('error', (error) => {
            return res.status(500).json({ success: false, message: 'Upload failed', error: error.message });
        });

        uploadStream.on('finish', async () => {
            settings.heroBackgroundImageId = uploadStream.id;
            settings.heroBackgroundImage = `/api/settings/image/${uploadStream.id}`;
            await settings.save();

            res.status(200).json({ success: true, data: settings });
        });

    } catch (error) {
        next(error);
    }
};

exports.getHeroImage = async (req, res, next) => {
    try {
        const bucket = getBucket();
        const fileId = new mongoose.Types.ObjectId(req.params.id);
        
        const files = await bucket.find({ _id: fileId }).toArray();
        if (!files || files.length === 0) {
            return res.status(404).json({ success: false, message: 'Image not found' });
        }

        res.set('Content-Type', files[0].contentType);
        const downloadStream = bucket.openDownloadStream(fileId);
        
        downloadStream.on('error', () => {
            res.status(404).json({ success: false, message: 'Image not found' });
        });

        downloadStream.pipe(res);
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

