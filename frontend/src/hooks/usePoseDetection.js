import { useState, useRef, useCallback, useEffect } from 'react';
import { yogaService, poseService } from '../services';

export const usePoseDetection = () => {
  const [pose, setPose] = useState(null);
  const [landmarks, setLandmarks] = useState([]);
  const [corrections, setCorrections] = useState([]);
  const [confidence, setConfidence] = useState(0);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [sessionStats, setSessionStats] = useState({
    startTime: null,
    duration: 0,
    posesDetected: [],
    totalCorrections: 0
  });

  const detectionInterval = useRef(null);
  const sessionTimer = useRef(null);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // Start pose detection session
  const startDetection = useCallback(() => {
    if (isDetecting) return;
    
    setIsDetecting(true);
    setError(null);
    setSessionStats({
      startTime: new Date(),
      duration: 0,
      posesDetected: [],
      totalCorrections: 0
    });

    // Start session timer
    sessionTimer.current = setInterval(() => {
      setSessionStats(prev => ({
        ...prev,
        duration: prev.duration + 1
      }));
    }, 1000);

    // Start detection loop
    detectionInterval.current = setInterval(() => {
      if (webcamRef.current && canvasRef.current) {
        detectPoseFromWebcam();
      }
    }, 100);
  }, [isDetecting]);

  // Stop pose detection
  const stopDetection = useCallback(() => {
    if (detectionInterval.current) {
      clearInterval(detectionInterval.current);
      detectionInterval.current = null;
    }
    
    if (sessionTimer.current) {
      clearInterval(sessionTimer.current);
      sessionTimer.current = null;
    }
    
    setIsDetecting(false);
    
    // Save session if it lasted more than 30 seconds
    if (sessionStats.duration > 30) {
      saveSession();
    }
  }, [sessionStats.duration]);

  // Detect pose from webcam
  const detectPoseFromWebcam = useCallback(async () => {
    if (!webcamRef.current || !canvasRef.current) return;
    
    try {
      const video = webcamRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Get image data from canvas
      const imageData = canvas.toDataURL('image/jpeg');
      
      // Analyze pose (simulate detection for now)
      const detectedPose = simulatePoseDetection();
      
      if (detectedPose) {
        setPose(detectedPose.name);
        setConfidence(detectedPose.confidence);
        setLandmarks(detectedPose.landmarks);
        
        // Get corrections
        const poseCorrections = poseService.getCorrections(detectedPose.landmarks);
        setCorrections(poseCorrections);
        
        // Update session stats
        if (detectedPose.confidence > 0.7) {
          setSessionStats(prev => {
            const poses = [...prev.posesDetected];
            const existingPoseIndex = poses.findIndex(p => p.name === detectedPose.name);
            
            if (existingPoseIndex >= 0) {
              poses[existingPoseIndex].count++;
              poses[existingPoseIndex].totalConfidence += detectedPose.confidence;
              poses[existingPoseIndex].averageConfidence = 
                poses[existingPoseIndex].totalConfidence / poses[existingPoseIndex].count;
            } else {
              poses.push({
                name: detectedPose.name,
                count: 1,
                totalConfidence: detectedPose.confidence,
                averageConfidence: detectedPose.confidence,
                firstDetected: new Date()
              });
            }
            
            return {
              ...prev,
              posesDetected: poses,
              totalCorrections: prev.totalCorrections + poseCorrections.length
            };
          });
        }
      }
    } catch (err) {
      console.error('Pose detection error:', err);
      setError('Failed to detect pose: ' + err.message);
    }
  }, []);

  // Simulate pose detection (replace with actual ML model)
  const simulatePoseDetection = () => {
    const poses = ['Mountain Pose', 'Tree Pose', 'Warrior II', 'Downward Dog', 'Child\'s Pose'];
    const randomPose = poses[Math.floor(Math.random() * poses.length)];
    
    return {
      name: randomPose,
      confidence: Math.random() * 0.3 + 0.7, // 0.7-1.0
      landmarks: generateMockLandmarks()
    };
  };

  // Generate mock landmarks for simulation
  const generateMockLandmarks = () => {
    const landmarks = [];
    for (let i = 0; i < 33; i++) { // MediaPipe Pose has 33 landmarks
      landmarks.push({
        x: Math.random(),
        y: Math.random(),
        z: Math.random() * 0.1,
        visibility: Math.random() * 0.5 + 0.5
      });
    }
    return landmarks;
  };

  // Analyze image for pose
  const analyzeImage = useCallback(async (imageFile) => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const result = await yogaService.analyzePose(imageFile);
      
      setPose(result.pose);
      setConfidence(result.confidence);
      setLandmarks(result.landmarks);
      setCorrections(result.corrections || []);
      
      return result;
    } catch (err) {
      setError(err.message || 'Failed to analyze image');
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // Get pose details
  const getPoseDetails = useCallback(async (poseName) => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const details = await yogaService.getPoseDetails(poseName);
      return details;
    } catch (err) {
      setError(err.message || 'Failed to get pose details');
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // Save session to server
  const saveSession = useCallback(async () => {
    if (sessionStats.duration === 0) return;
    
    try {
      const sessionData = {
        startTime: sessionStats.startTime,
        duration: sessionStats.duration,
        poses: sessionStats.posesDetected.map(p => ({
          name: p.name,
          duration: Math.round(sessionStats.duration / sessionStats.posesDetected.length),
          confidence: p.averageConfidence
        })),
        totalCorrections: sessionStats.totalCorrections,
        endTime: new Date()
      };
      
      await yogaService.saveSession(sessionData);
      console.log('Session saved:', sessionData);
    } catch (err) {
      console.error('Failed to save session:', err);
    }
  }, [sessionStats]);

  // Get pose suggestions based on user level
  const getPoseSuggestions = useCallback(async (difficulty = 'beginner') => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const poses = await yogaService.getPoseList();
      const filteredPoses = poses.filter(p => p.difficulty === difficulty);
      return filteredPoses;
    } catch (err) {
      setError(err.message || 'Failed to get pose suggestions');
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // Calculate pose score
  const calculatePoseScore = useCallback((detectedLandmarks, referenceLandmarks) => {
    if (!detectedLandmarks || !referenceLandmarks) return 0;
    
    let totalDistance = 0;
    let validPoints = 0;
    
    for (let i = 0; i < Math.min(detectedLandmarks.length, referenceLandmarks.length); i++) {
      const detected = detectedLandmarks[i];
      const reference = referenceLandmarks[i];
      
      if (detected.visibility > 0.5) {
        const dx = detected.x - reference.x;
        const dy = detected.y - reference.y;
        totalDistance += Math.sqrt(dx * dx + dy * dy);
        validPoints++;
      }
    }
    
    if (validPoints === 0) return 0;
    
    const averageDistance = totalDistance / validPoints;
    // Convert distance to score (0-100)
    const score = Math.max(0, 100 - (averageDistance * 1000));
    return Math.round(score);
  }, []);

  // Get correction tips
  const getCorrectionTips = useCallback((poseName, landmarks) => {
    const tips = {
      'Mountain Pose': [
        'Keep feet hip-width apart',
        'Distribute weight evenly',
        'Lengthen your spine',
        'Relax your shoulders'
      ],
      'Tree Pose': [
        'Place foot above or below knee',
        'Focus on a fixed point',
        'Keep standing leg straight',
        'Bring hands to heart center'
      ],
      'Warrior II': [
        'Front knee over ankle',
        'Back leg straight',
        'Arms parallel to floor',
        'Hips squared to side'
      ],
      'Downward Dog': [
        'Press hands firmly',
        'Lengthen your spine',
        'Bend knees if needed',
        'Heels toward floor'
      ],
      'Child\'s Pose': [
        'Knees wide or together',
        'Forehead to mat',
        'Arms extended or resting',
        'Breathe deeply'
      ]
    };
    
    return tips[poseName] || ['Focus on your breath', 'Maintain steady posture', 'Listen to your body'];
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
      }
      if (sessionTimer.current) {
        clearInterval(sessionTimer.current);
      }
    };
  }, []);

  return {
    // State
    pose,
    landmarks,
    corrections,
    confidence,
    isDetecting,
    isAnalyzing,
    error,
    sessionStats,
    
    // Refs for webcam and canvas
    webcamRef,
    canvasRef,
    
    // Actions
    startDetection,
    stopDetection,
    analyzeImage,
    getPoseDetails,
    getPoseSuggestions,
    calculatePoseScore,
    getCorrectionTips,
    
    // Helper functions
    resetDetection: () => {
      setPose(null);
      setLandmarks([]);
      setCorrections([]);
      setConfidence(0);
      setError(null);
    },
    
    // Formatting helpers
    formatDuration: (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    },
    
    formatConfidence: (conf) => {
      return `${Math.round(conf * 100)}%`;
    },
    
    // Session info
    hasActiveSession: isDetecting,
    sessionDuration: sessionStats.duration,
    detectedPoses: sessionStats.posesDetected,
    
    // Pose validation
    isValidPose: confidence > 0.7,
    needsCorrection: corrections.length > 0,
    
    // Performance metrics
    getSessionSummary: () => ({
      totalPoses: sessionStats.posesDetected.length,
      averageConfidence: sessionStats.posesDetected.length > 0 ?
        sessionStats.posesDetected.reduce((sum, p) => sum + p.averageConfidence, 0) / 
        sessionStats.posesDetected.length : 0,
      totalTime: sessionStats.duration,
      correctionsPerMinute: sessionStats.duration > 0 ?
        (sessionStats.totalCorrections / sessionStats.duration) * 60 : 0
    })
  };
};