// src/hooks/useNutrition.js
import { useState, useEffect } from 'react';

export const useNutrition = (userData) => {
  const [nutrition, setNutrition] = useState({
    dailyCalories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    meals: [],
    waterIntake: 0
  });

  const [dailyGoal, setDailyGoal] = useState({
    calories: 2000,
    protein: 50, // grams
    carbs: 250, // grams
    fats: 65, // grams
    water: 2.5 // liters
  });

  // Calculate nutrition based on user data
  useEffect(() => {
    if (userData) {
      const { weight, height, age, activityLevel, goal } = userData;
      
      // BMR calculation (Mifflin-St Jeor Equation)
      let bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
      
      // Activity multiplier
      const activityMultipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        veryActive: 1.9
      };
      
      const tdee = bmr * (activityMultipliers[activityLevel] || 1.2);
      
      // Goal adjustment
      const goalAdjustments = {
        weightLoss: -500,
        maintenance: 0,
        muscleGain: 300
      };
      
      const dailyCalories = tdee + (goalAdjustments[goal] || 0);
      
      // Macronutrient distribution
      const proteinGrams = Math.round((dailyCalories * 0.3) / 4); // 30% calories from protein
      const fatGrams = Math.round((dailyCalories * 0.25) / 9); // 25% calories from fat
      const carbGrams = Math.round((dailyCalories * 0.45) / 4); // 45% calories from carbs
      
      setDailyGoal({
        calories: Math.round(dailyCalories),
        protein: proteinGrams,
        carbs: carbGrams,
        fats: fatGrams,
        water: 2.5
      });
    }
  }, [userData]);

  const addMeal = (meal) => {
    setNutrition(prev => ({
      ...prev,
      meals: [...prev.meals, meal],
      dailyCalories: prev.dailyCalories + meal.calories,
      protein: prev.protein + meal.protein,
      carbs: prev.carbs + meal.carbs,
      fats: prev.fats + meal.fats
    }));
  };

  const logWater = (amount) => {
    setNutrition(prev => ({
      ...prev,
      waterIntake: prev.waterIntake + amount
    }));
  };

  const getProgress = () => {
    return {
      calories: (nutrition.dailyCalories / dailyGoal.calories) * 100,
      protein: (nutrition.protein / dailyGoal.protein) * 100,
      carbs: (nutrition.carbs / dailyGoal.carbs) * 100,
      fats: (nutrition.fats / dailyGoal.fats) * 100,
      water: (nutrition.waterIntake / dailyGoal.water) * 100
    };
  };

  return {
    nutrition,
    dailyGoal,
    addMeal,
    logWater,
    getProgress,
    setDailyGoal
  };
};