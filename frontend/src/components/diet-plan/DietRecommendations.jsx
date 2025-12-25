import React from "react";
import MacroCard from "./MacroCard";
import MealCard from "./MealCard";

export default function DietRecommendation({ user, yogaStats }) {
  // fallback data
  const weight = user?.stats?.weight || 70;
  const goal = user?.stats?.goal || "weight-loss";
  const caloriesBurned = yogaStats?.calories || 250;

  // Basic AI-style calculation
  const calories =
    goal === "muscle-gain" ? 2200 :
    goal === "weight-loss" ? 1800 : 2000;

  const protein = goal === "muscle-gain" ? 160 : 130;
  const carbs = goal === "weight-loss" ? 180 : 220;
  const fat = 60;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">
        🍎 Smart Diet Recommendation
      </h1>

      {/* Macro Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <MacroCard title="Calories" value={`${calories} kcal`} />
        <MacroCard title="Protein" value={`${protein} g`} />
        <MacroCard title="Carbs" value={`${carbs} g`} />
        <MacroCard title="Fat" value={`${fat} g`} />
      </div>

      {/* AI Insight */}
      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6">
        <p className="text-sm text-green-300">
          🤖 Based on today’s yoga session, you burned <b>{caloriesBurned} kcal</b>.
          Increase protein intake to support muscle recovery.
        </p>
      </div>

      {/* Meal Recommendations */}
      <h2 className="text-xl font-semibold mb-4">Recommended Meals</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MealCard
          meal="Breakfast"
          items="Oatmeal, Banana, Boiled Eggs"
          calories={450}
        />
        <MealCard
          meal="Lunch"
          items="Grilled Chicken, Brown Rice, Vegetables"
          calories={600}
        />
        <MealCard
          meal="Snack"
          items="Greek Yogurt, Nuts"
          calories={300}
        />
        <MealCard
          meal="Dinner"
          items="Salmon, Salad, Sweet Potato"
          calories={550}
        />
      </div>
    </div>
  );
}
