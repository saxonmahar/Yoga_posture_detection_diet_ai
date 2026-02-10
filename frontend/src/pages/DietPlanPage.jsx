import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Utensils, Apple, Coffee, Droplets, Target, Activity, Calendar, Flame, Loader2, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dietService } from '../services/diet/diet.service';

function DietPlanPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [regenerating, setRegenerating] = useState(false);
  const [yogaSessionData, setYogaSessionData] = useState(null);
  const [hasCompletedSession, setHasCompletedSession] = useState(false);

  // Default stats if user object is missing
  const defaultStats = {
    goal: 'maintain',
    activityLevel: 'moderately_active',
    weight: 70,
    height: 170,
    age: 25
  };

  const stats = user?.stats || defaultStats;

  // Fetch diet recommendations with custom data
  const fetchRecommendationsWithData = async (customStats) => {
    try {
      setError(null);
      setLoading(true);

      const userData = {
        age: user?.age || customStats.age || 25,
        height: user?.height || customStats.height || 170,
        weight: user?.weight || customStats.weight || 70,
        activity_level: customStats.activityLevel || 'moderately_active',
        body_type: user?.bodyType || customStats.bodyType || 'mesomorphic',
        goal: user?.goal || customStats.goal || 'maintain'
      };

      const response = await dietService.getRecommendation(userData);
      
      if (response.data.success) {
        setRecommendations(response.data.recommendation);
      } else {
        setError('Failed to get recommendations');
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError(err.response?.data?.error || 'Failed to fetch diet recommendations. Please make sure the Python Flask server is running on port 5000.');
    } finally {
      setLoading(false);
      setRegenerating(false);
    }
  };

  // Fetch diet recommendations
  const fetchRecommendations = async () => {
    await fetchRecommendationsWithData(stats);
  };

  // Check if user has completed a yoga session - DATABASE IS SOURCE OF TRUTH
  useEffect(() => {
    const checkSessionCompletion = async () => {
      try {
        // ALWAYS check database first - this is the source of truth
        if (user?._id || user?.id) {
          const userId = user._id || user.id;
          const response = await fetch(`http://localhost:5001/api/analytics/user/${userId}`, {
            credentials: 'include'
          });
          
          if (response.ok) {
            const data = await response.json();
            const totalSessions = data.analytics?.overall_stats?.total_sessions || 0;
            
            if (totalSessions > 0) {
              setHasCompletedSession(true);
              console.log('✅ Diet page: User has', totalSessions, 'sessions - UNLOCKING diet');
              
              // Sync localStorage with database truth
              localStorage.setItem('hasCompletedYogaSession', 'true');
            } else {
              setHasCompletedSession(false);
              console.log('⚠️ Diet page: User has 0 sessions - LOCKING diet');
              
              // Clear any stale localStorage data
              localStorage.removeItem('hasCompletedYogaSession');
            }
            return; // Database check succeeded, don't use localStorage
          }
        }
        
        // Only if database fails, check localStorage as temporary fallback
        console.warn('⚠️ Diet page: Database check failed, using localStorage fallback');
        const completedSession = localStorage.getItem('hasCompletedYogaSession');
        setHasCompletedSession(completedSession === 'true');
        
      } catch (error) {
        console.error('❌ Diet page: Error checking session completion:', error);
        // Only on error, use localStorage
        const completedSession = localStorage.getItem('hasCompletedYogaSession');
        setHasCompletedSession(completedSession === 'true');
      }
    };

    if (!authLoading && user) {
      checkSessionCompletion();
    }
  }, [user, authLoading]);

  // Fetch recommendations when component mounts or location state changes
  useEffect(() => {
    // Only fetch if user is authenticated and has completed a session
    if (!user || authLoading || !hasCompletedSession) {
      return;
    }

    // Check for yoga session data from localStorage first
    const sessionData = localStorage.getItem('yogaSessionData');
    if (sessionData) {
      try {
        const parsedData = JSON.parse(sessionData);
        setYogaSessionData(parsedData);
        console.log('🧘‍♀️ Yoga session data found:', parsedData);
        
        // Adjust activity level based on yoga session
        const adjustedStats = {
          ...stats,
          activityLevel: parsedData.totalCalories > 20 ? 'very_active' : 'moderately_active'
        };
        // Auto-fetch recommendations with adjusted stats
        fetchRecommendationsWithData(adjustedStats);
        return;
      } catch (error) {
        console.error('Error parsing yoga session data:', error);
      }
    }

    // Check if coming from yoga session via navigation state
    if (location.state?.yogaSession) {
      setYogaSessionData(location.state.yogaSession);
      // Adjust activity level based on yoga session
      const adjustedStats = {
        ...stats,
        activityLevel: location.state.yogaSession.caloriesBurned > 100 ? 'very_active' : 'moderately_active'
      };
      // Auto-fetch recommendations with adjusted stats
      fetchRecommendationsWithData(adjustedStats);
    } else {
      // Normal flow - fetch recommendations
      fetchRecommendations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state, user, authLoading, hasCompletedSession]); // Run when these change

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
            <Utensils className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Smart Diet Plan</h2>
          <p className="text-slate-400 mb-6">Please log in to access your personalized AI-powered diet recommendations.</p>
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

  // If user hasn't completed a yoga session, show requirement screen
  if (user && !authLoading && !hasCompletedSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center max-w-2xl mx-auto">
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-3xl p-12 border border-slate-700/50 shadow-2xl">
            {/* Lock Icon */}
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-purple-500/30">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Utensils className="w-8 h-8 text-white" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white mb-4">
              Complete a Yoga Session First! 🧘‍♀️
            </h2>
            <p className="text-xl text-slate-300 mb-6 leading-relaxed">
              Your personalized diet plan is waiting for you, but we need to understand your activity level first.
            </p>
            
            <div className="bg-slate-700/30 rounded-2xl p-6 mb-8 border border-slate-600/30">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-400" />
                Why Complete a Session?
              </h3>
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-300">
                    <strong className="text-white">Accurate Calorie Calculation:</strong> We measure your actual calories burned
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-300">
                    <strong className="text-white">Pose-Specific Nutrition:</strong> Different poses need different nutrients
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-300">
                    <strong className="text-white">Recovery Optimization:</strong> Get meals that help your body recover
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-300">
                    <strong className="text-white">Personalized Timing:</strong> Recommendations based on when you practice
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => navigate('/pose-detection')}
                className="w-full px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl font-bold text-lg transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-3"
              >
                <Activity className="w-6 h-6" />
                Start Your First Yoga Session
              </button>
              
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full px-8 py-4 bg-slate-700/50 hover:bg-slate-700 rounded-xl font-semibold transition-all border border-slate-600/50 hover:border-slate-600"
              >
                Back to Dashboard
              </button>
            </div>

            <p className="text-sm text-slate-500 mt-6">
              💡 Tip: Complete just one pose (takes ~2 minutes) to unlock your personalized diet plan!
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleRegenerate = () => {
    setRegenerating(true);
    fetchRecommendations();
  };

  // Calculate macros from recommendations
  const calculateMacros = () => {
    if (!recommendations) {
      return {
        calories: stats.goal === 'weight-loss' ? 1800 : stats.goal === 'weight-gain' ? 2200 : 2000,
        protein: 120,
        carbs: 200,
        fat: 65
      };
    }

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    ['Breakfast', 'Lunch', 'Dinner'].forEach(mealType => {
      if (recommendations[mealType]) {
        recommendations[mealType].forEach(item => {
          totalCalories += item.Calories || 0;
          totalProtein += item.Proteins || 0;
          totalCarbs += item.Carbohydrates || 0;
          totalFat += item.Fats || 0;
        });
      }
    });

    return {
      calories: recommendations.total_calories || Math.round(totalCalories),
      protein: Math.round(totalProtein),
      carbs: Math.round(totalCarbs),
      fat: Math.round(totalFat)
    };
  };

  const macros = calculateMacros();
  const waterIntake = Math.round((user?.weight || stats.weight) * 0.033);

  const mealTypes = [
    { 
      key: 'Breakfast', 
      time: '8:00 AM', 
      icon: Coffee, 
      color: 'from-orange-500 to-yellow-400' 
    },
    { 
      key: 'Lunch', 
      time: '12:00 PM', 
      icon: Utensils, 
      color: 'from-green-500 to-emerald-400' 
    },
    { 
      key: 'Dinner', 
      time: '8:00 PM', 
      icon: Utensils, 
      color: 'from-purple-500 to-pink-400' 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white via-emerald-200 to-blue-200 bg-clip-text text-transparent">
                AI-Powered Diet Plan
              </h1>
              <p className="text-slate-400">Personalized nutrition for {user?.name || 'your wellness journey'}</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`px-3 py-1 rounded-full text-sm ${user?.isPremium ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'}`}>
                {user?.isPremium ? '🌟 Premium Plan' : 'Basic Plan'}
              </div>
              {stats.goal && (
                <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm border border-emerald-500/30">
                  {stats.goal.replace('-', ' ').replace('_', ' ')}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Yoga Session Completion Banner */}
        {yogaSessionData && (
          <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-emerald-400 mb-2">Great Yoga Session! 🧘</h3>
                <p className="text-slate-300 mb-3">
                  You just completed a {yogaSessionData.duration} minute session with {yogaSessionData.accuracy}% accuracy, 
                  burning {yogaSessionData.caloriesBurned} calories. Based on your activity, we've personalized your diet recommendations!
                </p>
                <button
                  onClick={() => navigate('/progress')}
                  className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-2"
                >
                  <Activity className="w-4 h-4" />
                  View Your Progress
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Banner - Show at top if error exists */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-400 mb-2">Error Loading Recommendations</h3>
                <p className="text-slate-300 mb-4">{error}</p>
                <div className="flex gap-3">
                  <button
                    onClick={handleRegenerate}
                    disabled={regenerating}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 font-semibold transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {regenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Retrying...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setError(null)}
                    className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-slate-300 font-semibold transition-all"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State - Full Screen */}
        {loading && !recommendations && !error ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-emerald-400 mx-auto mb-4" />
              <p className="text-slate-400">Loading your personalized diet plan...</p>
              <p className="text-slate-500 text-sm mt-2">This may take a few seconds...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Main Content - Always show, even if no recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Nutrition Goals */}
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Daily Nutrition Goals</h2>
                  {recommendations?.note && (
                    <span className="text-xs text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded-full">
                      {recommendations.note}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/30">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-400 flex items-center justify-center">
                        <Flame className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{macros.calories}</div>
                        <div className="text-sm text-slate-400">Calories</div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500">Target daily intake</div>
                  </div>

                  <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/30">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                        <Droplets className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{macros.protein}g</div>
                        <div className="text-sm text-slate-400">Protein</div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500">For muscle recovery</div>
                  </div>

                  <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/30">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center">
                        <Apple className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{macros.carbs}g</div>
                        <div className="text-sm text-slate-400">Carbs</div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500">Energy source</div>
                  </div>

                  <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/30">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{macros.fat}g</div>
                        <div className="text-sm text-slate-400">Fat</div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500">Essential nutrients</div>
                  </div>
                </div>
              </div>

              {/* Meal Schedule */}
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Today's Meal Plan</h2>
                  <button
                    onClick={handleRegenerate}
                    disabled={regenerating}
                    className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-lg text-emerald-400 text-sm font-semibold transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {regenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Regenerating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        Regenerate
                      </>
                    )}
                  </button>
                </div>
                <div className="space-y-4">
                  {mealTypes.map((mealType) => {
                    const Icon = mealType.icon;
                    const mealItems = recommendations?.[mealType.key] || [];
                    
                    return (
                      <div key={mealType.key} className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                        <div className="flex items-center gap-4 mb-3">
                          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${mealType.color} flex items-center justify-center`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-lg">{mealType.key}</div>
                            <div className="text-sm text-slate-400">{mealType.time}</div>
                          </div>
                        </div>
                        {mealItems.length > 0 ? (
                          <div className="space-y-2">
                            {mealItems.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                                <div className="flex-1">
                                  <div className="font-medium text-white">{item.Food_items || 'Food Item'}</div>
                                  <div className="text-xs text-slate-400 mt-1">
                                    {item.Calories ? `${Math.round(item.Calories)} cal` : ''} • 
                                    {item.Proteins ? ` ${Math.round(item.Proteins)}g protein` : ''} • 
                                    {item.Carbohydrates ? ` ${Math.round(item.Carbohydrates)}g carbs` : ''} • 
                                    {item.Fats ? ` ${Math.round(item.Fats)}g fat` : ''}
                                  </div>
                                </div>
                                {item.Link && (
  <img
    src={item.Link}
    alt={item.Food_items || 'Food item'}
    className="w-16 h-16 rounded-lg object-cover ml-3"
    onError={(e) => {
      e.target.onerror = null;
      e.target.style.display = 'none';
    }}
  />
)}

                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-slate-400 text-sm italic">No recommendations available</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Water Intake */}
              <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <Droplets className="w-5 h-5 mr-2 text-blue-400" />
                      Hydration Goal
                    </h3>
                    <p className="text-slate-400 text-sm">Based on your weight: {user?.weight || stats.weight}kg</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-400">{waterIntake}L</div>
                    <div className="text-sm text-slate-400">Daily water intake</div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-center space-x-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-10 h-10 rounded-lg ${i < waterIntake ? 'bg-blue-500' : 'bg-slate-700/50'} border border-slate-600/30`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* AI Recommendations */}
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
                <h3 className="text-lg font-semibold mb-4">AI Recommendations</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                    <h4 className="font-medium mb-2 text-sm text-emerald-400">Based on your profile:</h4>
                    <p className="text-sm text-slate-300">
                      {recommendations?.total_calories 
                        ? `Your daily calorie target is ${recommendations.total_calories} kcal based on your ${stats.goal?.replace('-', ' ').replace('_', ' ')} goal.`
                        : 'Follow the meal plan above to achieve your nutrition goals.'}
                    </p>
                  </div>

                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <h4 className="font-medium mb-2 text-sm text-blue-400">Hydration Tip:</h4>
                    <p className="text-sm text-slate-300">
                      Drink {waterIntake}L of water daily. Aim for 500ml 30 minutes before meals for better digestion.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
                <h4 className="font-medium mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => navigate('/pose-detection')}
                    className="w-full flex items-center p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg transition text-left border border-slate-600/30 hover:border-slate-600"
                  >
                    <Activity className="w-5 h-5 mr-3 text-blue-400" />
                    <span>Start Workout Session</span>
                  </button>
                  <button
                    onClick={() => navigate('/progress')}
                    className="w-full flex items-center p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg transition text-left border border-slate-600/30 hover:border-slate-600"
                  >
                    <Calendar className="w-5 h-5 mr-3 text-green-400" />
                    <span>View Progress</span>
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full flex items-center p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg transition text-left border border-slate-600/30 hover:border-slate-600"
                  >
                    <Target className="w-5 h-5 mr-3 text-purple-400" />
                    <span>Back to Dashboard</span>
                  </button>
                </div>
              </div>

              {/* Premium Upgrade */}
              {!user?.isPremium && (
                <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/20">
                  <h4 className="font-semibold mb-3 flex items-center text-yellow-400">
                    <Target className="w-5 h-5 mr-2" />
                    Upgrade for Advanced Features
                  </h4>
                  <ul className="space-y-2 mb-4 text-sm text-slate-300">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                      Custom meal plans
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                      Grocery shopping lists
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                      Recipe suggestions
                    </li>
                  </ul>
                  <button
                    onClick={() => navigate('/premium')}
                    className="w-full py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-lg font-semibold text-sm transition-all"
                  >
                    Upgrade to Premium
                  </button>
                </div>
              )}
            </div>
          </div>
          </>
        )}
      </div>
    </div>
  );
}

export default DietPlanPage;
