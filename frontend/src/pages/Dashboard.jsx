import React from 'react'
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
  Activity
} from 'lucide-react'

function Dashboard({ onNavigate, user, onLogout }) {
  const stats = [
    { label: 'Yoga Sessions', value: '24', icon: Calendar, change: '+12%', color: 'text-blue-400' },
    { label: 'Calories Burned', value: '1,248', icon: Zap, change: '+8%', color: 'text-orange-400' },
    { label: 'Perfect Poses', value: '156', icon: Trophy, change: '+15%', color: 'text-yellow-400' },
    { label: 'Meditation', value: '18h', icon: Brain, change: '+25%', color: 'text-purple-400' },
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary via-surface to-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back, <span className="bg-gradient-to-r from-accent to-pink-400 bg-clip-text text-transparent">{user?.name}</span>
              </h1>
              <p className="text-text-muted">Here's your wellness overview for today</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => onNavigate('premium')}
                className={`px-6 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                  user?.isPremium
                    ? 'bg-gradient-to-r from-premium to-orange-500'
                    : 'bg-gradient-to-r from-accent to-pink-500 hover:from-accent/90 hover:to-pink-600'
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
                onClick={() => onNavigate('home')}
                className="px-6 py-2.5 bg-surface hover:bg-secondary rounded-xl font-semibold transition border border-white/10"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-accent/30 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-text-muted text-sm mb-2">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-surface ${stat.color} bg-opacity-20`}>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Recent Activity */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button className="p-4 bg-surface hover:bg-secondary rounded-xl border border-white/10 transition group">
                  <div className="flex items-center justify-center w-12 h-12 bg-accent/20 rounded-lg mb-3 mx-auto">
                    <Camera className="w-6 h-6 text-accent" />
                  </div>
                  <p className="font-semibold text-center">Start Pose Detection</p>
                  <p className="text-text-muted text-sm text-center">Real-time AI feedback</p>
                </button>
                <button className="p-4 bg-surface hover:bg-secondary rounded-xl border border-white/10 transition group">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-lg mb-3 mx-auto">
                    <Utensils className="w-6 h-6 text-green-400" />
                  </div>
                  <p className="font-semibold text-center">View Diet Plan</p>
                  <p className="text-text-muted text-sm text-center">Personalized nutrition</p>
                </button>
                <button className="p-4 bg-surface hover:bg-secondary rounded-xl border border-white/10 transition group">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-lg mb-3 mx-auto">
                    <BarChart3 className="w-6 h-6 text-blue-400" />
                  </div>
                  <p className="font-semibold text-center">Progress Analytics</p>
                  <p className="text-text-muted text-sm text-center">Track your journey</p>
                </button>
              </div>
            </div>

            {/* Recent Sessions */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-accent" />
                  Recent Yoga Sessions
                </h2>
                <button className="text-accent hover:text-accent-light text-sm font-semibold flex items-center">
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
          </div>

          {/* Right Column - Recommendations & Schedule */}
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

            {/* AI Recommendations */}
            <div className="bg-gradient-to-br from-accent/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-6 border border-accent/30">
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
                        <button className="mt-2 text-accent hover:text-accent-light text-sm font-semibold flex items-center">
                          Explore
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Upgrade Card */}
            {!user?.isPremium && (
              <div className="bg-gradient-to-br from-premium/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-6 border border-premium/30">
                <div className="flex items-center mb-4">
                  <Star className="w-6 h-6 text-premium mr-3" />
                  <div>
                    <h3 className="font-bold text-lg">Unlock Premium Features</h3>
                    <p className="text-sm text-text-muted">Get personalized AI coaching</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  {['Advanced Pose Analysis', 'Custom Diet Plans', 'Live Yoga Classes', 'Priority Support'].map((feature, i) => (
                    <li key={i} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-premium rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => onNavigate('premium')}
                  className="w-full py-3 bg-gradient-to-r from-premium to-orange-500 hover:from-premium/90 hover:to-orange-600 rounded-xl font-bold transition shadow-lg shadow-premium/20"
                >
                  Upgrade Now
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Current Streak */}
        <div className="mt-8 bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold mb-2">🔥 14-Day Streak</h3>
              <p className="text-text-muted">Keep going! You're on a roll with your practice.</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-3xl font-bold">14</p>
                <p className="text-text-muted text-sm">Days in a row</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">94%</p>
                <p className="text-text-muted text-sm">Consistency</p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex space-x-2">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className="h-2 flex-1 bg-gradient-to-r from-accent to-pink-500 rounded-full"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard