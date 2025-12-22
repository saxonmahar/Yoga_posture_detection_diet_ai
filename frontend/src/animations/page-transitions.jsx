// Page transition animations
export const pageTransitions = {
  // Fade in/out
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  },

  // Slide from right
  slideRight: {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
    transition: { duration: 0.4, ease: "easeInOut" }
  },

  // Slide from left
  slideLeft: {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 100, opacity: 0 },
    transition: { duration: 0.4, ease: "easeInOut" }
  },

  // Slide from bottom
  slideUp: {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -50, opacity: 0 },
    transition: { duration: 0.4, ease: "easeOut" }
  },

  // Scale in/out
  scale: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
    transition: { duration: 0.3 }
  },

  // Yoga-themed page transition
  yogaTransition: {
    initial: { 
      clipPath: "circle(0% at 50% 50%)",
      opacity: 0 
    },
    animate: { 
      clipPath: "circle(100% at 50% 50%)",
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeInOut"
      }
    },
    exit: { 
      clipPath: "circle(0% at 50% 50%)",
      opacity: 0,
      transition: {
        duration: 0.6,
        ease: "easeInOut"
      }
    }
  },

  // Diet-themed page transition
  dietTransition: {
    initial: { 
      clipPath: "inset(0 0 100% 0)",
      opacity: 0 
    },
    animate: { 
      clipPath: "inset(0 0 0 0)",
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    exit: { 
      clipPath: "inset(100% 0 0 0)",
      opacity: 0,
      transition: {
        duration: 0.6,
        ease: "easeIn"
      }
    }
  }
};

// Layout animations
export const layoutAnimations = {
  // For dashboard cards
  cardStagger: {
    container: {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.2
        }
      }
    },
    item: {
      hidden: { y: 20, opacity: 0 },
      show: { y: 0, opacity: 1 }
    }
  },

  // For list items
  listStagger: {
    container: {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.05
        }
      }
    },
    item: {
      hidden: { x: -20, opacity: 0 },
      show: { x: 0, opacity: 1 }
    }
  }
};