import { useState, useEffect, useCallback } from 'react';
import { dietService, mealService } from '../services';

export const useDietPlan = (userId) => {
  const [dietPlan, setDietPlan] = useState(null);
  const [meals, setMeals] = useState([]);
  const [nutrition, setNutrition] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    fiber: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load diet plan
  const loadDietPlan = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const plan = await dietService.getDietPlan(userId);
      setDietPlan(plan);
      
      // Calculate nutrition from plan
      const totalNutrition = plan.meals.reduce((acc, meal) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fats: acc.fats + meal.fats,
        fiber: acc.fiber + (meal.fiber || 0)
      }), { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 });
      
      setNutrition(totalNutrition);
      setMeals(plan.meals);
    } catch (err) {
      setError(err.message || 'Failed to load diet plan');
      console.error('Error loading diet plan:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Get diet recommendation
  const getRecommendation = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const recommendation = await dietService.getRecommendation(userData);
      return recommendation;
    } catch (err) {
      setError(err.message || 'Failed to get diet recommendation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Add meal to plan
  const addMeal = useCallback(async (mealData) => {
    setLoading(true);
    setError(null);
    
    try {
      const newMeal = await mealService.createMeal(mealData);
      setMeals(prev => [...prev, newMeal]);
      
      // Update nutrition
      setNutrition(prev => ({
        calories: prev.calories + newMeal.calories,
        protein: prev.protein + newMeal.protein,
        carbs: prev.carbs + newMeal.carbs,
        fats: prev.fats + newMeal.fats,
        fiber: prev.fiber + (newMeal.fiber || 0)
      }));
      
      return newMeal;
    } catch (err) {
      setError(err.message || 'Failed to add meal');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update meal
  const updateMeal = useCallback(async (mealId, mealData) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedMeal = await mealService.updateMeal(mealId, mealData);
      
      // Update meals array
      setMeals(prev => prev.map(meal => 
        meal.id === mealId ? updatedMeal : meal
      ));
      
      // Recalculate nutrition
      const totalNutrition = meals.reduce((acc, meal) => {
        const currentMeal = meal.id === mealId ? updatedMeal : meal;
        return {
          calories: acc.calories + currentMeal.calories,
          protein: acc.protein + currentMeal.protein,
          carbs: acc.carbs + currentMeal.carbs,
          fats: acc.fats + currentMeal.fats,
          fiber: acc.fiber + (currentMeal.fiber || 0)
        };
      }, { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 });
      
      setNutrition(totalNutrition);
      return updatedMeal;
    } catch (err) {
      setError(err.message || 'Failed to update meal');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [meals]);

  // Remove meal
  const removeMeal = useCallback(async (mealId) => {
    setLoading(true);
    setError(null);
    
    try {
      await mealService.deleteMeal(mealId);
      
      // Remove from meals array
      const mealToRemove = meals.find(meal => meal.id === mealId);
      setMeals(prev => prev.filter(meal => meal.id !== mealId));
      
      // Update nutrition
      if (mealToRemove) {
        setNutrition(prev => ({
          calories: prev.calories - mealToRemove.calories,
          protein: prev.protein - mealToRemove.protein,
          carbs: prev.carbs - mealToRemove.carbs,
          fats: prev.fats - mealToRemove.fats,
          fiber: prev.fiber - (mealToRemove.fiber || 0)
        }));
      }
    } catch (err) {
      setError(err.message || 'Failed to remove meal');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [meals]);

  // Track meal consumption
  const trackMeal = useCallback(async (mealId, consumed = true) => {
    setLoading(true);
    setError(null);
    
    try {
      await dietService.trackMeal({ mealId, consumed });
      
      // Update meal status
      setMeals(prev => prev.map(meal => 
        meal.id === mealId ? { ...meal, consumed } : meal
      ));
    } catch (err) {
      setError(err.message || 'Failed to track meal');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Search foods
  const searchFoods = useCallback(async (query) => {
    setLoading(true);
    setError(null);
    
    try {
      const results = await mealService.searchFoods(query);
      return results;
    } catch (err) {
      setError(err.message || 'Failed to search foods');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Calculate nutrition for custom foods
  const calculateNutrition = useCallback(async (foods) => {
    setLoading(true);
    setError(null);
    
    try {
      const nutrition = await mealService.calculateNutrition(foods);
      return nutrition;
    } catch (err) {
      setError(err.message || 'Failed to calculate nutrition');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get daily summary
  const getDailySummary = useCallback(async (date) => {
    setLoading(true);
    setError(null);
    
    try {
      const summary = await dietService.getNutritionSummary(date);
      return summary;
    } catch (err) {
      setError(err.message || 'Failed to get daily summary');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load diet plan on mount
  useEffect(() => {
    if (userId) {
      loadDietPlan();
    }
  }, [userId, loadDietPlan]);

  return {
    // State
    dietPlan,
    meals,
    nutrition,
    loading,
    error,
    
    // Actions
    loadDietPlan,
    getRecommendation,
    addMeal,
    updateMeal,
    removeMeal,
    trackMeal,
    searchFoods,
    calculateNutrition,
    getDailySummary,
    
    // Computed values
    isPlanComplete: meals.length > 0,
    totalMeals: meals.length,
    consumedMeals: meals.filter(meal => meal.consumed).length,
    nutritionProgress: {
      calories: (nutrition.calories / (dietPlan?.dailyCalories || 2000)) * 100,
      protein: (nutrition.protein / (dietPlan?.dailyProtein || 50)) * 100,
      carbs: (nutrition.carbs / (dietPlan?.dailyCarbs || 250)) * 100,
      fats: (nutrition.fats / (dietPlan?.dailyFats || 65)) * 100
    }
  };
};