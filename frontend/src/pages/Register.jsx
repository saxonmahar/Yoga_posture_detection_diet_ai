import React, { useState } from 'react'
import { Mail, Lock, User, CheckCircle, XCircle } from 'lucide-react'

function Register({ onNavigate, onRegister }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    fitnessLevel: 'beginner',
    goals: []
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fitnessLevels = [
    { value: 'beginner', label: 'Beginner', icon: '🌱' },
    { value: 'intermediate', label: 'Intermediate', icon: '💪' },
    { value: 'advanced', label: 'Advanced', icon: '🔥' }
  ]

  const goals = [
    { id: 'weightLoss', label: 'Weight Loss', icon: '⚖️' },
    { id: 'flexibility', label: 'Flexibility', icon: '🤸' },
    { id: 'strength', label: 'Strength', icon: '💪' },
    { id: 'stressRelief', label: 'Stress Relief', icon: '🧘' },
    { id: 'mindfulness', label: 'Mindfulness', icon: '✨' },
  ]

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validateForm()
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      const userData = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        isPremium: false,
        fitnessLevel: formData.fitnessLevel,
        goals: formData.goals,
        joinDate: new Date().toISOString()
      }
      
      onRegister(userData)
      setIsSubmitting(false)
    }, 1500)
  }

  const toggleGoal = (goalId) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(id => id !== goalId)
        : [...prev.goals, goalId]
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary via-surface to-secondary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-accent to-pink-500 rounded-2xl flex items-center justify-center mb-6 animate-float">
            <span className="text-3xl">🧘‍♀️</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-accent to-pink-400 bg-clip-text text-transparent">
            Begin Your Journey
          </h1>
          <p className="text-text-muted mt-2">
            Create your personalized wellness account
          </p>
        </div>

        <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-white/10 p-8 shadow-2xl shadow-accent/10">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Personal Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-accent" />
                Personal Information
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={`w-full px-4 py-3 bg-surface border rounded-lg focus:outline-none focus:ring-2 transition ${
                      errors.name ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:ring-accent'
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="text-red-400 text-sm mt-1 flex items-center"><XCircle className="w-4 h-4 mr-1" /> {errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className={`w-full px-12 py-3 bg-surface border rounded-lg focus:outline-none focus:ring-2 transition ${
                        errors.email ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:ring-accent'
                      }`}
                      placeholder="your@email.com"
                    />
                  </div>
                  {errors.email && <p className="text-red-400 text-sm mt-1 flex items-center"><XCircle className="w-4 h-4 mr-1" /> {errors.email}</p>}
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Lock className="w-5 h-5 mr-2 text-accent" />
                Security
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className={`w-full px-12 py-3 bg-surface border rounded-lg focus:outline-none focus:ring-2 transition ${
                        errors.password ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:ring-accent'
                      }`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.password && <p className="text-red-400 text-sm mt-1 flex items-center"><XCircle className="w-4 h-4 mr-1" /> {errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      className={`w-full px-12 py-3 bg-surface border rounded-lg focus:outline-none focus:ring-2 transition ${
                        errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:ring-accent'
                      }`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-red-400 text-sm mt-1 flex items-center"><XCircle className="w-4 h-4 mr-1" /> {errors.confirmPassword}</p>}
                </div>
              </div>
            </div>

            {/* Fitness Level */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Fitness Level</h3>
              <div className="grid grid-cols-3 gap-4">
                {fitnessLevels.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setFormData({...formData, fitnessLevel: level.value})}
                    className={`p-4 rounded-xl border transition-all ${
                      formData.fitnessLevel === level.value
                        ? 'border-accent bg-accent/10 ring-2 ring-accent/20'
                        : 'border-white/10 bg-surface hover:border-accent/50'
                    }`}
                  >
                    <div className="text-2xl mb-2">{level.icon}</div>
                    <div className="font-medium">{level.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Goals */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Wellness Goals</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {goals.map((goal) => (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => toggleGoal(goal.id)}
                    className={`p-3 rounded-lg border transition-all flex flex-col items-center ${
                      formData.goals.includes(goal.id)
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-white/10 bg-surface hover:border-accent/50'
                    }`}
                  >
                    <span className="text-xl mb-1">{goal.icon}</span>
                    <span className="text-sm font-medium">{goal.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="terms"
                className="w-5 h-5 rounded border-white/20 bg-surface text-accent focus:ring-accent"
              />
              <label htmlFor="terms" className="text-sm text-text-muted">
                I agree to the <button type="button" className="text-accent hover:text-accent-light">Terms of Service</button> and <button type="button" className="text-accent hover:text-accent-light">Privacy Policy</button>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-accent to-pink-500 hover:from-accent/90 hover:to-pink-600 rounded-xl font-bold text-lg transition-all shadow-lg shadow-accent/30 hover:shadow-accent/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
            >
              {isSubmitting ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <CheckCircle className="w-6 h-6" />
                </>
              )}
            </button>

            {/* Login Link */}
            <p className="text-center text-text-muted">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="text-accent hover:text-accent-light font-semibold"
              >
                Sign in here
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register