const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8
  },
  fitnessLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  wellnessGoals: {
    type: [String], // Allows for multiple selections
    enum: ['Weight Loss', 'Flexibility', 'Strength', 'Stress Relief', 'Mindfulness'],
    required: true
  },
  agreedToTerms: {
    type: Boolean,
    required: [true, 'You must agree to the terms']
  }
}, { 
  timestamps: true // Automatically creates 'createdAt' and 'updatedAt'
});

const User = mongoose.model('User', userSchema);

module.exports = User;