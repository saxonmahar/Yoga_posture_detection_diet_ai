const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    // User reference
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    
    // Meal information
    mealType: {
        type: String,
        enum: ['breakfast', 'lunch', 'dinner', 'snack', 'pre-workout', 'post-workout'],
        required: true
    },
    mealDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    
    // Food items array
    items: [{
        foodName: {
            type: String,
            required: true,
            trim: true
        },
        quantity: {
            amount: Number,
            unit: {
                type: String,
                enum: ['g', 'ml', 'piece', 'cup', 'tablespoon', 'teaspoon', 'bowl', 'plate']
            }
        },
        
        // Nutrition facts
        calories: {
            type: Number,
            min: 0,
            required: true
        },
        protein: {
            type: Number, // in grams
            min: 0,
            default: 0
        },
        carbohydrates: {
            type: Number, // in grams
            min: 0,
            default: 0
        },
        fats: {
            type: Number, // in grams
            min: 0,
            default: 0
        },
        fiber: {
            type: Number, // in grams
            min: 0,
            default: 0
        },
        sugar: {
            type: Number, // in grams
            min: 0,
            default: 0
        },
        
        // Food category
        category: {
            type: String,
            enum: [
                'grains', 'protein', 'vegetables', 'fruits', 
                'dairy', 'fats-oils', 'sweets', 'beverages', 'other'
            ]
        },
        
        // Custom fields
        isHealthy: Boolean,
        isHomeCooked: Boolean,
        allergens: [String],
        
        // Optional image
        imageUrl: String
    }],
    
    // Total nutrition for the meal
    totalCalories: {
        type: Number,
        min: 0,
        default: 0
    },
    totalProtein: {
        type: Number,
        min: 0,
        default: 0
    },
    totalCarbs: {
        type: Number,
        min: 0,
        default: 0
    },
    totalFats: {
        type: Number,
        min: 0,
        default: 0
    },
    
    // Meal details
    mealTime: {
        type: String, // e.g., "08:30 AM"
        trim: true
    },
    location: {
        type: String,
        enum: ['home', 'restaurant', 'office', 'outside', 'other']
    },
    
    // User rating & notes
    satisfaction: {
        type: Number,
        min: 1,
        max: 5
    },
    hungerLevelBefore: {
        type: Number,
        min: 1,
        max: 5
    },
    hungerLevelAfter: {
        type: Number,
        min: 1,
        max: 5
    },
    notes: String,
    
    // Water intake (in ml)
    waterIntake: {
        type: Number,
        min: 0,
        default: 0
    },
    
    // Photo of the meal (optional)
    mealPhotoUrl: String,
    
    // Tags for filtering
    tags: [String]
}, {
    timestamps: true
});

// Calculate totals before saving
foodSchema.pre('save', function(next) {
    // Calculate total nutrition from items
    if (this.items && this.items.length > 0) {
        this.totalCalories = this.items.reduce((sum, item) => sum + (item.calories || 0), 0);
        this.totalProtein = this.items.reduce((sum, item) => sum + (item.protein || 0), 0);
        this.totalCarbs = this.items.reduce((sum, item) => sum + (item.carbohydrates || 0), 0);
        this.totalFats = this.items.reduce((sum, item) => sum + (item.fats || 0), 0);
    }
    
    next();
});

// Indexes for faster queries
foodSchema.index({ userId: 1, mealDate: -1 });
foodSchema.index({ mealType: 1 });
foodSchema.index({ 'items.foodName': 1 });
foodSchema.index({ 'items.category': 1 });

// Static method to get daily summary
foodSchema.statics.getDailySummary = async function(userId, date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const meals = await this.find({
        userId,
        mealDate: {
            $gte: startOfDay,
            $lte: endOfDay
        }
    });
    
    const summary = {
        totalMeals: meals.length,
        totalCalories: meals.reduce((sum, meal) => sum + meal.totalCalories, 0),
        totalProtein: meals.reduce((sum, meal) => sum + meal.totalProtein, 0),
        totalCarbs: meals.reduce((sum, meal) => sum + meal.totalCarbs, 0),
        totalFats: meals.reduce((sum, meal) => sum + meal.totalFats, 0),
        waterIntake: meals.reduce((sum, meal) => sum + meal.waterIntake, 0),
        mealsByType: {}
    };
    
    // Group by meal type
    meals.forEach(meal => {
        if (!summary.mealsByType[meal.mealType]) {
            summary.mealsByType[meal.mealType] = [];
        }
        summary.mealsByType[meal.mealType].push({
            _id: meal._id,
            totalCalories: meal.totalCalories,
            items: meal.items.map(item => item.foodName)
        });
    });
    
    return summary;
};

// Method to get weekly calories
foodSchema.statics.getWeeklyCalories = async function(userId, startDate) {
    const startWeek = new Date(startDate);
    const endWeek = new Date(startDate);
    endWeek.setDate(endWeek.getDate() + 7);
    
    const meals = await this.find({
        userId,
        mealDate: {
            $gte: startWeek,
            $lt: endWeek
        }
    });
    
    const weeklyData = {};
    for (let i = 0; i < 7; i++) {
        const date = new Date(startWeek);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        weeklyData[dateStr] = 0;
    }
    
    meals.forEach(meal => {
        const dateStr = meal.mealDate.toISOString().split('T')[0];
        if (weeklyData[dateStr] !== undefined) {
            weeklyData[dateStr] += meal.totalCalories;
        }
    });
    
    return weeklyData;
};

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;