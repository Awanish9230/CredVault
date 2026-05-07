const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['superadmin', 'admin', 'viewer'], default: 'admin' },
  organisation: { type: String, default: 'CredVault Org' },
  isActive: { type: Boolean, default: true },
  refreshToken: { type: String, default: '' },
  lastLogin: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
