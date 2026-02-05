const API_BASE_URL = 'http://localhost:5001/api/ranking';

class RankingService {
  // Get yoga session rankings (leaderboard)
  async getLeaderboard() {
    try {
      const response = await fetch(`${API_BASE_URL}/leaderboard`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch leaderboard');
      }

      return result;
    } catch (error) {
      console.error('Leaderboard fetch error:', error);
      throw error;
    }
  }

  // Get user's personal ranking
  async getUserRanking() {
    try {
      const response = await fetch(`${API_BASE_URL}/my-rank`, {
        method: 'GET',
        credentials: 'include'
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch user ranking');
      }

      return result;
    } catch (error) {
      console.error('User ranking fetch error:', error);
      throw error;
    }
  }

  // Get leaderboard statistics
  async getLeaderboardStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch leaderboard stats');
      }

      return result;
    } catch (error) {
      console.error('Leaderboard stats fetch error:', error);
      throw error;
    }
  }
}

export default new RankingService();