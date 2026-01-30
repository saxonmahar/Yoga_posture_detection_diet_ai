const mongoose = require('mongoose');

const poseAttemptSchema = new mongoose.Schema({
  pose_id: {
    type: String,
    required: true,
    enum: ['yog1', 'yog2', 'yog3', 'yog4', 'yog5', 'yog6']
  },
  pose_name: {
    type: String,
    required: true
  },
  accuracy_score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  attempts_count: {
    type: Number,
    default: 1
  },
  hold_duration: {
    type: Number, // seconds
    default: 0
  },
  completed_successfully: {
    type: Boolean,
    default: false
  },
  feedback_given: [{
    type: String
  }],
  corrections_needed: [{
    joint: String,
    message: String
  }],
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const yogaSessionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  session_date: {
    type: Date,
    default: Date.now
  },
  total_duration: {
    type: Number, // minutes
    default: 0
  },
  poses_practiced: [poseAttemptSchema],
  session_notes: {
    type: String,
    default: ''
  },
  overall_performance: {
    average_accuracy: {
      type: Number,
      default: 0
    },
    total_poses_attempted: {
      type: Number,
      default: 0
    },
    poses_completed: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Calculate session statistics before saving
yogaSessionSchema.pre('save', function() {
  if (this.poses_practiced && this.poses_practiced.length > 0) {
    const totalAccuracy = this.poses_practiced.reduce((sum, pose) => sum + (pose.accuracy_score || 0), 0);
    this.overall_performance.average_accuracy = Math.round(totalAccuracy / this.poses_practiced.length);
    this.overall_performance.total_poses_attempted = this.poses_practiced.length;
    this.overall_performance.poses_completed = this.poses_practiced.filter(pose => pose.completed_successfully).length;
  }
});

module.exports = mongoose.model('YogaSession', yogaSessionSchema);