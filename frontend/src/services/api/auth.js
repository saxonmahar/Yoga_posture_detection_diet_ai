// src/services/api/auth.js
// Simple mock auth service
export const authService = {
  login: async (email, password) => {
    console.log('Mock API Auth - Login:', email);
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      success: true,
      user: {
        id: '1',
        name: email.split('@')[0] || 'User',
        email,
        isPremium: false
      },
      token: 'mock-token'
    };
  },
  
  register: async (userData) => {
    console.log('Mock API Auth - Register:', userData);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      user: {
        id: 'new-' + Date.now(),
        ...userData,
        isPremium: false
      },
      token: 'mock-token'
    };
  }
};