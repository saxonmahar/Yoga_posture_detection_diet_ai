// Additional interceptors can be added here
export const setupInterceptors = (apiClient) => {
  // Request interceptor
  apiClient.interceptors.request.use(
    (config) => {
      // Add auth token to every request if available
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Add other default headers
      config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json';
      config.headers['Accept'] = 'application/json';
      
      console.log('Request:', config.method?.toUpperCase(), config.url);
      return config;
    },
    (error) => {
      console.error('Request Error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  apiClient.interceptors.response.use(
    (response) => {
      console.log('Response:', response.status, response.config.url);
      return response;
    },
    (error) => {
      console.error('Response Error:', error.response?.status, error.config?.url);
      
      // Handle specific error codes
      if (error.response) {
        switch (error.response.status) {
          case 401:
            // Unauthorized - clear tokens and redirect to login
            localStorage.removeItem('authToken');
            localStorage.removeItem('yogaai-user');
            window.location.href = '/login';
            break;
            
          case 403:
            // Forbidden - user doesn't have permission
            console.warn('Access forbidden');
            break;
            
          case 404:
            // Not found
            console.warn('Resource not found');
            break;
            
          case 500:
            // Server error
            console.error('Server error occurred');
            break;
            
          default:
            console.error('API Error:', error.response.status);
        }
      } else if (error.request) {
        // Network error
        console.error('Network Error:', error.message);
      } else {
        // Other errors
        console.error('Error:', error.message);
      }
      
      return Promise.reject(error);
    }
  );

  return apiClient;
};