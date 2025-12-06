import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Calendar,
  Target,
  TrendingUp,
  Trophy,
  Zap,
  Heart,
  Brain,
  Users,
  ArrowRight,
  Camera,
  Utensils,
  BarChart3,
  Plus,
  Star,
  Clock,
  Activity,
  Flame,
  Award,
  Target as TargetIcon
} from 'lucide-react'

function Dashboard({ user, onLogout }) {
  const navigate = useNavigate()
  const stats = [
    { label: 'Yoga Sessions', value: user?.stats?.totalWorkouts || '0', icon: Calendar, change: '+12%', color: 'text-blue-400' },
    { label: 'Calories Burned', value: user?.stats?.totalCaloriesBurned || '0', icon: Flame, change: '+8%', color: 'text-orange-400' },
    { label: 'Current Streak', value: `${user?.stats?.currentStreak || 0} days`, icon: Trophy, change: '+15%', color: 'text-yellow-400' },
    { label: 'Accuracy', value: `${user?.stats?.averageAccuracy || 0}%`, icon: TargetIcon, change: '+5%', color: 'text-purple-400' },
  ]

  const recentSessions = [
    { pose: 'Downward Dog', accuracy: 92, duration: '5:24', date: 'Today', icon: '🐕' },
    { pose: 'Warrior II', accuracy: 87, duration: '4:12', date: 'Yesterday', icon: '⚔️' },
    { pose: 'Tree Pose', accuracy: 95, duration: '3:48', date: '2 days ago', icon: '🌳' },
    { pose: 'Child\'s Pose', accuracy: 98, duration: '6:30', date: '3 days ago', icon: '🧘' },
  ]

  const recommendations = [
    { title: 'Improve Flexibility', icon: Heart, description: 'Try our 7-day flexibility challenge' },
    { title: 'Stress Relief', icon: Brain, description: 'Guided meditation for anxiety' },
    { title: 'Community', icon: Users, description: 'Join live yoga sessions' },
  ]

  const upcomingChallenges = [
    { name: 'Morning Flow', time: '8:00 AM', difficulty: 'Beginner' },
    { name: 'Power Yoga', time: '12:00 PM', difficulty: 'Intermediate' },
    { name: 'Sunset Stretch', time: '6:00 PM', difficulty: 'All Levels' },
  ]

  // Quick Actions for YogaAI features
  const quickActions = [
    {
      id: 'pose-detection',
      title: 'Start Pose Detection',
      description: 'Practice yoga with AI feedback',
      icon: Camera,
      color: 'bg-blue-500/20 text-blue-400',
      bgColor: 'from-blue-500 to-cyan-400',
      onClick: () => navigate('/pose-detection')
    },
    {
      id: 'diet-plan',
      title: 'View Diet Plan',
      description: 'AI-generated nutrition plan',
      icon: Utensils,
      color: 'bg-green-500/20 text-green-400',
      bgColor: 'from-green-500 to-emerald-400',
      onClick: () => navigate('/diet-plan')
    },
    {
      id: 'progress',
      title: 'Progress Analytics',
      description: 'Track your fitness journey',
      icon: BarChart3,
      color: 'bg-purple-500/20 text-purple-400',
      bgColor: 'from-purple-500 to-pink-400',
      onClick: () => navigate('/progress')
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back, <span className="gradient-text">{user?.name || 'Yogi'}</span>! 👋
              </h1>
              <p className="text-text-muted">Ready for today's wellness journey?</p>
              <div className="mt-4 flex items-center space-x-2">
                <div className={`px-3 py-1 rounded-full text-sm ${user?.isPremium ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'}`}>
                  {user?.isPremium ? '🌟 Premium Member' : 'Free Plan'}
                </div>
                {user?.stats?.goal && (
                  <div className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm">
                    {user.stats.goal.replace('-', ' ')}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3">
                <button
                  onClick={() => navigate('/premium')}
                  className={`px-6 py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                    user?.isPremium
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
                      : 'btn-primary'
                  }`}
                >
                {user?.isPremium ? (
                  <>
                    <Star className="w-5 h-5" />
                    Premium Member
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Upgrade to Premium
                  </>
                )}
              </button>
              <button
                onClick={onLogout}
                className="px-6 py-2.5 bg-surface hover:bg-secondary rounded-lg font-semibold transition border border-white/10"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-accent/30 transition card-hover">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-text-muted text-sm mb-2">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.color} bg-opacity-20`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  <TrendingUp className={`w-4 h-4 mr-2 ${stat.color}`} />
                  <span className={`text-sm font-medium ${stat.color}`}>{stat.change}</span>
                  <span className="text-text-muted text-sm ml-2">from last week</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick Actions - YogaAI Features */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-400" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <button
                  key={action.id}
                  onClick={action.onClick}
                  className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-accent/30 transition-all card-hover text-left"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.bgColor} flex items-center justify-center mb-4`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                  <p className="text-sm text-text-muted">{action.description}</p>
                  <div className="mt-4 flex items-center text-accent text-sm font-medium">
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Recent Activity */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Sessions */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-accent" />
                  Recent Yoga Sessions
                </h2>
                <button
                  onClick={() => navigate('/progress')}
                  className="text-accent hover:text-accent/80 text-sm font-semibold flex items-center"
                >
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              <div className="space-y-4">
                {recentSessions.map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-surface/50 rounded-xl hover:bg-surface transition">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{session.icon}</div>
                      <div>
                        <p className="font-semibold">{session.pose}</p>
                        <p className="text-sm text-text-muted">{session.date} • {session.duration}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{session.accuracy}%</p>
                      <p className="text-sm text-text-muted">Accuracy</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-gradient-to-br from-accent/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-6 border border-accent/30">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <Target className="w-5 h-5 mr-2 text-accent" />
                AI Recommendations
              </h2>
              <div className="space-y-4">
                {recommendations.map((rec, index) => {
                  const Icon = rec.icon
                  return (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-white/5 rounded-xl">
                      <div className="p-2 bg-accent/20 rounded-lg">
                        <Icon className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-semibold">{rec.title}</p>
                        <p className="text-sm text-text-muted">{rec.description}</p>
                        <button
                          onClick={() => navigate('/pose-detection')}
                          className="mt-2 text-accent hover:text-accent/80 text-sm font-semibold flex items-center"
                        >
                          Start Now
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Upcoming & Stats */}
          <div className="space-y-8">
            {/* Upcoming Challenges */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-400" />
                Upcoming Live Sessions
              </h2>
              <div className="space-y-4">
                {upcomingChallenges.map((challenge, index) => (
                  <div key={index} className="p-4 bg-surface/50 rounded-xl hover:bg-surface transition">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-semibold">{challenge.name}</p>
                      <span className="px-3 py-1 bg-accent/20 text-accent text-xs font-semibold rounded-full">
                        {challenge.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center text-text-muted text-sm">
                      <Clock className="w-4 h-4 mr-2" />
                      {challenge.time}
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-3 bg-surface hover:bg-secondary rounded-xl font-semibold transition border border-white/10">
                Join Next Session
              </button>
            </div>

            {/* Current Streak */}
            <div className="bg-gradient-to-br from-accent/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-6 border border-accent/30">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold mb-2 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-yellow-400" />
                    Current Streak
                  </h3>
                  <p className="text-text-muted">Keep going! You're on a roll with your practice.</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">{user?.stats?.currentStreak || 0}</p>
                  <p className="text-text-muted text-sm">Days in a row</p>
                </div>
              </div>
              <div className="mt-6 flex space-x-1">
                {Array.from({ length: Math.min(user?.stats?.currentStreak || 0, 14) }).map((_, i) => (
                  <div 
                    key={i} 
                    className="h-2 flex-1 bg-gradient-to-r from-accent to-pink-500 rounded-full"
                  ></div>
                ))}
                {Array.from({ length: Math.max(0, 14 - (user?.stats?.currentStreak || 0)) }).map((_, i) => (
                  <div 
                    key={i + (user?.stats?.currentStreak || 0)} 
                    className="h-2 flex-1 bg-surface rounded-full"
                  ></div>
                ))}
              </div>
            </div>

            {/* Upgrade Card */}
            {!user?.isPremium && (
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/30">
                <div className="flex items-center mb-4">
                  <Star className="w-6 h-6 text-yellow-400 mr-3" />
                  <div>
                    <h3 className="font-bold text-lg">Unlock Premium Features</h3>
                    <p className="text-sm text-text-muted">Get personalized AI coaching</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  {['Advanced Pose Analysis', 'Custom Diet Plans', 'Live Yoga Classes', 'Priority Support'].map((feature, i) => (
                    <li key={i} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/premium')}
                  className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-lg font-bold transition shadow-lg shadow-yellow-500/20"
                >
                  Upgrade Now
                </button>
              </div>
            )}

            {/* Quick Navigation */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h4 className="font-medium mb-3">Quick Navigation</h4>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/pose-detection')}
                  className="w-full flex items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition text-left"
                >
                  <Camera className="w-5 h-5 mr-3 text-blue-400" />
                  <span>AI Pose Detection</span>
                </button>
                <button 
                  onClick={() => navigate('/diet-plan')}
                  className="w-full flex items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition text-left"
                >
                  <Utensils className="w-5 h-5 mr-3 text-green-400" />
                  <span>View Diet Plan</span>
                </button>
                <button
                  onClick={() => navigate('/progress')}
                  className="w-full flex items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition text-left"
                >
                  <BarChart3 className="w-5 h-5 mr-3 text-purple-400" />
                  <span>Progress Analytics</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard