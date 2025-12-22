// src/hooks/useWorkoutSchedule.js
import { useState, useEffect } from 'react';

export const useWorkoutSchedule = () => {
  const [schedule, setSchedule] = useState(() => {
    const saved = localStorage.getItem('yogaSchedule');
    return saved ? JSON.parse(saved) : {
      weeklyPlan: {
        monday: { yoga: [], diet: null },
        tuesday: { yoga: [], diet: null },
        wednesday: { yoga: [], diet: null },
        thursday: { yoga: [], diet: null },
        friday: { yoga: [], diet: null },
        saturday: { yoga: [], diet: null },
        sunday: { yoga: [], diet: null }
      },
      reminders: [],
      completedSessions: []
    };
  });

  const addYogaSession = (day, session) => {
    setSchedule(prev => ({
      ...prev,
      weeklyPlan: {
        ...prev.weeklyPlan,
        [day]: {
          ...prev.weeklyPlan[day],
          yoga: [...prev.weeklyPlan[day].yoga, session]
        }
      }
    }));
  };

  const setDietPlan = (day, dietPlan) => {
    setSchedule(prev => ({
      ...prev,
      weeklyPlan: {
        ...prev.weeklyPlan,
        [day]: {
          ...prev.weeklyPlan[day],
          diet: dietPlan
        }
      }
    }));
  };

  const markSessionComplete = (day, sessionId, feedback) => {
    setSchedule(prev => ({
      ...prev,
      completedSessions: [...prev.completedSessions, {
        day,
        sessionId,
        date: new Date().toISOString(),
        feedback
      }]
    }));
  };

  const addReminder = (reminder) => {
    setSchedule(prev => ({
      ...prev,
      reminders: [...prev.reminders, {
        ...reminder,
        id: Date.now(),
        isActive: true
      }]
    }));
  };

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('yogaSchedule', JSON.stringify(schedule));
  }, [schedule]);

  return {
    schedule,
    addYogaSession,
    setDietPlan,
    markSessionComplete,
    addReminder,
    setSchedule
  };
};