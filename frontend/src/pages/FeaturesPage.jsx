import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain,
  Camera,
  Target,
  BarChart3,
  Utensils,
  Heart,
  Zap,
  Shield,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Star,
  Play,
  Award,
  TrendingUp,
  Globe,
  Lock,
  Unlock,
  Eye,
  Activity,
  Clock,
  Flame
} from 'lucide-react';

const FeaturesPage = () => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState('ai-coach');

  // helper function to navigate and scroll to top
  const goTo = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  const mainFeatures = [
    {
      id: 'ai-coach',
      icon: Brain,
      title: 'AI Yoga Coach',
      subtitle: 'Intelligent Personal Guidance',
      description: 'Your personalized AI yoga assistant that adapts to your fitness level, goals, and preferences with advanced machine learning.',
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'from-emerald-500/10 to-teal-500/10',
      borderColor: 'border-emerald-500/30',
      features: [
        {
          title: 'Personalized Sessions',
          description: 'AI-generated yoga sequences based on your mood, energy level, and fitness goals.',
          icon: Target,
          stats: '98% Accuracy'
        },
        {
          title: 'Real-time Form Correction',
          description: 'Advanced computer vision technology provides instant feedback on your posture and alignment.',
          icon: Eye,
          stats: 'Live Feedback'
        },
        {
          title: 'Adaptive Difficulty',
          description: 'Automatically adjusts poses and sequences as you progress in your wellness journey.',
          icon: TrendingUp,
          stats: 'Smart Progression'
        }
      ]
    },
    {
      id: 'pose-detection',
      icon: Camera,
      title: 'AI Pose Detection',
      subtitle: 'Computer Vision Technology',
      description: 'State-of-the-art pose recognition technology that analyzes your form in real-time with precision and accuracy.',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-500/10 to-cyan-500/10',
      borderColor: 'border-blue-500/30',
      features: [
        {
          title: 'Real-time Analysis',
          description: 'Instant pose recognition and feedback using advanced computer vision algorithms.',
          icon: Zap,
          stats: '60 FPS'
        },
        {
          title: 'Precision Tracking',
          description: '33 key body points tracked for comprehensive pose analysis and correction.',
          icon: Target,
          stats: '33 Points'
        },
        {
          title: 'Progress Monitoring',
          description: 'Track your improvement over time with detailed pose accuracy metrics.',
          icon: BarChart3,
          stats: 'Detailed Metrics'
        }
      ]
    },
    {
      id: 'diet-plans',
      icon: Utensils,
      title: 'Smart Diet Plans',
      subtitle: 'Personalized Nutrition',
      description: 'AI-curated nutrition plans tailored to your yoga practice, dietary preferences, and health goals.',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-500/10 to-pink-500/10',
      borderColor: 'border-purple-500/30',
      features: [
        {
          title: 'Personalized Meals',
          description: 'Custom meal plans based on your dietary preferences, restrictions, and fitness goals.',
          icon: Heart,
          stats: '1000+ Recipes'
        },
        {
          title: 'Nutritional Balance',
          description: 'Scientifically balanced macronutrients to support your yoga practice and recovery.',
          icon: Activity,
          stats: 'Macro Balanced'
        },
        {
          title: 'Shopping Lists',
          description: 'Automated grocery lists and meal prep guides for effortless healthy eating.',
          icon: CheckCircle,
          stats: 'Auto-Generated'
        }
      ]
    },
    {
      id: 'progress-tracking',
      icon: BarChart3,
      title: 'Progress Analytics',
      subtitle: 'Data-Driven Insights',
      description: 'Comprehensive analytics and insights to monitor your yoga journey with detailed progress tracking.',
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-500/10 to-red-500/10',
      borderColor: 'border-orange-500/30',
      features: [
        {
          title: 'Performance Metrics',
          description: 'Track accuracy, consistency, and improvement across all your yoga sessions.',
          icon: TrendingUp,
          stats: 'Real-time Data'
        },
        {
          title: 'Streak Tracking',
          description: 'Build and maintain your practice streak with motivational milestones.',
          icon: Flame,
          stats: 'Daily Streaks'
        },
        {
          title: 'Goal Achievement',
          description: 'Set and track personal goals with intelligent recommendations for improvement.',
          icon: Award,
          stats: 'Smart Goals'
        }
      ]
    }
  ];

  const additionalFeatures = [
    {
      title: 'Community Support',
      description: 'Connect with fellow yogis worldwide',
      icon: Users,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Offline Mode',
      description: 'Practice anywhere without internet',
      icon: Globe,
      color: 'from-indigo-500 to-purple-500'
    },
    {
      title: 'Privacy First',
      description: 'Your data stays secure and private',
      icon: Shield,
      color: 'from-pink-500 to-rose-500'
    },
    {
      title: '24/7 Support',
      description: 'Get help whenever you need it',
      icon: Clock,
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const currentFeature = mainFeatures.find(f => f.id === activeFeature);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-purple-500/20 rounded-full text-sm font-semibold text-emerald-400 mb-8 border border-emerald-500/30 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            ADVANCED AI TECHNOLOGY
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Powerful Features for{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Your Yoga Journey
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-4xl mx-auto leading-relaxed mb-8">
            Discover how our cutting-edge AI-powered platform transforms your yoga practice with 
            intelligent guidance, real-time feedback, and personalized wellness insights.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => goTo('/pose-detection')}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 rounded-xl font-semibold text-white transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 flex items-center justify-center group"
            >
              <Play className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              Try AI Detection
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')}
              className="px-8 py-4 bg-slate-800/50 hover:bg-slate-800 backdrop-blur-xl rounded-xl font-semibold text-white transition-all border border-slate-700/50 hover:border-slate-600 flex items-center justify-center group"
            >
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Main Features Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Feature Navigation */}
          <div className="mb-16">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-800/50 to-slate-800/30 rounded-2xl blur-xl"></div>
              <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-2xl p-2 border border-slate-700/50 shadow-2xl">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  {mainFeatures.map((feature) => {
                    const Icon = feature.icon
                    const isActive = activeFeature === feature.id
                    return (
                      <button
                        key={feature.id}
                        onClick={() => setActiveFeature(feature.id)}
                        className={`group relative p-6 rounded-xl transition-all duration-300 text-left ${
                          isActive 
                            ? `bg-gradient-to-br ${feature.color} shadow-lg` 
                            : 'bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/30 hover:border-slate-600'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                          isActive 
                            ? 'bg-white/20' 
                            : `bg-gradient-to-br ${feature.color} group-hover:scale-110 transition-transform`
                        }`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                        <p className={`text-sm ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                          {feature.subtitle}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Active Feature Content */}
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-br ${currentFeature.bgColor} rounded-3xl blur-xl`}></div>
            <div className={`relative bg-slate-800/40 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border ${currentFeature.borderColor} shadow-2xl`}>
              
              {/* Feature Header */}
              <div className="text-center mb-12">
                <div className={`w-20 h-20 bg-gradient-to-br ${currentFeature.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <currentFeature.icon className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{currentFeature.title}</h2>
                <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                  {currentFeature.description}
                </p>
              </div>

              {/* Feature Details Grid */}
              <div className="grid md:grid-cols-3 gap-8">
                {currentFeature.features.map((subFeature, index) => {
                  const SubIcon = subFeature.icon
                  return (
                    <div key={index} className="group relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-700/50 to-slate-700/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                      <div className="relative bg-slate-700/30 backdrop-blur-xl rounded-2xl p-6 border border-slate-600/50 shadow-xl group-hover:border-slate-600 transition-all duration-300 hover:transform hover:scale-105 h-full">
                        
                        <div className={`w-14 h-14 bg-gradient-to-br ${currentFeature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                          <SubIcon className="w-7 h-7 text-white" />
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-4">{subFeature.title}</h3>
                        <p className="text-slate-400 leading-relaxed mb-6">{subFeature.description}</p>
                        
                        <div className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${currentFeature.color} bg-opacity-20 rounded-full border ${currentFeature.borderColor}`}>
                          <Star className="w-4 h-4 mr-2 text-white" fill="currentColor" />
                          <span className="text-white text-sm font-semibold">{subFeature.stats}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Feature CTA */}
              <div className="text-center mt-12">
                <button
                  onClick={() => {
                    if (currentFeature.id === 'ai-coach' || currentFeature.id === 'pose-detection') {
                      goTo('/pose-detection')
                    } else if (currentFeature.id === 'diet-plans') {
                      goTo('/diet-plan')
                    } else if (currentFeature.id === 'progress-tracking') {
                      goTo('/progress')
                    }
                  }}
                  className={`px-8 py-4 bg-gradient-to-r ${currentFeature.color} hover:opacity-90 rounded-xl font-semibold text-white transition-all shadow-lg hover:shadow-xl flex items-center justify-center mx-auto group`}
                >
                  <Zap className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  Try {currentFeature.title}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full text-sm font-semibold text-cyan-400 mb-6 border border-cyan-500/30 backdrop-blur-sm">
              <Shield className="w-4 h-4 mr-2" />
              ADDITIONAL FEATURES
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Everything You Need for{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Complete Wellness
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Comprehensive features designed to support every aspect of your yoga and wellness journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-800/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-2xl group-hover:border-slate-600 transition-all duration-300 hover:transform hover:scale-105 text-center h-full">
                    
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-4">{feature.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                    
                    <div className="mt-6">
                      <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-3xl p-12 border border-slate-700/50 shadow-2xl text-center">
              
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/30">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Experience{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent">
                  AI-Powered Yoga?
                </span>
              </h3>
              
              <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
                Join thousands of users who have transformed their practice with our intelligent wellness platform.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => goTo('/register')}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 rounded-xl font-semibold text-white transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 flex items-center justify-center group"
                >
                  <Sparkles className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  Start Free Today
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => goTo('/')}
                  className="px-8 py-4 bg-slate-700/50 hover:bg-slate-700 backdrop-blur-xl rounded-xl font-semibold text-white transition-all border border-slate-600/50 hover:border-slate-600 flex items-center justify-center"
                >
                  <ArrowRight className="w-5 h-5 mr-2 rotate-180" />
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;
