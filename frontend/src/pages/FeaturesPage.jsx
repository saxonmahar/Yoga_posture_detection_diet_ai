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
      description: 'AI-powered yoga guidance that provides real-time feedback and personalized recommendations based on your practice level and goals.',
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'from-emerald-500/10 to-teal-500/10',
      borderColor: 'border-emerald-500/30',
      features: [
        {
          title: 'Guided Sessions',
          description: 'Step-by-step yoga sequences with voice guidance and visual demonstrations.',
          icon: Target,
          stats: 'Voice Guided'
        },
        {
          title: 'Form Feedback',
          description: 'Computer vision technology provides feedback on your posture and alignment.',
          icon: Eye,
          stats: 'Real-time Tips'
        },
        {
          title: 'Progress Tracking',
          description: 'Monitor your improvement over time with session history and accuracy metrics.',
          icon: TrendingUp,
          stats: 'Track Progress'
        }
      ]
    },
    {
      id: 'pose-detection',
      icon: Camera,
      title: 'AI Pose Detection',
      subtitle: 'Computer Vision Technology',
      description: 'Computer vision technology that recognizes yoga poses and provides feedback to help improve your form and technique.',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-500/10 to-cyan-500/10',
      borderColor: 'border-blue-500/30',
      features: [
        {
          title: 'Pose Recognition',
          description: 'Identifies 6 fundamental yoga poses using your device camera.',
          icon: Zap,
          stats: '6 Poses'
        },
        {
          title: 'Accuracy Scoring',
          description: 'Provides accuracy scores and suggestions for pose improvement.',
          icon: Target,
          stats: 'Score & Tips'
        },
        {
          title: 'Session Recording',
          description: 'Tracks your practice sessions and maintains a history of your progress.',
          icon: BarChart3,
          stats: 'Session History'
        }
      ]
    },
    {
      id: 'diet-plans',
      icon: Utensils,
      title: 'Smart Diet Plans',
      subtitle: 'Personalized Nutrition',
      description: 'Personalized nutrition recommendations based on your activity level and dietary preferences to support your wellness goals.',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-500/10 to-pink-500/10',
      borderColor: 'border-purple-500/30',
      features: [
        {
          title: 'Meal Suggestions',
          description: 'Get breakfast, lunch, and dinner recommendations based on your preferences.',
          icon: Heart,
          stats: 'Daily Meals'
        },
        {
          title: 'Nutrition Info',
          description: 'View calorie and macronutrient information for recommended meals.',
          icon: Activity,
          stats: 'Nutrition Facts'
        },
        {
          title: 'Dietary Options',
          description: 'Support for various dietary preferences including vegetarian and vegan options.',
          icon: CheckCircle,
          stats: 'Multiple Diets'
        }
      ]
    },
    {
      id: 'progress-tracking',
      icon: BarChart3,
      title: 'Progress Analytics',
      subtitle: 'Data-Driven Insights',
      description: 'Track your yoga practice with detailed analytics including session history, accuracy trends, and consistency metrics.',
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-500/10 to-red-500/10',
      borderColor: 'border-orange-500/30',
      features: [
        {
          title: 'Session Statistics',
          description: 'View your practice history including session count, accuracy, and duration.',
          icon: TrendingUp,
          stats: 'Session Data'
        },
        {
          title: 'Consistency Tracking',
          description: 'Monitor your practice frequency and build healthy habits over time.',
          icon: Flame,
          stats: 'Daily Practice'
        },
        {
          title: 'Personal Goals',
          description: 'Set practice goals and track your progress toward achieving them.',
          icon: Award,
          stats: 'Goal Setting'
        }
      ]
    }
  ];

  const additionalFeatures = [
    {
      title: 'Community Features',
      description: 'Connect with other yoga practitioners',
      icon: Users,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Schedule Planning',
      description: 'Plan and organize your yoga sessions',
      icon: Globe,
      color: 'from-indigo-500 to-purple-500'
    },
    {
      title: 'Secure Platform',
      description: 'Your data is protected and private',
      icon: Shield,
      color: 'from-pink-500 to-rose-500'
    },
    {
      title: 'Regular Updates',
      description: 'Continuous improvements and new features',
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
