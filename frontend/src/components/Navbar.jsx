import React, { useState } from 'react'
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react'

function Navbar({ onNavigate, currentPage, user, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [featuresDropdown, setFeaturesDropdown] = useState(false)

  const navItems = [
    { id: 'home', label: 'Home' },
    { 
      id: 'features', 
      label: 'Features',
      dropdown: [
        { id: 'ai-yoga', label: 'AI Yoga Coach' },
        { id: 'pose-detection', label: 'AI Pose Detection' },
        { id: 'diet-plans', label: 'Diet Plans' },
        { id: 'progress', label: 'Progress Tracking' },
        { id: 'live-classes', label: 'Live Classes' },
      ]
    },
    { id: 'resources', label: 'Resources' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'about', label: 'About' },
  ]

  const handleNavClick = (item) => {
    setIsMenuOpen(false)
    setFeaturesDropdown(false)
    
    // If clicking on Features or any dropdown item, go to Features page
    if (item.id === 'features' || item.dropdown) {
      onNavigate('features')
    } else {
      onNavigate(item.id)
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-surface/95 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          
          {/* Logo */}
          <div 
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-xl font-bold">🧘</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-accent to-pink-400 bg-clip-text text-transparent">
                YogaAI
              </h1>
              <p className="text-xs text-text-muted hidden sm:block">Intelligent Wellness</p>
            </div>
          </div>

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
                      className={`px-4 py-2 text-sm font-medium transition-all duration-300 flex items-center ${
                        currentPage === item.id 
                          ? 'text-accent' 
                          : 'text-text-muted hover:text-accent'
                      }`}
                      onClick={() => handleNavClick(item)}
                    >
                      {item.label}
                      <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${featuresDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {featuresDropdown && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-card/95 backdrop-blur-lg rounded-xl border border-white/10 shadow-2xl py-2 z-50">
                        {item.dropdown.map((subItem) => (
                          <button
                            key={subItem.id}
                            onClick={() => {
                              setFeaturesDropdown(false)
                              onNavigate('features')
                            }}
                            className="w-full text-left px-4 py-3 text-sm text-text-muted hover:text-accent hover:bg-white/5 transition flex items-center"
                          >
                            <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                            {subItem.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => handleNavClick(item)}
                    className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
                      currentPage === item.id 
                        ? 'text-accent border-b-2 border-accent' 
                        : 'text-text-muted hover:text-accent hover:border-b-2 hover:border-accent/50'
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
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="px-4 py-2 text-sm text-text-muted hover:text-accent transition font-medium"
                >
                  Dashboard
                </button>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-accent to-pink-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-text-muted">{user.isPremium ? '🌟 Premium' : 'Free Plan'}</p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 text-sm text-red-400 hover:text-red-300 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('login')}
                  className="px-4 py-2 text-sm text-text-muted hover:text-accent transition font-medium"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('register')}
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
                    onClick={() => handleNavClick(item)}
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
                          onClick={() => {
                            setIsMenuOpen(false)
                            onNavigate('features')
                          }}
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
                        <p className="text-sm text-text-muted">{user.isPremium ? '🌟 Premium' : 'Free Plan'}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false)
                        onNavigate('dashboard')
                      }}
                      className="w-full py-3 bg-surface hover:bg-secondary rounded-lg font-medium transition"
                    >
                      Go to Dashboard
                    </button>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false)
                        onLogout()
                      }}
                      className="w-full py-3 text-red-400 hover:text-red-300 transition"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false)
                        onNavigate('login')
                      }}
                      className="w-full py-3 bg-surface hover:bg-secondary rounded-lg font-medium transition"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false)
                        onNavigate('register')
                      }}
                      className="w-full py-3 bg-gradient-to-r from-accent to-pink-500 rounded-lg font-semibold"
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