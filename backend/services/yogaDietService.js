// Yoga-Diet Integration Service
// Connects yoga sessions with personalized diet recommendations

const nepaliFood = require('../data/nepali-foods.json');

class YogaDietService {
  /**
   * Get post-yoga recovery meal recommendations
   * @param {Object} sessionData - Yoga session data
   * @returns {Object} Meal recommendations
   */
  getPostYogaMeals(sessionData) {
    const {
      caloriesBurned = 0,
      duration = 0,
      poses = [],
      accuracy = 0,
      timeOfDay = 'morning'
    } = sessionData;

    // Analyze pose types to determine nutritional needs
    const poseAnalysis = this.analyzePoses(poses);
    
    // Determine meal type based on time
    const mealType = this.getMealTypeFromTime(timeOfDay);
    
    // Calculate recovery needs
    const recoveryNeeds = this.calculateRecoveryNeeds(caloriesBurned, duration, poseAnalysis);
    
    // Get appropriate meals
    const recommendations = this.selectMeals(mealType, recoveryNeeds, poseAnalysis);
    
    return {
      success: true,
      sessionSummary: {
        caloriesBurned,
        duration,
        accuracy,
        poseTypes: poseAnalysis.types
      },
      recoveryNeeds,
      recommendations,
      message: this.generateMessage(caloriesBurned, accuracy, poseAnalysis)
    };
  }

  /**
   * Analyze poses to determine focus areas
   */
  analyzePoses(poses) {
    const poseTypes = {
      flexibility: ['tree', 'warrior2', 'goddess'],
      strength: ['plank', 'downdog'],
      balance: ['tree', 'goddess'],
      cardio: ['warrior2', 'downdog']
    };

    const analysis = {
      flexibility: 0,
      strength: 0,
      balance: 0,
      cardio: 0,
      types: []
    };

    poses.forEach(pose => {
      const poseName = pose.poseName?.toLowerCase() || '';
      
      Object.keys(poseTypes).forEach(type => {
        if (poseTypes[type].some(p => poseName.includes(p))) {
          analysis[type]++;
        }
      });
    });

    // Determine primary focus
    const maxType = Object.keys(analysis).reduce((a, b) => 
      analysis[a] > analysis[b] ? a : b
    );
    
    if (analysis[maxType] > 0) {
      analysis.types.push(maxType);
    }

    return analysis;
  }

  /**
   * Determine meal type based on time of day
   */
  getMealTypeFromTime(timeOfDay) {
    const hour = new Date().getHours();
    
    if (timeOfDay === 'morning' || hour < 11) return 'breakfast';
    if (timeOfDay === 'afternoon' || (hour >= 11 && hour < 16)) return 'lunch';
    if (timeOfDay === 'evening' || hour >= 16) return 'dinner';
    
    return 'snacks';
  }

  /**
   * Calculate recovery nutritional needs
   */
  calculateRecoveryNeeds(caloriesBurned, duration, poseAnalysis) {
    const needs = {
      calories: Math.round(caloriesBurned * 1.2), // 20% more for recovery
      protein: 0,
      carbs: 0,
      hydration: 0,
      focus: []
    };

    // Protein needs based on strength work
    if (poseAnalysis.strength > 2) {
      needs.protein = 20; // High protein
      needs.focus.push('muscle-recovery');
    } else {
      needs.protein = 12; // Moderate protein
    }

    // Carbs for energy replenishment
    if (caloriesBurned > 150 || duration > 30) {
      needs.carbs = 50; // High carbs
      needs.focus.push('energy-restoration');
    } else {
      needs.carbs = 30; // Moderate carbs
    }

    // Hydration based on duration
    needs.hydration = Math.ceil(duration / 15); // 1L per 15 min

    // Special needs based on pose types
    if (poseAnalysis.flexibility > 2) {
      needs.focus.push('joint-health');
    }
    if (poseAnalysis.balance > 2) {
      needs.focus.push('brain-health');
    }

    return needs;
  }

  /**
   * Select appropriate meals based on needs
   */
  selectMeals(mealType, recoveryNeeds, poseAnalysis) {
    let availableMeals = [];

    // Get meals from appropriate category
    if (mealType === 'breakfast') {
      availableMeals = nepaliFood.breakfast;
    } else if (mealType === 'lunch') {
      availableMeals = nepaliFood.lunch;
    } else if (mealType === 'dinner') {
      availableMeals = nepaliFood.dinner;
    } else {
      availableMeals = nepaliFood.snacks;
    }

    // Filter and score meals
    const scoredMeals = availableMeals.map(meal => {
      let score = 0;

      // Score based on protein needs
      if (recoveryNeeds.protein >= 15 && meal.protein >= 15) score += 3;
      else if (recoveryNeeds.protein >= 12 && meal.protein >= 10) score += 2;

      // Score based on calories
      const calorieMatch = Math.abs(meal.calories - recoveryNeeds.calories);
      if (calorieMatch < 50) score += 3;
      else if (calorieMatch < 100) score += 2;
      else if (calorieMatch < 150) score += 1;

      // Score based on bestFor tag
      if (meal.bestFor === 'post-yoga') score += 2;
      if (meal.bestFor === 'recovery') score += 2;

      // Score based on focus areas
      if (recoveryNeeds.focus.includes('muscle-recovery') && meal.protein >= 15) score += 2;
      if (recoveryNeeds.focus.includes('joint-health') && meal.benefits.some(b => b.includes('fiber'))) score += 1;

      return { ...meal, score };
    });

    // Sort by score and return top 3
    const topMeals = scoredMeals
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    return {
      primary: topMeals[0],
      alternatives: topMeals.slice(1),
      allOptions: topMeals
    };
  }

  /**
   * Generate personalized message
   */
  generateMessage(caloriesBurned, accuracy, poseAnalysis) {
    let message = `🧘 Great session! You burned ${caloriesBurned} calories`;
    
    if (accuracy >= 85) {
      message += ` with excellent ${accuracy}% accuracy! 🎯`;
    } else if (accuracy >= 70) {
      message += ` with good ${accuracy}% accuracy! 👍`;
    } else {
      message += `. Keep practicing to improve your form! 💪`;
    }

    // Add focus-specific message
    if (poseAnalysis.types.includes('strength')) {
      message += '\n\n💪 Your strength-focused session needs high protein for muscle recovery.';
    } else if (poseAnalysis.types.includes('flexibility')) {
      message += '\n\n🤸 Your flexibility work benefits from anti-inflammatory foods for joint health.';
    } else if (poseAnalysis.types.includes('balance')) {
      message += '\n\n🧠 Balance poses benefit from omega-3 rich foods for brain health.';
    }

    return message;
  }

  /**
   * Get pre-yoga meal suggestions
   */
  getPreYogaMeals(scheduledTime) {
    const timeUntilYoga = (new Date(scheduledTime) - new Date()) / (1000 * 60); // minutes
    
    let recommendations = [];

    if (timeUntilYoga > 120) {
      // More than 2 hours - can have a full meal
      recommendations = nepaliFood.breakfast
        .filter(meal => meal.bestFor === 'pre-yoga' || meal.calories < 300)
        .slice(0, 3);
    } else if (timeUntilYoga > 60) {
      // 1-2 hours - light meal
      recommendations = nepaliFood.snacks
        .filter(meal => meal.calories < 250)
        .slice(0, 3);
    } else {
      // Less than 1 hour - very light snack
      recommendations = nepaliFood.snacks
        .filter(meal => meal.calories < 150)
        .slice(0, 3);
    }

    return {
      success: true,
      timeUntilYoga: Math.round(timeUntilYoga),
      message: this.getPreYogaMessage(timeUntilYoga),
      recommendations
    };
  }

  /**
   * Generate pre-yoga message
   */
  getPreYogaMessage(minutes) {
    if (minutes > 120) {
      return `⏰ Yoga in ${Math.round(minutes / 60)} hours. Have a light, energizing meal now.`;
    } else if (minutes > 60) {
      return `⏰ Yoga in ${Math.round(minutes)} minutes. Have a quick, easily digestible snack.`;
    } else {
      return `⏰ Yoga starting soon! Just have water or a very light snack if needed.`;
    }
  }

  /**
   * Get goal-based meal recommendations
   */
  getMealsByGoal(goal, mealType = 'lunch') {
    let meals = [];

    switch (mealType) {
      case 'breakfast':
        meals = nepaliFood.breakfast;
        break;
      case 'lunch':
        meals = nepaliFood.lunch;
        break;
      case 'dinner':
        meals = nepaliFood.dinner;
        break;
      default:
        meals = nepaliFood.snacks;
    }

    // Filter based on goal
    if (goal === 'weight_loss') {
      meals = meals.filter(m => m.calories < 350).sort((a, b) => a.calories - b.calories);
    } else if (goal === 'weight_gain') {
      meals = meals.filter(m => m.calories > 350).sort((a, b) => b.calories - a.calories);
    } else if (goal === 'muscle_gain') {
      meals = meals.filter(m => m.protein >= 15).sort((a, b) => b.protein - a.protein);
    }

    return meals.slice(0, 3);
  }

  /**
   * Get all Nepali foods by category
   */
  getAllFoods() {
    return nepaliFood;
  }

  /**
   * Search foods by name
   */
  searchFoods(query) {
    const allFoods = [
      ...nepaliFood.breakfast,
      ...nepaliFood.lunch,
      ...nepaliFood.dinner,
      ...nepaliFood.snacks
    ];

    return allFoods.filter(food => 
      food.name.toLowerCase().includes(query.toLowerCase()) ||
      food.localName.includes(query)
    );
  }
}

module.exports = new YogaDietService();
