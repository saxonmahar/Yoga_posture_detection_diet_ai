import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { usePoseDetection } from '../hooks';
import { AnimatedPage, AnimatedCard, LoadingSpinner } from "../animations/framer-config.jsx";
import { poseAnimations } from '../animations';
import { YOGA_POSES } from '../utils/poseData';

const PoseDetectionPage = ({ user, updateUserStats, onNavigate }) => {
  const navigate = useNavigate();

  const {
    pose,
    landmarks,
    corrections,
    confidence,
    isDetecting,
    isAnalyzing,
    error,
    startDetection,
    stopDetection,
    analyzeImage,
    getCorrectionTips,
    resetDetection,
    webcamRef,
    canvasRef
  } = usePoseDetection();

  const [selectedPose, setSelectedPose] = useState('Mountain Pose');
  const [cameraMode, setCameraMode] = useState('user'); // 'user' or 'environment'
  const [capturedImage, setCapturedImage] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [autoDetect, setAutoDetect] = useState(false);

  // Start/stop detection
  const toggleDetection = () => {
    if (isDetecting) {
      stopDetection();
    } else {
      startDetection();
    }
  };

  // Capture image from webcam
  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      return imageSrc;
    }
    return null;
  };

  // Analyze captured image
  const handleAnalyzeImage = async () => {
    if (!capturedImage) return;
    
    try {
      const imageBlob = await fetch(capturedImage).then(r => r.blob());
      const file = new File([imageBlob], 'pose.jpg', { type: 'image/jpeg' });
      await analyzeImage(file);
      setShowResults(true);
      
      // Update user stats if analysis successful
      if (updateUserStats && confidence > 0.7) {
        updateUserStats({
          totalWorkouts: user?.stats?.totalWorkouts + 1 || 1,
          averageAccuracy: Math.round(
            ((user?.stats?.averageAccuracy || 0) * (user?.stats?.totalWorkouts || 0) + confidence * 100) / 
            ((user?.stats?.totalWorkouts || 0) + 1)
          )
        });
      }
    } catch (err) {
      console.error('Error analyzing image:', err);
    }
  };

  // Get correction tips for current pose
  const correctionTips = getCorrectionTips(pose, landmarks);

  // Auto-detect pose when confidence is high
  useEffect(() => {
    if (autoDetect && confidence > 0.85 && pose) {
      setSelectedPose(pose);
    }
  }, [autoDetect, confidence, pose]);

  // Draw landmarks on canvas
  useEffect(() => {
    if (canvasRef.current && landmarks.length > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw video frame if available
      if (webcamRef.current?.video) {
        ctx.drawImage(webcamRef.current.video, 0, 0, canvas.width, canvas.height);
      }
      
      // Draw landmarks
      landmarks.forEach((landmark, index) => {
        if (landmark.visibility > 0.5) {
          const x = landmark.x * canvas.width;
          const y = landmark.y * canvas.height;
          
          // Draw circle for landmark
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = confidence > 0.7 ? '#10B981' : '#EF4444';
          ctx.fill();
          
          // Draw landmark number
          ctx.fillStyle = 'white';
          ctx.font = '10px Arial';
          ctx.fillText(index.toString(), x - 3, y - 8);
        }
      });
      
      // Draw connections between landmarks (simplified skeleton)
      const connections = [
        [11, 12], [11, 13], [13, 15], [12, 14], [14, 16], // Shoulders to hands
        [11, 23], [12, 24], [23, 24], // Shoulders to hips
        [23, 25], [25, 27], [24, 26], [26, 28] // Hips to feet
      ];
      
      ctx.strokeStyle = confidence > 0.7 ? '#3B82F6' : '#F59E0B';
      ctx.lineWidth = 2;
      
      connections.forEach(([start, end]) => {
        if (landmarks[start]?.visibility > 0.5 && landmarks[end]?.visibility > 0.5) {
          const startX = landmarks[start].x * canvas.width;
          const startY = landmarks[start].y * canvas.height;
          const endX = landmarks[end].x * canvas.width;
          const endY = landmarks[end].y * canvas.height;
          
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
        }
      });
    }
  }, [landmarks, confidence]);

  // Redirect if not logged in
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <AnimatedPage transition="fade">
      <div className="min-h-screen bg-gradient-to-b from-background to-surface p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 gradient-text">
                  AI Pose Detection
                </h1>
                <p className="text-text-muted">
                  Real-time yoga pose analysis with AI-powered feedback
                </p>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-surface border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400">Error: {error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Camera and Controls */}
            <div className="lg:col-span-2 space-y-6">
              {/* Camera Section */}
              <AnimatedCard delay={0.1}>
                <div className="bg-card rounded-2xl border border-white/10 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Live Camera Feed</h2>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCameraMode(mode => mode === 'user' ? 'environment' : 'user')}
                        className="px-3 py-1 bg-surface border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-sm"
                      >
                        Switch Camera
                      </button>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${isDetecting ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
                        <span className="text-sm">{isDetecting ? 'Detecting' : 'Idle'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative rounded-xl overflow-hidden bg-black">
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      screenshotFormat="image/jpeg"
                      videoConstraints={{
                        facingMode: cameraMode,
                        width: 1280,
                        height: 720
                      }}
                      className="w-full h-auto"
                    />
                    
                    {/* Overlay canvas for landmarks */}
                    <canvas
                      ref={canvasRef}
                      className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    />

                    {/* Keypoint indicators */}
                    {landmarks.map((landmark, index) => {
                      if (landmark.visibility > 0.5) {
                        const x = landmark.x * 100;
                        const y = landmark.y * 100;
                        const isCorrect = confidence > 0.7;
                        const needsAdjustment = confidence > 0.4 && confidence <= 0.7;

                        return (
                          <div
                            key={index}
                            className={`keypoint-indicator absolute ${
                              isCorrect ? 'keypoint-correct' :
                              needsAdjustment ? 'keypoint-adjust' : 'keypoint-incorrect'
                            }`}
                            style={{
                              left: `${x}%`,
                              top: `${y}%`,
                              transform: 'translate(-50%, -50%)'
                            }}
                          />
                        );
                      }
                      return null;
                    })}

                    {/* Correction arrows */}
                    {corrections.map((correction, index) => {
                      if (correction.targetLandmark && landmarks[correction.targetLandmark]) {
                        const landmark = landmarks[correction.targetLandmark];
                        const x = landmark.x * 100;
                        const y = landmark.y * 100;

                        return (
                          <div
                            key={`arrow-${index}`}
                            className="correction-arrow absolute"
                            style={{
                              left: `${x}%`,
                              top: `${y}%`,
                              transform: 'translate(-50%, -50%)'
                            }}
                          >
                            <ArrowRight size={24} />
                          </div>
                        );
                      }
                      return null;
                    })}

                    {/* Success celebration */}
                    {confidence > 0.85 && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="success-celebration text-6xl">
                          <CheckCircle className="text-green-500" />
                        </div>
                      </div>
                    )}

                    {/* Detection overlay */}
                    {isDetecting && (
                      <div className="absolute top-4 left-4 bg-black/70 px-3 py-2 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm">Live Detection Active</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Confidence indicator */}
                    {confidence > 0 && (
                      <div className="absolute top-4 right-4 bg-black/70 px-3 py-2 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${confidence > 0.7 ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                          <span className="text-sm">Confidence: {Math.round(confidence * 100)}%</span>
                        </div>
                      </div>
                    )}
                    
                    {!webcamRef.current && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="text-center">
                          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                          <p className="text-text-muted">Initializing camera...</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Camera Controls */}
                  <div className="flex flex-wrap gap-3 mt-6">
                    <button
                      onClick={toggleDetection}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                        isDetecting
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-primary hover:bg-primary/80 text-white'
                      }`}
                    >
                      {isDetecting ? 'Stop Detection' : 'Start Live Detection'}
                    </button>
                    
                    <button
                      onClick={captureImage}
                      disabled={!webcamRef.current}
                      className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Capture Image
                    </button>
                    
                    <button
                      onClick={resetDetection}
                      className="px-6 py-3 bg-surface border border-white/10 hover:bg-white/5 rounded-lg font-medium transition-colors"
                    >
                      Reset
                    </button>
                    
                    <label className="flex items-center gap-2 px-4 py-3 bg-surface border border-white/10 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                      <input
                        type="checkbox"
                        checked={autoDetect}
                        onChange={(e) => setAutoDetect(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span>Auto-detect</span>
                    </label>
                  </div>
                </div>
              </AnimatedCard>

              {/* Results Section */}
              {showResults && (
                <AnimatedCard delay={0.2}>
                  <div className="bg-card rounded-2xl border border-white/10 p-6">
                    <h2 className="text-xl font-semibold mb-6">Analysis Results</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Detected Pose */}
                      <div className="bg-surface p-4 rounded-xl">
                        <h3 className="font-semibold mb-2 text-text-muted">Detected Pose</h3>
                        <p className="text-2xl font-bold">{pose || 'Unknown'}</p>
                        <div className="mt-2">
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-primary rounded-full h-2 transition-all duration-500"
                              style={{ width: `${confidence * 100}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-text-muted mt-1">Confidence: {Math.round(confidence * 100)}%</p>
                        </div>
                      </div>

                      {/* Target Pose */}
                      <div className="bg-surface p-4 rounded-xl">
                        <h3 className="font-semibold mb-2 text-text-muted">Target Pose</h3>
                        <p className="text-2xl font-bold">{selectedPose}</p>
                        <div className="mt-2">
                          <select
                            value={selectedPose}
                            onChange={(e) => setSelectedPose(e.target.value)}
                            className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-sm"
                          >
                            {YOGA_POSES.map((pose) => (
                              <option key={pose.id} value={pose.name}>
                                {pose.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Match Score */}
                      <div className="bg-surface p-4 rounded-xl">
                        <h3 className="font-semibold mb-2 text-text-muted">Match Score</h3>
                        <div className="flex items-center gap-3">
                          <div className="text-3xl font-bold">
                            {Math.round(confidence * 100)}
                            <span className="text-lg text-text-muted">/100</span>
                          </div>
                          <div className="flex-1">
                            <div className="w-full bg-gray-700 rounded-full h-3">
                              <div 
                                className={`rounded-full h-3 transition-all duration-500 ${
                                  confidence > 0.8 ? 'bg-green-500' :
                                  confidence > 0.6 ? 'bg-amber-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${confidence * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Captured Image */}
                    {capturedImage && (
                      <div className="mt-6">
                        <h3 className="font-semibold mb-3">Captured Image</h3>
                        <div className="flex gap-4">
                          <img 
                            src={capturedImage} 
                            alt="Captured pose" 
                            className="w-48 h-48 object-cover rounded-xl border border-white/10"
                          />
                          <div className="flex-1">
                            <button
                              onClick={handleAnalyzeImage}
                              disabled={isAnalyzing}
                              className="mb-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50"
                            >
                              {isAnalyzing ? 'Analyzing...' : 'Analyze This Image'}
                            </button>
                            {isAnalyzing && (
                              <div className="flex items-center gap-2 text-text-muted">
                                <LoadingSpinner size={20} />
                                <span>Processing image with AI...</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </AnimatedCard>
              )}

              {/* Corrections Section */}
              {corrections.length > 0 && (
                <AnimatedCard delay={0.3}>
                  <div className="bg-card rounded-2xl border border-white/10 p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <span className="text-amber-500">💡</span>
                      AI Feedback & Corrections
                    </h2>
                    
                    <div className="space-y-4">
                      {corrections.map((correction, index) => (
                        <div 
                          key={index}
                          className="p-4 bg-surface border border-white/10 rounded-xl"
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              correction.severity === 'high' ? 'bg-red-500/20' :
                              correction.severity === 'medium' ? 'bg-amber-500/20' : 'bg-blue-500/20'
                            }`}>
                              {correction.severity === 'high' ? '⚠️' :
                               correction.severity === 'medium' ? '📝' : '💡'}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1">{correction.title}</h4>
                              <p className="text-text-muted mb-2">{correction.message}</p>
                              <p className="text-sm text-primary">{correction.suggestion}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                                      {/* General Tips */}
                  <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-xl">
                    <h3 className="font-semibold mb-2 text-primary">General Tips for {selectedPose}:</h3>
                    <ul className="space-y-2">
                      {correctionTips.map((tip, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="text-primary">•</span>
                          <span className="text-text-muted">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AnimatedCard>
              )}
            </div>

            {/* Right Column - Pose Info & Controls */}
            <div className="space-y-6">
              {/* Pose Information */}
              <AnimatedCard delay={0.1}>
                <div className="bg-card rounded-2xl border border-white/10 p-6">
                  <h2 className="text-xl font-semibold mb-4">Pose Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-2">
                        Select Pose to Practice
                      </label>
                      <select
                        value={selectedPose}
                        onChange={(e) => setSelectedPose(e.target.value)}
                        className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        {YOGA_POSES.map((pose) => (
                          <option key={pose.id} value={pose.name}>
                            {pose.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="p-4 bg-surface rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Difficulty Level</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${selectedPose.includes('Tree') || selectedPose.includes('Warrior') ? 'bg-amber-500' : 'bg-emerald-500'}`}>
                          {selectedPose.includes('Tree') || selectedPose.includes('Warrior') ? 'Intermediate' : 'Beginner'}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-text-muted">Average Hold Time</span>
                          <span>30-60 seconds</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-text-muted">Calories Burned</span>
                          <span>3-5 per minute</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-text-muted">Muscles Worked</span>
                          <span>Core, Legs, Back</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Benefits</h3>
                      <ul className="space-y-2">
                        {selectedPose === 'Mountain Pose' && (
                          <>
                            <li className="flex items-center gap-2 text-sm">
                              <span className="text-green-500">✓</span>
                              <span>Improves posture and balance</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm">
                              <span className="text-green-500">✓</span>
                              <span>Strengthens thighs, knees, and ankles</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm">
                              <span className="text-green-500">✓</span>
                              <span>Relieves sciatica and reduces flat feet</span>
                            </li>
                          </>
                        )}
                        {selectedPose === 'Tree Pose' && (
                          <>
                            <li className="flex items-center gap-2 text-sm">
                              <span className="text-green-500">✓</span>
                              <span>Improves balance and coordination</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm">
                              <span className="text-green-500">✓</span>
                              <span>Strengthens legs and core muscles</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm">
                              <span className="text-green-500">✓</span>
                              <span>Increases focus and concentration</span>
                            </li>
                          </>
                        )}
                        {selectedPose === 'Warrior II' && (
                          <>
                            <li className="flex items-center gap-2 text-sm">
                              <span className="text-green-500">✓</span>
                              <span>Strengthens legs and ankles</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm">
                              <span className="text-green-500">✓</span>
                              <span>Stretches groins, chest, and lungs</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm">
                              <span className="text-green-500">✓</span>
                              <span>Increases stamina and concentration</span>
                            </li>
                          </>
                        )}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Instructions</h3>
                      <ol className="list-decimal list-inside space-y-2 text-sm">
                        {selectedPose === 'Mountain Pose' && (
                          <>
                            <li>Stand with your feet together or hip-width apart</li>
                            <li>Distribute your weight evenly across both feet</li>
                            <li>Engage your thigh muscles and lift your kneecaps</li>
                            <li>Lengthen your tailbone toward the floor</li>
                            <li>Broaden your collarbones and relax your shoulders</li>
                            <li>Hold for 5-10 breaths</li>
                          </>
                        )}
                        {selectedPose === 'Tree Pose' && (
                          <>
                            <li>Shift your weight onto your left foot</li>
                            <li>Place right foot on left inner thigh or calf</li>
                            <li>Bring palms together at heart center</li>
                            <li>Focus on a fixed point in front of you</li>
                            <li>Hold for 5-10 breaths, then switch sides</li>
                          </>
                        )}
                        {selectedPose === 'Warrior II' && (
                          <>
                            <li>Step feet 3-4 feet apart</li>
                            <li>Turn right foot out 90 degrees, left foot in slightly</li>
                            <li>Bend right knee over right ankle</li>
                            <li>Extend arms parallel to floor, gaze over right hand</li>
                            <li>Hold for 5-10 breaths, then switch sides</li>
                          </>
                        )}
                      </ol>
                    </div>
                  </div>
                </div>
              </AnimatedCard>

              {/* Quick Actions */}
              <AnimatedCard delay={0.2}>
                <div className="bg-card rounded-2xl border border-white/10 p-6">
                  <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => navigate('/yoga-session')}
                      className="w-full p-4 bg-primary text-white rounded-xl hover:bg-primary/80 transition-colors flex items-center justify-center gap-3"
                    >
                      <span className="text-xl">🧘</span>
                      <span className="font-medium">Start Full Yoga Session</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        if (capturedImage) {
                          handleAnalyzeImage();
                        } else {
                          captureImage();
                          setTimeout(handleAnalyzeImage, 500);
                        }
                      }}
                      disabled={isAnalyzing}
                      className="w-full p-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      <span className="text-xl">🤖</span>
                      <span className="font-medium">
                        {isAnalyzing ? 'Analyzing...' : 'Quick Analyze'}
                      </span>
                    </button>
                    
                    <button
                      onClick={() => {
                        if (webcamRef.current) {
                          const image = captureImage();
                          if (image) {
                            // Save to local storage or download
                            const link = document.createElement('a');
                            link.href = image;
                            link.download = `yoga-pose-${new Date().toISOString()}.jpg`;
                            link.click();
                          }
                        }
                      }}
                      disabled={!webcamRef.current}
                      className="w-full p-4 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      <span className="text-xl">📸</span>
                      <span className="font-medium">Save Pose Snapshot</span>
                    </button>
                    
                    <button
                      onClick={() => navigate('/progress')}
                      className="w-full p-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center gap-3"
                    >
                      <span className="text-xl">📊</span>
                      <span className="font-medium">View Progress</span>
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <h3 className="font-semibold mb-3">Today's Stats</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-surface p-3 rounded-lg">
                        <p className="text-sm text-text-muted">Poses Analyzed</p>
                        <p className="text-xl font-bold">{user?.stats?.totalWorkouts || 0}</p>
                      </div>
                      <div className="bg-surface p-3 rounded-lg">
                        <p className="text-sm text-text-muted">Avg. Accuracy</p>
                        <p className="text-xl font-bold">{user?.stats?.averageAccuracy || 0}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedCard>

              {/* Tips & Guidance */}
              <AnimatedCard delay={0.3}>
                <div className="bg-card rounded-2xl border border-white/10 p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <span className="text-purple-500">💡</span>
                    Tips for Better Results
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="p-3 bg-surface rounded-lg">
                      <h4 className="font-medium mb-1 flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        Camera Setup
                      </h4>
                      <p className="text-sm text-text-muted">
                        Ensure good lighting and position camera to see your full body.
                      </p>
                    </div>
                    
                    <div className="p-3 bg-surface rounded-lg">
                      <h4 className="font-medium mb-1 flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        Wear Appropriate Clothing
                      </h4>
                      <p className="text-sm text-text-muted">
                        Wear form-fitting clothes that don't obscure your body shape.
                      </p>
                    </div>
                    
                    <div className="p-3 bg-surface rounded-lg">
                      <h4 className="font-medium mb-1 flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        Clear Background
                      </h4>
                      <p className="text-sm text-text-muted">
                        Use a plain background for better pose detection accuracy.
                      </p>
                    </div>
                    
                    <div className="p-3 bg-surface rounded-lg">
                      <h4 className="font-medium mb-1 flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        Stay in Frame
                      </h4>
                      <p className="text-sm text-text-muted">
                        Keep your entire body within the camera view for complete analysis.
                      </p>
                    </div>
                  </div>

                  {/* Safety Notice */}
                  <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <h4 className="font-medium mb-2 text-red-400">⚠️ Safety Notice</h4>
                    <p className="text-sm text-text-muted">
                      Listen to your body. If you feel pain, stop immediately. 
                      This tool provides guidance but is not a substitute for professional instruction.
                    </p>
                  </div>
                </div>
              </AnimatedCard>
            </div>
          </div>

          {/* Bottom Section - Recent Analyses */}
          {showResults && (
            <AnimatedCard delay={0.4}>
              <div className="mt-8 bg-card rounded-2xl border border-white/10 p-6">
                <h2 className="text-xl font-semibold mb-6">Recent Analyses</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-surface rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Mountain Pose</span>
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                        92%
                      </span>
                    </div>
                    <p className="text-sm text-text-muted">10 minutes ago</p>
                    <div className="mt-3 text-xs text-text-muted">
                      <span className="text-green-500">✓</span> Good posture detected
                    </div>
                  </div>
                  
                  <div className="p-4 bg-surface rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Tree Pose</span>
                      <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-xs">
                        78%
                      </span>
                    </div>
                    <p className="text-sm text-text-muted">Yesterday</p>
                    <div className="mt-3 text-xs text-text-muted">
                      <span className="text-amber-500">⚠</span> Balance improvement needed
                    </div>
                  </div>
                  
                  <div className="p-4 bg-surface rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Warrior II</span>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                        85%
                      </span>
                    </div>
                    <p className="text-sm text-text-muted">2 days ago</p>
                    <div className="mt-3 text-xs text-text-muted">
                      <span className="text-blue-500">📈</span> Stance width improved
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => navigate('/progress')}
                  className="w-full mt-6 px-6 py-3 bg-surface border border-white/10 rounded-xl hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
                >
                  <span>View All History</span>
                  <span>→</span>
                </button>
              </div>
            </AnimatedCard>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
};

export default PoseDetectionPage;