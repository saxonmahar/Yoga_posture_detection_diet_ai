import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Award, Calendar, BarChart3, User } from 'lucide-react';
import ProgressDashboard from '../components/analytics/ProgressDashboard';

const ProgressPage = () => {
  const [user, setUser] = useState(null);
  const [yogaProgressData, setYogaProgressData] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        console.log('👤 User data loaded:', parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
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

    // Debug all localStorage data
    console.log('🔍 All localStorage keys:', Object.keys(localStorage));
    console.log('🔍 yogaProgressData raw:', localStorage.getItem('yogaProgressData'));
    console.log('🔍 user raw:', localStorage.getItem('user'));
  }, []);

  // Allow access if user exists OR if yoga progress data exists
  if (!user && !yogaProgressData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-slate-400 mb-4">Please log in to view your progress</div>
          <button 
            onClick={() => window.location.href = '/login'}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Debug logging
  console.log('🔍 ProgressPage Debug:', { user, yogaProgressData });

  // Get user ID safely
  const userId = user?._id || user?.id || 'guest';

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
                Welcome back, {user?.name || user?.username || 'Yoga Practitioner'}!
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
                <div className="text-sm text-slate-400">Track Progress</div>
                <div className="text-lg font-bold text-white">Real-time</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50"
              >
                <Target className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-sm text-slate-400">Pose Mastery</div>
                <div className="text-lg font-bold text-white">6 Poses</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50"
              >
                <Award className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <div className="text-sm text-slate-400">Achievements</div>
                <div className="text-lg font-bold text-white">Unlock</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50"
              >
                <Calendar className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <div className="text-sm text-slate-400">Streak Tracking</div>
                <div className="text-lg font-bold text-white">Daily</div>
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
          <ProgressDashboard userId={userId} yogaProgressData={yogaProgressData} />
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
            <h3 className="text-lg font-semibold text-white mb-2">How Progress Tracking Works</h3>
            <p className="text-slate-400 text-sm mb-4">
              Your progress is automatically tracked every time you practice yoga poses. 
              We analyze your accuracy, improvement trends, and consistency to provide personalized insights.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-emerald-400 font-medium">📊 Real-time Analysis</div>
                <div className="text-slate-500">MediaPipe tracks your pose accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-blue-400 font-medium">🎯 Smart Insights</div>
                <div className="text-slate-500">AI provides personalized recommendations</div>
              </div>
              <div className="text-center">
                <div className="text-yellow-400 font-medium">🏆 Achievement System</div>
                <div className="text-slate-500">Unlock badges as you improve</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProgressPage;