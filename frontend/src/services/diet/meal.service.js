import apiClient from '../api/client.js';

export const mealService = {
  // Create meal plan
  createMealPlan: (planData) => {
    return apiClient.post('/api/meals/plan', planData);
  },

  // Get meal by ID
  getMeal: (mealId) => {
    return apiClient.get(`/api/meals/${mealId}`);
  },

  // Update meal
  updateMeal: (mealId, mealData) => {
    return apiClient.put(`/api/meals/${mealId}`, mealData);
  },

  // Delete meal
  deleteMeal: (mealId) => {
    return apiClient.delete(`/api/meals/${mealId}`);
  },

  // Search foods
  searchFoods: (query) => {
    return apiClient.get('/api/meals/foods/search', { params: { query } });
  },

  // Calculate nutrition
  calculateNutrition: (foods) => {
    return apiClient.post('/api/meals/calculate', { foods });
  }
};