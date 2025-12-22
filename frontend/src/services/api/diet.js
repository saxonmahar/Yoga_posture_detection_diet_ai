// src/services/api/diet.js
// Simple mock diet service
export const dietService = {
  getPlan: async () => {
    console.log('Mock API - Get Diet Plan');
    await new Promise(resolve => setTimeout(resolve, 700));
    return {
      plan: {
        calories: 2000,
        protein: 120,
        carbs: 200,
        fat: 65
      }
    };
  }
};