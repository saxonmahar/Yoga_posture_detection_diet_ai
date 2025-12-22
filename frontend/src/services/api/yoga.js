// src/services/api/yoga.js
// Simple mock yoga service
export const yogaService = {
  getSessions: async () => {
    console.log('Mock API - Get Yoga Sessions');
    await new Promise(resolve => setTimeout(resolve, 700));
    return {
      sessions: [
        { id: '1', name: 'Morning Flow', duration: '15 min', difficulty: 'Beginner' },
        { id: '2', name: 'Power Yoga', duration: '30 min', difficulty: 'Intermediate' }
      ]
    };
  }
};