import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Import all pages - MAKE SURE THESE FILES EXIST
import HomePage from './pages/HomePage'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Premium from './pages/Premium'
import FeaturesPage from './pages/FeaturesPage'
import HowItWorksPage from './pages/HowItWorksPage'
import PricingPage from './pages/PricingPage'
import AboutPage from './pages/AboutPage'
import TestimonialsPage from './pages/TestimonialsPage'

// Import new company pages
import CareersPage from './pages/CareersPage'
import BlogPage from './pages/BlogPage'
import PressPage from './pages/PressPage'
import ContactPage from './pages/ContactPage'

// Import pose detection page
import PoseDetection from './components/PoseDetection'

export default function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [user, setUser] = useState(null)

  // Simulate user authentication state
  useEffect(() => {
    const savedUser = localStorage.getItem('yogaai-user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('yogaai-user', JSON.stringify(userData))
    setCurrentPage('dashboard')
  }

  const handleRegister = (userData) => {
    setUser(userData)
    localStorage.setItem('yogaai-user', JSON.stringify(userData))
    setCurrentPage('dashboard')
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('yogaai-user')
    setCurrentPage('home')
  }

  const renderPage = () => {
    switch(currentPage) {
      case 'login':
        return <Login onNavigate={setCurrentPage} onLogin={handleLogin} />
      case 'register':
        return <Register onNavigate={setCurrentPage} onRegister={handleRegister} />
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} user={user} onLogout={handleLogout} />
      case 'premium':
        return <Premium onNavigate={setCurrentPage} user={user} />
      
      // Main navigation pages
      case 'features':
        return <FeaturesPage onNavigate={setCurrentPage} />
      case 'how-it-works':
        return <HowItWorksPage onNavigate={setCurrentPage} />
      case 'pricing':
        return <PricingPage onNavigate={setCurrentPage} />
      case 'about':
        return <AboutPage onNavigate={setCurrentPage} />
      case 'testimonials':
        return <TestimonialsPage onNavigate={setCurrentPage} />
      
      // Company pages (from footer)
      case 'careers':
        return <CareersPage onNavigate={setCurrentPage} />
      case 'blog':
        return <BlogPage onNavigate={setCurrentPage} />
      case 'press':
        return <PressPage onNavigate={setCurrentPage} />
      case 'contact':
        return <ContactPage onNavigate={setCurrentPage} />
      
      // AI Pose Detection page
      case 'pose-detection':
        return <PoseDetection onNavigate={setCurrentPage} />
      
      // Legal pages (for footer links)
      case 'privacy':
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl">
              <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
              <p className="text-gray-600 mb-4">Privacy policy content will appear here...</p>
              <button onClick={() => setCurrentPage('home')} className="px-6 py-2 bg-blue-500 text-white rounded-lg">
                Back to Home
              </button>
            </div>
          </div>
        )
      case 'terms':
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl">
              <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
              <p className="text-gray-600 mb-4">Terms of service content will appear here...</p>
              <button onClick={() => setCurrentPage('home')} className="px-6 py-2 bg-blue-500 text-white rounded-lg">
                Back to Home
              </button>
            </div>
          </div>
        )
      case 'cookies':
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl">
              <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
              <p className="text-gray-600 mb-4">Cookie policy content will appear here...</p>
              <button onClick={() => setCurrentPage('home')} className="px-6 py-2 bg-blue-500 text-white rounded-lg">
                Back to Home
              </button>
            </div>
          </div>
        )
      case 'security':
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl">
              <h1 className="text-3xl font-bold mb-6">Security</h1>
              <p className="text-gray-600 mb-4">Security information will appear here...</p>
              <button onClick={() => setCurrentPage('home')} className="px-6 py-2 bg-blue-500 text-white rounded-lg">
                Back to Home
              </button>
            </div>
          </div>
        )
      case 'gdpr':
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl">
              <h1 className="text-3xl font-bold mb-6">GDPR Compliance</h1>
              <p className="text-gray-600 mb-4">GDPR information will appear here...</p>
              <button onClick={() => setCurrentPage('home')} className="px-6 py-2 bg-blue-500 text-white rounded-lg">
                Back to Home
              </button>
            </div>
          </div>
        )
      
      // Default to homepage
      default:
        return <HomePage onNavigate={setCurrentPage} />
    }
  }

  // Show footer on main pages only (not on auth/dashboard pages)
  const showFooter = () => {
    const noFooterPages = ['login', 'register', 'dashboard', 'premium']
    return !noFooterPages.includes(currentPage)
  }

  return (
    <div className="min-h-screen bg-primary text-text">
      <Navbar 
        onNavigate={setCurrentPage} 
        currentPage={currentPage}
        user={user}
        onLogout={handleLogout}
      />
      {renderPage()}
      {/* Show footer on main pages */}
      {showFooter() && <Footer onNavigate={setCurrentPage} />}
    </div>
  )
}