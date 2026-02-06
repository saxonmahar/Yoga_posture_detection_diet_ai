import apiClient from './api/client';

class CommunityService {
  // Get recent community activity from real users
  async getRecentActivity(limit = 10) {
    try {
      const response = await apiClient.get(`/api/community/activity?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching community activity:', error);
      return { success: false, activities: [], error: error.message };
    }
  }

  // Get top active friends/users
  async getTopFriends(limit = 5) {
    try {
      const response = await apiClient.get(`/api/community/top-friends?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching top friends:', error);
      return { success: false, topFriends: [], error: error.message };
    }
  }

  // Get user badges
  async getUserBadges(userId) {
    try {
      const response = await apiClient.get(`/api/community/badges/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user badges:', error);
      return { success: false, badges: [], error: error.message };
    }
  }
}

export default new CommunityService();
