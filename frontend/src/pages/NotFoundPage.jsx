import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AnimatedPage } from '../animations/framer-config';

const NotFoundPage = ({ onNavigate }) => {
  const navigate = useNavigate();

  return (
    <AnimatedPage transition="fade">
      <div className="min-h-screen bg-gradient-to-b from-background to-surface flex items-center justify-center p-4">
        <div className="text-center max-w-2xl">
          {/* Animated 404 */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="mb-8"
          >
            <div className="relative">
              <div className="text-9xl font-bold text-primary opacity-20">404</div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl font-bold gradient-text">404</div>
              </div>
            </div>
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
            <p className="text-xl text-text-muted mb-8">
              Oops! The page you're looking for seems to have taken a yoga break.
            </p>
          </motion.div>

          {/* Yoga Animation */}
          <motion.div
            animate={{ rotate: [0, 10, 0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="text-6xl mb-8"
          >
            🧘
          </motion.div>

          {/* Suggestions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <p className="text-text-muted mb-6">
              Don't worry, let's find your way back to your yoga practice:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="p-4 bg-surface border border-white/10 rounded-xl">
                <span className="text-2xl mb-2 block">🏠</span>
                <p className="font-medium">Return Home</p>
                <p className="text-sm text-text-muted">Back to the main page</p>
              </div>
              <div className="p-4 bg-surface border border-white/10 rounded-xl">
                <span className="text-2xl mb-2 block">🧘</span>
                <p className="font-medium">Start Yoga Session</p>
                <p className="text-sm text-text-muted">Continue your practice</p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary/80 transition-colors font-medium"
            >
              Go to Homepage
            </button>
            
            <button
              onClick={() => navigate(-1)}
              className="px-8 py-3 bg-surface border border-white/10 rounded-xl hover:bg-white/5 transition-colors font-medium"
            >
              Go Back
            </button>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-3 bg-surface border border-white/10 rounded-xl hover:bg-white/5 transition-colors font-medium"
            >
              Dashboard
            </button>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 max-w-md mx-auto"
          >
            <p className="text-text-muted mb-4">Or search for what you need:</p>
            <div className="relative">
              <input
                type="text"
                placeholder="Search YogaAI..."
                className="w-full bg-background border border-white/10 rounded-xl px-6 py-4 pr-12 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-primary">
                🔍
              </button>
            </div>
          </motion.div>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 pt-8 border-t border-white/10"
          >
            <p className="text-text-muted text-sm">
              Need help?{' '}
              <button
                onClick={() => navigate('/contact')}
                className="text-primary hover:underline"
              >
                Contact our support team
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default NotFoundPage;