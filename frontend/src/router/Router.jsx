import React from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Import Layout
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

// Import all pages
import HomePage from '../pages/HomePage'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import Premium from '../pages/Premium'
import FeaturesPage from '../pages/FeaturesPage'
import HowItWorksPage from '../pages/HowItWorksPage'
import PricingPage from '../pages/PricingPage'
import AboutPage from '../pages/AboutPage'
import TestimonialsPage from '../pages/TestimonialsPage'
import CareersPage from '../pages/CareersPage'
import BlogPage from '../pages/BlogPage'
import PressPage from '../pages/PressPage'
import ContactPage from '../pages/ContactPage'
import PoseDetectionPage from '../pages/PoseDetectionPage'
import DietPlanPage from '../pages/DietPlanPage'
import ProgressPage from '../pages/ProgressPage'
import YogaSessionPage from '../pages/YogaSessionPage'
import ProfilePage from '../pages/ProfilePage'
import SettingsPage from '../pages/SettingsPage'
import NotFoundPage from '../pages/NotFoundPage'


// Layout wrapper component
const Layout = ({ children, showFooter = true }) => {
  const { user, logout } = useAuth()
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Navbar user={user} onLogout={logout} />
      <main className="pt-16">
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

// Protected Route wrapper
const ProtectedRoute = ({ children, redirectTo = "/login" }) => {
  const { user } = useAuth()
  if (!user) {
    return <Navigate to={redirectTo} replace />
  }
  return children
}

export default function Router() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <Routes>
      {/* Public routes with footer */}
      <Route path="/" element={
        <Layout showFooter={true}>
          <HomePage />
        </Layout>
      } />
      <Route path="/home" element={
        <Layout showFooter={true}>
          <HomePage />
        </Layout>
      } />
      <Route path="/features" element={
        <Layout showFooter={true}>
          <FeaturesPage />
        </Layout>
      } />
      <Route path="/how-it-works" element={
        <Layout showFooter={true}>
          <HowItWorksPage />
        </Layout>
      } />
      <Route path="/pricing" element={
        <Layout showFooter={true}>
          <PricingPage />
        </Layout>
      } />
      <Route path="/about" element={
        <Layout showFooter={true}>
          <AboutPage />
        </Layout>
      } />
      <Route path="/testimonials" element={
        <Layout showFooter={true}>
          <TestimonialsPage />
        </Layout>
      } />
      <Route path="/careers" element={
        <Layout showFooter={true}>
          <CareersPage />
        </Layout>
      } />
      <Route path="/blog" element={
        <Layout showFooter={true}>
          <BlogPage />
        </Layout>
      } />
      <Route path="/press" element={
        <Layout showFooter={true}>
          <PressPage />
        </Layout>
      } />
      <Route path="/contact" element={
        <Layout showFooter={true}>
          <ContactPage />
        </Layout>
      } />

      {/* Auth routes without footer */}
      <Route path="/login" element={
        <Layout showFooter={false}>
          {user ? <Navigate to="/dashboard" /> : <Login />}
        </Layout>
      } />
      <Route path="/register" element={
        <Layout showFooter={false}>
          {user ? <Navigate to="/dashboard" /> : <Register />}
        </Layout>
      } />

      {/* Protected routes - dashboard and features */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout showFooter={false}>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/premium" element={
        <ProtectedRoute>
          <Layout showFooter={false}>
            <Premium />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/pose-detection" element={
        <ProtectedRoute>
          <Layout showFooter={false}>
            <PoseDetectionPage />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/yoga-session" element={
        <ProtectedRoute>
          <Layout showFooter={false}>
            <YogaSessionPage />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/diet-plan" element={
        <ProtectedRoute>
          <Layout showFooter={false}>
            <DietPlanPage />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/progress" element={
        <ProtectedRoute>
          <Layout showFooter={false}>
            <ProgressPage />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/profile" element={
        <ProtectedRoute>
          <Layout showFooter={false}>
            <ProfilePage />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/settings" element={
        <ProtectedRoute>
          <Layout showFooter={false}>
            <SettingsPage />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Legal pages (public) */}
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

      {/* 404 Page */}
      <Route path="*" element={
        <Layout showFooter={true}>
          <NotFoundPage />
        </Layout>
      } />
    </Routes>
  )
}
