import api from './client';

export const scheduleAPI = {
  // Get user's schedule for a date range
  getSchedule: async (params = {}) => {
    try {
      const response = await api.get('/api/schedule', { params });
      return response.data;
    } catch (error) {
      console.error('Get schedule error:', error);
      throw error.response?.data || error;
    }
  },

  // Create a new scheduled session
  createSession: async (sessionData) => {
    try {
      const response = await api.post('/api/schedule', sessionData);
      return response.data;
    } catch (error) {
      console.error('Create session error:', error);
      throw error.response?.data || error;
    }
  },

  // Update an existing session
  updateSession: async (sessionId, updates) => {
    try {
      const response = await api.put(`/api/schedule/${sessionId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Update session error:', error);
      throw error.response?.data || error;
    }
  },

  // Mark session as completed
  completeSession: async (sessionId, completionData) => {
    try {
      const response = await api.patch(`/api/schedule/${sessionId}/complete`, completionData);
      return response.data;
    } catch (error) {
      console.error('Complete session error:', error);
      throw error.response?.data || error;
    }
  },

  // Delete a session
  deleteSession: async (sessionId) => {
    try {
      const response = await api.delete(`/api/schedule/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Delete session error:', error);
      throw error.response?.data || error;
    }
  },

  // Get schedule templates
  getTemplates: async () => {
    try {
      const response = await api.get('/api/schedule/templates');
      return response.data;
    } catch (error) {
      console.error('Get templates error:', error);
      throw error.response?.data || error;
    }
  },

  // Apply a schedule template
  applyTemplate: async (templateData) => {
    try {
      const response = await api.post('/api/schedule/templates/apply', templateData);
      return response.data;
    } catch (error) {
      console.error('Apply template error:', error);
      throw error.response?.data || error;
    }
  },

  // Get today's sessions
  getTodaySessions: async () => {
    try {
      const today = new Date();
      const startDate = today.toISOString().split('T')[0];
      const endDate = startDate;
      
      const response = await api.get('/api/schedule', {
        params: { startDate, endDate }
      });
      
      return response.data;
    } catch (error) {
      console.error('Get today sessions error:', error);
      throw error.response?.data || error;
    }
  },

  // Get upcoming sessions
  getUpcomingSessions: async (limit = 5) => {
    try {
      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + 30); // Next 30 days
      
      const response = await api.get('/api/schedule', {
        params: {
          startDate: today.toISOString().split('T')[0],
          endDate: futureDate.toISOString().split('T')[0],
          limit
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Get upcoming sessions error:', error);
      throw error.response?.data || error;
    }
  },

  // Get schedule statistics
  getStats: async (period = 'month') => {
    try {
      const response = await api.get('/api/schedule/stats', {
        params: { period }
      });
      return response.data;
    } catch (error) {
      console.error('Get schedule stats error:', error);
      throw error.response?.data || error;
    }
  }
};

export default scheduleAPI;