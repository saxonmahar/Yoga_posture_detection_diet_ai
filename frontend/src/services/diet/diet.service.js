import api from '../api.js';

export const dietService = {
  // Get diet recommendation
  getRecommendation: (userData) => {
    return api.post('/diet/recommendations', userData);
  },

  // Get personalized diet plan
  getDietPlan: (userId) => {
    return api.get(`/diet/plan/${userId}`);
  },

  // Update diet preferences
  updatePreferences: (preferences) => {
    return api.put('/diet/preferences', preferences);
  },

  // Track meal
  trackMeal: (mealData) => {
    return api.post('/diet/track', mealData);
  },

  // Get nutrition summary
  getNutritionSummary: (date) => {
    return api.get('/diet/summary', { params: { date } });
  },

  // Get food suggestions
  getFoodSuggestions: (criteria) => {
    return api.post('/diet/suggestions', criteria);
  }
};