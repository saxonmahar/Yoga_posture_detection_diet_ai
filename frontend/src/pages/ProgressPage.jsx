import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Target, 
  Award, 
  Calendar, 
  BarChart3, 
  User, 
  Play, 
  ArrowRight,
  Zap,
  Clock,
  Flame,
  Star,
  Trophy,
  Activity,
  Heart,
  Brain,
  Sparkles,
  ChevronRight,
  Eye,
  Gauge,
  LineChart,
  PieChart,
  BarChart,
  Users,
  Globe,
  Shield,
  Rocket,
  Crown,
  Diamond,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  Plus,
  Filter,
  Download,
  Share2,
  Settings,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProgressDashboard from '../components/analytics/ProgressDashboard';

const ProgressPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [userAnalytics, setUserAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [yogaProgressData, setYogaProgressData] = useState(null);
  const [activeTimeframe, setActiveTimeframe] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('accuracy');

  useEffect(() => {
    if (user?._id || user?.id) {
      fetchUserAnalytics();
      
      // Clean up any non-user-specific localStorage data
      const cleanupSharedData = () => {
        const sharedKeys = [
          'yogaProgressData',
          'yogaSessionData', 
          'lastYogaSessionTime',
          'user'
        ];
        
        sharedKeys.forEach(key => {
          if (localStorage.getItem(key)) {
            console.log(`🧹 Removing shared localStorage key: ${key}`);
            localStorage.removeItem(key);
          }
        });
      };
      
      cleanupSharedData();
    } else {
      setLoading(false);
      console.log('⚠️ No authenticated user found for progress page');
    }
    
    // Check for yoga progress data from session - USER SPECIFIC ONLY
    if (user?._id || user?.id) {
      const userId = user._id || user.id;
      const progressData = localStorage.getItem(`yogaProgressData_${userId}`);
      if (progressData) {
        try {
          const parsedData = JSON.parse(progressData);
          setYogaProgressData(parsedData);
          console.log(`📈 User-specific yoga progress data found for user ${userId}:`, parsedData);
        } catch (error) {
          console.error('Error parsing yoga progress data:', error);
        }
      } else {
        console.log(`ℹ️ No user-specific progress data found for user ${userId}`);
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
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-xl font-semibold transition-all border border-blue-500/30"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const fetchUserAnalytics = async () => {
    try {
      const userId = user._id || user.id;
      if (!userId) {
        console.log('⚠️ No user ID available for progress analytics')
        setLoading(false)
        return
      }
      
      console.log('📊 Fetching progress analytics for user:', userId);
      
      const response = await fetch(`http://localhost:5001/api/analytics/user/${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUserAnalytics(data.analytics);
          console.log('✅ Progress analytics loaded:', data.analytics);
        } else {
          console.log('⚠️ Progress analytics request failed:', data.error);
        }
      } else if (response.status === 404) {
        console.log('ℹ️ No progress analytics found for user - showing empty state');
      } else {
        console.log(`⚠️ Progress analytics request failed with status: ${response.status}`);
      }
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.log('🌐 Backend server not available - using empty state');
      } else {
        console.error('❌ Error fetching progress analytics:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Check if user has any sessions
  const totalSessions = userAnalytics?.overall_stats?.total_sessions || 0;
  
  const hasRecentSession = () => {
    if (!user?._id && !user?.id) {
      return false;
    }
    
    const userId = user._id || user.id;
    const lastSessionTime = localStorage.getItem(`lastYogaSessionTime_${userId}`);
    const yogaProgressData = localStorage.getItem(`yogaProgressData_${userId}`);
    const yogaSessionData = localStorage.getItem(`yogaSessionData_${userId}`);
    
    if (lastSessionTime) {
      try {
        const sessionTime = new Date(lastSessionTime);
        const now = new Date();
        const hoursDiff = (now - sessionTime) / (1000 * 60 * 60);
        
        if (hoursDiff <= 24) {
          console.log(`✅ Recent session found for user ${userId}: ${hoursDiff.toFixed(1)} hours ago`);
          return true;
        }
      } catch (error) {
        console.error('Error checking recent session:', error);
      }
    }
    
    const hasUserSpecificData = !!(yogaProgressData || yogaSessionData);
    if (hasUserSpecificData) {
      console.log(`✅ User-specific session data found for user ${userId}`);
    }
    return hasUserSpecificData;
  };
  
  const hasCompletedSessions = totalSessions > 0 || hasRecentSession();

  // Handle start session click
  const handleStartSession = () => {
    navigate('/pose-detection', { 
      state: { 
        autoStartWebcam: true,
        fromProgress: true 
      } 
    });
  };

  // Mock data for premium visualizations
  const mockWeeklyData = [
    { day: 'Mon', accuracy: 85, sessions: 2, calories: 120 },
    { day: 'Tue', accuracy: 88, sessions: 1, calories: 80 },
    { day: 'Wed', accuracy: 92, sessions: 3, calories: 180 },
    { day: 'Thu', accuracy: 87, sessions: 2, calories: 140 },
    { day: 'Fri', accuracy: 94, sessions: 2, calories: 160 },
    { day: 'Sat', accuracy: 91, sessions: 4, calories: 220 },
    { day: 'Sun', accuracy: 89, sessions: 1, calories: 90 }
  ];

  const poseAccuracyData = [
    { pose: 'Tree Pose', accuracy: 94, improvement: 8, sessions: 12 },
    { pose: 'Warrior II', accuracy: 91, improvement: 5, sessions: 15 },
    { pose: 'Downward Dog', accuracy: 89, improvement: 12, sessions: 18 },
    { pose: 'Plank', accuracy: 87, improvement: -2, sessions: 10 },
    { pose: 'Goddess', accuracy: 85, improvement: 15, sessions: 8 },
    { pose: 'T-Pose', accuracy: 96, improvement: 3, sessions: 20 }
  ];

  const achievements = [
    { 
      id: 1, 
      title: 'First Steps', 
      description: 'Complete your first yoga session', 
      icon: Star, 
      unlocked: true, 
      date: '2 days ago',
      rarity: 'common'
    },
    { 
      id: 2, 
      title: 'Consistency Master', 
      description: 'Practice for 7 consecutive days', 
      icon: Flame, 
      unlocked: true, 
      date: '1 day ago',
      rarity: 'rare'
    },
    { 
      id: 3, 
      title: 'Pose Perfectionist', 
      description: 'Achieve 95% accuracy in any pose', 
      icon: Target, 
      unlocked: false, 
      date: null,
      rarity: 'epic'
    },
    { 
      id: 4, 
      title: 'Wellness Warrior', 
      description: 'Complete 50 total sessions', 
      icon: Crown, 
      unlocked: false, 
      date: null,
      rarity: 'legendary'
    }
  ];

  // Empty state for new users
  if (!loading && !hasCompletedSessions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Header */}
        <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-purple-500/20 rounded-full text-sm font-semibold text-emerald-400 mb-8 border border-emerald-500/30 backdrop-blur-sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              PROGRESS ANALYTICS
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Your Wellness{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Journey Starts Here
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-4xl mx-auto leading-relaxed mb-12">
              Welcome, {user?.name || user?.fullName || 'Yogi'}! Complete your first session to unlock 
              advanced analytics, personalized insights, and achievement tracking.
            </p>

            {/* Preview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
              {[
                { icon: Target, label: 'Pose Accuracy', value: 'Track Form', color: 'from-blue-500 to-cyan-500' },
                { icon: TrendingUp, label: 'Progress Trends', value: 'See Growth', color: 'from-emerald-500 to-teal-500' },
                { icon: Flame, label: 'Streak Counter', value: 'Build Habits', color: 'from-orange-500 to-red-500' },
                { icon: Trophy, label: 'Achievements', value: 'Earn Badges', color: 'from-yellow-500 to-orange-500' }
              ].map((stat, index) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-800/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                    <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50 shadow-2xl group-hover:border-slate-600 transition-all duration-300 hover:transform hover:scale-105">
                      <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-sm text-slate-400">{stat.label}</div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
              <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-3xl p-12 border border-slate-700/50 shadow-2xl">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/30">
                  <Rocket className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Ready to Begin Your{" "}
                  <span className="bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent">
                    Transformation?
                  </span>
                </h3>
                <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
                  Start your first AI-powered yoga session and unlock a world of personalized insights, 
                  progress tracking, and achievement rewards.
                </p>
                <button
                  onClick={handleStartSession}
                  className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 rounded-2xl font-bold text-white text-lg transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-105 group"
                >
                  <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  Start Your First Session
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Feature Preview */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                What You'll{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Unlock
                </span>
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Advanced analytics and insights await your first session
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {[
                {
                  icon: LineChart,
                  title: 'Advanced Analytics',
                  description: 'Detailed performance metrics with beautiful visualizations and trend analysis',
                  features: ['Real-time accuracy tracking', 'Progress trend charts', 'Performance comparisons', 'Weekly/monthly reports'],
                  color: 'from-blue-500 to-cyan-500'
                },
                {
                  icon: Brain,
                  title: 'AI Insights',
                  description: 'Personalized recommendations powered by machine learning algorithms',
                  features: ['Form improvement tips', 'Pose difficulty suggestions', 'Optimal session timing', 'Injury prevention alerts'],
                  color: 'from-purple-500 to-pink-500'
                },
                {
                  icon: Trophy,
                  title: 'Achievement System',
                  description: 'Gamified experience with badges, streaks, and milestone celebrations',
                  features: ['Unlock rare achievements', 'Build practice streaks', 'Compete with friends', 'Celebrate milestones'],
                  color: 'from-yellow-500 to-orange-500'
                }
              ].map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-800/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                    <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl group-hover:border-slate-600 transition-all duration-300 hover:transform hover:scale-105 h-full">
                      
                      <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                      <p className="text-slate-400 mb-6 leading-relaxed">{feature.description}</p>
                      
                      <div className="space-y-3">
                        {feature.features.map((item, idx) => (
                          <div key={idx} className="flex items-center text-slate-300">
                            <CheckCircle className="w-4 h-4 text-emerald-400 mr-3 flex-shrink-0" />
                            <span className="text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>
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

  // Premium Progress Dashboard for users with sessions
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Premium Header */}
      <section className="relative pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Progress Analytics</h1>
                <p className="text-slate-400">Welcome back, {user?.name || user?.fullName || 'Yogi'}!</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all">
                <RefreshCw className="w-5 h-5 text-slate-400" />
              </button>
              <button className="p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all">
                <Download className="w-5 h-5 text-slate-400" />
              </button>
              <button className="p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all">
                <Share2 className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Premium Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                icon: TrendingUp,
                label: 'Total Sessions',
                value: totalSessions > 0 ? totalSessions : (yogaProgressData ? 1 : 0),
                change: '+12%',
                changeType: 'positive',
                color: 'from-emerald-500 to-teal-500',
                bgColor: 'from-emerald-500/10 to-teal-500/10'
              },
              {
                icon: Flame,
                label: 'Current Streak',
                value: `${userAnalytics?.overall_stats?.current_streak || (hasRecentSession() ? 1 : 0)} days`,
                change: '+2 days',
                changeType: 'positive',
                color: 'from-orange-500 to-red-500',
                bgColor: 'from-orange-500/10 to-red-500/10'
              },
              {
                icon: Target,
                label: 'Avg Accuracy',
                value: `${yogaProgressData?.latestSession?.averageAccuracy || 92}%`,
                change: '+5%',
                changeType: 'positive',
                color: 'from-blue-500 to-cyan-500',
                bgColor: 'from-blue-500/10 to-cyan-500/10'
              },
              {
                icon: Trophy,
                label: 'Achievements',
                value: userAnalytics?.achievements?.length || (hasRecentSession() ? 2 : 0),
                change: '+1 new',
                changeType: 'positive',
                color: 'from-yellow-500 to-orange-500',
                bgColor: 'from-yellow-500/10 to-orange-500/10'
              }
            ].map((stat, index) => {
              const Icon = stat.icon
              const ChangeIcon = stat.changeType === 'positive' ? ArrowUp : stat.changeType === 'negative' ? ArrowDown : Minus
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-800/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50 shadow-2xl group-hover:border-slate-600 transition-all duration-300 hover:transform hover:scale-105">
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className={`flex items-center space-x-1 px-2 py-1 bg-gradient-to-r ${stat.bgColor} rounded-lg border border-current/20`}>
                        <ChangeIcon className={`w-3 h-3 ${stat.changeType === 'positive' ? 'text-emerald-400' : stat.changeType === 'negative' ? 'text-red-400' : 'text-slate-400'}`} />
                        <span className={`text-xs font-medium ${stat.changeType === 'positive' ? 'text-emerald-400' : stat.changeType === 'negative' ? 'text-red-400' : 'text-slate-400'}`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Time Frame Selector */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-white">Performance Overview</h2>
              <div className="flex bg-slate-800/50 rounded-xl p-1 border border-slate-700/50">
                {['week', 'month', 'year'].map((timeframe) => (
                  <button
                    key={timeframe}
                    onClick={() => setActiveTimeframe(timeframe)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                      activeTimeframe === timeframe
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {timeframe}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <select 
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2 text-white focus:border-emerald-500/50 focus:outline-none"
              >
                <option value="accuracy">Accuracy</option>
                <option value="sessions">Sessions</option>
                <option value="calories">Calories</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left Column - Charts */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Weekly Performance Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-800/30 rounded-3xl blur-xl"></div>
                <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Weekly Performance</h3>
                    <div className="flex items-center space-x-2">
                      <LineChart className="w-5 h-5 text-emerald-400" />
                      <span className="text-sm text-slate-400">Last 7 days</span>
                    </div>
                  </div>
                  
                  {/* Mock Chart Visualization */}
                  <div className="h-64 flex items-end justify-between space-x-2">
                    {mockWeeklyData.map((day, index) => (
                      <div key={day.day} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-gradient-to-t from-emerald-500 to-cyan-500 rounded-t-lg transition-all duration-500 hover:from-emerald-400 hover:to-cyan-400"
                          style={{ 
                            height: `${(day[selectedMetric] / Math.max(...mockWeeklyData.map(d => d[selectedMetric]))) * 200}px`,
                            minHeight: '20px'
                          }}
                        ></div>
                        <span className="text-xs text-slate-400 mt-2">{day.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Pose Accuracy Breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-800/30 rounded-3xl blur-xl"></div>
                <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Pose Accuracy Breakdown</h3>
                    <div className="flex items-center space-x-2">
                      <Target className="w-5 h-5 text-blue-400" />
                      <span className="text-sm text-slate-400">Individual poses</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {poseAccuracyData.map((pose, index) => (
                      <div key={pose.pose} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-sm">{index + 1}</span>
                          </div>
                          <div>
                            <div className="font-semibold text-white">{pose.pose}</div>
                            <div className="text-sm text-slate-400">{pose.sessions} sessions</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-2xl font-bold text-white">{pose.accuracy}%</div>
                            <div className={`text-sm flex items-center ${pose.improvement >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {pose.improvement >= 0 ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                              {Math.abs(pose.improvement)}%
                            </div>
                          </div>
                          <div className="w-20 h-2 bg-slate-600 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                              style={{ width: `${pose.accuracy}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Achievements & Insights */}
            <div className="space-y-8">
              
              {/* Achievements */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-800/30 rounded-3xl blur-xl"></div>
                <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Achievements</h3>
                    <Trophy className="w-5 h-5 text-yellow-400" />
                  </div>
                  
                  <div className="space-y-4">
                    {achievements.map((achievement) => {
                      const Icon = achievement.icon
                      return (
                        <div 
                          key={achievement.id} 
                          className={`p-4 rounded-xl border transition-all ${
                            achievement.unlocked 
                              ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30' 
                              : 'bg-slate-700/30 border-slate-600/30'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              achievement.unlocked 
                                ? `bg-gradient-to-br ${
                                    achievement.rarity === 'legendary' ? 'from-purple-500 to-pink-500' :
                                    achievement.rarity === 'epic' ? 'from-indigo-500 to-purple-500' :
                                    achievement.rarity === 'rare' ? 'from-blue-500 to-cyan-500' :
                                    'from-emerald-500 to-teal-500'
                                  }`
                                : 'bg-slate-600'
                            }`}>
                              <Icon className={`w-5 h-5 ${achievement.unlocked ? 'text-white' : 'text-slate-400'}`} />
                            </div>
                            <div className="flex-1">
                              <div className={`font-semibold ${achievement.unlocked ? 'text-white' : 'text-slate-400'}`}>
                                {achievement.title}
                              </div>
                              <div className="text-sm text-slate-400">{achievement.description}</div>
                              {achievement.unlocked && achievement.date && (
                                <div className="text-xs text-emerald-400 mt-1">Unlocked {achievement.date}</div>
                              )}
                            </div>
                            {achievement.unlocked && (
                              <CheckCircle className="w-5 h-5 text-emerald-400" />
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>

              {/* AI Insights */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-800/30 rounded-3xl blur-xl"></div>
                <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">AI Insights</h3>
                    <Brain className="w-5 h-5 text-purple-400" />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl border border-emerald-500/30">
                      <div className="flex items-center space-x-2 mb-2">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-medium text-emerald-400">Improvement Tip</span>
                      </div>
                      <p className="text-sm text-slate-300">
                        Your Tree Pose has improved 8% this week! Focus on engaging your core for better balance.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/30">
                      <div className="flex items-center space-x-2 mb-2">
                        <Target className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium text-blue-400">Next Goal</span>
                      </div>
                      <p className="text-sm text-slate-300">
                        You're 3% away from achieving 95% accuracy in Warrior II. Keep practicing!
                      </p>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/30">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-medium text-purple-400">Optimal Time</span>
                      </div>
                      <p className="text-sm text-slate-300">
                        Your best sessions happen around 7 PM. Consider scheduling practice then.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-800/30 rounded-3xl blur-xl"></div>
                <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
                  <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
                  
                  <div className="space-y-3">
                    <button
                      onClick={handleStartSession}
                      className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 rounded-xl border border-emerald-500/30 hover:border-emerald-500/50 transition-all group"
                    >
                      <div className="flex items-center space-x-3">
                        <Play className="w-5 h-5 text-emerald-400" />
                        <span className="font-medium text-white">Start New Session</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                    </button>
                    
                    <button
                      onClick={() => navigate('/diet-plan')}
                      className="w-full flex items-center justify-between p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl border border-slate-600/30 hover:border-slate-600/50 transition-all group"
                    >
                      <div className="flex items-center space-x-3">
                        <Heart className="w-5 h-5 text-pink-400" />
                        <span className="font-medium text-white">View Diet Plan</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-pink-400 group-hover:translate-x-1 transition-all" />
                    </button>
                    
                    <button
                      onClick={() => navigate('/community')}
                      className="w-full flex items-center justify-between p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl border border-slate-600/30 hover:border-slate-600/50 transition-all group"
                    >
                      <div className="flex items-center space-x-3">
                        <Users className="w-5 h-5 text-cyan-400" />
                        <span className="font-medium text-white">Join Community</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Original Progress Dashboard Component */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <ProgressDashboard 
              userId={user?._id || user?.id} 
              yogaProgressData={yogaProgressData}
              userAnalytics={userAnalytics}
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ProgressPage;