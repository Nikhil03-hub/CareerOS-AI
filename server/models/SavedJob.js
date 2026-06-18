const mongoose = require('mongoose');

const savedJobSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  jobId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    default: ''
  },
  salary: {
    type: String,
    default: ''
  },
  jobType: {
    type: String,
    default: ''
  },
  applyLink: {
    type: String,
    default: '#'
  },
  url: {
    type: String,
    default: '#'
  },
  source: {
    type: String,
    default: 'CareerOS'
  }
}, {
  timestamps: true
});

savedJobSchema.index({ userId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.models.SavedJob || mongoose.model('SavedJob', savedJobSchema);
