// src/App.jsx
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'

// Import all pages
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

// Import company pages
import CareersPage from './pages/CareersPage'
import BlogPage from './pages/BlogPage'
import PressPage from './pages/PressPage'
import ContactPage from './pages/ContactPage'

// Import pose detection page
import PoseDetection from './components/common/PoseDetection'

// Import new YogaAI feature pages
import DietPlanPage from './pages/DietPlanPage'
import ProgressPage from './pages/Progress'

// Layout wrapper component
const Layout = ({ children, showFooter = true, user, onLogout }) => {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Navbar user={user} onLogout={onLogout} />
      <main className="pt-16"> {/* Add padding for fixed navbar */}
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  )
}

// Legal pages component
const LegalPage = ({ title, content, navigate }) => (
  <div className="min-h-screen bg-gradient-to-b from-background to-surface flex items-center justify-center p-4">
    <div className="bg-card p-8 rounded-2xl border border-white/10 max-w-2xl w-full">
      <h1 className="text-3xl font-bold mb-6 gradient-text">{title}</h1>
      <div className="space-y-4 text-text-muted">
        {content}
      </div>
      <button
        onClick={() => navigate('/')}
        className="mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
      >
        Back to Home
      </button>
    </div>
  </div>
)

// Main app content with routing
function AppContent() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  // Navigation helper function
  const navigateTo = (page) => {
    navigate(`/${page}`)
  }

  // Simulate user authentication state
  useEffect(() => {
    const savedUser = localStorage.getItem('yogaai-user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing saved user data:', error)
        localStorage.removeItem('yogaai-user')
      }
    }
  }, [])

  const handleLogin = (userData) => {
    const userWithStats = {
      ...userData,
      stats: userData.stats || {
        totalWorkouts: 12,
        totalCaloriesBurned: 1250,
        currentStreak: 7,
        averageAccuracy: 87
      }
    }
    setUser(userWithStats)
    localStorage.setItem('yogaai-user', JSON.stringify(userWithStats))
    navigate('/dashboard')
  }

  const handleRegister = (userData) => {
    const userWithStats = {
      ...userData,
      stats: userData.stats || {
        totalWorkouts: 0,
        totalCaloriesBurned: 0,
        currentStreak: 0,
        averageAccuracy: 0
      }
    }
    setUser(userWithStats)
    localStorage.setItem('yogaai-user', JSON.stringify(userWithStats))
    navigate('/dashboard')
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('yogaai-user')
    navigate('/')
  }

  // Function to update user stats (for pose detection completion)
  const updateUserStats = (newStats) => {
    if (user) {
      const updatedUser = {
        ...user,
        stats: {
          ...user.stats,
          ...newStats
        }
      }
      setUser(updatedUser)
      localStorage.setItem('yogaai-user', JSON.stringify(updatedUser))
    }
  }

  return (
    <Routes>
      {/* Public routes with footer */}
      <Route path="/" element={
        <Layout showFooter={true}>
          <HomePage onNavigate={navigateTo} />
        </Layout>
      } />
      <Route path="/home" element={
        <Layout showFooter={true}>
          <HomePage onNavigate={navigateTo} />
        </Layout>
      } />
      <Route path="/features" element={
        <Layout showFooter={true}>
          <FeaturesPage onNavigate={navigateTo} />
        </Layout>
      } />
      <Route path="/how-it-works" element={
        <Layout showFooter={true}>
          <HowItWorksPage onNavigate={navigateTo} />
        </Layout>
      } />
      <Route path="/pricing" element={
        <Layout showFooter={true}>
          <PricingPage onNavigate={navigateTo} />
        </Layout>
      } />
      <Route path="/about" element={
        <Layout showFooter={true}>
          <AboutPage onNavigate={navigateTo} />
        </Layout>
      } />
      <Route path="/testimonials" element={
        <Layout showFooter={true}>
          <TestimonialsPage onNavigate={navigateTo} />
        </Layout>
      } />
      <Route path="/careers" element={
        <Layout showFooter={true}>
          <CareersPage onNavigate={navigateTo} />
        </Layout>
      } />
      <Route path="/blog" element={
        <Layout showFooter={true}>
          <BlogPage onNavigate={navigateTo} />
        </Layout>
      } />
      <Route path="/press" element={
        <Layout showFooter={true}>
          <PressPage onNavigate={navigateTo} />
        </Layout>
      } />
      <Route path="/contact" element={
        <Layout showFooter={true}>
          <ContactPage onNavigate={navigateTo} />
        </Layout>
      } />

      {/* Auth routes without footer */}
      <Route path="/login" element={
        <Layout showFooter={false}>
          <Login onLogin={handleLogin} />
        </Layout>
      } />
      <Route path="/register" element={
        <Layout showFooter={false}>
          <Register onRegister={handleRegister} />
        </Layout>
      } />

      {/* Protected routes - dashboard and features */}
      <Route path="/dashboard" element={
        <Layout showFooter={false}>
          <Dashboard user={user} onLogout={handleLogout} />
        </Layout>
      } />
      <Route path="/premium" element={
        <Layout showFooter={false}>
          <Premium user={user} onNavigate={navigateTo} />
        </Layout>
      } />
      <Route path="/pose-detection" element={
        <Layout showFooter={false}>
          <PoseDetection user={user} updateUserStats={updateUserStats} onNavigate={navigateTo} />
        </Layout>
      } />
      <Route path="/diet-plan" element={
        <Layout showFooter={false}>
          <DietPlanPage user={user} onNavigate={navigateTo} />
        </Layout>
      } />
      <Route path="/progress" element={
        <Layout showFooter={false}>
          <ProgressPage user={user} onNavigate={navigateTo} />
        </Layout>
      } />

      {/* Legal pages */}
      <Route path="/privacy" element={
        <Layout showFooter={true}>
          <LegalPage 
            title="Privacy Policy"
            content={
              <>
                <p>Your privacy is important to us. This Privacy Policy explains how YogaAI collects, uses, and protects your personal information.</p>
                <p>We collect information you provide directly, such as your name, email address, and fitness goals. We also collect usage data to improve our services.</p>
                <p>Your data is encrypted and stored securely. We never sell your personal information to third parties.</p>
              </>
            }
          />
        </Layout>
      } />
      <Route path="/terms" element={
        <Layout showFooter={true}>
          <LegalPage 
            title="Terms of Service"
            content={
              <>
                <p>By using YogaAI, you agree to these Terms of Service. Please read them carefully.</p>
                <p>Our services are designed to support your wellness journey, but they are not a substitute for professional medical advice.</p>
                <p>You are responsible for using our services safely and within your physical limits. We recommend consulting with a healthcare professional before starting any new exercise program.</p>
              </>
            }
          />
        </Layout>
      } />
      <Route path="/cookies" element={
        <Layout showFooter={true}>
          <LegalPage 
            title="Cookie Policy"
            content={
              <>
                <p>We use cookies to enhance your experience on YogaAI. Cookies are small text files stored on your device.</p>
                <p>Essential cookies are necessary for the website to function properly. We also use analytics cookies to understand how users interact with our platform.</p>
                <p>You can control cookies through your browser settings. However, disabling essential cookies may affect your ability to use certain features.</p>
              </>
            }
          />
        </Layout>
      } />
      <Route path="/security" element={
        <Layout showFooter={true}>
          <LegalPage 
            title="Security"
            content={
              <>
                <p>We take security seriously at YogaAI. Your data is protected with industry-standard encryption and security measures.</p>
                <p>We implement secure authentication, regular security audits, and monitoring systems to protect against unauthorized access.</p>
                <p>If you suspect any security issues, please contact us immediately at security@yogaai.com.</p>
              </>
            }
          />
        </Layout>
      } />
      <Route path="/gdpr" element={
        <Layout showFooter={true}>
          <LegalPage 
            title="GDPR Compliance"
            content={
              <>
                <p>YogaAI is committed to complying with the General Data Protection Regulation (GDPR) for our users in the European Union.</p>
                <p>You have the right to access, correct, or delete your personal data. You can also request data portability or object to data processing.</p>
                <p>To exercise your GDPR rights, please contact our Data Protection Officer at dpo@yogaai.com.</p>
              </>
            }
          />
        </Layout>
      } />

      {/* Redirect any unknown route to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

// Main App component
export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}