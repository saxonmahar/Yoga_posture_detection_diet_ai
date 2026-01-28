import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Award, Calendar, BarChart3, User, Play, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProgressDashboard from '../components/analytics/ProgressDashboard';

const ProgressPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [userAnalytics, setUserAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [yogaProgressData, setYogaProgressData] = useState(null);

  useEffect(() => {
    if (user?._id || user?.id) {
      fetchUserAnalytics();
    } else {
      setLoading(false);
      console.log('⚠️ No authenticated user found for progress page');
    }
    
    // Check for yoga progress data from session
    const progressData = localStorage.getItem('yogaProgressData');
    if (progressData) {
      try {
        const parsedData = JSON.parse(progressData);
        setYogaProgressData(parsedData);
        console.log('📈 Yoga progress data found:', parsedData);
      } catch (error) {
        console.error('Error parsing yoga progress data:', error);
      }
    }
  }, [user]);

  // If still loading auth, show loading spinner
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user is authenticated, show login prompt
  if (!user && !authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
            <BarChart3 className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Progress Tracking</h2>
          <p className="text-slate-400 mb-6">Please log in to view your personal yoga progress and analytics.</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/login')}
              className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl font-semibold transition-all shadow-lg shadow-emerald-500/20"
            >
              Log In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="w-full px-6 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl font-semibold transition-all border border-slate-600/50 hover:border-slate-600"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  const fetchUserAnalytics = async () => {
    try {
      const userId = user._id || user.id;
      console.log('📊 Fetching progress analytics for user:', userId);
      
      const response = await fetch(`http://localhost:5001/api/analytics/user/${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUserAnalytics(data.analytics);
          console.log('✅ Progress analytics loaded:', data.analytics);
        }
      } else {
        console.log('⚠️ No analytics data available yet');
      }
    } catch (error) {
      console.error('❌ Error fetching progress analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check if user has any sessions - USER SPECIFIC ONLY
  const totalSessions = userAnalytics?.overall_stats?.total_sessions || 0;
  const hasCompletedSessions = totalSessions > 0;

  // Handle start session click
  const handleStartSession = () => {
    navigate('/pose-detection', { 
      state: { 
        autoStartWebcam: true,
        fromProgress: true 
      } 
    });
  };

  // Empty state for new users - NEVER show other users' data
  if (!loading && !hasCompletedSessions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 backdrop-blur-sm border-b border-slate-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <BarChart3 className="w-8 h-8 text-emerald-400" />
                <h1 className="text-4xl font-bold text-white">Your Progress Journey</h1>
              </div>
              <p className="text-xl text-slate-300 mb-6">
                Welcome, {user?.name || user?.fullName || 'Yogi'}! Your wellness story starts here.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Empty State Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Illustration */}
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full flex items-center justify-center border border-emerald-500/30">
                <BarChart3 className="w-16 h-16 text-emerald-400" />
              </div>
            </div>

            {/* Main Message */}
            <h2 className="text-3xl font-bold text-white mb-4">
              Your Progress Story Awaits
            </h2>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Complete your first yoga session to unlock detailed analytics, track your improvement, 
              and celebrate your achievements on this wellness journey.
            </p>

            {/* What You'll Get */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gradient-to-br from-slate-800/60 to-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
              >
                <Target className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Pose Accuracy</h3>
                <p className="text-slate-400 text-sm">
                  Track your form improvement across all 6 yoga poses with real-time feedback
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gradient-to-br from-slate-800/60 to-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
              >
                <TrendingUp className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Progress Trends</h3>
                <p className="text-slate-400 text-sm">
                  Visualize your improvement over time with beautiful charts and insights
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-gradient-to-br from-slate-800/60 to-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
              >
                <Award className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Achievements</h3>
                <p className="text-slate-400 text-sm">
                  Unlock badges and celebrate milestones as you build your practice
                </p>
              </motion.div>
            </div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-xl rounded-2xl p-8 border border-emerald-500/30"
            >
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Begin?</h3>
              <p className="text-slate-300 mb-6">
                Start your first yoga session and watch your progress unfold in real-time
              </p>
              <button
                onClick={handleStartSession}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl font-bold text-white transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-105"
              >
                <Play className="w-6 h-6" />
                Start Your First Session
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>

            {/* Motivational Quote */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-12 text-center"
            >
              <blockquote className="text-lg italic text-slate-400">
                "The journey of a thousand miles begins with a single step."
              </blockquote>
              <p className="text-sm text-slate-500 mt-2">- Lao Tzu</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading your progress...</p>
        </div>
      </div>
    );
  }

  // Show progress dashboard for users with sessions - USER DATA ONLY
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <BarChart3 className="w-8 h-8 text-emerald-400" />
              <h1 className="text-4xl font-bold text-white">Progress Analytics</h1>
            </div>
            <p className="text-xl text-slate-300 mb-6">
              Track your yoga journey and celebrate your achievements
            </p>
            
            {/* User Welcome */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <User className="w-5 h-5 text-emerald-400" />
              <span className="text-lg text-emerald-400 font-medium">
                Welcome back, {user?.name || user?.fullName || 'Yoga Practitioner'}!
              </span>
            </div>

            {/* Latest Session Banner */}
            {yogaProgressData?.latestSession && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-2xl p-6 mb-6 max-w-4xl mx-auto"
              >
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-emerald-400 mb-2">🎉 Latest Session Complete!</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-slate-400">Poses</div>
                      <div className="text-white font-bold">{yogaProgressData.latestSession.completedPoses?.length || 0}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Duration</div>
                      <div className="text-white font-bold">{Math.round(yogaProgressData.latestSession.totalTime / 60)}m</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Accuracy</div>
                      <div className="text-white font-bold">{yogaProgressData.latestSession.averageAccuracy || 0}%</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Calories</div>
                      <div className="text-white font-bold">{yogaProgressData.latestSession.totalCalories || 0}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Quick Stats Preview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50"
              >
                <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <div className="text-sm text-slate-400">Sessions</div>
                <div className="text-lg font-bold text-white">{totalSessions}</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50"
              >
                <Target className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-sm text-slate-400">Streak</div>
                <div className="text-lg font-bold text-white">{userAnalytics?.overall_stats?.current_streak || 0} days</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50"
              >
                <Award className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <div className="text-sm text-slate-400">Achievements</div>
                <div className="text-lg font-bold text-white">{userAnalytics?.achievements?.length || 0}</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50"
              >
                <Calendar className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <div className="text-sm text-slate-400">Favorite Pose</div>
                <div className="text-lg font-bold text-white">{userAnalytics?.overall_stats?.favorite_pose || 'None'}</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <ProgressDashboard 
            userId={user?._id || user?.id} 
            yogaProgressData={yogaProgressData}
            userAnalytics={userAnalytics}
          />
        </motion.div>
      </div>

      {/* Footer Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-gradient-to-br from-slate-800/60 to-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6"
        >
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Your Personal Progress</h3>
            <p className="text-slate-400 text-sm mb-4">
              All data shown is specific to your account and practice sessions. 
              Your privacy is protected - no other user data is ever displayed.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-emerald-400 font-medium">📊 Real-time Analysis</div>
                <div className="text-slate-500">MediaPipe tracks your pose accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-blue-400 font-medium">🎯 Personal Insights</div>
                <div className="text-slate-500">AI provides your personalized recommendations</div>
              </div>
              <div className="text-center">
                <div className="text-yellow-400 font-medium">🏆 Your Achievements</div>
                <div className="text-slate-500">Unlock badges based on your progress</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProgressPage;