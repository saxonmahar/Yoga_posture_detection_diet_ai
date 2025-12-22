import { useState, useEffect, useCallback } from 'react';

export const useProgress = (userId, yogaProgress, dietProgress) => {
  const [overallProgress, setOverallProgress] = useState({
    score: 0,
    level: 1,
    achievements: [],
    lastUpdated: null
  });

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate overall progress
  const calculateOverallProgress = useCallback(() => {
    if (!yogaProgress || !dietProgress) return;

    const yogaScore = Math.min(yogaProgress.sessionsCompleted * 10, 50);
    const dietScore = Math.min(dietProgress.daysFollowed * 5, 30);
    const streakBonus = yogaProgress.streak * 2;
    const achievementBonus = overallProgress.achievements.length * 5;

    const totalScore = yogaScore + dietScore + streakBonus + achievementBonus;
    const level = Math.floor(totalScore / 100) + 1;

    setOverallProgress({
      score: totalScore,
      level,
      achievements: overallProgress.achievements,
      lastUpdated: new Date().toISOString()
    });
  }, [yogaProgress, dietProgress, overallProgress.achievements]);

  // Load achievements
  const loadAchievements = useCallback(async () => {
    if (!yogaProgress || !dietProgress) return;

    const allAchievements = [
      {
        id: 'yoga_beginner',
        name: 'Yoga Beginner',
        description: 'Complete your first yoga session',
        icon: '🧘',
        unlocked: yogaProgress.sessionsCompleted >= 1
      },
      {
        id: 'yoga_enthusiast',
        name: 'Yoga Enthusiast',
        description: 'Complete 10 yoga sessions',
        icon: '🌟',
        unlocked: yogaProgress.sessionsCompleted >= 10
      },
      {
        id: 'yoga_master',
        name: 'Yoga Master',
        description: 'Complete 50 yoga sessions',
        icon: '👑',
        unlocked: yogaProgress.sessionsCompleted >= 50
      },
      {
        id: 'pose_explorer',
        name: 'Pose Explorer',
        description: 'Try 10 different yoga poses',
        icon: '🔍',
        unlocked: yogaProgress.posesMastered.length >= 10
      },
      {
        id: 'diet_starter',
        name: 'Diet Starter',
        description: 'Track meals for 7 days',
        icon: '🥗',
        unlocked: dietProgress.daysFollowed >= 7
      },
      {
        id: 'healthy_eater',
        name: 'Healthy Eater',
        description: 'Track meals for 30 days',
        icon: '🥇',
        unlocked: dietProgress.daysFollowed >= 30
      },
      {
        id: 'hydration_hero',
        name: 'Hydration Hero',
        description: 'Drink 2L water daily for a week',
        icon: '💧',
        unlocked: dietProgress.waterIntake >= 14 // 2L * 7 days
      },
      {
        id: 'streak_master',
        name: 'Streak Master',
        description: 'Maintain a 7-day yoga streak',
        icon: '🔥',
        unlocked: yogaProgress.streak >= 7
      },
      {
        id: 'calorie_warrior',
        name: 'Calorie Warrior',
        description: 'Achieve 5000 calorie deficit',
        icon: '⚔️',
        unlocked: dietProgress.calorieDeficit >= 5000
      },
      {
        id: 'balanced_life',
        name: 'Balanced Life',
        description: 'Complete both yoga and diet for 30 days',
        icon: '⚖️',
        unlocked: yogaProgress.sessionsCompleted >= 30 && dietProgress.daysFollowed >= 30
      }
    ];

    const unlockedAchievements = allAchievements.filter(achievement => achievement.unlocked);
    setOverallProgress(prev => ({
      ...prev,
      achievements: unlockedAchievements
    }));

    return unlockedAchievements;
  }, [yogaProgress, dietProgress]);

  // Record progress event
  const recordProgress = useCallback(async (type, data) => {
    setLoading(true);
    setError(null);

    try {
      const progressEvent = {
        type,
        data,
        timestamp: new Date().toISOString(),
        userId
      };

      // Add to history
      setHistory(prev => [progressEvent, ...prev]);

      // Recalculate achievements and overall progress
      await loadAchievements();
      calculateOverallProgress();

      return progressEvent;
    } catch (err) {
      setError(err.message || 'Failed to record progress');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, loadAchievements, calculateOverallProgress]);

  // Get progress trends
  const getTrends = useCallback((period = 'week') => {
    const now = new Date();
    let startDate;

    switch (period) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 7));
    }

    const periodHistory = history.filter(item =>
      new Date(item.timestamp) >= startDate
    );

    return {
      yogaSessions: periodHistory.filter(item => item.type === 'yoga_session').length,
      mealsTracked: periodHistory.filter(item => item.type === 'meal_tracked').length,
      totalEvents: periodHistory.length
    };
  }, [history]);

  // Reset progress
  const resetProgress = useCallback(async () => {
    if (!window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      setOverallProgress({
        score: 0,
        level: 1,
        achievements: [],
        lastUpdated: null
      });

      setHistory([]);

      console.log('Progress reset successfully');
    } catch (err) {
      setError(err.message || 'Failed to reset progress');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Recalculate when progress changes
  useEffect(() => {
    calculateOverallProgress();
  }, [calculateOverallProgress]);

  // Load achievements when progress changes
  useEffect(() => {
    if (yogaProgress && dietProgress) {
      loadAchievements();
    }
  }, [yogaProgress, dietProgress, loadAchievements]);

  return {
    // State
    overallProgress,
    history,
    loading,
    error,

    // Actions
    recordProgress,
    getTrends,
    resetProgress,

    // Computed values
    totalScore: overallProgress.score,
    level: overallProgress.level,
    nextLevelScore: overallProgress.level * 100,
    progressToNextLevel: (overallProgress.score % 100),

    // Achievement helpers
    hasAchievement: (achievementId) =>
      overallProgress.achievements.some(achievement => achievement.id === achievementId),

    // Formatting helpers
    formatDuration: (seconds) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    },

    formatCalories: (calories) => {
      if (calories >= 1000) {
        return `${(calories / 1000).toFixed(1)}k`;
      }
      return calories.toString();
    }
  };
};
