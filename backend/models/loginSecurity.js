const mongoose = require('mongoose');

const loginSecuritySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Login attempt details
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  
  ipAddress: {
    type: String,
    required: true
  },
  
  userAgent: {
    type: String,
    required: true
  },
  
  // Parsed device info
  deviceInfo: {
    browser: String,
    os: String,
    device: String,
    isMobile: Boolean
  },
  
  // Location info (if available)
  location: {
    country: String,
    region: String,
    city: String,
    timezone: String
  },
  
  // Login status
  status: {
    type: String,
    enum: ['success', 'failed', 'blocked', 'suspicious'],
    required: true
  },
  
  // Security flags
  isNewDevice: {
    type: Boolean,
    default: false
  },
  
  isNewLocation: {
    type: Boolean,
    default: false
  },
  
  isSuspicious: {
    type: Boolean,
    default: false
  },
  
  // Notification status
  emailNotificationSent: {
    type: Boolean,
    default: false
  },
  
  // User response to security email
  userConfirmed: {
    type: String,
    enum: ['pending', 'confirmed', 'denied'],
    default: 'pending'
  },
  
  // Security token for email verification
  securityToken: {
    type: String,
    select: false
  },
  
  // Additional metadata
  failureReason: String,
  
  // Timestamps
  loginAttemptAt: {
    type: Date,
    default: Date.now
  },
  
  confirmedAt: Date,
  
  expiresAt: {
    type: Date,
    default: Date.now,
    expires: 2592000 // 30 days
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
loginSecuritySchema.index({ user: 1, loginAttemptAt: -1 });
loginSecuritySchema.index({ email: 1, ipAddress: 1 });
loginSecuritySchema.index({ status: 1, loginAttemptAt: -1 });
loginSecuritySchema.index({ userConfirmed: 1, emailNotificationSent: 1 });

// Static method to check if device/location is new
loginSecuritySchema.statics.checkNewDeviceOrLocation = async function(userId, ipAddress, userAgent) {
  const recentLogins = await this.find({
    user: userId,
    status: 'success',
    loginAttemptAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
  }).sort({ loginAttemptAt: -1 }).limit(10);

  const isNewDevice = !recentLogins.some(login => login.userAgent === userAgent);
  const isNewLocation = !recentLogins.some(login => login.ipAddress === ipAddress);

  return { isNewDevice, isNewLocation };
};

// Static method to get recent failed attempts
loginSecuritySchema.statics.getRecentFailedAttempts = async function(email, timeWindow = 15) {
  const since = new Date(Date.now() - timeWindow * 60 * 1000);
  
  return await this.countDocuments({
    email: email.toLowerCase(),
    status: 'failed',
    loginAttemptAt: { $gte: since }
  });
};

// Static method to check if IP is blocked
loginSecuritySchema.statics.isIpBlocked = async function(ipAddress, timeWindow = 60) {
  const since = new Date(Date.now() - timeWindow * 60 * 1000);
  
  const failedAttempts = await this.countDocuments({
    ipAddress,
    status: { $in: ['failed', 'blocked'] },
    loginAttemptAt: { $gte: since }
  });

  return failedAttempts >= 10; // Block after 10 failed attempts in 1 hour
};

module.exports = mongoose.model('LoginSecurity', loginSecuritySchema);