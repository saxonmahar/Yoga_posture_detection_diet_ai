import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Calendar,
  Target,
  TrendingUp,
  Trophy,
  Zap,
  Heart,
  Users,
  ArrowRight,
  Camera,
  Utensils,
  BarChart3,
  Star,
  Clock,
  Activity,
  Flame,
  Award,
  Target as TargetIcon,
  Play,
  Sparkles,
  TrendingDown,
  CheckCircle2,
  ChevronRight,
  Apple,
  Moon,
  Sun,
  Droplets,
  AlertCircle,
  User
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function Dashboard() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [userAnalytics, setUserAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hasCompletedSession, setHasCompletedSession] = useState(false)

  // Fetch real user analytics on component mount
  useEffect(() => {
    if (user?._id || user?.id) {
      fetchUserAnalytics()
      checkSessionCompletion()
    } else {
      // No authenticated user - set loading to false and show guest experience
      setLoading(false)
      console.log('⚠️ No authenticated user found')
    }
  }, [user])

  // Also check session completion when userAnalytics updates
  useEffect(() => {
    if (userAnalytics?.overall_stats?.total_sessions > 0) {
      setHasCompletedSession(true)
      console.log(`✅ Analytics loaded: ${userAnalytics.overall_stats.total_sessions} sessions - UNLOCKED`)
    }
  }, [userAnalytics])

  // If still loading auth, show loading spinner
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  // If no user is authenticated, redirect to login
  if (!user && !authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
            <User className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Welcome to Yoga AI</h2>
          <p className="text-slate-400 mb-6">Please log in to access your personalized dashboard and track your yoga progress.</p>
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
    )
  }

  const fetchUserAnalytics = async () => {
    try {
      const userId = user._id || user.id
      if (!userId) {
        console.log('⚠️ No user ID available for analytics')
        setLoading(false)
        return
      }
      
      console.log('📊 Fetching dashboard analytics for user:', userId)
      
      const response = await fetch(`http://localhost:5001/api/analytics/user/${userId}`)
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setUserAnalytics(data.analytics)
          console.log('✅ Dashboard analytics loaded:', data.analytics)
        } else {
          console.log('⚠️ Analytics request failed:', data.error)
        }
      } else if (response.status === 404) {
        console.log('ℹ️ No analytics data found for user - showing empty state')
      } else {
        console.log(`⚠️ Analytics request failed with status: ${response.status}`)
      }
    } catch (error) {
      // Only log unexpected errors, not network issues
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.log('🌐 Backend server not available - using empty state')
      } else {
        console.error('❌ Error fetching dashboard analytics:', error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const checkSessionCompletion = async () => {
    // First check if user has any completed sessions in the database
    if (user?._id || user?.id) {
      try {
        const userId = user._id || user.id
        const response = await fetch(`http://localhost:5001/api/analytics/user/${userId}`)
        
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.analytics?.overall_stats?.total_sessions > 0) {
            setHasCompletedSession(true)
            console.log(`✅ User has ${data.analytics.overall_stats.total_sessions} completed sessions - UNLOCKED`)
            return
          }
        }
      } catch (error) {
        console.log('🌐 Backend not available, checking localStorage...')
      }
    }
    
    // Check localStorage for session completion flag
    const hasCompletedFlag = localStorage.getItem('hasCompletedYogaSession')
    if (hasCompletedFlag === 'true') {
      setHasCompletedSession(true)
      console.log('✅ Found session completion flag - UNLOCKED')
      return
    }
    
    // Fallback: check localStorage for recent session completion
    const lastSessionTime = localStorage.getItem('lastYogaSessionTime')
    const lastSessionData = localStorage.getItem('yogaSessionData')
    const lastProgressData = localStorage.getItem('yogaProgressData')
    
    // Check if user has ever completed a session (no time limit)
    if (lastSessionTime || lastSessionData || lastProgressData) {
      setHasCompletedSession(true)
      // Set the flag for future checks
      localStorage.setItem('hasCompletedYogaSession', 'true')
      console.log('✅ Found session data in localStorage - UNLOCKED')
      return
    }
    
    console.log('📊 No session completion found - LOCKED')
    setHasCompletedSession(false)
  }

  // Check Flask ML server status
  const checkMLServer = async () => {
    try {
      const response = await fetch('http://localhost:5000/health', {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
      });
      
      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      }
      return { success: false, error: 'Server not responding properly' };
    } catch (error) {
      return { success: false, error: 'Cannot connect to ML server' };
    }
  };

  // Handle AI Pose Detection click - UPDATED
  const handlePoseDetectionClick = async () => {
    // Check if ML server is running
    const mlStatus = await checkMLServer();
    
    if (!mlStatus.success) {
      // Show dialog with instructions
      const userConfirmed = window.confirm(
        '🧘 AI Pose Detection requires the ML Server to be running.\n\n' +
        'To start the ML Server:\n' +
        '1. Open Terminal/CMD\n' +
        '2. Navigate to: cd backend/Ml\n' +
        '3. Run: python app.py\n\n' +
        'The server should start on http://localhost:5000\n\n' +
        'Click OK to open pose detection anyway, or Cancel to stay here.'
      );
      
      if (!userConfirmed) {
        return; // Don't navigate if user cancels
      }
    }
    
    // Navigate to pose detection page WITH AUTO-START FLAG
    navigate('/pose-detection', { 
      state: { 
        autoStartWebcam: true,
        fromDashboard: true 
      } 
    });
  };

  // Real user stats from analytics - ALWAYS show user's own data (even if 0)
  const totalSessions = userAnalytics?.overall_stats?.total_sessions || 0;
  const currentStreak = userAnalytics?.overall_stats?.current_streak || 0;
  const avgAccuracy = userAnalytics?.pose_progress?.length > 0 ? 
    Math.round(userAnalytics.pose_progress.reduce((sum, pose) => sum + pose.average_score, 0) / userAnalytics.pose_progress.length) : 0;

  const stats = [
    { 
      label: 'Yoga Sessions', 
      value: loading ? '...' : totalSessions.toString(), 
      icon: Calendar, 
      change: totalSessions === 0 ? 'Start today!' : '+12%', 
      trending: totalSessions === 0 ? 'neutral' : 'up',
      color: 'from-blue-500 to-cyan-400',
      bgColor: 'bg-blue-500/10',
      emptyMessage: 'Your first session awaits!'
    },
    { 
      label: 'Current Streak', 
      value: loading ? '...' : `${currentStreak} ${currentStreak === 1 ? 'day' : 'days'}`, 
      icon: Trophy, 
      change: currentStreak === 0 ? 'Begin streak!' : '+15%', 
      trending: currentStreak === 0 ? 'neutral' : 'up',
      color: 'from-yellow-500 to-amber-400',
      bgColor: 'bg-yellow-500/10',
      emptyMessage: 'Build your practice streak!'
    },
    { 
      label: 'Accuracy', 
      value: loading ? '...' : totalSessions === 0 ? 'Ready to start!' : `${avgAccuracy}%`, 
      icon: TargetIcon, 
      change: totalSessions === 0 ? 'Track progress!' : '+5%', 
      trending: totalSessions === 0 ? 'neutral' : 'up',
      color: 'from-purple-500 to-pink-400',
      bgColor: 'bg-purple-500/10',
      emptyMessage: 'Perfect your poses!'
    },
  ]

  // Real recent sessions from analytics - USER SPECIFIC ONLY
  const recentSessions = userAnalytics?.recent_sessions?.slice(0, 3).map(session => ({
    pose: session.poses_practiced?.[0]?.pose_name || 'Yoga Session',
    accuracy: session.overall_performance?.average_accuracy || 0,
    duration: `${session.total_duration || 0}m`,
    date: new Date(session.session_date).toLocaleDateString(),
    calories: Math.round((session.total_duration || 0) * 3), // Estimate 3 cal/min
    icon: '🧘‍♀️',
    difficulty: session.overall_performance?.average_accuracy >= 85 ? 'Advanced' : 
                session.overall_performance?.average_accuracy >= 70 ? 'Intermediate' : 'Beginner'
  })) || [];

  // Empty state for new users - NEVER show other users' data
  const emptyStateSessions = [
    { 
      pose: 'Your yoga journey starts here!', 
      accuracy: 0, 
      duration: '0m', 
      date: 'Ready when you are', 
      calories: 0,
      icon: '🎯',
      difficulty: 'Beginner',
      isEmpty: true
    },
    { 
      pose: 'Complete your first session', 
      accuracy: 0, 
      duration: '0m', 
      date: 'Today could be the day', 
      calories: 0,
      icon: '🌟',
      difficulty: 'Beginner',
      isEmpty: true
    },
    { 
      pose: 'Build your practice streak', 
      accuracy: 0, 
      duration: '0m', 
      date: 'Every expert was once a beginner', 
      calories: 0,
      icon: '💪',
      difficulty: 'Beginner',
      isEmpty: true
    }
  ];

  const displaySessions = recentSessions.length > 0 ? recentSessions : emptyStateSessions;

  const todayGoals = [
    { title: 'Morning Yoga', completed: true, time: '30 min', icon: Sun },
    { title: 'Drink 2L Water', completed: false, progress: 60, icon: Droplets },
    { title: 'Healthy Meal Plan', completed: true, time: '3 meals', icon: Apple },
    { title: 'Evening Meditation', completed: false, time: '15 min', icon: Moon },
  ];

  const quickActions = [
    {
      id: 'pose-detection',
      title: 'AI Pose Detection',
      description: 'Real-time feedback on your form',
      icon: Camera,
      gradient: 'from-blue-500 to-cyan-400',
      badge: 'Popular',
      onClick: handlePoseDetectionClick,
      enabled: true
    },
    {
      id: 'diet-plan',
      title: 'Smart Diet Plan',
      description: hasCompletedSession ? 'Personalized nutrition guide' : 'Complete a yoga session first',
      icon: Utensils,
      gradient: 'from-green-500 to-emerald-400',
      badge: hasCompletedSession ? 'New' : 'Locked',
      onClick: hasCompletedSession ? () => navigate('/diet-plan') : () => {
        alert('🧘‍♀️ Complete a yoga session first to unlock your personalized diet plan!')
      },
      enabled: hasCompletedSession
    },
    {
      id: 'progress',
      title: 'Progress Analytics',
      description: hasCompletedSession ? 'Track your improvements' : 'Complete a yoga session first',
      icon: BarChart3,
      gradient: 'from-purple-500 to-pink-400',
      badge: hasCompletedSession ? null : 'Locked',
      onClick: hasCompletedSession ? () => navigate('/progress') : () => {
        alert('📊 Complete a yoga session first to view your progress analytics!')
      },
      enabled: hasCompletedSession
    },
    {
      id: 'community',
      title: 'Live Classes',
      description: 'Join community sessions',
      icon: Users,
      gradient: 'from-orange-500 to-red-400',
      badge: 'Live',
      onClick: () => navigate('/community'),
      enabled: true
    }
  ]

  const upcomingClasses = [
    { 
      name: 'Morning Flow', 
      instructor: 'Sanjay Mahar',
      time: '8:00 AM', 
      duration: '45 min',
      difficulty: 'Beginner',
      participants: 234,
      thumbnail: '🌅'
    },
    { 
      name: 'Power Yoga', 
      instructor: 'Shashank Yadav',
      time: '12:00 PM', 
      duration: '60 min',
      difficulty: 'Intermediate',
      participants: 189,
      thumbnail: '💪'
    },
    { 
      name: 'Bishsist Pandey', 
      instructor: 'Lisa Sharma',
      time: '6:00 PM', 
      duration: '30 min',
      difficulty: 'All Levels',
      participants: 412,
      thumbnail: '🌇'
    },
  ]

  const achievements = [
    { title: '7-Day Streak', icon: Flame, unlocked: true },
    { title: 'First Pose Master', icon: Trophy, unlocked: true },
    { title: 'Early Bird', icon: Sun, unlocked: false },
    { title: 'Community Star', icon: Star, unlocked: false },
  ]

  const nutritionToday = {
    calories: { consumed: 1420, target: 2000 },
    protein: { consumed: 68, target: 100 },
    carbs: { consumed: 145, target: 200 },
    fats: { consumed: 42, target: 65 }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Premium Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-emerald-200 to-blue-200 bg-clip-text text-transparent">
                  Welcome back, {user?.name || user?.fullName || 'Yogi'}!
                </h1>
                <div className="animate-bounce">👋</div>
              </div>
              <p className="text-slate-400 text-lg">Let's make today amazing for your wellness journey</p>
              
              {/* Session Completion Status */}
              {hasCompletedSession ? (
                <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-semibold">
                      {userAnalytics?.overall_stats?.total_sessions > 1 
                        ? `${userAnalytics.overall_stats.total_sessions} Sessions Complete!` 
                        : 'Session Complete!'}
                    </span>
                    <span className="text-green-300">
                      {userAnalytics?.overall_stats?.current_streak > 0 
                        ? `${userAnalytics.overall_stats.current_streak} day streak! 🔥` 
                        : 'Diet Plan & Progress Analytics are now unlocked 🎉'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mt-4 p-3 bg-amber-500/20 border border-amber-500/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-400" />
                    <span className="text-amber-400 font-semibold">Complete a yoga session</span>
                    <span className="text-amber-300">to unlock Diet Plan & Progress Analytics</span>
                  </div>
                </div>
              )}
              
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                {user?.isPremium && (
                  <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-yellow-500/20">
                    <Star className="w-4 h-4" fill="currentColor" />
                    Premium Member
                  </div>
                )}
                <div className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-semibold border border-emerald-500/30">
                  🎯 Wellness Goals
                </div>
                <div className="px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-400 text-sm font-semibold border border-blue-500/30">
                  Level {user?.level?.charAt(0).toUpperCase() + user?.level?.slice(1) || 'Beginner'}
                </div>
                <div className="px-4 py-1.5 rounded-full bg-purple-500/20 text-purple-400 text-sm font-semibold border border-purple-500/30">
                  📧 {user?.email || ''}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/premium')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg ${
                  user?.isPremium
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-yellow-500/20'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-emerald-500/20'
                }`}
              >
                {user?.isPremium ? (
                  <>
                    <Star className="w-5 h-5" fill="currentColor" />
                    Manage Premium
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Upgrade to Premium
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid with Enhanced Design - USER SPECIFIC DATA ONLY */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            const trendIcon = stat.trending === 'up' ? TrendingUp : stat.trending === 'down' ? TrendingDown : Target
            const TrendIcon = trendIcon
            const isEmptyState = totalSessions === 0
            
            return (
              <div 
                key={index} 
                className={`group relative bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden ${
                  isEmptyState ? 'border-dashed border-slate-600/50' : ''
                }`}
              >
                {/* Glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                <div className="relative">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-slate-400 text-sm mb-2">{stat.label}</p>
                      <p className={`text-4xl font-bold ${isEmptyState ? 'text-slate-300' : 'text-white'}`}>
                        {stat.value}
                      </p>
                      {isEmptyState && (
                        <p className="text-xs text-slate-500 mt-1">{stat.emptyMessage}</p>
                      )}
                    </div>
                    <div className={`p-3 rounded-xl ${stat.bgColor} backdrop-blur-sm`}>
                      <Icon className={`w-7 h-7 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} strokeWidth={2.5} />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <TrendIcon className={`w-4 h-4 mr-2 ${
                      stat.trending === 'up' ? 'text-emerald-400' : 
                      stat.trending === 'down' ? 'text-red-400' : 'text-slate-400'
                    }`} />
                    <span className={`text-sm font-semibold ${
                      stat.trending === 'up' ? 'text-emerald-400' : 
                      stat.trending === 'down' ? 'text-red-400' : 'text-slate-400'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-slate-500 text-sm ml-2">
                      {isEmptyState ? 'Your journey begins' : 'vs last week'}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick Actions - Enhanced */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Zap className="w-6 h-6 mr-3 text-yellow-400" />
              Quick Actions
            </h2>
            {/* ML Server Status Indicator */}
            <button
              onClick={async () => {
                const status = await checkMLServer();
                if (status.success) {
                  alert('✅ ML Server is running on http://localhost:5000');
                } else {
                  alert('❌ ML Server is not running. Please start Flask server on port 5000.');
                }
              }}
              className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4" />
              Check ML Server
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon
              const isLocked = !action.enabled
              return (
                <button
                  key={action.id}
                  onClick={action.onClick}
                  className={`group relative bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 transition-all duration-300 text-left overflow-hidden ${
                    isLocked 
                      ? 'opacity-60 cursor-not-allowed' 
                      : 'hover:border-slate-600 hover:scale-105 hover:shadow-2xl'
                  }`}
                >
                  {/* Animated gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 ${!isLocked && 'group-hover:opacity-20'} transition-opacity duration-300`}></div>
                  
                  {action.badge && (
                    <div className={`absolute top-4 right-4 px-3 py-1 backdrop-blur-sm rounded-full text-xs font-semibold border ${
                      action.badge === 'Locked' 
                        ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                        : 'bg-white/10 text-white border-white/20'
                    }`}>
                      {action.badge}
                    </div>
                  )}
                  
                  {isLocked && (
                    <div className="absolute top-4 left-4 w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    </div>
                  )}
                  
                  <div className="relative">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 shadow-lg ${!isLocked && 'group-hover:scale-110'} transition-transform duration-300 ${isLocked && 'grayscale'}`}>
                      <Icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{action.title}</h3>
                    <p className="text-sm text-slate-400 mb-4">{action.description}</p>
                    <div className={`flex items-center text-sm font-semibold transition-transform duration-300 ${
                      isLocked 
                        ? 'text-red-400' 
                        : 'text-emerald-400 group-hover:translate-x-2'
                    }`}>
                      <span>{isLocked ? 'Complete Session First' : 'Get Started'}</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Today's Goals */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Target className="w-5 h-5 mr-3 text-emerald-400" />
                  Today's Goals
                </h2>
                <button 
                  onClick={() => navigate('/goals')}
                  className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold flex items-center"
                >
                  Manage
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {todayGoals.map((goal, index) => {
                  const Icon = goal.icon
                  return (
                    <div 
                      key={index}
                      className={`p-4 rounded-xl border transition-all ${
                        goal.completed 
                          ? 'bg-emerald-500/10 border-emerald-500/30' 
                          : 'bg-slate-700/30 border-slate-600/30 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${goal.completed ? 'bg-emerald-500/20' : 'bg-slate-600/30'}`}>
                            <Icon className={`w-5 h-5 ${goal.completed ? 'text-emerald-400' : 'text-slate-400'}`} />
                          </div>
                          <div>
                            <p className={`font-semibold ${goal.completed ? 'text-white' : 'text-slate-300'}`}>
                              {goal.title}
                            </p>
                            <p className="text-sm text-slate-400">{goal.time}</p>
                          </div>
                        </div>
                        {goal.completed && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" fill="currentColor" />
                        )}
                      </div>
                      {goal.progress && (
                        <div className="mt-3">
                          <div className="w-full bg-slate-700/50 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${goal.progress}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{goal.progress}% completed</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Recent Sessions - USER SPECIFIC ONLY */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Activity className="w-5 h-5 mr-3 text-blue-400" />
                  {totalSessions === 0 ? 'Your Yoga Journey' : 'Recent Yoga Sessions'}
                </h2>
                <button
                  onClick={() => navigate('/progress')}
                  className="text-blue-400 hover:text-blue-300 text-sm font-semibold flex items-center"
                >
                  {totalSessions === 0 ? 'Get Started' : 'View All'}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              <div className="space-y-4">
                {displaySessions.map((session, index) => (
                  <button
                    key={index}
                    onClick={() => session.isEmpty ? handlePoseDetectionClick() : navigate('/progress')}
                    className={`w-full flex items-center justify-between p-5 rounded-xl transition-all border group ${
                      session.isEmpty 
                        ? 'bg-slate-700/20 hover:bg-slate-700/40 border-slate-600/30 hover:border-slate-600 border-dashed' 
                        : 'bg-slate-700/30 hover:bg-slate-700/50 border-slate-600/30 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{session.icon}</div>
                      <div className="text-left">
                        <p className={`font-bold text-lg mb-1 ${session.isEmpty ? 'text-slate-300' : 'text-white'}`}>
                          {session.pose}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {session.duration}
                          </span>
                          {!session.isEmpty && (
                            <>
                              <span className="flex items-center gap-1">
                                <Flame className="w-4 h-4" />
                                {session.calories} cal
                              </span>
                              <span className="px-2 py-0.5 bg-slate-600/50 rounded text-xs">
                                {session.difficulty}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {session.isEmpty ? (
                        <div className="text-slate-400">
                          <p className="text-sm">Click to start</p>
                          <p className="text-xs text-slate-500">{session.date}</p>
                        </div>
                      ) : (
                        <>
                          <p className="font-bold text-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                            {session.accuracy}%
                          </p>
                          <p className="text-sm text-slate-400">Accuracy</p>
                        </>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Empty state call to action */}
              {totalSessions === 0 && (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
                  <div className="text-center">
                    <p className="text-white font-semibold mb-2">Ready to begin your wellness journey?</p>
                    <p className="text-slate-400 text-sm mb-4">Complete your first yoga session to start tracking your amazing progress!</p>
                    <button
                      onClick={handlePoseDetectionClick}
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg font-semibold transition-all"
                    >
                      Start First Session 🧘‍♀️
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Nutrition Overview */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Apple className="w-5 h-5 mr-3 text-green-400" />
                  Today's Nutrition
                </h2>
                <button
                  onClick={() => navigate('/diet-plan')}
                  className="text-green-400 hover:text-green-300 text-sm font-semibold flex items-center"
                >
                  View Plan
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(nutritionToday).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-3">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-slate-700"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-emerald-500"
                          strokeDasharray={`${2 * Math.PI * 40}`}
                          strokeDashoffset={`${2 * Math.PI * 40 * (1 - value.consumed / value.target)}`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-lg font-bold text-white">
                          {Math.round((value.consumed / value.target) * 100)}%
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-white capitalize mb-1">{key}</p>
                    <p className="text-xs text-slate-400">
                      {value.consumed}g / {value.target}g
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Side Content */}
          <div className="space-y-8">
            {/* Upcoming Live Classes */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <Play className="w-5 h-5 mr-3 text-red-400" />
                Live Classes Today
              </h2>
              <div className="space-y-4">
                {upcomingClasses.map((cls, index) => (
                  <button
                    key={index}
                    onClick={() => navigate('/community')}
                    className="w-full p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl transition-all border border-slate-600/30 hover:border-slate-600 text-left group"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="text-2xl">{cls.thumbnail}</div>
                      <div className="flex-1">
                        <p className="font-bold text-white mb-1">{cls.name}</p>
                        <p className="text-xs text-slate-400">with {cls.instructor}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        cls.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                        cls.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {cls.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4 text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {cls.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {cls.participants}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                  </button>
                ))}
              </div>
              <button 
                onClick={() => navigate('/community')}
                className="w-full mt-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-xl font-semibold transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Browse All Classes
              </button>
            </div>

            {/* Achievements */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <Award className="w-5 h-5 mr-3 text-yellow-400" />
                Achievements
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon
                  return (
                    <button
                      key={index}
                      onClick={() => navigate('/achievements')}
                      className={`p-4 rounded-xl transition-all ${
                        achievement.unlocked
                          ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30'
                          : 'bg-slate-700/20 border-slate-600/30'
                      } border hover:scale-105`}
                    >
                      <Icon className={`w-8 h-8 mx-auto mb-2 ${
                        achievement.unlocked ? 'text-yellow-400' : 'text-slate-600'
                      }`} />
                      <p className={`text-xs font-semibold text-center ${
                        achievement.unlocked ? 'text-white' : 'text-slate-500'
                      }`}>
                        {achievement.title}
                      </p>
                    </button>
                  )
                })}
              </div>
              <button
                onClick={() => navigate('/achievements')}
                className="w-full mt-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm font-semibold transition-all"
              >
                View All Achievements
              </button>
            </div>

            {/* Current Streak */}
            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl rounded-2xl p-6 border border-orange-500/30 shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                    <Flame className="w-5 h-5 mr-2 text-orange-400" />
                    {user?.stats?.currentStreak || 0} Day Streak
                  </h3>
                  <p className="text-slate-300 text-sm">Keep the momentum going!</p>
                </div>
                <div className="text-4xl">🔥</div>
              </div>
              <div className="mt-6 grid grid-cols-7 gap-1">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div 
                    key={i}
                    className={`h-2 rounded-full ${
                      i < (user?.stats?.currentStreak || 0) 
                        ? 'bg-gradient-to-r from-orange-500 to-red-500' 
                        : 'bg-slate-700'
                    }`}
                  ></div>
                ))}
              </div>
              <button
                onClick={() => navigate('/progress')}
                className="w-full mt-6 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-sm font-semibold transition-all"
              >
                View Streak History
              </button>
            </div>

            {/* Premium Upgrade Card (for non-premium users) */}
            {!user?.isPremium && (
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-xl rounded-2xl p-6 border border-yellow-500/30 shadow-xl">
                <div className="flex items-center mb-4">
                  <Star className="w-7 h-7 text-yellow-400 mr-3" fill="currentColor" />
                  <div>
                    <h3 className="font-bold text-xl text-white">Go Premium</h3>
                    <p className="text-sm text-slate-300">Unlock your full potential</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  {[
                    'Advanced AI Pose Analysis',
                    'Personalized Diet Plans',
                    'Unlimited Live Classes',
                    'Priority Support 24/7',
                    'Exclusive Content Library'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center text-sm text-slate-200">
                      <CheckCircle2 className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/premium')}
                  className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-xl font-bold transition-all shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Upgrade Now
                </button>
              </div>
            )}

            {/* Quick Navigation */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
              <h4 className="font-semibold text-white mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                Quick Navigation
              </h4>
              <div className="space-y-2">
                <button
                  onClick={handlePoseDetectionClick}
                  className="w-full flex items-center justify-between p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl transition-all border border-slate-600/30 hover:border-slate-600 group"
                >
                  <div className="flex items-center">
                    <Camera className="w-5 h-5 mr-3 text-blue-400" />
                    <span className="text-white font-medium">AI Pose Detection</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </button>
                <button 
                  onClick={() => navigate('/diet-plan')}
                  className="w-full flex items-center justify-between p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl transition-all border border-slate-600/30 hover:border-slate-600 group"
                >
                  <div className="flex items-center">
                    <Utensils className="w-5 h-5 mr-3 text-green-400" />
                    <span className="text-white font-medium">Smart Diet Plan</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </button>
                <button
                  onClick={() => navigate('/progress')}
                  className="w-full flex items-center justify-between p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl transition-all border border-slate-600/30 hover:border-slate-600 group"
                >
                  <div className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-3 text-purple-400" />
                    <span className="text-white font-medium">Progress Analytics</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </button>
                <button
                  onClick={() => navigate('/community')}
                  className="w-full flex items-center justify-between p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl transition-all border border-slate-600/30 hover:border-slate-600 group"
                >
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-3 text-orange-400" />
                    <span className="text-white font-medium">Community</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </button>
                <button
                  onClick={() => navigate('/settings')}
                  className="w-full flex items-center justify-between p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl transition-all border border-slate-600/30 hover:border-slate-600 group"
                >
                  <div className="flex items-center">
                    <Target className="w-5 h-5 mr-3 text-pink-400" />
                    <span className="text-white font-medium">Settings</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </button>
              </div>
            </div>

            {/* Wellness Tips */}
            <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-xl rounded-2xl p-6 border border-emerald-500/30 shadow-xl">
              <h4 className="font-semibold text-white mb-4 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-emerald-400" />
                Today's Wellness Tip
              </h4>
              <div className="mb-4">
                <p className="text-slate-200 text-sm leading-relaxed">
                  "Start your day with 10 minutes of mindful breathing. It helps reduce stress and improves focus throughout the day."
                </p>
              </div>
              <button
                onClick={() => navigate('/tips')}
                className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold flex items-center"
              >
                Read More Tips
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-8 border border-blue-500/30 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
                <Sparkles className="w-6 h-6 mr-3 text-yellow-400" />
                Ready to Transform Your Practice?
              </h3>
              <p className="text-slate-300">
                Join thousands of yogis improving their form with AI-powered feedback
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handlePoseDetectionClick}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 rounded-xl font-bold text-white transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Start Session
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
  )
}

export default Dashboard