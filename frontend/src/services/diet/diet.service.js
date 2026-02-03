import api from '../api/client.js';

export const dietService = {
  // Get diet recommendation
  getRecommendation: (userData) => {
    return api.post('/api/diet/recommendations', userData);
  },

  // Get personalized diet plan
  getDietPlan: (userId) => {
    return api.get(`/api/diet/plan/${userId}`);
  },

  // Update diet preferences
  updatePreferences: (preferences) => {
    return api.put('/api/diet/preferences', preferences);
  },

  // Track meal
  trackMeal: (mealData) => {
    return api.post('/api/diet/track', mealData);
  },

  // Get nutrition summary
  getNutritionSummary: (date) => {
    return api.get('/api/diet/summary', { params: { date } });
  },

  // Get food suggestions
  getFoodSuggestions: (criteria) => {
    return api.post('/api/diet/suggestions', criteria);
  }
};