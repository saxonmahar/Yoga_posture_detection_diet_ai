const mongoose = require('mongoose');

const poseProgressSchema = new mongoose.Schema({
  pose_id: {
    type: String,
    required: true,
    enum: ['yog1', 'yog2', 'yog3', 'yog4', 'yog5', 'yog6']
  },
  pose_name: {
    type: String,
    required: true
  },
  mastery_level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Master'],
    default: 'Beginner'
  },
  best_score: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  average_score: {
    type: Number,
    default: 0
  },
  total_attempts: {
    type: Number,
    default: 0
  },
  successful_completions: {
    type: Number,
    default: 0
  },
  first_attempt_date: {
    type: Date,
    default: Date.now
  },
  first_perfect_date: {
    type: Date,
    default: null
  },
  last_practiced: {
    type: Date,
    default: Date.now
  },
  improvement_trend: {
    type: String,
    enum: ['Improving', 'Stable', 'Declining', 'New'],
    default: 'New'
  },
  recent_scores: [{
    score: Number,
    date: Date
  }] // Keep last 10 scores for trend analysis
});

const userProgressSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  overall_stats: {
    total_sessions: {
      type: Number,
      default: 0
    },
    total_practice_time: {
      type: Number, // minutes
      default: 0
    },
    current_streak: {
      type: Number,
      default: 0
    },
    longest_streak: {
      type: Number,
      default: 0
    },
    last_practice_date: {
      type: Date,
      default: null
    },
    favorite_pose: {
      type: String,
      default: null
    },
    overall_mastery_level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Master'],
      default: 'Beginner'
    }
  },
  pose_progress: [poseProgressSchema],
  achievements: [{
    achievement_id: String,
    name: String,
    description: String,
    unlocked_date: Date,
    icon: String
  }],
  goals: [{
    goal_type: {
      type: String,
      enum: ['daily_practice', 'pose_mastery', 'accuracy_target', 'streak_target']
    },
    target_value: Number,
    current_value: Number,
    deadline: Date,
    completed: {
      type: Boolean,
      default: false
    },
    created_date: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Method to update pose progress
userProgressSchema.methods.updatePoseProgress = function(poseId, poseName, accuracyScore, completed) {
  let poseProgress = this.pose_progress.find(p => p.pose_id === poseId);
  
  if (!poseProgress) {
    // Create new pose progress
    poseProgress = {
      pose_id: poseId,
      pose_name: poseName,
      mastery_level: 'Beginner',
      best_score: accuracyScore,
      average_score: accuracyScore,
      total_attempts: 1,
      successful_completions: completed ? 1 : 0,
      first_attempt_date: new Date(),
      first_perfect_date: accuracyScore >= 90 ? new Date() : null,
      last_practiced: new Date(),
      improvement_trend: 'New',
      recent_scores: [{ score: accuracyScore, date: new Date() }]
    };
    this.pose_progress.push(poseProgress);
  } else {
    // Update existing pose progress
    poseProgress.total_attempts += 1;
    if (completed) poseProgress.successful_completions += 1;
    if (accuracyScore > poseProgress.best_score) poseProgress.best_score = accuracyScore;
    if (accuracyScore >= 90 && !poseProgress.first_perfect_date) {
      poseProgress.first_perfect_date = new Date();
    }
    
    // Add to recent scores (keep last 10)
    poseProgress.recent_scores.push({ score: accuracyScore, date: new Date() });
    if (poseProgress.recent_scores.length > 10) {
      poseProgress.recent_scores.shift();
    }
    
    // Calculate new average
    const totalScore = poseProgress.recent_scores.reduce((sum, s) => sum + s.score, 0);
    poseProgress.average_score = totalScore / poseProgress.recent_scores.length;
    
    // Update mastery level
    if (poseProgress.average_score >= 90) poseProgress.mastery_level = 'Master';
    else if (poseProgress.average_score >= 75) poseProgress.mastery_level = 'Advanced';
    else if (poseProgress.average_score >= 60) poseProgress.mastery_level = 'Intermediate';
    
    // Calculate improvement trend
    if (poseProgress.recent_scores.length >= 3) {
      const recentAvg = poseProgress.recent_scores.slice(-3).reduce((sum, s) => sum + s.score, 0) / 3;
      const olderAvg = poseProgress.recent_scores.slice(0, -3).reduce((sum, s) => sum + s.score, 0) / Math.max(1, poseProgress.recent_scores.length - 3);
      
      if (recentAvg > olderAvg + 5) poseProgress.improvement_trend = 'Improving';
      else if (recentAvg < olderAvg - 5) poseProgress.improvement_trend = 'Declining';
      else poseProgress.improvement_trend = 'Stable';
    }
    
    poseProgress.last_practiced = new Date();
  }
  
  return poseProgress;
};

// Method to update overall stats
userProgressSchema.methods.updateOverallStats = function() {
  this.overall_stats.total_sessions += 1;
  this.overall_stats.last_practice_date = new Date();
  
  // Update streak
  const today = new Date();
  const lastPractice = this.overall_stats.last_practice_date;
  const daysDiff = Math.floor((today - lastPractice) / (1000 * 60 * 60 * 24));
  
  if (daysDiff <= 1) {
    this.overall_stats.current_streak += 1;
    if (this.overall_stats.current_streak > this.overall_stats.longest_streak) {
      this.overall_stats.longest_streak = this.overall_stats.current_streak;
    }
  } else {
    this.overall_stats.current_streak = 1;
  }
  
  // Calculate favorite pose
  const poseCounts = {};
  this.pose_progress.forEach(pose => {
    poseCounts[pose.pose_name] = pose.total_attempts;
  });
  
  this.overall_stats.favorite_pose = Object.keys(poseCounts).reduce((a, b) => 
    poseCounts[a] > poseCounts[b] ? a : b, null
  );
  
  // Calculate overall mastery level
  const avgMastery = this.pose_progress.reduce((sum, pose) => {
    const masteryScore = pose.mastery_level === 'Master' ? 4 : 
                        pose.mastery_level === 'Advanced' ? 3 :
                        pose.mastery_level === 'Intermediate' ? 2 : 1;
    return sum + masteryScore;
  }, 0) / Math.max(1, this.pose_progress.length);
  
  if (avgMastery >= 3.5) this.overall_stats.overall_mastery_level = 'Master';
  else if (avgMastery >= 2.5) this.overall_stats.overall_mastery_level = 'Advanced';
  else if (avgMastery >= 1.5) this.overall_stats.overall_mastery_level = 'Intermediate';
  else this.overall_stats.overall_mastery_level = 'Beginner';
};

module.exports = mongoose.model('UserProgress', userProgressSchema);