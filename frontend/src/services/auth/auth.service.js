// src/services/auth/auth.service.js - Standalone version (FIXED)

// Mock data for development
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

// Mock API calls with delay
const simulateAPI = (data, delay = 800) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), delay);
  });
};

export const authService = {
  // Mock login
  login: async (email, password) => {
    console.log('Auth Service - Login:', email);
    
    // Validate input
    if (!email || !password) {
      throw { message: 'Email and password are required' };
    }
    
    // Simulate API call
    return await simulateAPI({
      success: true,
      user: {
        ...mockUser,
        email,
        name: email.split('@')[0] || 'User'
      },
      token: 'mock-jwt-token-' + Date.now()
    }, 1000);
  },

  // Mock registration
  register: async (userData) => {
    console.log('Auth Service - Register:', userData);
    
    if (!userData.email || !userData.password) {
      throw { message: 'Email and password are required' };
    }
    
    return await simulateAPI({
      success: true,
      user: {
        ...mockUser,
        ...userData,
        id: 'new-' + Date.now(),
        isPremium: false,
        stats: {
          totalWorkouts: 0,
          totalCaloriesBurned: 0,
          currentStreak: 0,
          averageAccuracy: 0,
          goal: userData.goal || 'weight-loss',
          activityLevel: userData.activityLevel || 'moderate',
          weight: userData.weight || 70,
          height: userData.height || 175,
          age: userData.age || 25
        }
      },
      token: 'mock-jwt-token-' + Date.now()
    }, 1200);
  },

  // Mock logout
  logout: async () => {
    console.log('Auth Service - Logout');
    return await simulateAPI({ success: true }, 500);
  },

  // Mock token verification
  verifyToken: async (token) => {
    console.log('Auth Service - Verify Token');
    
    if (!token) {
      throw { message: 'No token provided' };
    }
    
    return await simulateAPI({
      success: true,
      user: mockUser
    }, 600);
  },

  // Mock password reset
  resetPassword: async (email) => {
    console.log('Auth Service - Reset Password:', email);
    
    if (!email) {
      throw { message: 'Email is required' };
    }
    
    return await simulateAPI({
      success: true,
      message: 'Password reset email sent'
    }, 800);
  }
};

export default authService;