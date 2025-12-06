const mongoose = require('mongoose');

const dietPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  planName: {
    type: String,
    required: true
  },
  description: String,
  caloriesPerDay: Number,
  meals: [{
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack']
    },
    name: String,
    description: String,
    calories: Number,
    ingredients: [String],
    preparationTime: Number // in minutes
  }],
  duration: Number, // in days
  createdDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('DietPlan', dietPlanSchema);
