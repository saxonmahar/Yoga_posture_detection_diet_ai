// Animation sequences for different yoga poses
export const yogaPoseAnimations = {
  // Mountain Pose
  mountain: {
    sequence: [
      { scale: 1, rotate: 0 },
      { scale: 1.02, rotate: 0.5 },
      { scale: 1, rotate: 0 }
    ],
    duration: 4,
    ease: "easeInOut"
  },

  // Tree Pose
  tree: {
    sequence: [
      { rotate: 0 },
      { rotate: -2 },
      { rotate: 2 },
      { rotate: 0 }
    ],
    duration: 6,
    ease: "easeInOut"
  },

  // Warrior II
  warrior2: {
    sequence: [
      { scaleX: 1 },
      { scaleX: 1.05 },
      { scaleX: 1 }
    ],
    duration: 3,
    ease: "easeInOut"
  },

  // Downward Dog
  downwardDog: {
    sequence: [
      { y: 0 },
      { y: -5 },
      { y: 0 }
    ],
    duration: 2,
    ease: "easeInOut"
  },

  // Child's Pose
  childsPose: {
    sequence: [
      { scale: 1 },
      { scale: 0.98 },
      { scale: 1 }
    ],
    duration: 5,
    ease: "easeInOut"
  }
};

// Breathing animation sequences
export const breathingAnimations = {
  // Inhale animation
  inhale: {
    scale: [1, 1.1],
    backgroundColor: ["#D1FAE5", "#A7F3D0"], // Light to darker green
    transition: {
      duration: 4,
      ease: "easeInOut"
    }
  },

  // Exhale animation
  exhale: {
    scale: [1.1, 1],
    backgroundColor: ["#A7F3D0", "#D1FAE5"], // Darker to light green
    transition: {
      duration: 4,
      ease: "easeInOut"
    }
  },

  // Hold animation
  hold: {
    scale: 1.05,
    backgroundColor: "#A7F3D0",
    transition: {
      duration: 2
    }
  }
};

// Meditation animations
export const meditationAnimations = {
  // Floating particles
  particles: {
    container: {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1
        }
      }
    },
    particle: {
      hidden: { y: 20, opacity: 0 },
      show: {
        y: [-20, 20, -20],
        opacity: [0, 1, 0],
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    }
  },

  // Concentric circles (for meditation timer)
  concentricCircles: {
    circle1: {
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.1, 0.3],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    circle2: {
      scale: [1, 1.4, 1],
      opacity: [0.2, 0.05, 0.2],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.5
      }
    }
  }
};