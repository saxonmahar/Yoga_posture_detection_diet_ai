import React from 'react';
import { Utensils, Apple, Coffee, Droplets, Target, Activity, Calendar, Flame } from 'lucide-react';

function DietPlanPage({ onNavigate, user = {} }) {
  // Default stats if user object is missing
  const defaultStats = {
    goal: 'general-health',
    activityLevel: 'moderate',
    weight: 70
  };

  const stats = user.stats || defaultStats;

  const mealTimes = [
    { time: '8:00 AM', type: 'Breakfast', icon: Coffee, color: 'from-orange-500 to-yellow-400' },
    { time: '12:00 PM', type: 'Lunch', icon: Utensils, color: 'from-green-500 to-emerald-400' },
    { time: '4:00 PM', type: 'Snack', icon: Apple, color: 'from-blue-500 to-cyan-400' },
    { time: '8:00 PM', type: 'Dinner', icon: Utensils, color: 'from-purple-500 to-pink-400' }
  ];

  // Calculate diet plan based on user stats
  const calculateDietPlan = () => {
    let calories = 2000;
    let protein = 120;
    let carbs = 200;

    if (stats.goal === 'weight-loss') {
      calories = 1800;
      protein = 140;
      carbs = 180;
    } else if (stats.goal === 'muscle-gain') {
      calories = 2200;
      protein = 160;
      carbs = 220;
    }

    if (stats.activityLevel === 'active') {
      calories += 200;
      protein += 10;
    } else if (stats.activityLevel === 'sedentary') {
      calories -= 200;
    }

    return {
      calories: Math.round(calories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: 65
    };
  };

  const dietPlan = calculateDietPlan();
  const waterIntake = Math.round(stats.weight * 0.033);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-surface">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">AI-Powered Diet Plan</h1>
              <p className="text-text-muted">Personalized nutrition for {user?.name || 'your wellness journey'}</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`px-3 py-1 rounded-full text-sm ${user?.isPremium ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'}`}>
                {user?.isPremium ? '🌟 Premium Plan' : 'Basic Plan'}
              </div>
              {stats.goal && (
                <div className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm">
                  {stats.goal.replace('-', ' ')}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Nutrition Goals */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 card-hover">
              <h2 className="text-xl font-semibold mb-4">Daily Nutrition Goals</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-surface p-4 rounded-xl">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-400 flex items-center justify-center">
                      <Flame className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{dietPlan.calories}</div>
                      <div className="text-sm text-text-muted">Calories</div>
                    </div>
                  </div>
                  <div className="text-sm text-text-muted">Target daily intake</div>
                </div>

                <div className="bg-surface p-4 rounded-xl">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                      <Droplets className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{dietPlan.protein}g</div>
                      <div className="text-sm text-text-muted">Protein</div>
                    </div>
                  </div>
                  <div className="text-sm text-text-muted">For muscle recovery</div>
                </div>

                <div className="bg-surface p-4 rounded-xl">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center">
                      <Apple className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{dietPlan.carbs}g</div>
                      <div className="text-sm text-text-muted">Carbs</div>
                    </div>
                  </div>
                  <div className="text-sm text-text-muted">Energy source</div>
                </div>
              </div>
            </div>

            {/* Meal Schedule */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 card-hover">
              <h2 className="text-xl font-semibold mb-4">Today's Meal Plan</h2>
              <div className="space-y-4">
                {mealTimes.map((meal, index) => {
                  const Icon = meal.icon;
                  return (
                    <div key={index} className="flex items-center p-4 bg-white/5 rounded-xl hover:bg-white/10 transition card-hover">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${meal.color} flex items-center justify-center mr-4`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{meal.type}</div>
                        <div className="text-sm text-text-muted">
                          {index === 0 && 'Oatmeal with berries & protein shake'}
                          {index === 1 && 'Grilled chicken salad with quinoa'}
                          {index === 2 && 'Greek yogurt with nuts'}
                          {index === 3 && 'Salmon with vegetables and brown rice'}
                        </div>
                      </div>
                      <div className="text-text-muted">{meal.time}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Water Intake */}
            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <Droplets className="w-5 h-5 mr-2 text-blue-400" />
                    Hydration Goal
                  </h3>
                  <p className="text-text-muted text-sm">Based on your weight: {stats.weight}kg</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-400">{waterIntake}L</div>
                  <div className="text-sm text-text-muted">Daily water intake</div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-center space-x-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-lg ${i < waterIntake ? 'bg-blue-500' : 'bg-surface'} border border-white/10`}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* AI Recommendations */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 card-hover">
              <h3 className="text-lg font-semibold mb-4">AI Recommendations</h3>
              <div className="space-y-4">
                <div className="p-4 bg-accent/10 rounded-lg">
                  <h4 className="font-medium mb-2 text-sm">Based on your workout:</h4>
                  <p className="text-sm text-text-muted">
                    "Increase protein intake by 20g to support muscle recovery after your plank sessions."
                  </p>
                </div>

                <div className="p-4 bg-green-500/10 rounded-lg">
                  <h4 className="font-medium mb-2 text-sm">Hydration Tip:</h4>
                  <p className="text-sm text-text-muted">
                    "Drink 500ml water 30 minutes before your next workout for better performance."
                  </p>
                </div>

                <button
                  onClick={() => onNavigate('dashboard')}
                  className="w-full py-3 btn-primary"
                >
                  Regenerate Plan with AI
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 card-hover">
              <h4 className="font-medium mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <button
                  onClick={() => onNavigate('pose-detection')}
                  className="w-full flex items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition text-left card-hover"
                >
                  <Activity className="w-5 h-5 mr-3 text-blue-400" />
                  <span>Start Workout Session</span>
                </button>
                <button
                  onClick={() => onNavigate('progress')}
                  className="w-full flex items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition text-left card-hover"
                >
                  <Calendar className="w-5 h-5 mr-3 text-green-400" />
                  <span>View Progress</span>
                </button>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="w-full flex items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition text-left card-hover"
                >
                  <Target className="w-5 h-5 mr-3 text-purple-400" />
                  <span>Back to Dashboard</span>
                </button>
              </div>
            </div>

            {/* Premium Upgrade */}
            {!user?.isPremium && (
              <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/20 card-hover">
                <h4 className="font-semibold mb-3 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-yellow-400" />
                  Upgrade for Advanced Features
                </h4>
                <ul className="space-y-2 mb-4 text-sm text-text-muted">
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
                  onClick={() => onNavigate('premium')}
                  className="w-full py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-lg font-semibold text-sm"
                >
                  Upgrade to Premium
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DietPlanPage;
