// Yoga pose specific animations
export const poseAnimations = {
  // Highlight animation for selected pose
  highlight: {
    initial: { scale: 1, opacity: 0.8 },
    animate: { 
      scale: 1.05, 
      opacity: 1,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      scale: 1, 
      opacity: 0.8,
      transition: { duration: 0.2 }
    }
  },

  // Pulse animation for active pose
  pulse: {
    scale: [1, 1.1, 1],
    transition: { 
      duration: 1.5, 
      repeat: Infinity,
      ease: "easeInOut"
    }
  },

  // Breathing animation (inhale/exhale)
  breathing: {
    scale: [1, 1.03, 1],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },

  // Correction highlight
  correction: {
    initial: { backgroundColor: "#ffffff" },
    animate: { 
      backgroundColor: "#fef3c7", // Amber 50
      transition: { 
        duration: 0.5,
        repeat: 2,
        repeatType: "reverse"
      }
    }
  },

  // Success feedback
  success: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    }
  },

  // Pose transition
  poseTransition: {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 20, opacity: 0 },
    transition: { duration: 0.3 }
  },

  // Skeleton loading
  skeleton: {
    initial: { opacity: 0.5 },
    animate: { 
      opacity: 1,
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  },

  // Progress bar animation
  progress: {
    initial: { width: "0%" },
    animate: { 
      width: "100%",
      transition: { 
        duration: 2,
        ease: "easeInOut"
      }
    }
  },

  // Floating animation (for meditation/yoga elements)
  float: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Animation variants for different difficulty levels
export const difficultyAnimations = {
  beginner: {
    color: "#10B981", // Emerald
    borderColor: "#10B981",
    transition: { duration: 0.3 }
  },
  intermediate: {
    color: "#F59E0B", // Amber
    borderColor: "#F59E0B",
    transition: { duration: 0.3 }
  },
  advanced: {
    color: "#EF4444", // Red
    borderColor: "#EF4444",
    transition: { duration: 0.3 }
  }
};

// Animation for pose cards
export const poseCardAnimations = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  },
  item: {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  }
};