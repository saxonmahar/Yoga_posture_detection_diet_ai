import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, User, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext' // Only keep this one

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const currentPage = location.pathname.slice(1) || 'home'
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [featuresDropdown, setFeaturesDropdown] = useState(false)
  
  // Use the auth context
  const { user, logout } = useAuth()

  const navItems = [
    { id: 'home', label: 'Home', page: 'home' },
    {
      id: 'features',
      label: 'Features',
      page: 'features',
      dropdown: [
        { id: 'ai-yoga', label: 'AI Yoga Coach', page: 'features' },
        { id: 'pose-detection', label: 'AI Pose Detection', page: 'pose-detection' },
        { id: 'diet-plans', label: 'Diet Plans', page: 'diet-plan' },
        { id: 'progress', label: 'Progress Tracking', page: 'progress' },
      ]
    },
    { id: 'pricing', label: 'Pricing', page: 'pricing' },
    { id: 'about', label: 'About', page: 'about' },
    { id: 'contact', label: 'Contact', page: 'contact' },
  ]

  const handleNavigation = (page) => {
    navigate(`/${page}`)
    setIsMenuOpen(false)
    setFeaturesDropdown(false)
  }

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-50 bg-surface/95 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          
          {/* Logo */}
          <button
            onClick={() => handleNavigation('home')}
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-xl font-bold">🧘</span>
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">
                YogaAI
              </h1>
              <p className="text-xs text-text-muted hidden sm:block">Intelligent Wellness</p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <div key={item.id} className="relative">
                {item.dropdown ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setFeaturesDropdown(true)}
                    onMouseLeave={() => setFeaturesDropdown(false)}
                  >
                    <button
                      onClick={() => handleNavigation(item.page)}
                      className={`px-4 py-2 text-sm font-medium transition-all duration-300 flex items-center ${
                        currentPage === item.page
                          ? 'text-green-400'
                          : 'text-slate-400 hover:text-green-400'
                      }`}
                    >
                      {item.label}
                      <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${featuresDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {featuresDropdown && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-slate-800/95 backdrop-blur-lg rounded-xl border border-green-500/30 shadow-2xl py-2 z-50 animate-fadeIn">
                        {item.dropdown.map((subItem) => (
                          <button
                            key={subItem.id}
                            onClick={() => handleNavigation(subItem.page)}
                            className="w-full text-left px-4 py-3 text-sm text-slate-400 hover:text-green-400 hover:bg-green-500/10 transition flex items-center"
                          >
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                            {subItem.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => handleNavigation(item.page)}
                    className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
                      currentPage === item.page
                        ? 'text-green-400 border-b-2 border-green-400'
                        : 'text-slate-400 hover:text-green-400 hover:border-b-2 hover:border-green-400/50'
                    }`}
                  >
                    {item.label}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-accent to-pink-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-text-muted">
                      {user.level ? `${user.level.charAt(0).toUpperCase() + user.level.slice(1)} Level` : 'Member'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleNavigation('dashboard')}
                  className="px-4 py-2 text-sm text-text-muted hover:text-accent transition"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm text-red-400 hover:text-red-300 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavigation('login')}
                  className="px-4 py-2 text-sm text-text-muted hover:text-accent transition font-medium"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavigation('register')}
                  className="px-6 py-2.5 bg-gradient-to-r from-accent to-pink-500 hover:from-accent/90 hover:to-pink-600 rounded-lg font-semibold transition-all shadow-lg shadow-accent/20 hover:shadow-accent/40"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-card hover:bg-secondary transition"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden bg-card/95 backdrop-blur-lg rounded-xl mt-2 p-6 border border-white/10 animate-fadeIn">
            <div className="space-y-1">
              {navItems.map((item) => (
                <div key={item.id}>
                  <button
                    onClick={() => handleNavigation(item.page)}
                    className="w-full text-left px-4 py-3 text-text-muted hover:text-accent hover:bg-white/5 rounded-lg transition flex items-center justify-between"
                  >
                    <span>{item.label}</span>
                    {item.dropdown && <ChevronDown className="w-4 h-4" />}
                  </button>
                  
                  {/* Mobile dropdown */}
                  {item.dropdown && (
                    <div className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-4">
                      {item.dropdown.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => handleNavigation(subItem.page)}
                          className="w-full text-left px-4 py-2 text-sm text-text-muted hover:text-accent hover:bg-white/5 rounded-lg transition flex items-center"
                        >
                          <div className="w-1.5 h-1.5 bg-accent rounded-full mr-3"></div>
                          {subItem.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Mobile Auth Buttons */}
              <div className="pt-4 mt-4 border-t border-white/10 space-y-3">
                {user ? (
                  <>
                    <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-br from-accent to-pink-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-text-muted">
                          {user.level ? `${user.level.charAt(0).toUpperCase() + user.level.slice(1)} Level` : 'Member'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleNavigation('dashboard')
                        setIsMenuOpen(false)
                      }}
                      className="w-full py-3 bg-surface hover:bg-secondary rounded-lg font-medium transition"
                    >
                      Go to Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full py-3 text-red-400 hover:text-red-300 transition"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        handleNavigation('login')
                        setIsMenuOpen(false)
                      }}
                      className="w-full py-3 bg-surface hover:bg-secondary rounded-lg font-medium transition"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        handleNavigation('register')
                        setIsMenuOpen(false)
                      }}
                      className="w-full py-3 btn-primary"
                    >
                      Get Started Free
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar