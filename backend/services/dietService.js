const Food = require('../models/food');
const axios = require('axios');

class DietService {
    constructor() {
        this.pythonMLUrl = process.env.PYTHON_ML_URL || 'http://localhost:5001';
    }

    // Log a meal
    async logMeal(userId, mealData) {
        try {
            const meal = new Food({
                userId,
                ...mealData,
                mealDate: mealData.mealDate || new Date()
            });

            await meal.save();
            return { success: true, meal };
        } catch (error) {
            console.error('Log meal error:', error);
            return { success: false, error: error.message };
        }
    }

    // Get diet recommendation from Python ML
    async getDietRecommendation(userData) {
        try {
            console.log('🍎 Getting diet recommendation from Python ML...');
            
            const response = await axios.post(
                `${this.pythonMLUrl}/api/diet-recommendation`,
                userData,
                { timeout: 15000 }
            );

            return {
                success: true,
                recommendation: response.data,
                generatedAt: new Date()
            };

        } catch (error) {
            console.error('Diet API error:', error.message);
            
            // Fallback recommendation
            return {
                success: true,
                recommendation: this.fallbackRecommendation(userData),
                generatedAt: new Date(),
                note: 'Using fallback recommendation'
            };
        }
    }

    // Fallback diet recommendation
    fallbackRecommendation(userData) {
        const bmi = userData.weight / ((userData.height / 100) ** 2);
        
        let dailyCalories;
        if (bmi < 18.5) {
            dailyCalories = 2500; // Underweight
        } else if (bmi < 25) {
            dailyCalories = 2200; // Normal
        } else {
            dailyCalories = 1800; // Overweight
        }

        return {
            bmi: bmi.toFixed(2),
            bmi_category: bmi < 18.5 ? 'underweight' : bmi < 25 ? 'normal' : 'overweight',
            daily_calories: dailyCalories,
            meal_plan: {
                breakfast: 'Oatmeal with fruits and nuts (400 cal)',
                lunch: 'Grilled chicken with vegetables (600 cal)',
                dinner: 'Fish with quinoa (500 cal)',
                snacks: ['Greek yogurt (150 cal)', 'Apple (80 cal)']
            },
            recommendations: [
                'Drink 2-3 liters of water daily',
                'Include protein in every meal',
                'Eat vegetables with each meal'
            ]
        };
    }

    // Get today's meals
    async getTodayMeals(userId) {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const meals = await Food.find({
                userId,
                mealDate: {
                    $gte: today,
                    $lt: tomorrow
                }
            }).sort({ mealDate: 1 });

            // Calculate daily totals
            const totals = meals.reduce((acc, meal) => ({
                calories: acc.calories + meal.totalCalories,
                protein: acc.protein + meal.totalProtein,
                carbs: acc.carbs + meal.totalCarbs,
                fats: acc.fats + meal.totalFats
            }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

            return {
                success: true,
                meals,
                totals,
                mealCount: meals.length
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Get meal by ID
    async getMealById(mealId) {
        try {
            const meal = await Food.findById(mealId);
            if (!meal) {
                return { success: false, error: 'Meal not found' };
            }

            return { success: true, meal };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Update meal
    async updateMeal(mealId, updateData) {
        try {
            const meal = await Food.findByIdAndUpdate(
                mealId,
                { $set: updateData },
                { new: true, runValidators: true }
            );

            if (!meal) {
                return { success: false, error: 'Meal not found' };
            }

            return { success: true, meal };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Delete meal
    async deleteMeal(mealId) {
        try {
            const result = await Food.findByIdAndDelete(mealId);
            if (!result) {
                return { success: false, error: 'Meal not found' };
            }

            return { success: true, message: 'Meal deleted' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Get weekly summary
    async getWeeklySummary(userId, startDate) {
        try {
            const summary = await Food.getDailySummary(userId, startDate);
            return { success: true, summary };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

module.exports = new DietService();