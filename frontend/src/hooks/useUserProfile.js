// src/hooks/useUserProfile.js
import { useState, useEffect } from 'react';

export const useUserProfile = () => {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('yogaDietProfile');
    return saved ? JSON.parse(saved) : {
      name: '',
      age: 25,
      weight: 70, // kg
      height: 170, // cm
      gender: 'male',
      activityLevel: 'moderate', // sedentary, light, moderate, active, veryActive
      goal: 'maintenance', // weightLoss, maintenance, muscleGain
      yogaExperience: 'beginner', // beginner, intermediate, advanced
      dietaryRestrictions: [],
      fitnessGoals: []
    };
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('yogaDietProfile', JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (updates) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const calculateBMI = () => {
    const heightInMeters = profile.height / 100;
    return profile.weight / (heightInMeters * heightInMeters);
  };

  const getBMICategory = () => {
    const bmi = calculateBMI();
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  const addDietaryRestriction = (restriction) => {
    if (!profile.dietaryRestrictions.includes(restriction)) {
      setProfile(prev => ({
        ...prev,
        dietaryRestrictions: [...prev.dietaryRestrictions, restriction]
      }));
    }
  };

  const removeDietaryRestriction = (restriction) => {
    setProfile(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.filter(r => r !== restriction)
    }));
  };

  const addFitnessGoal = (goal) => {
    if (!profile.fitnessGoals.includes(goal)) {
      setProfile(prev => ({
        ...prev,
        fitnessGoals: [...prev.fitnessGoals, goal]
      }));
    }
  };

  return {
    profile,
    updateProfile,
    calculateBMI,
    getBMICategory,
    addDietaryRestriction,
    removeDietaryRestriction,
    addFitnessGoal,
    isLoading,
    error
  };
};