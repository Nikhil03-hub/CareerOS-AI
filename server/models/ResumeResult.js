const mongoose = require('mongoose');

const resumeResultSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  rawText: {
    type: String,
    default: ''
  },
  skills: {
    type: [String],
    default: []
  },
  atsScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  missingSkills: {
    type: [String],
    default: []
  },
  scoringBreakdown: {
    skillScore: { type: Number, default: 0 },
    experienceScore: { type: Number, default: 0 },
    educationScore: { type: Number, default: 0 },
    formatScore: { type: Number, default: 0 }
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'text_extracted', 'skills_extracted', 'completed', 'failed'],
    default: 'pending'
  },
  error: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.ResumeResult || mongoose.model('ResumeResult', resumeResultSchema);
