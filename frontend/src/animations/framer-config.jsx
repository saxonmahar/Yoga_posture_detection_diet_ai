import { motion } from 'framer-motion';

// Reusable animation components
export const AnimatedPage = ({ children, transition = 'fade' }) => {
  const transitions = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.3 }
    },
    slideUp: {
      initial: { y: 20, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: -20, opacity: 0 },
      transition: { duration: 0.4 }
    },
    scale: {
      initial: { scale: 0.95, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.95, opacity: 0 },
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      initial={transitions[transition].initial}
      animate={transitions[transition].animate}
      exit={transitions[transition].exit}
      transition={transitions[transition].transition}
    >
      {children}
    </motion.div>
  );
};

// Animated card component
export const AnimatedCard = ({ children, delay = 0, ...props }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ 
      duration: 0.4, 
      delay: delay,
      ease: "easeOut" 
    }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    {...props}
  >
    {children}
  </motion.div>
);

// Loading spinner animation
export const LoadingSpinner = ({ size = 40, color = "#10B981" }) => (
  <motion.div
    style={{
      width: size,
      height: size,
      border: `3px solid ${color}20`,
      borderTop: `3px solid ${color}`,
      borderRadius: "50%"
    }}
    animate={{ rotate: 360 }}
    transition={{
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }}
  />
);

// Progress bar component
export const AnimatedProgressBar = ({ progress, color = "#10B981" }) => (
  <motion.div
    style={{
      width: "100%",
      height: 8,
      backgroundColor: "#E5E7EB",
      borderRadius: 4,
      overflow: "hidden"
    }}
  >
    <motion.div
      style={{
        height: "100%",
        backgroundColor: color,
        borderRadius: 4
      }}
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ 
        duration: 1, 
        ease: "easeOut" 
      }}
    />
  </motion.div>
);

// Pulse animation for notifications
export const PulseDot = ({ color = "#EF4444" }) => (
  <motion.div
    style={{
      width: 8,
      height: 8,
      backgroundColor: color,
      borderRadius: "50%"
    }}
    animate={{
      scale: [1, 1.5, 1],
      opacity: [1, 0.5, 1]
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
);