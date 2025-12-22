import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useYogaSession, useWebcam, usePoseDetection } from '../hooks';
import { AnimatedPage, LoadingSpinner } from '../animations/framer-config';
const yogaPoses = [
  {
    id: 'mountain-pose',
    name: 'Mountain Pose',
    sanskrit: 'Tadasana',
    difficulty: 'Beginner',
    duration: 60,
    calories: 15,
    benefits: ['Improves posture', 'Strengthens thighs', 'Relieves tension'],
    instructions: 'Stand tall with feet together, arms at sides. Engage your core and breathe deeply.'
  },
  {
    id: 'downward-dog',
    name: 'Downward Dog',
    sanskrit: 'Adho Mukha Svanasana',
    difficulty: 'Beginner',
    duration: 90,
    calories: 25,
    benefits: ['Strengthens arms', 'Stretches hamstrings', 'Relieves back pain'],
    instructions: 'Form an inverted V with your body. Hands shoulder-width apart, hips high.'
  },
  {
    id: 'warrior-ii',
    name: 'Warrior II',
    sanskrit: 'Virabhadrasana II',
    difficulty: 'Intermediate',
    duration: 120,
    calories: 35,
    benefits: ['Strengthens legs', 'Improves balance', 'Opens hips'],
    instructions: 'Front knee bent at 90°, back leg straight. Arms extended parallel to floor.'
  },
  {
    id: 'tree-pose',
    name: 'Tree Pose',
    sanskrit: 'Vrikshasana',
    difficulty: 'Intermediate',
    duration: 90,
    calories: 20,
    benefits: ['Improves balance', 'Strengthens core', 'Increases focus'],
    instructions: 'Stand on one leg, other foot on inner thigh. Hands in prayer position.'
  }
];
import { poseAnimations } from '../animations';

