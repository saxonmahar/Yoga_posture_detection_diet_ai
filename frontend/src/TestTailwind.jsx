import React from "react"

function TestTailwind() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold text-red-500 mb-6">
        🧘 Tailwind v4 Test
      </h1>
      
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-purple-600 rounded-lg">Purple</div>
        <div className="p-4 bg-blue-600 rounded-lg">Blue</div>
        <div className="p-4 bg-green-600 rounded-lg">Green</div>
      </div>
      
      <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition">
        Test Button
      </button>
      
      <p className="mt-6">
        If you see colors and a gradient button, Tailwind v4 is working!
      </p>
    </div>
  )
}

export default TestTailwind
