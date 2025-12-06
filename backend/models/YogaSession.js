const mongoose = require('mongoose');

const yogaSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  poseName: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  corrections: [String],
  imageUrl: String,
  landmarks: [{
    x: Number,
    y: Number,
    z: Number,
    visibility: Number
  }],
  duration: Number, // in seconds
  caloriesBurned: Number,
  date: {
    type: Date,
    default: Date.now
  },
  feedback: String,
  score: {
    type: Number,
    min: 0,
    max: 100
  }
});

module.exports = mongoose.model('YogaSession', yogaSessionSchema);
