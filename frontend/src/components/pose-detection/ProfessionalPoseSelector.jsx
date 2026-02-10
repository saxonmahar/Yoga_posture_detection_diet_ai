// components/pose-detection/ProfessionalPoseSelector.jsx
import React, { useState, useEffect } from 'react';
import { CheckCircle, Star, Target, Clock, Zap, Play, Info, X, Camera, Volume2, VolumeX } from 'lucide-react';
import axios from 'axios';
import PoseCamera from './PoseCamera';
import PrePoseInstructions from './PrePoseInstructions';
import ttsService from '../../services/ttsService';

const ML_API_URL = 'http://localhost:5000';

const ProfessionalPoseSelector = ({ selectedPose, onPoseSelect, onStartPose, onPoseComplete, completedPoses = [], isActive = false }) => {
  const [hoveredPose, setHoveredPose] = useState(null);
  const [availablePoses, setAvailablePoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startingPose, setStartingPose] = useState(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [activePose, setActivePose] = useState(null);
  const [showImageModal, setShowImageModal] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [instructionPose, setInstructionPose] = useState(null);

  // Initialize TTS service
  useEffect(() => {
    // Set initial TTS state
    ttsService.setEnabled(true);
    
    return () => {
      // Cleanup TTS when component unmounts
      ttsService.endSession();
    };
  }, []);

  // Professional yoga poses with real images from pose folder
  const PROFESSIONAL_POSES = [
    { 
      id: 'yog1', 
      name: 'Warrior II (Virabhadrasana II)', 
      icon: '⚔️', 
      difficulty: 'Intermediate', 
      color: 'from-orange-500 to-red-500',
      description: 'Strong standing pose with arms extended',
      benefits: ['Strengthens legs', 'Opens hips', 'Improves balance'],
      duration: '30-60 seconds',
      instructions: 'Stand with feet wide apart, turn right foot out 90°, bend right knee, extend arms parallel to floor',
      image: '/images/poses/warrior2.jpg'
    },
    { 
      id: 'yog2', 
      name: 'T Pose', 
      icon: '🤸', 
      difficulty: 'Beginner', 
      color: 'from-blue-500 to-cyan-500',
      description: 'Simple standing pose with arms extended',
      benefits: ['Improves flexibility', 'Strengthens core', 'Better balance'],
      duration: '15-30 seconds',
      instructions: 'Stand straight, extend arms out to sides parallel to floor, keep legs straight',
      image: '/images/poses/tpose.jpg'
    },
    { 
      id: 'yog3', 
      name: 'Tree Pose (Vrikshasana)', 
      icon: '🌳', 
      difficulty: 'Beginner', 
      color: 'from-green-500 to-emerald-500',
      description: 'Balance on one leg with hands in prayer position',
      benefits: ['Improves balance', 'Strengthens legs', 'Enhances focus'],
      duration: '30-60 seconds each leg',
      instructions: 'Stand on one leg, place other foot on inner thigh, hands in prayer position',
      image: '/images/poses/tree.jpg'
    },
    { 
      id: 'yog4', 
      name: 'Goddess Pose', 
      icon: '👸', 
      difficulty: 'Intermediate', 
      color: 'from-purple-500 to-pink-500',
      description: 'Wide-legged squat with arms raised',
      benefits: ['Strengthens thighs', 'Opens hips', 'Builds confidence'],
      duration: '30-45 seconds',
      instructions: 'Wide-legged squat, knees bent, arms raised up in victory pose',
      image: '/images/poses/goddess.jpg'
    },
    { 
      id: 'yog5', 
      name: 'Downward Facing Dog', 
      icon: '🐕', 
      difficulty: 'Intermediate', 
      color: 'from-yellow-500 to-amber-500',
      description: 'Inverted V-shape with hands and feet on ground',
      benefits: ['Stretches spine', 'Strengthens arms', 'Energizes body'],
      duration: '30-60 seconds',
      instructions: 'Hands and feet on ground, form inverted V-shape, straighten legs and arms',
      image: '/images/poses/downward_dog.jpg'
    },
    { 
      id: 'yog6', 
      name: 'Plank Pose', 
      icon: '💪', 
      difficulty: 'Beginner', 
      color: 'from-indigo-500 to-blue-500',
      description: 'Hold body straight like a plank',
      benefits: ['Strengthens core', 'Builds endurance', 'Improves posture'],
      duration: '15-60 seconds',
      instructions: 'Hold body straight like a plank, arms extended, core engaged',
      image: '/images/poses/plank.jpg'
    }
  ];

  // Load available poses from ML API
  useEffect(() => {
    const loadAvailablePoses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${ML_API_URL}/api/ml/available-poses`);
        
        if (response.data.success) {
          setAvailablePoses(response.data.poses);
          console.log('✅ Loaded professional poses:', Object.keys(response.data.poses).length);
        }
      } catch (err) {
        console.error('❌ Error loading poses:', err);
        setError('Failed to load available poses');
      } finally {
        setLoading(false);
      }
    };

    loadAvailablePoses();
  }, []);

  // Text-to-Speech function for pose feedback - SIMPLIFIED
  const speakFeedback = (message) => {
    // Use the new TTS service for simplified feedback
    ttsService.speak(message, false);
  };

  // Handle pose detection results with simplified TTS feedback
  const handlePoseDetection = (result) => {
    if (result && result.accuracy_score !== undefined) {
      // Use TTS service for simplified, actionable feedback with landmark validation
      ttsService.provideFeedback(
        activePose || selectedPose, 
        result.accuracy_score, 
        result.landmarks && result.landmarks.length > 0,
        result.landmarks ? result.landmarks.length : 0
      );
    }
  };

  // Start professional pose detection directly with live guidance
  const handleStartPose = async (poseId) => {
    if (startingPose) return;
    
    setStartingPose(poseId);
    
    try {
      console.log(`🧘 Starting live guided pose detection for: ${poseId}`);
      
      // Call the professional ML API endpoint
      const response = await axios.post(`${ML_API_URL}/api/ml/pose/${poseId}`);
      
      if (response.data.success) {
        console.log('✅ Professional pose detection started:', response.data.message);
        
        // Select this pose and notify parent
        setActivePose(poseId);
        setShowCameraModal(true);
        
        // Select this pose and notify parent
        onPoseSelect?.(poseId);
        onStartPose?.(poseId, response.data);
        
        // NO AUTOMATIC TTS WELCOME - Strict mode
        console.log('🔇 TTS Welcome DISABLED - Strict mode active, only corrective feedback during detection');
      } else {
        throw new Error(response.data.error || 'Failed to start pose detection');
      }
    } catch (err) {
      console.error('❌ Error starting pose:', err);
      alert(`❌ Failed to start ${poseId}: ${err.response?.data?.error || err.message}`);
    } finally {
      setStartingPose(null);
    }
  };

  // Close camera modal and END TTS SESSION
  const closeCameraModal = () => {
    setShowCameraModal(false);
    setActivePose(null);
    
    // CRITICAL: End TTS session when closing modal
    ttsService.endSession();
    console.log('🛑 Camera modal closed - TTS session ended');
  };

  const getPoseBenefits = (poseId) => {
    const pose = PROFESSIONAL_POSES.find(p => p.id === poseId);
    return pose?.benefits || ['Great for practice', 'Improves flexibility', 'Builds strength'];
  };

  const getPoseInstructions = (poseId) => {
    const pose = PROFESSIONAL_POSES.find(p => p.id === poseId);
    if (!pose) return ['Follow proper form', 'Breathe deeply', 'Hold steadily', 'Listen to your body'];
    
    return pose.instructions.split(', ').map((instruction, index) => 
      `${instruction.charAt(0).toUpperCase()}${instruction.slice(1)}`
    );
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'bg-green-500/20 text-green-400';
      case 'intermediate': return 'bg-amber-500/20 text-amber-400';
      case 'advanced': return 'bg-red-500/20 text-red-400';
      default: return 'bg-blue-500/20 text-blue-400';
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          <span className="ml-3 text-slate-400">Loading professional poses...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-xl rounded-2xl border border-red-500/30 p-6">
        <div className="text-center py-4">
          <div className="text-red-400 mb-2">⚠️ {error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-6 h-6 text-emerald-400" />
          <h2 className="text-xl font-semibold text-white">Professional Pose Selection</h2>
          <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium">
            Real MediaPipe
          </div>
        </div>

        {/* TTS Toggle */}
        <div className="mb-6">
          <button
            onClick={() => {
              const newState = !ttsService.getStatus().enabled;
              ttsService.setEnabled(newState);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              ttsService.getStatus().enabled
                ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                : 'bg-slate-700/50 border border-slate-600 text-slate-400'
            }`}
          >
            {ttsService.getStatus().enabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="font-medium">Voice Feedback</span>
            <span className="text-sm">{ttsService.getStatus().enabled ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Pose Grid - Smaller, More Compact Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {PROFESSIONAL_POSES
            .filter(pose => !completedPoses.includes(pose.id)) // Hide completed poses
            .map((pose) => {
            const isSelected = selectedPose === pose.id;
            const isStarting = startingPose === pose.id;
            const apiPose = availablePoses[pose.id];
            
            return (
              <div
                key={pose.id}
                onClick={() => !isStarting && onPoseSelect?.(pose.id)}
                onMouseEnter={() => setHoveredPose(pose.id)}
                onMouseLeave={() => setHoveredPose(null)}
                className={`relative p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                  isSelected
                    ? `bg-gradient-to-br ${pose.color}/20 border-emerald-500/50 shadow-lg shadow-emerald-500/20 transform scale-105`
                    : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600/50 hover:bg-slate-800/60 hover:transform hover:scale-102'
                }`}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2 z-10">
                    <div className="bg-emerald-500 rounded-full p-1">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}

                {/* Pose Image - Smaller and Compact */}
                <div 
                  className="w-full h-32 mb-3 mt-6 rounded-lg overflow-hidden bg-gradient-to-br from-slate-700/30 to-slate-800/30 shadow-lg border border-slate-600/20 cursor-pointer group"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowImageModal(pose);
                  }}
                >
                  <div className="relative w-full h-full">
                    <img 
                      src={pose.image} 
                      alt={pose.name}
                      className="w-full h-full object-contain bg-gradient-to-br from-white/5 to-slate-100/5 group-hover:scale-105 transition-transform duration-500"
                      style={{ 
                        filter: 'brightness(1.1) contrast(1.1)',
                        imageRendering: 'crisp-edges'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full hidden items-center justify-center text-8xl bg-gradient-to-br from-slate-600 to-slate-700 text-slate-300">
                      {pose.icon}
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg">
                        <span className="text-white text-sm font-medium">👁️ View Full Image</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pose Header - Compact */}
                <div className="flex items-start gap-2 mb-3">
                  <span className="text-2xl flex-shrink-0">{pose.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-sm leading-tight mb-1">{pose.name}</h3>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getDifficultyColor(pose.difficulty)}`}>
                        {pose.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pose Description - Shorter */}
                <p className="text-xs text-slate-300 mb-3 leading-relaxed line-clamp-2">{pose.description}</p>

                {/* Duration - Compact */}
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                  <Clock className="w-3 h-3 text-blue-400" />
                  <span className="font-medium">{pose.duration}</span>
                </div>

                {/* Action Button - Smaller */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartPose(pose.id);
                  }}
                  disabled={isStarting}
                  className={`
                    w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-bold text-xs
                    transition-all duration-200 shadow-lg
                    ${isStarting 
                      ? 'bg-slate-600/50 text-slate-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white hover:scale-105 active:scale-95 shadow-emerald-500/25'
                    }
                  `}
                >
                  {isStarting ? (
                    <>
                      <div className="w-3 h-3 border-2 border-slate-400/30 border-t-slate-400 rounded-full animate-spin"></div>
                      Starting...
                    </>
                  ) : (
                    <>
                      <Camera className="w-3 h-3" />
                      Start Pose
                    </>
                  )}
                </button>

                {/* Hover Effect */}
                {hoveredPose === pose.id && (
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-2xl pointer-events-none border border-emerald-400/20"></div>
                )}

                {/* Glow Effect for Selected */}
                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-2xl pointer-events-none"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Pose Details */}
        {selectedPose && (
          <div className="border-t border-slate-700/50 pt-6">
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-800/40 rounded-2xl p-6 border border-slate-700/30">
              {/* Header with Large Image */}
              <div className="flex flex-col lg:flex-row gap-6 mb-6">
                {/* Large Pose Image */}
                <div className="lg:w-1/3">
                  <div 
                    className="w-full h-64 rounded-xl overflow-hidden bg-gradient-to-br from-slate-700/50 to-slate-800/50 shadow-lg cursor-pointer group border border-slate-600/20"
                    onClick={() => setShowImageModal(PROFESSIONAL_POSES.find(p => p.id === selectedPose))}
                  >
                    <div className="relative w-full h-full">
                      <img 
                        src={PROFESSIONAL_POSES.find(p => p.id === selectedPose)?.image} 
                        alt={PROFESSIONAL_POSES.find(p => p.id === selectedPose)?.name}
                        className="w-full h-full object-contain bg-white/5 group-hover:scale-105 transition-transform duration-500"
                        style={{ 
                          filter: 'brightness(1.1) contrast(1.1)',
                          imageRendering: 'crisp-edges'
                        }}
                      />
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                          <span className="text-white text-sm font-medium">👁️ View Full Size</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pose Info */}
                <div className="lg:w-2/3">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{PROFESSIONAL_POSES.find(p => p.id === selectedPose)?.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        {PROFESSIONAL_POSES.find(p => p.id === selectedPose)?.name}
                      </h3>
                      <p className="text-slate-400">Professional MediaPipe Analysis Ready</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getDifficultyColor(PROFESSIONAL_POSES.find(p => p.id === selectedPose)?.difficulty)}`}>
                          {PROFESSIONAL_POSES.find(p => p.id === selectedPose)?.difficulty}
                        </span>
                        <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium">
                          Real MediaPipe
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-slate-300 mb-4 leading-relaxed">
                    {PROFESSIONAL_POSES.find(p => p.id === selectedPose)?.description}
                  </p>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-slate-700/40 rounded-xl">
                      <Clock className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                      <p className="text-xs text-slate-400">Hold Time</p>
                      <p className="text-sm font-bold text-white">
                        {PROFESSIONAL_POSES.find(p => p.id === selectedPose)?.duration || '30-60s'}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-slate-700/40 rounded-xl">
                      <Zap className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
                      <p className="text-xs text-slate-400">Calories</p>
                      <p className="text-sm font-bold text-white">3-5/min</p>
                    </div>
                    <div className="text-center p-3 bg-slate-700/40 rounded-xl">
                      <Target className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                      <p className="text-xs text-slate-400">Focus</p>
                      <p className="text-sm font-bold text-white">Balance</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  Key Benefits
                </h4>
                <div className="grid grid-cols-1 gap-1">
                  {getPoseBenefits(selectedPose).map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-slate-300">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-400" />
                  Step-by-Step Instructions
                </h4>
                <div className="space-y-2">
                  {getPoseInstructions(selectedPose).map((instruction, index) => (
                    <div key={index} className="flex items-start gap-3 text-sm text-slate-300">
                      <div className="w-5 h-5 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">
                        {index + 1}
                      </div>
                      <span>{instruction}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Professional Features */}
              <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                <h4 className="text-sm font-semibold text-emerald-400 mb-2">Professional MediaPipe Features Active</h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    <span>Real-time angle analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    <span>Visual correction feedback</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    <span>Accuracy scoring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    <span>Voice feedback (TTS)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{showImageModal.icon}</span>
                <div>
                  <h2 className="text-xl font-semibold text-white">{showImageModal.name}</h2>
                  <p className="text-sm text-slate-400">{showImageModal.description}</p>
                </div>
              </div>
              <button
                onClick={() => setShowImageModal(null)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            {/* Large Image */}
            <div className="p-6">
              <div className="w-full h-96 rounded-xl overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-700/50">
                <img 
                  src={showImageModal.image} 
                  alt={showImageModal.name}
                  className="w-full h-full object-contain bg-white/5"
                  style={{ 
                    filter: 'brightness(1.2) contrast(1.1)',
                    imageRendering: 'crisp-edges'
                  }}
                />
              </div>
              
              {/* Pose Details */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-white mb-3">Instructions:</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{showImageModal.instructions}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-3">Benefits:</h3>
                  <ul className="space-y-2">
                    {showImageModal.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-slate-300">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Camera Modal */}
      {showCameraModal && activePose && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center pt-1 px-2">
          <div className="bg-slate-900 rounded-2xl border border-slate-700 max-w-6xl w-full max-h-[98vh] overflow-hidden mt-1">
            {/* Modal Header - Compact */}
            <div className="flex items-center justify-between p-3 border-b border-slate-700 bg-slate-800/50">
              <div className="flex items-center gap-2">
                <span className="text-lg">{PROFESSIONAL_POSES.find(p => p.id === activePose)?.icon}</span>
                <div>
                  <h2 className="text-base font-semibold text-white">
                    {PROFESSIONAL_POSES.find(p => p.id === activePose)?.name}
                  </h2>
                  <p className="text-xs text-slate-400">Live Guided Practice</p>
                </div>
              </div>
              <button
                onClick={closeCameraModal}
                className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Camera Feed - Larger and Higher */}
            <div className="p-2">
              <PoseCamera
                isActive={true}
                onWebcamStart={() => console.log('Camera started')}
                onWebcamStop={() => console.log('Camera stopped')}
                onCapture={(imageSrc) => console.log('Image captured')}
                showLandmarks={true}
                mirrored={true}
                selectedPose={activePose}
                onPoseDetection={handlePoseDetection}
                onPoseComplete={onPoseComplete} // Pass the callback
                onPoseChange={(newPoseId) => {
                  console.log(`🔄 Parent received pose change: ${activePose} → ${newPoseId}`);
                  setActivePose(newPoseId);
                  onPoseSelect?.(newPoseId);
                }}
              />
            </div>

            {/* Instructions - Compact */}
            <div className="px-2 pb-2">
              <div className="bg-slate-800/50 rounded-xl p-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>🎯 Follow the live guidance</span>
                  <span>🔊 Listen to voice instructions</span>
                  <span>⏱️ Hold for {PROFESSIONAL_POSES.find(p => p.id === activePose)?.duration}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfessionalPoseSelector;