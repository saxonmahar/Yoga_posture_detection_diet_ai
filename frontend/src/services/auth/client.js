// src/services/auth/client.js

// Create a simple mock API client
const createMockClient = () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    isPremium: false,
    stats: {
      totalWorkouts: 12,
      totalCaloriesBurned: 1250,
      currentStreak: 7,
      averageAccuracy: 87,
      goal: 'weight-loss',
      activityLevel: 'active',
      weight: 70,
      height: 175,
      age: 28
    }
  };

  const mockToken = 'mock-jwt-token-' + Date.now();

  return {
    post: async (url, data) => {
      console.log('Mock API POST:', url, data);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Handle different endpoints
      if (url === '/auth/login') {
        return {
          data: {
            success: true,
            user: mockUser,
            token: mockToken
          }
        };
      }
      
      if (url === '/auth/register') {
        return {
          data: {
            success: true,
            user: {
              ...mockUser,
              ...data,
              id: 'new-' + Date.now(),
              isPremium: false
            },
            token: mockToken
          }
        };
      }
      
      return { data: { success: true } };
    },
    
    get: async (url) => {
      console.log('Mock API GET:', url);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (url === '/auth/verify') {
        return {
          data: {
            success: true,
            user: mockUser
          }
        };
      }
      
      return { data: { success: true } };
    }
  };
};

const apiClient = createMockClient();
export default apiClient;