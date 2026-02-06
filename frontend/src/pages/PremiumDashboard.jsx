import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Crown,
  Sparkles,
  Zap,
  Target,
  Brain,
  Users,
  Calendar,
  BarChart3,
  Video,
  Utensils,
  Award,
  Lock,
  Unlock,
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  Heart,
  Shield
} from 'lucide-react';

function PremiumDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    // Check if user has premium access
    const premiumStatus = localStorage.getItem(`premium_${user?._id || user?.id}`);
    setIsPremium(premiumStatus === 'true');
  }, [user]);

  const premiumFeatures = [
    {
      id: 'ai-coach',
      title: 'AI Personal Coach',
      description: 'Get real-time AI-powered coaching with advanced pose corrections and personalized feedback',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      route: '/pose-detection',
      status: 'active',
      benefits: [
        'Advanced pose analysis',
        'Real-time corrections',
        'Voice feedback',
        'Progress tracking'
      ]
    },
    {
      id: 'custom-diet',
      title: 'Custom Diet Plans',
      description: 'Personalized nutrition plans tailored to your fitness goals and dietary preferences',
      icon: Utensils,
      color: 'from-emerald-500 to-teal-500',
      route: '/diet-plan',
      status: 'active',
      benefits: [
        'Personalized meal plans',
        'Calorie tracking',
        'Macro optimization',
        'Recipe suggestions'
      ]
    },
    {
      id: 'live-classes',
      title: 'Live Yoga Classes',
      description: 'Join exclusive live yoga sessions with certified instructors',
      icon: Video,
      color: 'from-blue-500 to-cyan-500',
      route: '/schedule',
      status: 'active',
      benefits: [
        'Live instructor sessions',
        'Interactive classes',
        'Q&A sessions',
        'Class recordings'
      ]
    },
    {
      id: 'advanced-analytics',
      title: 'Advanced Analytics',
      description: 'Deep insights into your progress with detailed charts and performance metrics',
      icon: BarChart3,
      color: 'from-orange-500 to-red-500',
      route: '/progress',
      status: 'active',
      benefits: [
        'Detailed progress charts',
        'Performance metrics',
        'Goal tracking',
        'Trend analysis'
      ]
    },
    {
      id: 'community',
      title: 'Premium Community',
      description: 'Connect with other premium members and participate in exclusive challenges',
      icon: Users,
      color: 'from-indigo-500 to-purple-500',
      route: '/community',
      status: 'active',
      benefits: [
        'Exclusive community',
        'Premium challenges',
        'Leaderboards',
        'Social features'
      ]
    },
    {
      id: 'priority-support',
      title: 'Priority Support',
      description: '24/7 dedicated support with faster response times',
      icon: Shield,
      color: 'from-green-500 to-emerald-500',
      route: '/contact',
      status: 'active',
      benefits: [
        '24/7 support',
        'Priority response',
        'Direct messaging',
        'Expert guidance'
      ]
    }
  ];

  const stats = [
    { label: 'Features Unlocked', value: '6', icon: Unlock, color: 'text-emerald-400' },
    { label: 'Premium Since', value: 'Today', icon: Calendar, color: 'text-blue-400' },
    { label: 'Savings', value: '30%', icon: TrendingUp, color: 'text-purple-400' },
    { label: 'Status', value: 'Active', icon: CheckCircle, color: 'text-green-400' }
  ];

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-3xl p-12 border border-orange-500/30 shadow-2xl">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">Premium Access Required</h1>
              <p className="text-slate-400 mb-8">
                Upgrade to Premium to unlock exclusive features and take your yoga practice to the next level.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => navigate('/premium')}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 rounded-xl font-semibold text-white transition-all shadow-lg"
                >
                  Upgrade to Premium
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-8 py-4 bg-slate-700/50 hover:bg-slate-700 rounded-xl font-semibold text-white transition-all border border-slate-600/50"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full text-sm font-semibold text-yellow-400 mb-6 border border-yellow-500/30 backdrop-blur-sm">
              <Crown className="w-4 h-4 mr-2" />
              PREMIUM MEMBER
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Premium
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              You now have access to all premium features. Explore exclusive content and take your practice to new heights!
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-800/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                  <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-2xl text-center">
                    <Icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Premium Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Your Premium Features
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {premiumFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.id} className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-800/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all"></div>
                    <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl group-hover:border-slate-600 transition-all hover:transform hover:scale-105 h-full flex flex-col">
                      
                      <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>

                      <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                      <p className="text-slate-400 mb-6 flex-1">{feature.description}</p>

                      <div className="space-y-2 mb-6">
                        {feature.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center text-slate-300">
                            <CheckCircle className="w-4 h-4 text-emerald-400 mr-2 flex-shrink-0" />
                            <span className="text-sm">{benefit}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => navigate(feature.route)}
                        className={`w-full py-3 bg-gradient-to-r ${feature.color} hover:opacity-90 rounded-xl font-semibold text-white transition-all shadow-lg flex items-center justify-center group`}
                      >
                        Explore Feature
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-3xl p-12 border border-slate-700/50 shadow-2xl text-center">
              <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-white mb-4">
                Ready to Start Your Premium Journey?
              </h3>
              <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
                Begin with an AI-powered yoga session or explore your personalized diet plan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/pose-detection')}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 rounded-xl font-semibold text-white transition-all shadow-lg flex items-center justify-center"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Start AI Session
                </button>
                <button
                  onClick={() => navigate('/diet-plan')}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl font-semibold text-white transition-all shadow-lg flex items-center justify-center"
                >
                  <Utensils className="w-5 h-5 mr-2" />
                  View Diet Plan
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-8 py-4 bg-slate-700/50 hover:bg-slate-700 rounded-xl font-semibold text-white transition-all border border-slate-600/50 flex items-center justify-center"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default PremiumDashboard;
