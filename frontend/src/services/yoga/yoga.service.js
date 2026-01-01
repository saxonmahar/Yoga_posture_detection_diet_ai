import apiClient from '../api/client.js';

export const yogaService = {
  // Analyze yoga pose from image
  analyzePose: (imageData) => {
    const formData = new FormData();
    formData.append('image', imageData);
    
    return apiClient.post('/api/yoga/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // Get pose corrections
  getCorrections: (poseData) => {
    return apiClient.post('/api/yoga/corrections', poseData);
  },

  // Get list of yoga poses
  getPoseList: () => {
    return apiClient.get('/api/yoga/poses');
  },

  // Get pose details
  getPoseDetails: (poseId) => {
    return apiClient.get(`/api/yoga/poses/${poseId}`);
  },

  // Save yoga session
  saveSession: (sessionData) => {
    return apiClient.post('/pose/sessions', sessionData);
  },

  // Get user's yoga history
  getHistory: () => {
    return apiClient.get('/api/yoga/history');
  }
};