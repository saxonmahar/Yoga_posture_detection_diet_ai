// src/services/api/user.js
// Simple mock user service
export const userService = {
  getProfile: async () => {
    console.log('Mock API - Get Profile');
    await new Promise(resolve => setTimeout(resolve, 600));
    const savedUser = localStorage.getItem('yogaai-user');
    return savedUser ? JSON.parse(savedUser) : null;
  },
  
  updateProfile: async (userData) => {
    console.log('Mock API - Update Profile:', userData);
    await new Promise(resolve => setTimeout(resolve, 800));
    return userData;
  }
};