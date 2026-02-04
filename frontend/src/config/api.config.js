// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5001',
  ML_API_URL: import.meta.env.VITE_ML_API_URL || 'http://localhost:5000',
  DIET_API_URL: import.meta.env.VITE_DIET_API_URL || 'http://localhost:5002',
  TIMEOUT: 10000,
  
  // API Endpoints
  ENDPOINTS: {
    // Auth endpoints
    AUTH: {
      REGISTER: '/api/auth/register',
      LOGIN: '/api/auth/login',
      LOGOUT: '/api/auth/logout',
      ME: '/api/auth/me'
    },
    
    // Email endpoints
    EMAIL: {
      VERIFY: '/api/email/verify',
      RESEND: '/api/email/resend'
    },
    
    // Password endpoints
    PASSWORD: {
      FORGOT: '/api/password/forgot',
      VERIFY: '/api/password/verify',
      RESET: '/api/password/reset'
    },
    
    // Photo endpoints
    PHOTO: {
      UPLOAD: '/api/photo/upload',
      DELETE: '/api/photo/delete',
      PROFILE: '/api/photo/profile'
    },
    
    // Pose endpoints
    POSE: {
      DETECT: '/api/pose/detect',
      SAVE_SESSION: '/api/pose/save-session'
    },
    
    // Diet endpoints
    DIET: {
      RECOMMENDATIONS: '/api/diet/recommendations',
      MEAL_PLAN: '/api/diet/meal-plan'
    },
    
    // Analytics endpoints
    ANALYTICS: {
      USER_STATS: '/api/analytics/user',
      PROGRESS: '/api/analytics/progress'
    },
    
    // Schedule endpoints
    SCHEDULE: {
      GET: '/api/schedule',
      CREATE: '/api/schedule',
      UPDATE: '/api/schedule',
      DELETE: '/api/schedule'
    }
  }
};

export default API_CONFIG;