const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // Date of progress entry
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    
    // Body metrics
    weight: {
        type: Number, // in kg
        min: 20,
        max: 200
    },
    bodyFatPercentage: {
        type: Number,
        min: 3,
        max: 50
    },
    muscleMass: {
        type: Number, // in kg
        min: 10,
        max: 100
    },
    
    // Measurements (in cm)
    measurements: {
        chest: Number,
        waist: Number,
        hips: Number,
        arms: Number,
        thighs: Number
    },
    
    // Exercise metrics
    exerciseData: {
        sessionsCompleted: {
            type: Number,
            default: 0
        },
        totalDuration: {
            type: Number, // minutes
            default: 0
        },
        caloriesBurned: {
            type: Number,
            default: 0
        },
        avgAccuracy: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        }
    },
    
    // Nutrition metrics
    nutritionData: {
        caloriesConsumed: {
            type: Number,
            default: 0
        },
        proteinConsumed: {
            type: Number, // grams
            default: 0
        },
        waterIntake: {
            type: Number, // ml
            default: 0
        },
        mealsLogged: {
            type: Number,
            default: 0
        }
    },
    
    // Mood & energy
    mood: {
        type: String,
        enum: ['excellent', 'good', 'neutral', 'poor', 'terrible']
    },
    energyLevel: {
        type: Number,
        min: 1,
        max: 10
    },
    
    // Sleep (in hours)
    sleepDuration: {
        type: Number,
        min: 0,
        max: 24
    },
    sleepQuality: {
        type: Number,
        min: 1,
        max: 5
    },
    
    // Notes
    notes: String,
    
    // Photos (optional)
    progressPhotos: [{
        url: String,
        caption: String,
        angle: String // front, side, back
    }]
}, {
    timestamps: true
});

// Indexes
progressSchema.index({ userId: 1, date: -1 });
progressSchema.index({ date: 1 });

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;