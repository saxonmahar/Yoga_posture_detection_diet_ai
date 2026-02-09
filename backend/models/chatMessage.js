const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  context: {
    page: String,
    sessionId: String,
    userStats: {
      totalSessions: Number,
      isPremium: Boolean
    }
  },
  tokensUsed: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
chatMessageSchema.index({ user: 1, timestamp: -1 });

// Method to get recent conversation history
chatMessageSchema.statics.getRecentHistory = async function(userId, limit = 10) {
  return this.find({ user: userId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .select('role content timestamp')
    .lean();
};

// Method to get conversation by session
chatMessageSchema.statics.getSessionHistory = async function(userId, sessionId) {
  return this.find({ 
    user: userId,
    'context.sessionId': sessionId 
  })
    .sort({ timestamp: 1 })
    .select('role content timestamp')
    .lean();
};

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = ChatMessage;
