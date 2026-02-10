import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Flame, Activity, Target, Clock, 
  ChevronRight, Heart, CheckCircle,
  Award, Sparkles
} from 'lucide-react';

const PostYogaMealCard = ({ sessionData, onClose }) => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMeal, setSelectedMeal] = useState(null);

  useEffect(() => {
    fetchRecommendations();
  }, [sessionData]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5002/recommend-post-yoga', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData)
      });

      const data = await response.json();
      if (data.success) {
        setRecommendations(data);
        setSelectedMeal(data.recommendations.primary);
      }
    } catch (error) {
      console.error('Error fetching post-yoga meals:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-300">Preparing your recovery meal...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!recommendations) return null;

  const { sessionSummary, recoveryNeeds, message } = recommendations;
  const alternatives = recommendations.recommendations.alternatives;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl max-w-4xl w-full my-8 border border-slate-700/50 shadow-2xl">
        
        {/* Header */}
        <div className="relative p-8 pb-6">
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-slate-700/50 hover:bg-slate-700 flex items-center justify-center transition-all"
            >
              ✕
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">
                Excellent Session! 🧘
              </h2>
              <p className="text-slate-400">Time for recovery nutrition</p>
            </div>
          </div>

          {/* Session Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-5 h-5 text-orange-400" />
                <span className="text-slate-400 text-sm">Burned</span>
              </div>
              <div className="text-2xl font-bold text-white">{sessionSummary.caloriesBurned}</div>
              <div className="text-xs text-slate-500">calories</div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-slate-400 text-sm">Duration</span>
              </div>
              <div className="text-2xl font-bold text-white">{sessionSummary.duration}</div>
              <div className="text-xs text-slate-500">minutes</div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-emerald-400" />
                <span className="text-slate-400 text-sm">Accuracy</span>
              </div>
              <div className="text-2xl font-bold text-white">{sessionSummary.accuracy}%</div>
              <div className="text-xs text-slate-500">average</div>
            </div>
          </div>

          {/* Personalized Message */}
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl p-4 border border-emerald-500/20">
            <p className="text-slate-200 whitespace-pre-line">{message}</p>
          </div>
        </div>

        {/* Recovery Needs */}
        <div className="px-8 pb-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            Your Recovery Needs
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
              <div className="text-emerald-400 text-xl font-bold">{recoveryNeeds.calories}</div>
              <div className="text-slate-400 text-xs">Calories</div>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
              <div className="text-blue-400 text-xl font-bold">{recoveryNeeds.protein}g</div>
              <div className="text-slate-400 text-xs">Protein</div>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
              <div className="text-purple-400 text-xl font-bold">{recoveryNeeds.carbs}g</div>
              <div className="text-slate-400 text-xs">Carbs</div>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
              <div className="text-cyan-400 text-xl font-bold">{recoveryNeeds.hydration}L</div>
              <div className="text-slate-400 text-xs">Water</div>
            </div>
          </div>
        </div>

        {/* Recommended Meal */}
        <div className="px-8 pb-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            Perfect Recovery Meal
          </h3>
          
          {selectedMeal && (
            <div className="bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-emerald-500/30 transition-all">
              <div className="grid md:grid-cols-2 gap-6 p-6">
                {/* Meal Image */}
                <div className="relative">
                  <img
                    src={selectedMeal.Link || selectedMeal.image}
                    alt={selectedMeal.Food_items || selectedMeal.name}
                    className="w-full h-64 object-cover rounded-xl"
                    onError={(e) => {
                      e.target.src = `https://source.unsplash.com/400x300/?${(selectedMeal.Food_items || selectedMeal.name).replace(' ', '+')}`;
                    }}
                  />
                  <div className="absolute top-3 right-3 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Heart className="w-4 h-4" fill="currentColor" />
                    Best Match
                  </div>
                  {selectedMeal.price && (
                    <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
                      ₹{selectedMeal.price}
                    </div>
                  )}
                </div>

                {/* Meal Details */}
                <div className="flex flex-col justify-between">
                  <div>
                    <h4 className="text-2xl font-bold text-white mb-1">{selectedMeal.Food_items || selectedMeal.name}</h4>
                    <p className="text-emerald-400 text-lg mb-4">{selectedMeal.LocalName || selectedMeal.localName}</p>
                    
                    {/* Nutrition Info */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-slate-700/30 rounded-lg p-3">
                        <div className="text-orange-400 text-lg font-bold">{selectedMeal.Calories || selectedMeal.calories}</div>
                        <div className="text-slate-400 text-xs">Calories</div>
                      </div>
                      <div className="bg-slate-700/30 rounded-lg p-3">
                        <div className="text-blue-400 text-lg font-bold">{selectedMeal.Proteins || selectedMeal.protein}g</div>
                        <div className="text-slate-400 text-xs">Protein</div>
                      </div>
                      <div className="bg-slate-700/30 rounded-lg p-3">
                        <div className="text-purple-400 text-lg font-bold">{selectedMeal.Carbohydrates || selectedMeal.carbs}g</div>
                        <div className="text-slate-400 text-xs">Carbs</div>
                      </div>
                      <div className="bg-slate-700/30 rounded-lg p-3">
                        <div className="text-green-400 text-lg font-bold">{selectedMeal.Fats || selectedMeal.fat}g</div>
                        <div className="text-slate-400 text-xs">Fat</div>
                      </div>
                    </div>

                    {/* Benefits */}
                    <div className="mb-4">
                      <div className="text-slate-400 text-sm mb-2">Benefits:</div>
                      <div className="flex flex-wrap gap-2">
                        {selectedMeal.benefits?.map((benefit, idx) => (
                          <span key={idx} className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-full border border-emerald-500/20">
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Prep Info */}
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {selectedMeal.prepTime} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Activity className="w-4 h-4" />
                        {selectedMeal.difficulty}
                      </span>
                      {selectedMeal.isVegetarian && (
                        <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded-full text-xs">
                          🌱 Vegetarian
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => navigate('/diet-plan', { state: { selectedMeal } })}
                    className="w-full mt-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2"
                  >
                    View Full Diet Plan
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Alternative Options */}
        {alternatives && alternatives.length > 0 && (
          <div className="px-8 pb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Other Great Options</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {alternatives.map((meal, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedMeal(meal)}
                  className={`bg-slate-800/30 rounded-xl p-4 border transition-all text-left ${
                    selectedMeal?.Food_items === meal.Food_items
                      ? 'border-emerald-500/50 bg-emerald-500/5'
                      : 'border-slate-700/30 hover:border-slate-600/50'
                  }`}
                >
                  <div className="flex gap-4">
                    <img
                      src={meal.Link || meal.image}
                      alt={meal.Food_items || meal.name}
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = `https://source.unsplash.com/200x200/?${(meal.Food_items || meal.name).replace(' ', '+')}`;
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1">{meal.Food_items || meal.name}</h4>
                      <p className="text-emerald-400 text-sm mb-2">{meal.LocalName || meal.localName}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span>{meal.Calories || meal.calories} cal</span>
                        <span>•</span>
                        <span>{meal.Proteins || meal.protein}g protein</span>
                        {meal.Price && (
                          <>
                            <span>•</span>
                            <span>₹{meal.Price || meal.price}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="px-8 pb-8 flex gap-4">
          <button
            onClick={() => {
              onClose();
              // Trigger "Choose Next Pose" flow
              window.dispatchEvent(new CustomEvent('chooseNextPose'));
            }}
            className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2"
          >
            🧘‍♀️ Choose Next Pose
          </button>
          <button
            onClick={() => navigate('/diet-plan')}
            className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl font-semibold text-white transition-all"
          >
            See Full Diet Plan
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl font-semibold text-white transition-all"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostYogaMealCard;
