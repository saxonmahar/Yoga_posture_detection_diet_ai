import apiClient from '../api/client.js';

export const dietService = {
  // Get diet recommendation
  getRecommendation: (userData) => {
    return apiClient.post('/diet/recommendations', userData);
  },

  // Get personalized diet plan
  getDietPlan: (userId) => {
    return apiClient.get(`/diet/plan/${userId}`);
  },

  // Update diet preferences
  updatePreferences: (preferences) => {
    return apiClient.put('/diet/preferences', preferences);
  },

  // Track meal
  trackMeal: (mealData) => {
    return apiClient.post('/diet/track', mealData);
  },

  // Get nutrition summary
  getNutritionSummary: (date) => {
    return apiClient.get('/diet/summary', { params: { date } });
  },

  // Get food suggestions
  getFoodSuggestions: (criteria) => {
    return apiClient.post('/diet/suggestions', criteria);
  }
};