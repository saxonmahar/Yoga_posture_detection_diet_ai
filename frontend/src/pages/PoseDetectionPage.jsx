import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Users, Heart, Star, Sparkles
} from 'lucide-react';
import ProfessionalPoseSelector from '../components/pose-detection/ProfessionalPoseSelector';
import { AnimatedPage, AnimatedCard, LoadingSpinner } from "../animations/framer-config.jsx";
import { useAuth } from '../context/AuthContext';

const PoseDetectionPage = () => {
  const navigate = useNavigate();
  
  // Get auth context
  const { user, loading: authLoading } = useAuth();
  
  // State variables
  const [selectedPose, setSelectedPose] = useState('yog3');

  // Professional yoga poses from the integrated system
  const YOGA_POSES = [
    { id: 'yog1', name: 'Warrior II (Virabhadrasana II)', icon: '⚔️', difficulty: 'Intermediate', color: 'from-orange-500 to-red-500', description: 'Strong standing pose with arms extended' },
    { id: 'yog2', name: 'T Pose', icon: '🤸', difficulty: 'Beginner', color: 'from-blue-500 to-cyan-500', description: 'Simple standing pose with arms extended' },
    { id: 'yog3', name: 'Tree Pose (Vrikshasana)', icon: '🌳', difficulty: 'Beginner', color: 'from-green-500 to-emerald-500', description: 'Balance on one leg with hands in prayer position' },
    { id: 'yog4', name: 'Goddess Pose', icon: '👸', difficulty: 'Intermediate', color: 'from-purple-500 to-pink-500', description: 'Wide-legged squat with arms raised' },
    { id: 'yog5', name: 'Downward Facing Dog', icon: '🐕', difficulty: 'Intermediate', color: 'from-yellow-500 to-amber-500', description: 'Inverted V-shape with hands and feet on ground' },
    { id: 'yog6', name: 'Plank Pose', icon: '💪', difficulty: 'Beginner', color: 'from-indigo-500 to-blue-500', description: 'Hold body straight like a plank' }
  ];

  // ==================== User Authentication ====================
  useEffect(() => {
    console.log('🔍 Auth state:', { user, authLoading });
    
    if (!authLoading && !user) {
      console.log('⚠️ No user after auth loaded, redirecting to login');
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Get current pose details
  const getCurrentPoseDetails = () => {
    return YOGA_POSES.find(pose => pose.id === selectedPose) || YOGA_POSES[0];
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
            <span className="text-red-400 text-2xl">⚠️</span>
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
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Left Column - Professional Pose Selection */}
            <div className="xl:col-span-3 space-y-8">
              <AnimatedCard delay={0.1}>
                <ProfessionalPoseSelector
                  selectedPose={selectedPose}
                  onPoseSelect={setSelectedPose}
                  onStartPose={(poseId, poseData) => {
                    console.log('🧘 Professional pose started:', poseId, poseData);
                  }}
                  isActive={false}
                />
              </AnimatedCard>
            </div>

            {/* Right Column - Quick Actions & Tips */}
            <div className="xl:col-span-1 space-y-8">
              {/* Quick Actions */}
              <AnimatedCard delay={0.2}>
                <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-yellow-400">⚡</span>
                    Quick Actions
                  </h2>
                  
                  <div className="space-y-3">
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
                      <span className="text-xl">📊</span>
                      <span className="font-medium">View Progress Analytics</span>
                    </button>
                    
                    <button
                      onClick={() => navigate('/diet-plan')}
                      className="w-full p-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl transition-all flex items-center justify-center gap-3"
                    >
                      <span className="text-xl">🍎</span>
                      <span className="font-medium">Get Diet Plan</span>
                    </button>
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
                  Select a pose above and click "Start Pose" to begin your AI-powered yoga session with real-time feedback
                </p>
              </div>
              <div className="flex gap-3">
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