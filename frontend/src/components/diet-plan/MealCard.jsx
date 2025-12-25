import React from "react";

export default function MealCard({ meal, items, calories }) {
  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-white/10">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-lg">{meal}</h3>
        <span className="text-sm text-green-400">
          {calories} kcal
        </span>
      </div>

      <p className="text-sm text-gray-300">
        {items}
      </p>
    </div>
  );
}
