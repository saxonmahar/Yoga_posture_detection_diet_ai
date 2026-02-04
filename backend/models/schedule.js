const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    default: 'Yoga Session'
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true // Format: "HH:MM" (24-hour format)
  },
  duration: {
    type: Number,
    required: true,
    default: 30 // Duration in minutes
  },
  poses: [{
    type: String,
    enum: ['warrior2', 'tpose', 'tree', 'goddess', 'downdog', 'plank']
  }],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'missed', 'cancelled'],
    default: 'scheduled'
  },
  recurring: {
    enabled: {
      type: Boolean,
      default: false
    },
    pattern: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'custom'],
      default: 'weekly'
    },
    daysOfWeek: [{
      type: Number, // 0 = Sunday, 1 = Monday, etc.
      min: 0,
      max: 6
    }],
    endDate: Date
  },
  reminders: {
    enabled: {
      type: Boolean,
      default: true
    },
    minutes: [{
      type: Number,
      default: [30, 15, 5] // Remind 30, 15, and 5 minutes before
    }]
  },
  notes: {
    type: String,
    maxlength: 500
  },
  completedAt: Date,
  accuracy: Number, // Pose accuracy when completed
  sessionData: {
    totalPoses: Number,
    averageAccuracy: Number,
    duration: Number // Actual duration completed
  }
}, {
  timestamps: true
});

// Index for efficient queries
scheduleSchema.index({ user: 1, date: 1 });
scheduleSchema.index({ user: 1, status: 1 });
scheduleSchema.index({ date: 1, status: 1 });

// Virtual for formatted date
scheduleSchema.virtual('formattedDate').get(function() {
  return this.date.toISOString().split('T')[0];
});

// Virtual for datetime combination
scheduleSchema.virtual('datetime').get(function() {
  const [hours, minutes] = this.time.split(':');
  const datetime = new Date(this.date);
  datetime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  return datetime;
});

// Method to check if session is overdue
scheduleSchema.methods.isOverdue = function() {
  const now = new Date();
  const sessionTime = this.datetime;
  return now > sessionTime && this.status === 'scheduled';
};

// Method to mark as completed
scheduleSchema.methods.markCompleted = function(sessionData = {}) {
  this.status = 'completed';
  this.completedAt = new Date();
  if (sessionData.accuracy) this.accuracy = sessionData.accuracy;
  if (sessionData.sessionData) this.sessionData = sessionData.sessionData;
  return this.save();
};

// Static method to get user's schedule for date range
scheduleSchema.statics.getUserSchedule = function(userId, startDate, endDate) {
  return this.find({
    user: userId,
    date: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ date: 1, time: 1 });
};

// Static method to get today's sessions
scheduleSchema.statics.getTodaySessions = function(userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return this.find({
    user: userId,
    date: {
      $gte: today,
      $lt: tomorrow
    }
  }).sort({ time: 1 });
};

// Static method to get upcoming sessions (excluding today)
scheduleSchema.statics.getUpcomingSessions = function(userId, limit = 5) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  return this.find({
    user: userId,
    date: { $gte: tomorrow },
    status: 'scheduled'
  })
  .sort({ date: 1, time: 1 })
  .limit(limit);
};

// Pre-save middleware to handle recurring sessions
// scheduleSchema.pre('save', function(next) {
//   // Auto-mark overdue sessions as missed
//   if (this.isOverdue() && this.status === 'scheduled') {
//     this.status = 'missed';
//   }
//   next();
// });

module.exports = mongoose.model('Schedule', scheduleSchema);