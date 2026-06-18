const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  preferredRole: {
    type: String,
    default: ''
  },
  experience: {
    type: String,
    default: ''
  },
  expectedSalary: {
    type: String,
    default: ''
  },
  skills: {
    type: [String],
    default: []
  },
  linkedinUrl: {
    type: String,
    default: ''
  },
  githubUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
  strict: false
});

module.exports = mongoose.models.UserProfile || mongoose.model('UserProfile', userProfileSchema);
