// TTS Service for Yoga Pose Feedback
// Provides simplified, actionable voice feedback during yoga sessions

class TTSService {
  constructor() {
    this.isEnabled = true;
    this.isActive = false;
    this.currentUtterance = null;
    this.lastMessage = '';
    this.messageQueue = [];
    this.isProcessingQueue = false;
    
    // Timing controls for realistic feedback
    this.lastFeedbackTime = 0;
    this.minFeedbackInterval = 5000; // Minimum 5 seconds between feedback (increased)
    this.landmarkValidationCount = 0;
    this.requiredLandmarkFrames = 5; // Need 5 consecutive frames (increased stability)
    
    // Simplified feedback categories
    this.feedbackCategories = {
      PERFECT: 'perfect',
      GOOD: 'good', 
      NEEDS_IMPROVEMENT: 'needs_improvement',
      INCORRECT: 'incorrect',
      NO_POSE: 'no_pose'
    };
    
    // Simplified feedback messages for each pose - FOCUS ON CORRECTIONS
    this.simplifiedFeedback = {
      'yog1': { // Warrior II
        perfect: ['Perfect Warrior II! Hold steady!', 'Excellent form!'],
        good: [], // Remove frequent "good" feedback
        needs_improvement: ['Widen your stance more!', 'Straighten your front arm!', 'Bend your front knee deeper!', 'Keep your back straight!'],
        incorrect: ['Stand wider - feet 4 feet apart!', 'Turn your front foot out 90 degrees!', 'Bend only your front knee!', 'Arms parallel to the floor!'],
        no_pose: ['Step back 3 meters so I can see your full Warrior stance!', 'Make sure your whole body is visible!']
      },
      'yog2': { // T Pose
        perfect: ['Perfect T Pose!', 'Excellent balance!'],
        good: [], // Remove frequent "good" feedback
        needs_improvement: ['Lift your arms higher!', 'Keep your arms straight!', 'Stand taller!', 'Engage your core!'],
        incorrect: ['Arms out to your sides at shoulder height!', 'Stand straight with feet together!', 'Keep your head up!', 'Extend through your fingertips!'],
        no_pose: ['Step back so I can see your full T Pose!', 'Make sure your arms are visible!']
      },
      'yog3': { // Tree Pose
        perfect: ['Perfect Tree Pose!', 'Amazing balance!'],
        good: [], // Remove frequent "good" feedback
        needs_improvement: ['Lift your foot higher on your thigh!', 'Press your foot into your leg!', 'Bring hands to prayer position!', 'Find your balance point!'],
        incorrect: ['Place your foot on your inner thigh, not your knee!', 'Balance on one leg only!', 'Hands together at heart center!', 'Keep your standing leg straight!'],
        no_pose: ['Step back so I can see your full Tree Pose!', 'Make sure you\'re in the camera view!']
      },
      'yog4': { // Goddess Pose
        perfect: ['Perfect Goddess Pose!', 'Powerful stance!'],
        good: [], // Remove frequent "good" feedback
        needs_improvement: ['Squat deeper!', 'Widen your feet more!', 'Lift your arms higher!', 'Keep your chest up!'],
        incorrect: ['Feet wide apart in a deep squat!', 'Knees bent, thighs parallel to floor!', 'Arms up in victory position!', 'Keep your back straight!'],
        no_pose: ['Step back so I can see your full Goddess Pose!', 'Make sure your squat is visible!']
      },
      'yog5': { // Downward Dog
        perfect: ['Perfect Downward Dog!', 'Excellent inverted V!'],
        good: [], // Remove frequent "good" feedback
        needs_improvement: ['Lift your hips higher!', 'Press your hands down firmly!', 'Straighten your legs more!', 'Lengthen your spine!'],
        incorrect: ['Hands and feet on the ground, hips up high!', 'Make an inverted V shape!', 'Press through your palms!', 'Straighten your arms and legs!'],
        no_pose: ['Get on hands and feet so I can see your Downward Dog!', 'Make sure your whole pose is visible!']
      },
      'yog6': { // Plank Pose
        perfect: ['Perfect Plank!', 'Rock solid!'],
        good: [], // Remove frequent "good" feedback
        needs_improvement: ['Keep your body straighter!', 'Engage your core more!', 'Don\'t let your hips sag!', 'Hold your head in line!'],
        incorrect: ['Body straight like a plank of wood!', 'Arms under your shoulders!', 'Engage your core muscles!', 'Keep your back flat!'],
        no_pose: ['Get in plank position so I can see your form!', 'Make sure your whole body is visible!']
      }
    };
    
    // Session control
    this.sessionActive = false;
    this.sessionStartTime = null;
  }

