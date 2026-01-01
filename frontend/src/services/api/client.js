// src/services/api/client.js
import axios from 'axios';

// In Vite, use import.meta.env instead of process.env
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Important: Send cookies (httpOnly tokens) with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - cookies are sent automatically with withCredentials: true
apiClient.interceptors.request.use(
  (config) => {
    // Cookies are automatically sent with withCredentials: true
    // No need to manually add tokens from localStorage
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear any stored user data and redirect to login on 401
      localStorage.removeItem('yogaai-user');
      // Don't redirect immediately - let the ProtectedRoute handle it
      // This prevents infinite redirect loops
    }
    return Promise.reject(error);
  }
);

export default apiClient;