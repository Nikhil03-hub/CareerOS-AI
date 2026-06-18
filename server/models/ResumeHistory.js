const mongoose = require('mongoose');

const resumeHistorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  originalFilename: {
    type: String,
    required: true
  },
  storedFilepath: {
    type: String,
    default: ''
  },
  analysisScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  skills: {
    type: [String],
    default: []
  },
  summary: {
    type: String,
    default: ''
  },
  suggestions: {
    type: [String],
    default: []
  },
  strengths: {
    type: [String],
    default: []
  },
  weaknesses: {
    type: [String],
    default: []
  },
  experience: {
    type: String,
    default: ''
  },
  education: {
    type: String,
    default: ''
  },
  fullJson: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

resumeHistorySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.models.ResumeHistory || mongoose.model('ResumeHistory', resumeHistorySchema);
