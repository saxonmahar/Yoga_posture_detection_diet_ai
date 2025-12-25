import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Layout
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

// Pages
import HomePage from "../pages/HomePage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Premium from "../pages/Premium";
import PoseDetectionPage from "../pages/PoseDetectionPage";
import YogaSessionPage from "../pages/YogaSessionPage";
import DietPlanPage from "../pages/DietPlanPage";
import ProgressPage from "../pages/ProgressPage";
import ProfilePage from "../pages/ProfilePage";
import SettingsPage from "../pages/SettingsPage";
import NotFoundPage from "../pages/NotFoundPage";

// Static pages
import FeaturesPage from "../pages/FeaturesPage";
import HowItWorksPage from "../pages/HowItWorksPage";
import PricingPage from "../pages/PricingPage";
import AboutPage from "../pages/AboutPage";
import TestimonialsPage from "../pages/TestimonialsPage";
import CareersPage from "../pages/CareersPage";
import BlogPage from "../pages/BlogPage";
import PressPage from "../pages/PressPage";
import ContactPage from "../pages/ContactPage";

// Layout wrapper
const Layout = ({ children, footer = true }) => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      <main className="pt-16">{children}</main>
      {footer && <Footer />}
    </div>
  );
};

// Protected route wrapper with loading state
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public route wrapper (redirects if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const withLayout = (page, footer = true) => <Layout footer={footer}>{page}</Layout>;

export default function Router() {
  const publicRoutes = [
    ["/", <HomePage />],
    ["/home", <HomePage />],
    ["/features", <FeaturesPage />],
    ["/how-it-works", <HowItWorksPage />],
    ["/pricing", <PricingPage />],
    ["/about", <AboutPage />],
    ["/testimonials", <TestimonialsPage />],
    ["/careers", <CareersPage />],
    ["/blog", <BlogPage />],
    ["/press", <PressPage />],
    ["/contact", <ContactPage />],
  ];

  const protectedRoutes = [
    ["/dashboard", <Dashboard />],
    ["/premium", <Premium />],
    ["/pose-detection", <PoseDetectionPage />],
    ["/yoga-session", <YogaSessionPage />],
    ["/diet-plan", <DietPlanPage />],
    ["/progress", <ProgressPage />],
    ["/profile", <ProfilePage />],
    ["/settings", <SettingsPage />],
  ];

  return (
    <Routes>
      {/* Public routes */}
      {publicRoutes.map(([path, page]) => (
        <Route key={path} path={path} element={withLayout(page)} />
      ))}

      {/* Auth routes - only accessible when NOT logged in */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            {withLayout(<Login />, false)}
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            {withLayout(<Register />, false)}
          </PublicRoute>
        }
      />

      {/* Protected routes - only accessible when logged in */}
      {protectedRoutes.map(([path, page]) => (
        <Route
          key={path}
          path={path}
          element={
            <ProtectedRoute>
              {withLayout(page, false)}
            </ProtectedRoute>
          }
        />
      ))}

      {/* 404 */}
      <Route path="*" element={withLayout(<NotFoundPage />)} />
    </Routes>
  );
}