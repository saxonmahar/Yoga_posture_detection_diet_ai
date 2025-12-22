import apiClient from '../api/client.js';

export const dietService = {
  // Get diet recommendation
  getRecommendation: (userData) => {
    return apiClient.post('/api/diet/recommend', userData);
  },

  // Get personalized diet plan
  getDietPlan: (userId) => {
    return apiClient.get(`/api/diet/plan/${userId}`);
  },

  // Update diet preferences
  updatePreferences: (preferences) => {
    return apiClient.put('/api/diet/preferences', preferences);
  },

  // Track meal
  trackMeal: (mealData) => {
    return apiClient.post('/api/diet/track', mealData);
  },

  // Get nutrition summary
  getNutritionSummary: (date) => {
    return apiClient.get('/api/diet/summary', { params: { date } });
  },

  // Get food suggestions
  getFoodSuggestions: (criteria) => {
    return apiClient.post('/api/diet/suggestions', criteria);
  }
};