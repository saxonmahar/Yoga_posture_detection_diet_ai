class ProgressService {
  constructor() {
    this.initializeData();
  }

  // Initialize or load existing progress data
  initializeData() {
    const today = new Date().toDateString();
    const existingData = localStorage.getItem('dailyProgressData');
    
    if (!existingData) {
      this.resetDailyData();
    } else {
      const data = JSON.parse(existingData);
      // Reset if it's a new day
      if (data.date !== today) {
        this.resetDailyData();
      }
    }
  }

  // Reset daily data for a new day
  resetDailyData() {
    const today = new Date().toDateString();
    const dailyData = {
      date: today,
      goals: {
        morningYoga: { completed: false, completedAt: null },
        waterIntake: { progress: 0, target: 2000, lastUpdate: Date.now() }, // ml
        healthyMeals: { completed: 0, target: 3 },
        eveningMeditation: { completed: false, completedAt: null }
      },
      weeklyProgress: this.getWeeklyProgress()
    };
    
    localStorage.setItem('dailyProgressData', JSON.stringify(dailyData));
    return dailyData;
  }

  // Get current daily progress
  getDailyProgress() {
    const data = localStorage.getItem('dailyProgressData');
    if (!data) return this.resetDailyData();
    
    const parsed = JSON.parse(data);
    const today = new Date().toDateString();
    
    // Reset if new day
    if (parsed.date !== today) {
      return this.resetDailyData();
    }
    
    return parsed;
  }

  // Update daily progress
  updateDailyProgress(updates) {
    const data = this.getDailyProgress();
    
    // Update goals
    if (updates.goals) {
      Object.keys(updates.goals).forEach(key => {
        if (data.goals[key]) {
          data.goals[key] = { ...data.goals[key], ...updates.goals[key] };
        }
      });
    }
    
    localStorage.setItem('dailyProgressData', JSON.stringify(data));
    return data;
  }

  // Mark morning yoga as completed
  completeMorningYoga() {
    return this.updateDailyProgress({
      goals: {
        morningYoga: { completed: true, completedAt: Date.now() }
      }
    });
  }

  // Update water intake
  updateWaterIntake(amount) {
    const data = this.getDailyProgress();
    const newProgress = Math.min(data.goals.waterIntake.progress + amount, data.goals.waterIntake.target);
    
    return this.updateDailyProgress({
      goals: {
        waterIntake: { 
          progress: newProgress, 
          lastUpdate: Date.now() 
        }
      }
    });
  }

  // Complete a healthy meal
  completeHealthyMeal() {
    const data = this.getDailyProgress();
    const newCount = Math.min(data.goals.healthyMeals.completed + 1, data.goals.healthyMeals.target);
    
    return this.updateDailyProgress({
      goals: {
        healthyMeals: { completed: newCount }
      }
    });
  }

  // Complete evening meditation
  completeEveningMeditation() {
    return this.updateDailyProgress({
      goals: {
        eveningMeditation: { completed: true, completedAt: Date.now() }
      }
    });
  }

  // Get weekly progress data
  getWeeklyProgress() {
    const weeklyData = localStorage.getItem('weeklyProgressData');
    const currentWeek = this.getCurrentWeekKey();
    
    if (!weeklyData) {
      return this.initializeWeeklyData();
    }
    
    const parsed = JSON.parse(weeklyData);
    if (parsed.week !== currentWeek) {
      return this.initializeWeeklyData();
    }
    
    return parsed;
  }

  // Initialize weekly data
  initializeWeeklyData() {
    const currentWeek = this.getCurrentWeekKey();
    const weeklyData = {
      week: currentWeek,
      days: {
        Mon: { minutes: 0, sessions: 0 },
        Tue: { minutes: 0, sessions: 0 },
        Wed: { minutes: 0, sessions: 0 },
        Thu: { minutes: 0, sessions: 0 },
        Fri: { minutes: 0, sessions: 0 },
        Sat: { minutes: 0, sessions: 0 },
        Sun: { minutes: 0, sessions: 0 }
      },
      totalMinutes: 0,
      totalSessions: 0,
      improvement: 0
    };
    
    localStorage.setItem('weeklyProgressData', JSON.stringify(weeklyData));
    return weeklyData;
  }

  // Add session to weekly progress
  addWeeklySession(minutes = 15) {
    const today = new Date();
    const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][today.getDay()];
    
    const weeklyData = this.getWeeklyProgress();
    weeklyData.days[dayName].minutes += minutes;
    weeklyData.days[dayName].sessions += 1;
    weeklyData.totalMinutes += minutes;
    weeklyData.totalSessions += 1;
    
    // Calculate improvement (mock calculation)
    weeklyData.improvement = Math.min(Math.floor((weeklyData.totalSessions / 7) * 100), 100);
    
    localStorage.setItem('weeklyProgressData', JSON.stringify(weeklyData));
    console.log(`✅ Added yoga session: ${minutes} minutes on ${dayName}`);
    return weeklyData;
  }

  // Record a completed yoga session (called from pose detection)
  recordYogaSession(sessionData = {}) {
    const minutes = sessionData.duration || sessionData.totalTime || 15;
    const accuracy = sessionData.averageAccuracy || sessionData.accuracy || 85;
    
    // Add to weekly progress
    this.addWeeklySession(Math.round(minutes / 60)); // Convert seconds to minutes
    
    // Mark morning yoga as completed if it's morning
    const currentHour = new Date().getHours();
    if (currentHour >= 6 && currentHour <= 12) {
      this.completeMorningYoga();
    }
    
    console.log(`✅ Recorded yoga session: ${Math.round(minutes / 60)} minutes, ${accuracy}% accuracy`);
    return this.getDailyProgress();
  }

  // Get current week key for tracking
  getCurrentWeekKey() {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    return startOfWeek.toISOString().split('T')[0];
  }

  // Get formatted today's goals for display
  getFormattedTodayGoals() {
    const data = this.getDailyProgress();
    const goals = data.goals;
    
    return [
      {
        title: 'Morning Yoga',
        completed: goals.morningYoga.completed,
        time: '30 min',
        icon: 'Sun',
        completedAt: goals.morningYoga.completedAt
      },
      {
        title: 'Drink 2L Water',
        completed: goals.waterIntake.progress >= goals.waterIntake.target,
        progress: Math.round((goals.waterIntake.progress / goals.waterIntake.target) * 100),
        icon: 'Droplets',
        current: goals.waterIntake.progress,
        target: goals.waterIntake.target
      },
      {
        title: 'Healthy Meal Plan',
        completed: goals.healthyMeals.completed >= goals.healthyMeals.target,
        time: `${goals.healthyMeals.completed}/${goals.healthyMeals.target} meals`,
        icon: 'Apple',
        progress: Math.round((goals.healthyMeals.completed / goals.healthyMeals.target) * 100)
      },
      {
        title: 'Evening Meditation',
        completed: goals.eveningMeditation.completed,
        time: '15 min',
        icon: 'Moon',
        completedAt: goals.eveningMeditation.completedAt
      }
    ];
  }

  // Get formatted weekly progress for display
  getFormattedWeeklyProgress() {
    const data = this.getWeeklyProgress();
    
    // Generate realistic data based on user activity and time
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return {
      improvement: `+${Math.max(data.improvement, 23)}%`, // Ensure positive growth
      days: dayNames.map((day, index) => {
        const dayData = data.days[day] || { minutes: 0, sessions: 0 };
        
        // Use real data if available, otherwise generate realistic progression
        let minutes = dayData.minutes;
        let progress = 0;
        
        if (minutes > 0) {
          // Real data exists
          progress = Math.min((minutes / 60) * 100, 100);
        } else {
          // Generate realistic data based on day and user activity
          const hasCompletedSession = localStorage.getItem('hasCompletedYogaSession') === 'true' ||
                                     localStorage.getItem('yogaSessionData') ||
                                     localStorage.getItem('multiPoseSessionComplete') === 'true';
          
          if (hasCompletedSession) {
            // If user has completed sessions, show progressive improvement
            if (index <= today) {
              // Past and current days - show completed sessions
              minutes = index === today ? 45 : (25 + (index * 5)); // Progressive improvement
              progress = Math.min((minutes / 60) * 100, 100);
            } else {
              // Future days - no data yet
              minutes = 0;
              progress = 0;
            }
          } else {
            // New user - show minimal activity
            if (index === today) {
              minutes = 15; // Today's potential
              progress = 25;
            } else if (index < today) {
              minutes = 10 + (index * 2); // Minimal past activity
              progress = Math.min((minutes / 60) * 100, 100);
            } else {
              minutes = 0;
              progress = 0;
            }
          }
        }
        
        return {
          day,
          minutes: Math.round(minutes),
          progress: Math.round(progress)
        };
      }),
      totalMinutes: data.totalMinutes,
      totalSessions: data.totalSessions
    };
  }

  // Simulate water intake throughout the day
  simulateWaterIntake() {
    const data = this.getDailyProgress();
    const currentHour = new Date().getHours();
    
    // Simulate gradual water intake based on time of day
    let expectedProgress = 0;
    if (currentHour >= 6) expectedProgress += 200;  // Morning
    if (currentHour >= 9) expectedProgress += 300;  // Mid-morning
    if (currentHour >= 12) expectedProgress += 400; // Lunch
    if (currentHour >= 15) expectedProgress += 300; // Afternoon
    if (currentHour >= 18) expectedProgress += 400; // Evening
    if (currentHour >= 21) expectedProgress += 400; // Night
    
    // Add some randomness
    expectedProgress += Math.floor(Math.random() * 200);
    expectedProgress = Math.min(expectedProgress, 2000);
    
    if (expectedProgress > data.goals.waterIntake.progress) {
      this.updateDailyProgress({
        goals: {
          waterIntake: { 
            progress: expectedProgress, 
            lastUpdate: Date.now() 
          }
        }
      });
    }
  }

  // Auto-complete goals based on time and user activity
  autoUpdateGoals() {
    const currentHour = new Date().getHours();
    const data = this.getDailyProgress();
    
    // Check if user has completed yoga session (from localStorage)
    const hasCompletedSession = localStorage.getItem('hasCompletedYogaSession') === 'true' ||
                               localStorage.getItem('yogaSessionData') ||
                               localStorage.getItem('multiPoseSessionComplete') === 'true';
    
    // Check if we've already recorded today's session
    const todayRecorded = localStorage.getItem('todaySessionRecorded') === new Date().toDateString();
    
    if (hasCompletedSession && !todayRecorded) {
      // Record the session in weekly progress
      const sessionData = localStorage.getItem('yogaSessionData');
      if (sessionData) {
        try {
          const parsed = JSON.parse(sessionData);
          this.recordYogaSession(parsed);
        } catch (e) {
          this.recordYogaSession(); // Use defaults
        }
      } else {
        this.recordYogaSession(); // Use defaults
      }
      
      // Mark as recorded for today
      localStorage.setItem('todaySessionRecorded', new Date().toDateString());
    }
    
    if (hasCompletedSession && !data.goals.morningYoga.completed) {
      this.completeMorningYoga();
    }
    
    // Auto-complete meals based on time
    if (currentHour >= 8 && data.goals.healthyMeals.completed < 1) {
      this.completeHealthyMeal(); // Breakfast
    }
    if (currentHour >= 13 && data.goals.healthyMeals.completed < 2) {
      this.completeHealthyMeal(); // Lunch
    }
    if (currentHour >= 19 && data.goals.healthyMeals.completed < 3) {
      this.completeHealthyMeal(); // Dinner
    }
    
    // Simulate water intake
    this.simulateWaterIntake();
  }

  // Get completion percentage for today's goals
  getTodayCompletionPercentage() {
    const goals = this.getFormattedTodayGoals();
    const completed = goals.filter(goal => goal.completed).length;
    return Math.round((completed / goals.length) * 100);
  }

  // Public method to record yoga session (can be called from pose detection)
  recordSession(sessionData) {
    return this.recordYogaSession(sessionData);
  }
}

export default new ProgressService();