  // Enable/disable TTS
  setEnabled(enabled) {
    this.isEnabled = enabled;
    if (!enabled) {
      this.stopAll();
    }
    console.log(`🔊 TTS ${enabled ? 'ENABLED' : 'DISABLED'}`);
  }

  // Start TTS session
  startSession() {
    this.sessionActive = true;
    this.sessionStartTime = Date.now();
    this.isActive = true;
    this.lastFeedbackTime = 0;
    this.landmarkValidationCount = 0;
    console.log('🎯 TTS Session STARTED with realistic timing');
  }

  // End TTS session - CRITICAL: Stop all speech immediately
  endSession() {
    console.log('🛑 TTS Session ENDING - Stopping all speech');
    this.sessionActive = false;
    this.isActive = false;
    this.lastFeedbackTime = 0;
    this.landmarkValidationCount = 0;
    this.stopAll();
    this.clearQueue();
    console.log('✅ TTS Session ENDED - All speech stopped');
  }

  // Stop all TTS immediately
  stopAll() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      console.log('🔇 All TTS CANCELLED');
    }
    
    if (this.currentUtterance) {
      this.currentUtterance = null;
    }
    
    this.clearQueue();
  }

  // Validate landmarks are real and stable - STRICT VALIDATION
  validateLandmarks(hasLandmarks, landmarkCount = 0) {
    // CRITICAL: Must have landmarks AND valid count - STRICTER VALIDATION
    if (!hasLandmarks || landmarkCount === 0 || landmarkCount < 25) {
      this.landmarkValidationCount = 0;
      console.log(`🔇 Landmarks INVALID: hasLandmarks=${hasLandmarks}, count=${landmarkCount} - NO FEEDBACK ALLOWED`);
      return false;
    }
    
    this.landmarkValidationCount++;
    console.log(`🎯 Landmark validation: ${this.landmarkValidationCount}/${this.requiredLandmarkFrames} frames`);
    
    // Need consistent landmarks for several frames before giving feedback
    const isValid = this.landmarkValidationCount >= this.requiredLandmarkFrames;
    if (isValid) {
      console.log(`✅ Landmarks validated: ${landmarkCount} landmarks for ${this.landmarkValidationCount} frames`);
    }
    return isValid;
  }

  // Check if enough time has passed since last feedback
  canProvideFeedback() {
    const now = Date.now();
    const timeSinceLastFeedback = now - this.lastFeedbackTime;
    
    if (timeSinceLastFeedback < this.minFeedbackInterval) {
      console.log(`🔇 TTS Feedback blocked - Too soon (${timeSinceLastFeedback}ms < ${this.minFeedbackInterval}ms)`);
      return false;
    }
    
    return true;
  }

  // Get simplified feedback based on accuracy score
  categorizeFeedback(accuracyScore, hasLandmarks = true) {
    if (!hasLandmarks) {
      return this.feedbackCategories.NO_POSE;
    }
    
    if (accuracyScore >= 90) {
      return this.feedbackCategories.PERFECT;
    } else if (accuracyScore >= 80) {
      return this.feedbackCategories.GOOD;
    } else if (accuracyScore >= 60) {
      return this.feedbackCategories.NEEDS_IMPROVEMENT;
    } else {
      return this.feedbackCategories.INCORRECT;
    }
  }

  // Get random message from category
  getRandomMessage(poseId, category) {
    const poseMessages = this.simplifiedFeedback[poseId];
    if (!poseMessages || !poseMessages[category]) {
      return this.getGenericMessage(category);
    }
    
    const messages = poseMessages[category];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  // Generic fallback messages
  getGenericMessage(category) {
    const genericMessages = {
      perfect: 'Perfect pose! Excellent form!',
      good: 'Good form! Almost perfect!',
      needs_improvement: 'Needs improvement - adjust your posture!',
      incorrect: 'Incorrect posture - check your form!',
      no_pose: 'Make sure your whole body is visible!'
    };
    
    return genericMessages[category] || 'Keep practicing!';
  }

  // Clear message queue
  clearQueue() {
    this.messageQueue = [];
    this.isProcessingQueue = false;
  }

  // Provide feedback based on accuracy score and landmark detection - STRICT MODE
  provideFeedback(poseId, accuracyScore, hasLandmarks = true, landmarkCount = 0, forceSpeak = false) {
    // ABSOLUTE REQUIREMENTS - NO EXCEPTIONS
    
    // 1. Session must be active
    if (!this.sessionActive && !forceSpeak) {
      console.log('🔇 TTS BLOCKED - Session not active');
      return;
    }

    // 2. TTS must be enabled
    if (!this.isEnabled) {
      console.log('🔇 TTS BLOCKED - TTS disabled');
      return;
    }

    // 3. CRITICAL: Must have valid landmarks - ABSOLUTE REQUIREMENT
    if (!hasLandmarks || !landmarkCount || landmarkCount < 25) {
      console.log(`🔇 TTS BLOCKED - NO VALID LANDMARKS: hasLandmarks=${hasLandmarks}, count=${landmarkCount}`);
      this.landmarkValidationCount = 0; // Reset validation
      return; // ABSOLUTE BLOCK
    }

    // 4. CRITICAL: Must have valid accuracy score
    if (!accuracyScore || accuracyScore === 0 || accuracyScore < 10) {
      console.log(`🔇 TTS BLOCKED - NO VALID ACCURACY: ${accuracyScore}`);
      return; // ABSOLUTE BLOCK
    }

    // 5. Validate landmarks are stable over multiple frames
    const landmarksValid = this.validateLandmarks(hasLandmarks, landmarkCount);
    if (!landmarksValid) {
      console.log(`🔇 TTS BLOCKED - Landmarks not stable yet: ${this.landmarkValidationCount}/${this.requiredLandmarkFrames} frames`);
      return; // Need stable landmarks over time
    }

    // 6. Check timing constraints - prevent spam
    if (!forceSpeak && !this.canProvideFeedback()) {
      console.log(`🔇 TTS BLOCKED - Too soon since last feedback`);
      return;
    }

    // ONLY CORRECTIVE FEEDBACK - NO PRAISE
    let shouldSpeak = false;
    let message = '';

    if (accuracyScore < 70) {
      // Only give corrective feedback for poor poses
      shouldSpeak = Math.random() < 0.6; // 60% chance for corrections
      const corrections = this.simplifiedFeedback[poseId]?.incorrect || ['Adjust your posture!'];
      message = corrections[Math.floor(Math.random() * corrections.length)];
      console.log(`🔊 TTS CORRECTION NEEDED: ${accuracyScore}% - "${message}"`);
    } else if (accuracyScore < 85) {
      // Improvement suggestions for medium poses
      shouldSpeak = Math.random() < 0.4; // 40% chance for improvements
      const improvements = this.simplifiedFeedback[poseId]?.needs_improvement || ['Keep improving!'];
      message = improvements[Math.floor(Math.random() * improvements.length)];
      console.log(`🔊 TTS IMPROVEMENT: ${accuracyScore}% - "${message}"`);
    } else {
      // NO PRAISE FOR GOOD POSES - Stay silent for good performance
      console.log(`🔇 TTS SILENT - Good pose (${accuracyScore}%) - No praise needed`);
      return;
    }

    // Speak only if we decided to give corrective feedback
    if (shouldSpeak && message) {
      this.speak(message, false); // Never mark as important for corrections
      this.lastFeedbackTime = Date.now();
      console.log(`✅ TTS CORRECTION GIVEN: "${message}"`);
    } else {
      console.log(`🔇 TTS CORRECTION SKIPPED - Random chance or no message`);
    }
  }

  // Speak celebration message (always speaks)
  celebratePerfectPose(poseId, perfectCount = 3) {
    const celebrationMessages = {
      'yog1': `BRAVO! Your Warrior II is magnificent! ${perfectCount} perfect poses completed!`,
      'yog2': `BRAVO! Your T Pose is perfect! ${perfectCount} perfect poses completed!`,
      'yog3': `BRAVO! Your Tree Pose is beautiful! ${perfectCount} perfect poses completed!`,
      'yog4': `BRAVO! Your Goddess Pose is powerful! ${perfectCount} perfect poses completed!`,
      'yog5': `BRAVO! Your Downward Dog is excellent! ${perfectCount} perfect poses completed!`,
      'yog6': `BRAVO! Your Plank Pose is rock solid! ${perfectCount} perfect poses completed!`
    };
    
    const message = celebrationMessages[poseId] || `BRAVO! Perfect pose mastery! ${perfectCount} perfect poses completed!`;
    this.speak(message, true); // Force speak celebration
  }

  // Speak initial setup commands before detection starts - DISABLED FOR STRICT MODE
  giveInitialSetupCommands(poseId) {
    // DISABLED - No automatic setup commands
    console.log(`🔇 Setup commands DISABLED for ${poseId} - Strict mode active`);
    return;
    
    // Old code commented out:
    // const setupCommands = { ... };
    // const setupMessage = setupCommands[poseId] || `Setup message`;
    // this.speak(setupMessage, true);
  }

  // Speak welcome message with setup - DISABLED FOR STRICT MODE
  welcomeMessage(poseId) {
    // DISABLED - No automatic welcome messages
    console.log(`🔇 Welcome message DISABLED for ${poseId} - Strict mode active`);
    return;
    
    // Old code commented out:
    // const poseName = this.getPoseName(poseId);
    // const welcomeMsg = `Starting ${poseName} practice. Listen for setup instructions.`;
    // this.speak(welcomeMsg, true);
  }

  // Get pose name
  getPoseName(poseId) {
    const poseNames = {
      'yog1': 'Warrior II',
      'yog2': 'T Pose', 
      'yog3': 'Tree Pose',
      'yog4': 'Goddess Pose',
      'yog5': 'Downward Facing Dog',
      'yog6': 'Plank Pose'
    };
    return poseNames[poseId] || 'yoga pose';
  }

  // Core speak method
  speak(message, isImportant = false) {
    // Don't speak if not enabled
    if (!this.isEnabled) {
      console.log('🔇 TTS Speak blocked - TTS disabled');
      return;
    }

    // Don't speak if session not active (unless it's important like celebration)
    if (!this.sessionActive && !isImportant) {
      console.log('🔇 TTS Speak blocked - Session not active');
      return;
    }

    // Don't repeat the same message
    if (this.lastMessage === message && !isImportant) {
      console.log('🔇 TTS Speak blocked - Duplicate message');
      return;
    }

    // Check browser support
    if (!('speechSynthesis' in window)) {
      console.warn('⚠️ Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Small delay to ensure cancellation
    setTimeout(() => {
      // Double-check session is still active (unless important)
      if (!this.sessionActive && !isImportant) {
        console.log('🔇 TTS Speak cancelled - Session ended during delay');
        return;
      }

      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 0.75; // Slower speech rate for better understanding
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      utterance.lang = 'en-US';

      // Event listeners
      utterance.onstart = () => {
        this.currentUtterance = utterance;
        console.log(`🔊 TTS Started: "${message.substring(0, 50)}..."`);
      };

      utterance.onend = () => {
        this.currentUtterance = null;
        this.lastMessage = message;
        console.log(`✅ TTS Completed: "${message.substring(0, 30)}..."`);
      };

      utterance.onerror = (event) => {
        this.currentUtterance = null;
        console.error(`❌ TTS Error:`, event.error);
      };

      // Speak the message
      window.speechSynthesis.speak(utterance);
      
    }, 100);
  }

  // Check if TTS is currently speaking
  isSpeaking() {
    return window.speechSynthesis?.speaking || false;
  }

  // Get current status
  getStatus() {
    return {
      enabled: this.isEnabled,
      active: this.isActive,
      sessionActive: this.sessionActive,
      speaking: this.isSpeaking(),
      queueLength: this.messageQueue.length
    };
  }
}

// Export singleton instance
export default new TTSService();