const YogaSessionPage = ({ user, updateUserStats, onNavigate }) => {
  const navigate = useNavigate();
  const [selectedPose, setSelectedPose] = useState(null);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  
  const { session, startSession, endSession, addCorrection, completePose } = useYogaSession();
  const { videoRef, isCameraOn, startWebcam, stopWebcam, captureImage } = useWebcam();
  const { pose, landmarks, corrections, confidence, isDetecting, startDetection, stopDetection } = usePoseDetection();

  // Start session with selected pose
  const handleStartSession = (pose) => {
    setSelectedPose(pose);
    startSession(pose);
    startWebcam();
    setTimeout(() => startDetection(), 1000); // Start detection after camera is ready
    setShowInstructions(false);
  };

  // End current session
  const handleEndSession = () => {
    stopDetection();
    stopWebcam();
    endSession();
    
    // Update user stats
    if (updateUserStats && session.duration > 0) {
      updateUserStats({
        totalWorkouts: user?.stats?.totalWorkouts + 1 || 1,
        totalCaloriesBurned: user?.stats?.totalCaloriesBurned + Math.round(session.duration * 3.5) || Math.round(session.duration * 3.5),
        currentStreak: user?.stats?.currentStreak + 1 || 1
      });
    }
    
    setSessionComplete(true);
  };

  // Complete current pose
  const handleCompletePose = () => {
    if (selectedPose) {
      completePose(selectedPose.name);
      setSelectedPose(null);
    }
  };

  // Take screenshot for analysis
  const handleTakePhoto = () => {
    const image = captureImage();
    if (image) {
      // You can save or analyze this image
      console.log('Photo captured:', image.substring(0, 50) + '...');
    }
  };

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get pose difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-emerald-500';
      case 'intermediate': return 'bg-amber-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Reset for new session
  const handleNewSession = () => {
    setSelectedPose(null);
    setSessionComplete(false);
    setShowInstructions(true);
  };

  // Auto-end session after 30 minutes
  useEffect(() => {
    if (session.duration > 1800) { // 30 minutes
      handleEndSession();
    }
  }, [session.duration]);

  // Redirect if not logged in
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <AnimatedPage transition="yogaTransition">
      <div className="min-h-screen bg-gradient-to-b from-background to-surface p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 gradient-text">
              Yoga Session
            </h1>
            <p className="text-text-muted">
              Practice yoga poses with real-time feedback and guidance
            </p>
          </div>

          {/* Session Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card p-4 rounded-xl border border-white/10">
              <p className="text-sm text-text-muted">Session Duration</p>
              <p className="text-2xl font-bold">{formatTime(session.duration)}</p>
            </div>
            <div className="bg-card p-4 rounded-xl border border-white/10">
              <p className="text-sm text-text-muted">Pose Confidence</p>
              <p className="text-2xl font-bold">{Math.round(confidence * 100)}%</p>
            </div>
            <div className="bg-card p-4 rounded-xl border border-white/10">
              <p className="text-sm text-text-muted">Corrections</p>
              <p className="text-2xl font-bold">{corrections.length}</p>
            </div>
            <div className="bg-card p-4 rounded-xl border border-white/10">
              <p className="text-sm text-text-muted">Calories Burned</p>
              <p className="text-2xl font-bold">{Math.round(session.duration * 3.5)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Camera and Controls */}
            <div className="lg:col-span-2 space-y-6">
              {/* Camera Feed */}
              <div className="bg-card rounded-2xl border border-white/10 p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Camera Feed</h2>
                  <div className="flex gap-2">
                    {!isCameraOn ? (
                      <button
                        onClick={startWebcam}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
                      >
                        Start Camera
                      </button>
                    ) : (
                      <button
                        onClick={stopWebcam}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Stop Camera
                      </button>
                    )}
                    {isCameraOn && (
                      <button
                        onClick={handleTakePhoto}
                        className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                      >
                        Take Photo
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {!isCameraOn && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <div className="text-center">
                        <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-text-muted">Camera is off</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Pose detection overlay */}
                  {isDetecting && (
                    <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm">Detecting Pose</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Current Pose Info */}
              {selectedPose && (
                <div className="bg-card rounded-2xl border border-white/10 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{selectedPose.name}</h3>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedPose.difficulty)}`}>
                          {selectedPose.difficulty}
                        </span>
                        <span className="text-text-muted">
                          Confidence: {Math.round(confidence * 100)}%
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handleCompletePose}
                      className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Complete Pose
                    </button>
                  </div>
                  
                  <p className="text-text-muted mb-4">{selectedPose.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Benefits:</h4>
                      <ul className="list-disc list-inside text-text-muted space-y-1">
                        {selectedPose.benefits.map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Instructions:</h4>
                      <ol className="list-decimal list-inside text-text-muted space-y-1">
                        {selectedPose.instructions.map((instruction, index) => (
                          <li key={index}>{instruction}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              {/* Corrections */}
              {corrections.length > 0 && (
                <div className="bg-card rounded-2xl border border-white/10 p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <span className="text-amber-500">⚠️</span>
                    Pose Corrections
                  </h3>
                  <div className="space-y-3">
                    {corrections.map((correction, index) => (
                      <div 
                        key={index}
                        className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg"
                      >
                        <p className="text-amber-300">{correction.message}</p>
                        <p className="text-sm text-amber-400/70 mt-1">{correction.suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Pose Library & Controls */}
            <div className="space-y-6">
              {/* Session Controls */}
              <div className="bg-card rounded-2xl border border-white/10 p-6">
                <h3 className="text-xl font-semibold mb-4">Session Controls</h3>
                
                {!session.isActive ? (
                  <div className="space-y-4">
                    <button
                      onClick={() => setShowInstructions(true)}
                      className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-left"
                    >
                      <span className="font-medium">View Instructions</span>
                      <p className="text-sm text-text-muted">Learn how to use the yoga session</p>
                    </button>
                    
                    {!isCameraOn ? (
                      <button
                        onClick={startWebcam}
                        className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors font-medium"
                      >
                        Start Camera First
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStartSession(yogaPoses[0])}
                        className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                      >
                        Start Yoga Session
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <button
                      onClick={handleEndSession}
                      className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                    >
                      End Session
                    </button>
                    
                    <div className="p-4 bg-surface rounded-lg">
                      <p className="text-sm text-text-muted">Session Active</p>
                      <p className="text-2xl font-bold">{formatTime(session.duration)}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Pose Library */}
              <div className="bg-card rounded-2xl border border-white/10 p-6">
                <h3 className="text-xl font-semibold mb-4">Pose Library</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {yogaPoses.map((poseItem, index) => (
                    <button
                      key={index}
                      onClick={() => !session.isActive && handleStartSession(poseItem)}
                      disabled={session.isActive}
                      className={`w-full p-3 rounded-lg text-left transition-all ${
                        session.isActive
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-white/5'
                      } ${
                        selectedPose?.name === poseItem.name
                          ? 'bg-primary/20 border border-primary/30'
                          : 'bg-surface border border-white/10'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{poseItem.name}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(poseItem.difficulty)}`}>
                          {poseItem.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-text-muted mt-1 truncate">{poseItem.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Session Summary */}
              {sessionComplete && (
                <div className="bg-card rounded-2xl border border-white/10 p-6">
                  <h3 className="text-xl font-semibold mb-4">Session Complete! 🎉</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-medium">{formatTime(session.duration)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Poses Completed:</span>
                      <span className="font-medium">{session.completedPoses.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Corrections:</span>
                      <span className="font-medium">{session.corrections.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Calories Burned:</span>
                      <span className="font-medium">{Math.round(session.duration * 3.5)}</span>
                    </div>
                    <button
                      onClick={handleNewSession}
                      className="w-full mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
                    >
                      Start New Session
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Instructions Modal */}
          {showInstructions && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
              <div className="bg-card rounded-2xl border border-white/10 p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6">Yoga Session Instructions</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">1. Setup Your Space</h3>
                    <p className="text-text-muted">Find a quiet space with enough room to move. Use a yoga mat for comfort.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">2. Camera Setup</h3>
                    <p className="text-text-muted">Position your camera so your entire body is visible. Good lighting helps with detection.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">3. Select a Pose</h3>
                    <p className="text-text-muted">Choose a pose from the library that matches your skill level.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">4. Follow Instructions</h3>
                    <p className="text-text-muted">Read the pose instructions carefully and follow along.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">5. Get Feedback</h3>
                    <p className="text-text-muted">The system will provide real-time corrections to help improve your form.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Safety Tips</h3>
                    <ul className="list-disc list-inside text-text-muted space-y-1">
                      <li>Listen to your body and don't push through pain</li>
                      <li>Breathe deeply and consistently</li>
                      <li>Modify poses as needed for your body</li>
                      <li>Consult a doctor if you have health concerns</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setShowInstructions(false)}
                    className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
                  >
                    Got it, Let's Start!
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-6 py-3 bg-surface border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
};

export default YogaSessionPage;