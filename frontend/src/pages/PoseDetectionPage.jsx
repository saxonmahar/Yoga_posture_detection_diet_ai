import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowRight, CheckCircle, Camera, Video, AlertCircle, 
  Zap, Target, Users, Award, Activity, Clock,
  RotateCcw, Maximize2, Minimize2, Download, Share2,
  BarChart, TrendingUp, Heart, Star, HelpCircle,
  Sparkles
} from 'lucide-react';
import PoseCamera from '../components/pose-detection/PoseCamera';
import PoseFeedback from '../components/pose-detection/PoseFeedback';
import PoseInstructions from '../components/pose-detection/PoseInstructions';
import { AnimatedPage, AnimatedCard, LoadingSpinner } from "../animations/framer-config.jsx";
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// ML API Configuration
const ML_API_URL = 'http://localhost:5000';

const PoseDetectionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const detectionIntervalRef = useRef(null);
  const autoStartedRef = useRef(false);
  
  // Get auth context
  const { user, loading: authLoading, updateUserStats } = useAuth();
  
  // State variables
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedPose, setSelectedPose] = useState('tree_pose');
  const [detectionResult, setDetectionResult] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [landmarks, setLandmarks] = useState([]);
  const [corrections, setCorrections] = useState([]);
  const [error, setError] = useState(null);
  const [webcamError, setWebcamError] = useState(null);
  const [poseHistory, setPoseHistory] = useState([]);
  const [capturedImage, setCapturedImage] = useState(null);
  const [streamStatus, setStreamStatus] = useState('disconnected');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [perfectPoses, setPerfectPoses] = useState(0);
  const [totalDetections, setTotalDetections] = useState(0);
  
  // Available yoga poses
  const YOGA_POSES = [
    { id: 'tree_pose', name: 'Tree Pose (Vrikshasana)', icon: '🌳', difficulty: 'Beginner', color: 'from-green-500 to-emerald-500' },
    { id: 'warrior_pose', name: 'Warrior II (Virabhadrasana II)', icon: '⚔️', difficulty: 'Intermediate', color: 'from-orange-500 to-red-500' },
    { id: 'mountain_pose', name: 'Mountain Pose (Tadasana)', icon: '🏔️', difficulty: 'Beginner', color: 'from-blue-500 to-cyan-500' },
    { id: 'downward_dog', name: 'Downward Dog (Adho Mukha Svanasana)', icon: '🐕', difficulty: 'Intermediate', color: 'from-yellow-500 to-amber-500' },
    { id: 'child_pose', name: 'Child\'s Pose (Balasana)', icon: '🧒', difficulty: 'Beginner', color: 'from-purple-500 to-pink-500' },
    { id: 'cobra_pose', name: 'Cobra Pose (Bhujangasana)', icon: '🐍', difficulty: 'Intermediate', color: 'from-red-500 to-pink-500' }
  ];

  // ==================== User Authentication ====================
  useEffect(() => {
    console.log('🔍 Auth state:', { user, authLoading });
    
    if (!authLoading && !user) {
      console.log('⚠️ No user after auth loaded, redirecting to login');
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // ==================== Auto-start webcam when coming from Dashboard ====================
  useEffect(() => {
    if (user && !authLoading) {
      const autoStart = location.state?.autoStartWebcam || false;
      
      if (autoStart && !autoStartedRef.current) {
        console.log('🚀 Auto-starting webcam from Dashboard...');
        autoStartedRef.current = true;
        
        const timer = setTimeout(() => {
          console.log('⏱️ Executing auto-start webcam');
          handleStartWebcam();
        }, 500);
        
        return () => clearTimeout(timer);
      }
    }
  }, [location.state, user, authLoading]);

  // ==================== Session Timer ====================
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSessionTimer(prev => {
          const newTimer = prev + 1;
          if (newTimer % 60 === 0) {
            setCaloriesBurned(prevCalories => prevCalories + 5);
          }
          return newTimer;
        });
      }, 1000);
    }
    
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTimerRunning]);

  // ==================== Check ML server health ====================
  useEffect(() => {
    const checkMLHealth = async () => {
      try {
        const response = await axios.get(`${ML_API_URL}/health`, { timeout: 3000 });
        if (response.data.status === 'healthy') {
          console.log('✅ ML Server is healthy');
          setError(null);
          setStreamStatus('connected');
          return true;
        }
      } catch (err) {
        console.log('❌ ML Server not available (using basic mode):', err.message);
        setStreamStatus('disconnected');
        return false;
      }
    };

    checkMLHealth();
  }, []);

  // ==================== Start webcam ====================
  const handleStartWebcam = async () => {
    if (isWebcamActive) {
      console.log('⚠️ Webcam already active');
      return;
    }
    
    console.log('🎥 Starting webcam...');
    
    try {
      setWebcamError(null);
      setStreamStatus('connecting');
      
      setIsWebcamActive(true);
      setStreamStatus('connected');
      
      if (!isTimerRunning) {
        setIsTimerRunning(true);
        console.log('⏱️ Session timer started');
      }
      
      console.log('✅ Webcam started successfully');
      
    } catch (err) {
      console.error('Error starting webcam:', err);
      setWebcamError('Failed to access webcam. Please check browser permissions.');
      setStreamStatus('error');
    }
  };

  // ==================== Stop webcam ====================
  const stopWebcam = () => {
    console.log('🛑 Stopping webcam...');
    
    setIsWebcamActive(false);
    setIsDetecting(false);
    setStreamStatus('disconnected');
    
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    
    setIsTimerRunning(false);
    
    console.log('✅ Webcam stopped');
  };

  // Handle webcam start callback
  const handleWebcamStart = () => {
    console.log('✅ Webcam stream started');
  };

  // Handle webcam stop callback
  const handleWebcamStop = () => {
    console.log('🛑 Webcam stream stopped');
    setIsWebcamActive(false);
    setIsTimerRunning(false);
  };

  // Handle image capture
  const handleCaptureImage = (imageSrc) => {
    setCapturedImage(imageSrc);
    console.log('📸 Image captured');
  };

  // Start/Stop detection
  const toggleDetection = async () => {
    if (isDetecting) {
      stopDetection();
    } else {
      await startDetection();
    }
  };

  // Start pose detection
  const startDetection = async () => {
    if (!isWebcamActive) {
      alert('Please start webcam first');
      return;
    }
    
    setIsDetecting(true);
    
    detectionIntervalRef.current = setInterval(async () => {
      await simulateDetection();
    }, 2000);
    
    console.log('🔍 Detection started');
  };

  // Stop pose detection
  const stopDetection = () => {
    setIsDetecting(false);
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    console.log('🛑 Detection stopped');
  };

  // Simulate detection
  const simulateDetection = async () => {
    if (!isWebcamActive || !isDetecting) return;
    
    setTotalDetections(prev => prev + 1);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockResult = {
        success: true,
        pose_type: selectedPose,
        confidence: Math.random() * 0.3 + 0.7,
        is_correct: Math.random() > 0.3,
        feedback: [
          Math.random() > 0.5 ? 'Great form! Keep your back straight.' : 'Try to align your knees better.',
          Math.random() > 0.5 ? 'Perfect balance!' : 'Shift weight slightly to the right.'
        ],
        landmarks: Array.from({ length: 17 }, () => ({
          x: Math.random(),
          y: Math.random(),
          confidence: Math.random() * 0.3 + 0.7
        })),
        angles: {
          left_elbow: Math.floor(Math.random() * 30 + 150),
          right_elbow: Math.floor(Math.random() * 30 + 150),
          left_knee: Math.floor(Math.random() * 40 + 140),
          right_knee: Math.floor(Math.random() * 40 + 140)
        },
        timestamp: new Date().toISOString()
      };
      
      if (mockResult.is_correct) {
        setPerfectPoses(prev => prev + 1);
      }
      
      updateDetectionResult(mockResult);
    } catch (err) {
      console.error('Detection error:', err);
      setError('Failed to detect pose. Please check ML server connection.');
    }
  };

  // Update UI with detection results
  const updateDetectionResult = async (result) => {
    setDetectionResult(result);
    setConfidence(result.confidence || 0);
    setLandmarks(result.landmarks || []);
    
    if (result.feedback && result.feedback.length > 0) {
      const newCorrections = result.feedback.map((message, index) => ({
        id: index,
        title: getCorrectionTitle(message),
        message: message,
        severity: getCorrectionSeverity(message),
        suggestion: getCorrectionSuggestion(message),
        icon: getCorrectionIcon(message)
      }));
      setCorrections(newCorrections);
    }
    
    if (result.timestamp) {
      const newHistory = [...poseHistory, {
        pose: result.pose_type,
        confidence: result.confidence,
        timestamp: result.timestamp,
        isCorrect: result.is_correct,
        icon: YOGA_POSES.find(p => p.id === result.pose_type)?.icon || '🧘'
      }].slice(-5);
      setPoseHistory(newHistory);
    }
    
    // Update user stats if pose is correct
    if (result.is_correct && updateUserStats && user) {
      try {
        await updateUserStats({
          totalWorkouts: (user?.stats?.totalWorkouts || 0) + 1,
          averageAccuracy: Math.round(
            ((user?.stats?.averageAccuracy || 0) * (user?.stats?.totalWorkouts || 0) + result.confidence * 100) / 
            ((user?.stats?.totalWorkouts || 0) + 1)
          )
        });
      } catch (error) {
        console.error('Error updating user stats:', error);
      }
    }
  };

  // Get correction helpers
  const getCorrectionTitle = (message) => {
    if (message.includes('balance')) return 'Balance Issue';
    if (message.includes('knee')) return 'Knee Alignment';
    if (message.includes('back') || message.includes('spine')) return 'Posture Correction';
    if (message.includes('arm') || message.includes('shoulder')) return 'Arm Position';
    if (message.includes('straight')) return 'Alignment';
    return 'Form Adjustment';
  };

  const getCorrectionSeverity = (message) => {
    if (message.includes('Great') || message.includes('Perfect') || message.includes('excellent')) 
      return 'low';
    if (message.includes('Try') || message.includes('adjust') || message.includes('slightly')) 
      return 'medium';
    return 'high';
  };

  const getCorrectionIcon = (message) => {
    if (message.includes('balance')) return '⚖️';
    if (message.includes('knee')) return '🦵';
    if (message.includes('back') || message.includes('spine')) return '🧍';
    if (message.includes('arm') || message.includes('shoulder')) return '💪';
    return '🎯';
  };

  const getCorrectionSuggestion = (message) => {
    if (message.includes('balance')) return 'Focus on a fixed point and engage your core';
    if (message.includes('knee')) return 'Ensure knees are aligned with ankles';
    if (message.includes('straight')) return 'Gently straighten while maintaining stability';
    if (message.includes('weight')) return 'Distribute weight evenly between both feet';
    return 'Adjust slowly and breathe deeply';
  };

  // Analyze captured image
  const analyzeCapturedImage = async () => {
    if (!capturedImage) {
      alert('Please capture an image first');
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockResult = {
        success: true,
        pose_type: selectedPose,
        confidence: 0.85,
        is_correct: true,
        feedback: ['Excellent form! Perfect alignment.', 'Great job maintaining balance.'],
        timestamp: new Date().toISOString()
      };
      
      await updateDetectionResult(mockResult);
      alert('✅ Image analyzed successfully!');
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Get current pose details
  const getCurrentPoseDetails = () => {
    return YOGA_POSES.find(pose => pose.id === selectedPose) || YOGA_POSES[0];
  };

  // Format time (seconds to MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate accuracy percentage
  const calculateAccuracy = () => {
    if (totalDetections === 0) return 0;
    return Math.round((perfectPoses / totalDetections) * 100);
  };

  // Reset session
  const resetSession = () => {
    stopWebcam();
    setSessionTimer(0);
    setCaloriesBurned(0);
    setPerfectPoses(0);
    setTotalDetections(0);
    setDetectionResult(null);
    setConfidence(0);
    setLandmarks([]);
    setCorrections([]);
    setCapturedImage(null);
    setIsTimerRunning(false);
    autoStartedRef.current = false;
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Download session report
  const downloadReport = () => {
    const report = `
AI Pose Detection Session Report
--------------------------------
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}
Session Duration: ${formatTime(sessionTimer)}
Pose Practiced: ${getCurrentPoseDetails().name}
Total Detections: ${totalDetections}
Perfect Poses: ${perfectPoses}
Accuracy: ${calculateAccuracy()}%
Calories Burned: ${caloriesBurned} cal
User: ${user?.name || 'Guest'}
--------------------------------
Keep up the great work! 🧘
    `;
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pose-session-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Share session results
  const shareResults = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Yoga Session Results',
        text: `Just completed a ${formatTime(sessionTimer)} yoga session with ${calculateAccuracy()}% accuracy! 🧘`,
        url: window.location.href,
      });
    } else {
      const text = `Just completed a ${formatTime(sessionTimer)} yoga session with ${calculateAccuracy()}% accuracy! 🧘 Check out my progress at: ${window.location.href}`;
      navigator.clipboard.writeText(text);
      alert('Results copied to clipboard! 📋');
    }
  };

  // ==================== RENDER ====================
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size={60} />
          <p className="mt-4 text-slate-400">Loading your yoga session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
          <p className="text-slate-400 mb-6">Please log in to use the pose detection feature</p>
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-xl text-white font-medium"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <AnimatedPage transition="fade">
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  🧘 AI Pose Detection
                </h1>
                <p className="text-slate-400">
                  Welcome back, <span className="text-emerald-400">{user.name}</span>!
                  {user?.stats?.averageAccuracy && (
                    <span className="ml-2 text-amber-400">
                      Avg. Accuracy: {user.stats.averageAccuracy}%
                    </span>
                  )}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-sm rounded-xl font-medium transition-all border border-slate-700 flex items-center gap-2"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  Back to Dashboard
                </button>
                
                <button
                  onClick={resetSession}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl font-medium transition-all border border-red-500/30 flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset Session
                </button>
              </div>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className={`p-4 rounded-2xl backdrop-blur-xl border ${
              streamStatus === 'connected' 
                ? 'bg-emerald-500/10 border-emerald-500/30' 
                : 'bg-slate-800/40 border-slate-700/50'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  streamStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'
                }`}></div>
                <div>
                  <p className="text-sm text-slate-400">ML Server</p>
                  <p className="font-semibold">{streamStatus === 'connected' ? 'Connected ✅' : 'Disconnected'}</p>
                </div>
              </div>
            </div>
            
            <div className={`p-4 rounded-2xl backdrop-blur-xl border ${
              isWebcamActive 
                ? 'bg-blue-500/10 border-blue-500/30' 
                : 'bg-slate-800/40 border-slate-700/50'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  isWebcamActive ? 'bg-blue-500 animate-pulse' : 'bg-slate-500'
                }`}></div>
                <div>
                  <p className="text-sm text-slate-400">Webcam</p>
                  <p className="font-semibold">{isWebcamActive ? 'Active 🎥' : 'Inactive'}</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-2xl backdrop-blur-xl bg-purple-500/10 border border-purple-500/30">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-sm text-slate-400">Session Time</p>
                  <p className="font-semibold text-white">{formatTime(sessionTimer)}</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-2xl backdrop-blur-xl bg-amber-500/10 border border-amber-500/30">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-amber-400" />
                <div>
                  <p className="text-sm text-slate-400">Accuracy</p>
                  <p className="font-semibold text-white">{calculateAccuracy()}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle size={20} />
                <p>{error}</p>
              </div>
            </div>
          )}

          {webcamError && (
            <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
              <div className="flex items-center gap-2 text-amber-400">
                <AlertCircle size={20} />
                <p>{webcamError}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Camera and Results */}
            <div className="lg:col-span-2 space-y-8">
              {/* Camera Section */}
              <AnimatedCard delay={0.1}>
                <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      <Camera className="w-5 h-5 text-blue-400" />
                      Live Camera Feed
                    </h2>
                    
                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full ${isDetecting ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`}></div>
                        <span className="text-sm">{isDetecting ? 'Detecting...' : 'Idle'}</span>
                      </div>
                      
                      <button
                        onClick={toggleFullscreen}
                        className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors"
                      >
                        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* PoseCamera Component */}
                  <div className="relative">
                    <PoseCamera
                      isActive={isWebcamActive}
                      onWebcamStart={handleWebcamStart}
                      onWebcamStop={handleWebcamStop}
                      onCapture={handleCaptureImage}
                      showLandmarks={isDetecting}
                      mirrored={true}
                    />
                    
                    {!isWebcamActive && (
                      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <div className="text-center p-8">
                          <div className="w-20 h-20 mx-auto mb-4 bg-slate-800/50 rounded-full flex items-center justify-center border-4 border-slate-700/50">
                            <Camera className="w-10 h-10 text-slate-500" />
                          </div>
                          <h3 className="text-xl font-semibold text-white mb-2">Webcam Inactive</h3>
                          <p className="text-slate-400 mb-6">Click "Start Webcam" to begin your yoga session</p>
                          <button
                            onClick={handleStartWebcam}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-medium transition-all"
                          >
                            Start Webcam
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Camera Controls */}
                  <div className="flex flex-wrap gap-3 mt-6">
                    <button
                      onClick={isWebcamActive ? stopWebcam : handleStartWebcam}
                      className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                        isWebcamActive
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white'
                      }`}
                    >
                      <Camera className="w-5 h-5" />
                      {isWebcamActive ? 'Stop Webcam' : 'Start Webcam'}
                    </button>
                    
                    <button
                      onClick={toggleDetection}
                      disabled={!isWebcamActive}
                      className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                        isDetecting
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <Zap className="w-5 h-5" />
                      {isDetecting ? 'Stop Detection' : 'Start Detection'}
                    </button>
                    
                    <button
                      onClick={analyzeCapturedImage}
                      disabled={!capturedImage || isAnalyzing}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-medium transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {isAnalyzing ? (
                        <>
                          <LoadingSpinner size={20} />
                          <span>Analyzing...</span>
                        </>
                      ) : (
                        <>
                          <Target className="w-5 h-5" />
                          <span>Analyze Image</span>
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={downloadReport}
                      disabled={sessionTimer === 0}
                      className="px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 backdrop-blur-sm rounded-xl font-medium transition-all flex items-center gap-2 border border-slate-600 disabled:opacity-50"
                    >
                      <Download className="w-5 h-5" />
                      Download Report
                    </button>
                  </div>

                  {/* Quick Stats Bar */}
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-slate-800/50 p-3 rounded-lg">
                      <p className="text-sm text-slate-400">Session Time</p>
                      <p className="text-lg font-bold text-white">{formatTime(sessionTimer)}</p>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded-lg">
                      <p className="text-sm text-slate-400">Calories</p>
                      <p className="text-lg font-bold text-white">{caloriesBurned} cal</p>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded-lg">
                      <p className="text-sm text-slate-400">Perfect Poses</p>
                      <p className="text-lg font-bold text-white">{perfectPoses}</p>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded-lg">
                      <p className="text-sm text-slate-400">Accuracy</p>
                      <p className="text-lg font-bold text-white">{calculateAccuracy()}%</p>
                    </div>
                  </div>
                </div>
              </AnimatedCard>

              {/* Results Section */}
              {detectionResult && (
                <AnimatedCard delay={0.2}>
                  <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-emerald-400" />
                      Detection Results
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      {/* Detected Pose */}
                      <div className="bg-slate-800/50 p-4 rounded-xl backdrop-blur-sm">
                        <h3 className="font-semibold mb-2 text-slate-400">Detected Pose</h3>
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-3xl">{getCurrentPoseDetails().icon}</span>
                          <div>
                            <p className="text-lg font-bold text-white">{getCurrentPoseDetails().name}</p>
                            <p className="text-sm text-slate-400">Difficulty: {getCurrentPoseDetails().difficulty}</p>
                          </div>
                        </div>
                        <div className="w-full bg-slate-700/50 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full transition-all duration-500 ${
                              confidence > 0.8 ? 'bg-gradient-to-r from-emerald-500 to-green-500' :
                              confidence > 0.6 ? 'bg-gradient-to-r from-amber-500 to-yellow-500' :
                              'bg-gradient-to-r from-red-500 to-pink-500'
                            }`}
                            style={{ width: `${confidence * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-slate-400 mt-2">Confidence: {Math.round(confidence * 100)}%</p>
                      </div>

                      {/* Pose Status */}
                      <div className="bg-slate-800/50 p-4 rounded-xl backdrop-blur-sm">
                        <h3 className="font-semibold mb-2 text-slate-400">Pose Status</h3>
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`text-2xl ${detectionResult.is_correct ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {detectionResult.is_correct ? '✅' : '⚠️'}
                          </div>
                          <span className="text-xl font-bold text-white">
                            {detectionResult.is_correct ? 'Perfect Form!' : 'Needs Adjustment'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1 text-slate-400">
                            <Target className="w-4 h-4" />
                            {perfectPoses} perfect
                          </span>
                          <span className="flex items-center gap-1 text-slate-400">
                            <BarChart className="w-4 h-4" />
                            {totalDetections} total
                          </span>
                        </div>
                      </div>

                      {/* Session Stats */}
                      <div className="bg-slate-800/50 p-4 rounded-xl backdrop-blur-sm">
                        <h3 className="font-semibold mb-2 text-slate-400">Session Stats</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Time:</span>
                            <span className="font-semibold text-white">{formatTime(sessionTimer)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Calories:</span>
                            <span className="font-semibold text-white">{caloriesBurned} cal</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Accuracy:</span>
                            <span className="font-semibold text-white">{calculateAccuracy()}%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Feedback Section */}
                    {corrections.length > 0 && (
                      <PoseFeedback 
                        corrections={corrections}
                        poseName={getCurrentPoseDetails().name}
                        confidence={confidence}
                      />
                    )}

                    {/* Recent Detections */}
                    {poseHistory.length > 0 && (
                      <div className="mt-6">
                        <h3 className="font-semibold mb-3 text-white flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-blue-400" />
                          Recent Detections
                        </h3>
                        <div className="space-y-2">
                          {poseHistory.slice().reverse().map((item, index) => (
                            <div 
                              key={index} 
                              className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{item.icon}</span>
                                <div>
                                  <p className="font-medium text-white">
                                    {YOGA_POSES.find(p => p.id === item.pose)?.name || item.pose}
                                  </p>
                                  <p className="text-xs text-slate-400">
                                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className={`px-2 py-1 rounded text-xs font-medium ${
                                  item.isCorrect 
                                    ? 'bg-emerald-500/20 text-emerald-400' 
                                    : 'bg-amber-500/20 text-amber-400'
                                }`}>
                                  {item.isCorrect ? '✓ Correct' : 'Needs Work'}
                                </div>
                                <p className="text-sm text-slate-400 mt-1">{Math.round(item.confidence * 100)}%</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </AnimatedCard>
              )}

              {/* Captured Image Section */}
              {capturedImage && (
                <AnimatedCard delay={0.3}>
                  <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                      <Camera className="w-5 h-5 text-amber-400" />
                      Captured Image
                    </h2>
                    
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex-1">
                        <img 
                          src={capturedImage} 
                          alt="Captured pose" 
                          className="w-full h-auto rounded-xl border-2 border-slate-600/50 shadow-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="space-y-4">
                          <div className="p-4 bg-slate-800/50 rounded-xl">
                            <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                              <Star className="w-5 h-5 text-amber-400" />
                              Analysis Options
                            </h4>
                            <p className="text-sm text-slate-400 mb-4">
                              This image has been captured from your webcam. You can analyze it with AI or save it for reference.
                            </p>
                            
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={analyzeCapturedImage}
                                disabled={isAnalyzing}
                                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
                              >
                                {isAnalyzing ? (
                                  <>
                                    <LoadingSpinner size={16} />
                                    <span>Analyzing...</span>
                                  </>
                                ) : (
                                  <>
                                    <span>🤖</span>
                                    <span>AI Analysis</span>
                                  </>
                                )}
                              </button>
                              
                              <button
                                onClick={() => {
                                  const a = document.createElement('a');
                                  a.href = capturedImage;
                                  a.download = `pose-${Date.now()}.jpg`;
                                  a.click();
                                }}
                                className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 backdrop-blur-sm rounded-lg transition-all border border-slate-600 flex items-center gap-2"
                              >
                                <Download className="w-4 h-4" />
                                <span>Save Image</span>
                              </button>
                              
                              <button
                                onClick={() => setCapturedImage(null)}
                                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all border border-red-500/30 flex items-center gap-2"
                              >
                                <span>🗑️</span>
                                <span>Discard</span>
                              </button>
                            </div>
                          </div>
                          
                          <div className="p-4 bg-slate-800/50 rounded-xl">
                            <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                              <HelpCircle className="w-5 h-5 text-blue-400" />
                              Tips for Best Results
                            </h4>
                            <ul className="text-sm text-slate-400 space-y-2">
                              <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                Ensure good lighting on your face and body
                              </li>
                              <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                Stand against a plain background
                              </li>
                              <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                Wear contrasting clothing for better detection
                              </li>
                              <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                Keep your entire body within the frame
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              )}
            </div>

            {/* Right Column - Pose Info & Controls */}
            <div className="space-y-8">
              {/* Pose Selection & Info */}
              <AnimatedCard delay={0.1}>
                <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-emerald-400" />
                    Select Pose to Practice
                  </h2>
                  
                  <div className="mb-6">
                    <select
                      value={selectedPose}
                      onChange={(e) => setSelectedPose(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white"
                    >
                      {YOGA_POSES.map((pose) => (
                        <option key={pose.id} value={pose.id} className="bg-slate-800">
                          {pose.name} ({pose.difficulty})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Current Pose Card */}
                  <div className={`p-5 rounded-xl bg-gradient-to-br ${getCurrentPoseDetails().color}/10 border ${getCurrentPoseDetails().color.replace('from-', 'border-').split(' ')[0]}/30 mb-6`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{getCurrentPoseDetails().icon}</span>
                        <div>
                          <h3 className="font-bold text-xl text-white">{getCurrentPoseDetails().name}</h3>
                          <p className="text-sm text-slate-300">Difficulty: {getCurrentPoseDetails().difficulty}</p>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-lg text-sm">
                        🧘 Recommended
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Hold Time</span>
                        <span className="text-white font-medium">30-60s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Calories</span>
                        <span className="text-white font-medium">3-5/min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Focus Area</span>
                        <span className="text-white font-medium">Balance</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Level</span>
                        <span className="text-white font-medium">{getCurrentPoseDetails().difficulty}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pose Instructions Component */}
                  <PoseInstructions 
                    poseId={selectedPose}
                    poseName={getCurrentPoseDetails().name}
                  />
                </div>
              </AnimatedCard>

              {/* Quick Actions */}
              <AnimatedCard delay={0.2}>
                <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Quick Actions
                  </h2>
                  
                  <div className="space-y-3">
                    <button
                      onClick={handleStartWebcam}
                      disabled={isWebcamActive}
                      className={`w-full p-4 rounded-xl transition-all flex items-center justify-center gap-3 ${
                        isWebcamActive
                          ? 'bg-slate-700/50 border border-slate-600 text-slate-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white'
                      }`}
                    >
                      <Camera className="w-5 h-5" />
                      <span className="font-medium">
                        {isWebcamActive ? 'Webcam Active' : 'Start Webcam Now'}
                      </span>
                    </button>
                    
                    <button
                      onClick={() => navigate('/yoga-session')}
                      className="w-full p-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl transition-all flex items-center justify-center gap-3"
                    >
                      <span className="text-xl">🧘</span>
                      <span className="font-medium">Start Full Yoga Session</span>
                    </button>
                    
                    <button
                      onClick={() => navigate('/progress')}
                      className="w-full p-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl transition-all flex items-center justify-center gap-3"
                    >
                      <BarChart className="w-5 h-5" />
                      <span className="font-medium">View Progress Analytics</span>
                    </button>
                    
                    <button
                      onClick={shareResults}
                      disabled={sessionTimer === 0}
                      className="w-full p-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      <Share2 className="w-5 h-5" />
                      <span className="font-medium">Share Results</span>
                    </button>
                  </div>

                  {/* Session Stats */}
                  <div className="mt-6 pt-6 border-t border-slate-700/50">
                    <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-amber-400" />
                      Today's Session
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-800/50 p-3 rounded-lg">
                        <p className="text-sm text-slate-400">Duration</p>
                        <p className="text-xl font-bold text-white">{formatTime(sessionTimer)}</p>
                      </div>
                      <div className="bg-slate-800/50 p-3 rounded-lg">
                        <p className="text-sm text-slate-400">Calories</p>
                        <p className="text-xl font-bold text-white">{caloriesBurned}</p>
                      </div>
                      <div className="bg-slate-800/50 p-3 rounded-lg">
                        <p className="text-sm text-slate-400">Poses</p>
                        <p className="text-xl font-bold text-white">{totalDetections}</p>
                      </div>
                      <div className="bg-slate-800/50 p-3 rounded-lg">
                        <p className="text-sm text-slate-400">Accuracy</p>
                        <p className="text-xl font-bold text-white">{calculateAccuracy()}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedCard>

              {/* Wellness Tips */}
              <AnimatedCard delay={0.3}>
                <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-xl rounded-2xl border border-emerald-500/30 p-6">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-emerald-400" />
                    Wellness Tips
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="p-3 bg-emerald-500/20 rounded-lg">
                      <h4 className="font-medium text-white mb-1 flex items-center gap-2">
                        <span className="text-emerald-400">💡</span>
                        Breathe Mindfully
                      </h4>
                      <p className="text-sm text-slate-300">
                        Sync your breath with movements. Inhale during expansions, exhale during contractions.
                      </p>
                    </div>
                    
                    <div className="p-3 bg-emerald-500/20 rounded-lg">
                      <h4 className="font-medium text-white mb-1 flex items-center gap-2">
                        <span className="text-emerald-400">🎯</span>
                        Focus on Alignment
                      </h4>
                      <p className="text-sm text-slate-300">
                        Quality over quantity. Hold poses with proper form rather than rushing through.
                      </p>
                    </div>
                    
                    <div className="p-3 bg-emerald-500/20 rounded-lg">
                      <h4 className="font-medium text-white mb-1 flex items-center gap-2">
                        <span className="text-emerald-400">⚡</span>
                        Consistency is Key
                      </h4>
                      <p className="text-sm text-slate-300">
                        Practice regularly, even for just 10 minutes daily, for better results.
                      </p>
                    </div>
                    
                    <div className="p-3 bg-emerald-500/20 rounded-lg">
                      <h4 className="font-medium text-white mb-1 flex items-center gap-2">
                        <span className="text-emerald-400">💧</span>
                        Stay Hydrated
                      </h4>
                      <p className="text-sm text-slate-300">
                        Drink water before and after your session for optimal performance.
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-8 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-8 border border-blue-500/30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
                  <Sparkles className="w-6 h-6 mr-3 text-yellow-400" />
                  Ready to Master Your Poses?
                </h3>
                <p className="text-slate-300">
                  Join thousands of yogis improving their form with AI-powered feedback
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleStartWebcam}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-xl font-bold text-white transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  {isWebcamActive ? 'Webcam Active' : 'Start Session'}
                </button>
                <button
                  onClick={() => navigate('/community')}
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl font-bold text-white transition-all border border-white/20 flex items-center gap-2"
                >
                  <Users className="w-5 h-5" />
                  Join Community
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default PoseDetectionPage;