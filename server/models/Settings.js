const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    heroBackgroundImage: { type: String, default: '' },
    heroOverlayOpacity: { type: Number, default: 0.7 },
    organisationName: { type: String, default: 'CredVault' },

}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
