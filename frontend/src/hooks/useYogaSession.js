// src/hooks/useYogaSession.js
import { useState, useRef, useEffect } from 'react';

export const useYogaSession = () => {
  const [session, setSession] = useState({
    isActive: false,
    startTime: null,
    duration: 0,
    currentPose: null,
    completedPoses: [],
    corrections: []
  });

  const timerRef = useRef(null);

  const startSession = (pose) => {
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
  };

  const endSession = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setSession(prev => ({
      ...prev,
      isActive: false,
      endTime: new Date()
    }));
  };

  const addCorrection = (correction) => {
    setSession(prev => ({
      ...prev,
      corrections: [...prev.corrections, {
        ...correction,
        timestamp: new Date().toISOString()
      }]
    }));
  };

  const completePose = (poseName) => {
    setSession(prev => ({
      ...prev,
      completedPoses: [...prev.completedPoses, {
        name: poseName,
        duration: prev.duration,
        timestamp: new Date().toISOString()
      }]
    }));
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    session,
    startSession,
    endSession,
    addCorrection,
    completePose
  };
};