const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  certId: { type: String, unique: true, required: true, index: true },
  recipientName: { type: String, required: true, trim: true },
  recipientEmail: { type: String, required: true, lowercase: true, index: true },
  role: { type: String, required: true, enum: ['Intern', 'Volunteer', 'Mentor', 'Trainer', 'Project Lead', 'Speaker'] },
  programme: { type: String, required: true, trim: true },
  certType: { type: String, required: true, enum: ['Internship', 'Appreciation', 'Participation', 'Achievement', 'Completion'] },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  issuedBy: { type: String, required: true },
  issuingOrg: { type: String, required: true },
  customMessage: { type: String, maxlength: 200, default: '' },
  template: { type: String, enum: ['elegant-gold', 'modern-corporate', 'professional-slate'], default: 'professional-slate' },
  status: { type: String, enum: ['active', 'revoked'], default: 'active', index: true },
  revokedReason: { type: String, default: '' },
  revokedAt: { type: Date },
  verifyCount: { type: Number, default: 0 },
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);
