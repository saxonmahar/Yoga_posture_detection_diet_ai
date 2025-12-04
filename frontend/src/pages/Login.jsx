import React, { useState } from 'react'
import { Mail, Lock, LogIn, Eye, EyeOff, Sparkles } from 'lucide-react'

function Login({ onNavigate, onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      return
    }
    
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      // For demo purposes - in real app, validate against backend
      if (formData.email.includes('@') && formData.password.length >= 6) {
        const userData = {
          id: 1,
          name: formData.email.split('@')[0],
          email: formData.email,
          isPremium: false,
          fitnessLevel: 'intermediate',
          goals: ['flexibility', 'stressRelief'],
          joinDate: new Date().toISOString()
        }
        
        onLogin(userData)
      } else {
        setError('Invalid credentials. For demo, use any email and password (min 6 chars)')
      }
      
      setIsLoading(false)
    }, 1500)
  }

  const handleDemoLogin = () => {
    setFormData({
      email: 'demo@yogaai.com',
      password: 'demo123'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-surface to-secondary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-10">
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-accent to-pink-500 rounded-2xl flex items-center justify-center animate-glow">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-premium rounded-full flex items-center justify-center animate-pulse">
              <span className="text-xs font-bold">🌟</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">
            Welcome Back to{' '}
            <span className="bg-gradient-to-r from-accent to-pink-400 bg-clip-text text-transparent">
              YogaAI
            </span>
          </h1>
          <p className="text-text-muted">
            Continue your wellness journey with intelligent guidance
          </p>
        </div>

        <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-white/10 p-8 shadow-2xl shadow-accent/10">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-surface border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent transition"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-12 pr-12 py-3 bg-surface border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent transition"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-white/20 bg-surface text-accent focus:ring-accent"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-text-muted">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                className="text-sm text-accent hover:text-accent-light"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-accent to-pink-500 hover:from-accent/90 hover:to-pink-600 rounded-xl font-bold text-lg transition-all shadow-lg shadow-accent/30 hover:shadow-accent/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
            >
              {isLoading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <LogIn className="w-6 h-6" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-3 bg-surface hover:bg-secondary border border-white/10 rounded-xl font-medium transition flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Try Demo Account</span>
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-center text-text-muted">
              Don't have an account?{' '}
              <button
                onClick={() => onNavigate('register')}
                className="text-accent hover:text-accent-light font-semibold"
              >
                Create account
              </button>
            </p>
            
            <div className="mt-6">
              <button
                onClick={() => onNavigate('home')}
                className="w-full py-3 text-text-muted hover:text-text transition flex items-center justify-center space-x-2"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-text-muted">
            By signing in, you agree to our{' '}
            <button className="text-accent hover:text-accent-light">Terms</button> and{' '}
            <button className="text-accent hover:text-accent-light">Privacy Policy</button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login