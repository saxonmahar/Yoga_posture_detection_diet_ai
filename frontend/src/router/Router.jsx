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
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} onLogout={logout} />
      <main className="pt-16">{children}</main>
      {footer && <Footer />}
    </div>
  );
};

// Protected route wrapper
const Protected = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

const withLayout = (page, footer = true) => <Layout footer={footer}>{page}</Layout>;

export default function Router() {
  const { user } = useAuth();

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

      {/* Auth routes */}
      <Route
        path="/login"
        element={withLayout(user ? <Navigate to="/dashboard" /> : <Login />, false)}
      />
      <Route
        path="/register"
        element={withLayout(user ? <Navigate to="/dashboard" /> : <Register />, false)}
      />

      {/* Protected routes */}
      {protectedRoutes.map(([path, page]) => (
        <Route key={path} path={path} element={<Protected>{withLayout(page, false)}</Protected>} />
      ))}

      {/* 404 */}
      <Route path="*" element={withLayout(<NotFoundPage />)} />
    </Routes>
  );
}
