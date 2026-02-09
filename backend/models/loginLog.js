const mongoose = require('mongoose');

const loginLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  loginTime: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  deviceInfo: {
    browser: String,
    os: String,
    device: String
  },
  status: {
    type: String,
    enum: ['success', 'failed'],
    default: 'success'
  }
}, {
  timestamps: true
});

// Index for faster queries
loginLogSchema.index({ loginTime: -1 });
loginLogSchema.index({ user: 1, loginTime: -1 });

module.exports = mongoose.model('LoginLog', loginLogSchema);
