import { useState, useRef, useEffect, useCallback } from 'react';
import { yogaService, poseService } from '../services/fitness.service.js';

export const useYoga = (userId) => {
  // Session state
  const [session, setSession] = useState({
    isActive: false,
    startTime: null,
    duration: 0,
    currentPose: null,
    completedPoses: [],
    corrections: []
  });

  // Pose detection state
  const [pose, setPose] = useState(null);
  const [landmarks, setLandmarks] = useState([]);
  const [corrections, setCorrections] = useState([]);
  const [confidence, setConfidence] = useState(0);
  const [isDetecting, setIsDetecting] = useState(false);

  // Progress state
  const [progress, setProgress] = useState({
    sessionsCompleted: 0,
    totalDuration: 0,
    posesMastered: [],
    streak: 0,
    caloriesBurned: 0
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Refs
  const timerRef = useRef(null);
  const videoRef = useRef(null);

  // Start yoga session
  const startSession = useCallback(async (pose) => {
    setLoading(true);
    setError(null);

    try {
      setSession({
        isActive: true,
        startTime: new Date(),
        duration: 0,
        currentPose: pose,
        completedPoses: [],
        corrections: []
      });

      // Start timer
      timerRef.current = setInterval(() => {
        setSession(prev => ({
          ...prev,
          duration: prev.duration + 1
        }));
      }, 1000);

      // Start pose detection if available
      if (videoRef.current) {
        await startDetection();
      }
    } catch (err) {
      setError(err.message || 'Failed to start session');
      console.error('Error starting session:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // End yoga session
  const endSession = useCallback(async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setLoading(true);
    setError(null);

    try {
      const sessionData = {
        ...session,
        endTime: new Date(),
        userId,
        caloriesBurned: Math.round(session.duration * 3.5), // Rough estimate
        accuracy: confidence
      };

      // Save session to backend
      await yogaService.saveSession(sessionData);

      // Update progress
      await updateProgress(sessionData);

      // Reset session
      setSession({
        isActive: false,
        startTime: null,
        duration: 0,
        currentPose: null,
        completedPoses: [],
        corrections: []
      });

      // Stop detection
      await stopDetection();
    } catch (err) {
      setError(err.message || 'Failed to end session');
      console.error('Error ending session:', err);
    } finally {
      setLoading(false);
    }
  }, [session, userId, confidence]);

  // Add correction to session
  const addCorrection = useCallback((correction) => {
    setSession(prev => ({
      ...prev,
      corrections: [...prev.corrections, {
        ...correction,
        timestamp: new Date().toISOString()
      }]
    }));

    setCorrections(prev => [...prev, correction]);
  }, []);

  // Complete pose
  const completePose = useCallback((poseName) => {
    setSession(prev => ({
      ...prev,
      completedPoses: [...prev.completedPoses, {
        name: poseName,
        duration: prev.duration,
        timestamp: new Date().toISOString(),
        accuracy: confidence
      }]
    }));
  }, [confidence]);

  // Start pose detection
  const startDetection = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setIsDetecting(true);
      // Pose detection logic would go here
      // For now, this is a placeholder
      console.log('Starting pose detection...');
    } catch (err) {
      setError(err.message || 'Failed to start pose detection');
      console.error('Error starting pose detection:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Stop pose detection
  const stopDetection = useCallback(async () => {
    setIsDetecting(false);
    setPose(null);
    setLandmarks([]);
    setCorrections([]);
    setConfidence(0);
  }, []);

  // Analyze pose from image
  const analyzePose = useCallback(async (imageData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await yogaService.analyzePose(imageData);

      setPose(result.pose);
      setLandmarks(result.landmarks);
      setConfidence(result.confidence);

      // Get corrections
      const correctionsResult = await yogaService.getCorrections({
        pose: result.pose,
        landmarks: result.landmarks
      });

      setCorrections(correctionsResult.corrections);

      return result;
    } catch (err) {
      setError(err.message || 'Failed to analyze pose');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get pose list
  const getPoseList = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const poses = await yogaService.getPoseList();
      return poses;
    } catch (err) {
      setError(err.message || 'Failed to get pose list');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get pose details
  const getPoseDetails = useCallback(async (poseId) => {
    setLoading(true);
    setError(null);

    try {
      const details = await yogaService.getPoseDetails(poseId);
      return details;
    } catch (err) {
      setError(err.message || 'Failed to get pose details');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get yoga history
  const getHistory = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const history = await yogaService.getHistory();
      return history;
    } catch (err) {
      setError(err.message || 'Failed to get yoga history');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update progress
  const updateProgress = useCallback(async (sessionData) => {
    try {
      const history = await getHistory();
      const sessions = history.filter(session => session.completed);

      const totalDuration = sessions.reduce((sum, session) => sum + session.duration, 0);
      const uniquePoses = [...new Set(sessions.flatMap(session => session.poses))];
      const streak = calculateStreak(sessions.map(s => s.date));

      const newProgress = {
        sessionsCompleted: sessions.length,
        totalDuration,
        posesMastered: uniquePoses,
        streak,
        caloriesBurned: Math.round(totalDuration * 3.5)
      };

      setProgress(newProgress);
      return newProgress;
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  }, [getHistory]);

  // Calculate streak
  const calculateStreak = useCallback((dates) => {
    if (dates.length === 0) return 0;

    const sortedDates = dates.map(d => new Date(d)).sort((a, b) => b - a);
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedDates.length; i++) {
      const date = new Date(sortedDates[i]);
      date.setHours(0, 0, 0, 0);

      const diffDays = Math.floor((currentDate - date) / (1000 * 60 * 60 * 24));

      if (diffDays === streak) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }, []);

  // Load progress on mount
  useEffect(() => {
    if (userId) {
      updateProgress();
    }
  }, [userId, updateProgress]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    // Session state
    session,
    pose,
    landmarks,
    corrections,
    confidence,
    isDetecting,
    progress,
    loading,
    error,

    // Session actions
    startSession,
    endSession,
    addCorrection,
    completePose,

    // Detection actions
    startDetection,
    stopDetection,
    analyzePose,

    // Data actions
    getPoseList,
    getPoseDetails,
    getHistory,
    updateProgress,

    // Refs
    videoRef,

    // Computed values
    sessionDuration: session.duration,
    totalSessions: progress.sessionsCompleted,
    totalDuration: progress.totalDuration,
    currentStreak: progress.streak,
    totalCaloriesBurned: progress.caloriesBurned,
    masteredPoses: progress.posesMastered.length,

    // Helper functions
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
