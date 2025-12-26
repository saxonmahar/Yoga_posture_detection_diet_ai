// src/pages/ProgressPage.jsx
import React, { useState } from 'react'
import { TrendingUp, Award, Activity, Flame } from 'lucide-react'

function ProgressPage({ onNavigate, user }) {
  // 添加默认用户数据以防未传入
  const defaultUser = {
    stats: {
      totalWorkouts: 12,
      totalCaloriesBurned: 1250,
      currentStreak: 7,
      averageAccuracy: 87
    }
  }

  const currentUser = user || defaultUser
  const achievements = [
    { id: 1, title: '7-Day Streak', description: 'Completed workouts 7 days in a row', unlocked: true },
    { id: 2, title: 'Plank Master', description: 'Held plank for 5+ minutes', unlocked: true },
    { id: 3, title: 'Perfect Form', description: 'Achieved 95%+ accuracy in all poses', unlocked: false },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Progress Analytics</h1>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Total Workouts</p>
                <p className="text-2xl font-bold mt-1">{currentUser.stats.totalWorkouts}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Calories Burned</p>
                <p className="text-2xl font-bold mt-1">{currentUser.stats.totalCaloriesBurned}</p>
              </div>
              <Flame className="w-8 h-8 text-orange-400" />
            </div>
          </div>

          <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Current Streak</p>
                <p className="text-2xl font-bold mt-1">{currentUser.stats.currentStreak} days</p>
              </div>
              <Award className="w-8 h-8 text-purple-400" />
            </div>
          </div>

          <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Average Accuracy</p>
                <p className="text-2xl font-bold mt-1">{currentUser.stats.averageAccuracy}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-green-500/30 mb-8 shadow-xl">
          <h2 className="text-xl font-semibold mb-6 text-white">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-xl border transition-all hover:scale-105 ${
                  achievement.unlocked
                    ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20'
                    : 'bg-slate-700/30 border-slate-600/30 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Award className={`w-5 h-5 ${
                    achievement.unlocked ? 'text-green-400' : 'text-slate-500'
                  }`} />
                  {achievement.unlocked && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded border border-green-500/30">Unlocked</span>
                  )}
                </div>
                <h4 className="font-medium text-white">{achievement.title}</h4>
                <p className="text-sm text-slate-400 mt-1">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-2xl p-6 border border-green-500/30 shadow-xl">
          <h3 className="text-lg font-semibold mb-3 text-white">AI Insights</h3>
          <p className="text-slate-400 mb-4">
            "Your consistency has improved by 30% this week. Keep practicing for 10 more minutes daily to reach your goal faster."
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => onNavigate && onNavigate('pose-detection')}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white rounded-lg transition-all shadow-lg shadow-green-500/20 hover:shadow-green-500/40"
            >
              Continue Practice
            </button>
            <button
              onClick={() => onNavigate && onNavigate('dashboard')}
              className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 backdrop-blur-sm text-white rounded-lg transition-all border border-slate-600 hover:border-green-400/50"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProgressPage