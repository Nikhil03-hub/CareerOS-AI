const mongoose = require('mongoose');

const userResumeSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  fileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    default: ''
  },
  atsScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  summary: {
    type: String,
    default: ''
  },
  skills: {
    type: [String],
    default: []
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.UserResume || mongoose.model('UserResume', userResumeSchema);
