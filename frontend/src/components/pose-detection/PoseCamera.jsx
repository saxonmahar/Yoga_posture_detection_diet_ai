// WORKING REAL-TIME MEDIAPIPE LANDMARKS - REGULAR WEBCAM
import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Webcam from 'react-webcam';
import ttsService from '../../services/ttsService';
import PostYogaMealCard from '../diet-plan/PostYogaMealCard';

const ML_API_URL = 'http://localhost:5000';

// Professional yoga poses data with difficulty and categories
const PROFESSIONAL_POSES = [
  { 
    id: 'yog1', 
    name: 'Warrior II',
    difficulty: 'Medium',
    category: 'Legs',
    muscleGroups: ['legs', 'core'],
    estimatedCalories: 8,
    description: 'A powerful standing pose that builds strength and stability',
    image: '/images/poses/warrior2.jpg'
  },
  { 
    id: 'yog2', 
    name: 'T Pose',
    difficulty: 'Easy',
    category: 'Upper Body',
    muscleGroups: ['arms', 'shoulders'],
    estimatedCalories: 4,
    description: 'Simple arm extension pose for shoulder strength',
    image: '/images/poses/tpose.jpg'
  },
  { 
    id: 'yog3', 
    name: 'Tree Pose',
    difficulty: 'Medium',
    category: 'Balance',
    muscleGroups: ['legs', 'core'],
    estimatedCalories: 6,
    description: 'Classic balance pose that improves focus and stability',
    image: '/images/poses/tree.jpg'
  },
  { 
    id: 'yog4', 
    name: 'Goddess Pose',
    difficulty: 'Medium',
    category: 'Lower Body',
    muscleGroups: ['legs', 'glutes'],
    estimatedCalories: 10,
    description: 'Powerful squat pose that strengthens legs and glutes',
    image: '/images/poses/goddess.jpg'
  },
  { 
    id: 'yog5', 
    name: 'Downward Facing Dog',
    difficulty: 'Hard',
    category: 'Full Body',
    muscleGroups: ['arms', 'shoulders', 'legs', 'core'],
    estimatedCalories: 12,
    description: 'Full body pose that builds strength and flexibility',
    image: '/images/poses/downward_dog.jpg'
  },
  { 
    id: 'yog6', 
    name: 'Plank Pose',
    difficulty: 'Medium',
    category: 'Core',
    muscleGroups: ['core', 'arms'],
    estimatedCalories: 8,
    description: 'Core strengthening pose that builds stability',
    image: '/images/poses/plank.jpg'
  }
];

// Live guided instructions for each pose
const LIVE_INSTRUCTIONS = {
  'yog1': {
    name: 'Warrior II',
    steps: [
      { instruction: "Welcome! Let's master Warrior II together. Step back 3-4 meters so I can see your full warrior stance.", duration: 5000 },
      { instruction: "Perfect! Stand with your feet wide apart, about 4 feet distance - feel your power!", duration: 4000 },
      { instruction: "Excellent! Turn your right foot out 90 degrees and ground it firmly like a warrior.", duration: 4000 },
      { instruction: "Amazing! Bend your right knee directly over your ankle - sink into your warrior strength!", duration: 5000 },
      { instruction: "Magnificent! Raise both arms parallel to the floor, reaching in opposite directions with warrior energy!", duration: 5000 },
      { instruction: "Beautiful Warrior II! Hold this powerful stance. I'm analyzing your warrior form with real MediaPipe.", duration: 2000 }
    ]
  },
  'yog2': {
    name: 'T Pose',
    steps: [
      { instruction: "Welcome! Let's practice T Pose together. First, step back 2-3 meters from your camera so I can see your full body clearly.", duration: 5000 },
      { instruction: "Great! Make sure you have good lighting - face a window or bright light if possible.", duration: 4000 },
      { instruction: "Perfect! Now stand straight in the center of the camera view with your feet hip-width apart.", duration: 4000 },
      { instruction: "Excellent! Slowly lift both arms out to your sides to shoulder height.", duration: 5000 },
      { instruction: "Amazing! Extend your arms fully, reaching through your fingertips, creating a perfect T shape.", duration: 4000 },
      { instruction: "Beautiful T Pose! Hold this position steady. I'm now analyzing your form with real MediaPipe technology.", duration: 2000 }
    ]
  },
  'yog3': {
    name: 'Tree Pose',
    steps: [
      { instruction: "Welcome! Let's practice Tree Pose together. First, step back 2-3 meters so I can see your full body clearly.", duration: 5000 },
      { instruction: "Great! Make sure you have good lighting and stand tall in the center of the camera view.", duration: 4000 },
      { instruction: "Perfect! Find a focal point ahead to help with balance, and shift your weight onto your left foot.", duration: 5000 },
      { instruction: "Excellent! Lift your right foot and place it on your inner left thigh - avoid the knee.", duration: 6000 },
      { instruction: "Amazing! Bring your palms together in prayer position at your heart center.", duration: 4000 },
      { instruction: "Beautiful Tree Pose! Find your balance and breathe deeply. I'm analyzing your form with real MediaPipe.", duration: 2000 }
    ]
  },
  'yog4': {
    name: 'Goddess Pose',
    steps: [
      { instruction: "Welcome! Let's embody the Goddess Pose together. Step back so I can see your full powerful stance.", duration: 5000 },
      { instruction: "Perfect! Stand with your feet very wide apart and turn both feet out - feel your goddess power!", duration: 5000 },
      { instruction: "Excellent! Lower into a deep wide squat, keeping your back straight and proud like a goddess!", duration: 5000 },
      { instruction: "Amazing! Lift your arms up and bend your elbows at 90 degrees - make strong victory arms!", duration: 5000 },
      { instruction: "Magnificent! Sink deeper into your squat and feel your inner goddess strength!", duration: 4000 },
      { instruction: "Powerful Goddess Pose! Hold this divine strength. I'm analyzing your goddess form with real MediaPipe.", duration: 2000 }
    ]
  },
  'yog5': {
    name: 'Downward Facing Dog',
    steps: [
      { instruction: "Welcome! Let's flow into Downward Dog together. Start on your hands and knees in the camera view.", duration: 5000 },
      { instruction: "Great! Place your hands firmly under your shoulders, spread your fingers wide for strength.", duration: 4000 },
      { instruction: "Perfect! Curl your toes under and prepare to lift your hips up to the sky.", duration: 4000 },
      { instruction: "Excellent! Straighten your legs and lift your hips up and back - create that beautiful inverted V!", duration: 5000 },
      { instruction: "Amazing! Press through your hands, lengthen your spine, and breathe deeply in this energizing pose.", duration: 5000 },
      { instruction: "Beautiful Downward Dog! Hold this rejuvenating pose. I'm analyzing your form with real MediaPipe.", duration: 2000 }
    ]
  },
  'yog6': {
    name: 'Plank Pose',
    steps: [
      { instruction: "Welcome! Let's build strength with Plank Pose. Start in a push-up position in the camera view.", duration: 5000 },
      { instruction: "Great! Place your hands directly under your shoulders, fingers spread for stability.", duration: 4000 },
      { instruction: "Perfect! Create a straight line from your head to your heels - be strong like a plank of wood!", duration: 5000 },
      { instruction: "Excellent! Engage your core muscles strongly, breathe steadily, and hold your power!", duration: 4000 },
      { instruction: "Amazing! Keep your body straight and strong, feel your core working and your strength building!", duration: 4000 },
      { instruction: "Perfect Plank! Hold this incredible strength. I'm analyzing your powerful form with real MediaPipe.", duration: 2000 }
    ]
  }
};

const PoseCamera = ({
  isActive = false,
  onWebcamStart,
  onWebcamStop,
  onCapture,
  showLandmarks = true,
  mirrored = true,
  selectedPose = 'yog2',
  onPoseDetection,
  onPoseChange, // Add this prop to handle pose changes
  onPoseComplete // NEW: Callback when pose is completed
}) => {
  const navigate = useNavigate(); // Add navigation hook
  const { user } = useAuth(); // Add auth context
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const detectionIntervalRef = useRef(null);
  const isProcessingRef = useRef(false); // Flag to prevent overlapping detections
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const [landmarkCount, setLandmarkCount] = useState(0);
  const [poseCompleted, setPoseCompleted] = useState(false);
  const [perfectPoseCount, setPerfectPoseCount] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [consecutiveFrames, setConsecutiveFrames] = useState(0);
  const [lastPoseState, setLastPoseState] = useState(false);
  
  // Add current selected pose state
  const [currentSelectedPose, setCurrentSelectedPose] = useState(selectedPose);
  
  // Add state to store last detection result
  const [lastDetectionResult, setLastDetectionResult] = useState(null);
  
  // Post-yoga meal card state
  const [showMealCard, setShowMealCard] = useState(false);
  const [mealCardSessionData, setMealCardSessionData] = useState(null);

  // Listen for "Choose Next Pose" event from meal card
  useEffect(() => {
    const handleChooseNextPose = () => {
      console.log('🔄 Choose Next Pose triggered from meal card');
      setShowMealCard(false);
      setShowPoseComplete(false);
      setShowPoseSelection(true);
    };

    window.addEventListener('chooseNextPose', handleChooseNextPose);
    return () => window.removeEventListener('chooseNextPose', handleChooseNextPose);
  }, []);

  // Update currentSelectedPose when selectedPose prop changes
  useEffect(() => {
    if (selectedPose !== currentSelectedPose) {
      console.log(`🔄 POSE SWITCH DETECTED: ${currentSelectedPose} → ${selectedPose}`);
      
      // NUCLEAR OPTION: Stop EVERYTHING immediately
      
      // 1. STOP ALL TTS - Multiple methods to ensure it stops
      ttsService.stopAll();
      ttsService.endSession();
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      console.log('🔇 TTS COMPLETELY STOPPED!');
      
      // 2. STOP DETECTION IMMEDIATELY
      const wasDetecting = isDetecting;
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
      setIsDetecting(false);
      console.log('⏸️ Detection STOPPED!');
      
      // 3. CLEAR CANVAS MULTIPLE TIMES to ensure it's clean
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        // Clear multiple times with different methods
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.fillStyle = 'rgba(0, 0, 0, 0)';
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        console.log('🧹 CANVAS COMPLETELY CLEARED!');
      }
      
      // 4. CLEAR LAST DETECTION RESULT - THIS IS THE FIX!
      setLastDetectionResult(null);
      console.log('🗑️ LAST DETECTION RESULT CLEARED!');
      
      // 5. UPDATE POSE STATE
      setCurrentSelectedPose(selectedPose);
      console.log(`✅ Pose state updated to: ${selectedPose}`);
      
      // 6. RESET ALL POSE-SPECIFIC STATES
      setPerfectPoseCount(0);
      setConsecutiveFrames(0);
      setPoseCompleted(false);
      setLastPoseState(false);
      setShowCelebration(false);
      setLandmarkCount(0);
      
      // 7. RESET SESSION DATA
      setSessionData({
        startTime: new Date(),
        attempts: 0,
        accuracyScores: [],
        feedbackGiven: [],
        correctionsNeeded: []
      });
      
      // 8. RESET GUIDANCE
      setGuidancePhase('preparation');
      setCurrentInstructionStep(0);
      setIsGivingInstructions(false);
      
      console.log(`✅✅✅ POSE SWITCH COMPLETE: ${selectedPose} - Everything reset!`);
      
      // 9. RESTART DETECTION - Always restart if webcam is streaming
      if (isStreaming) {
        setTimeout(() => {
          console.log(`▶️ RESTARTING DETECTION for: ${selectedPose}`);
          setGuidancePhase('analysis');
          setIsGivingInstructions(false);
          
          // Start fresh detection interval - 50ms for smooth tracking
          setIsDetecting(true);
          detectionIntervalRef.current = setInterval(async () => {
            await detectPose();
          }, 50);
        }, 1000); // Increased to 1 second for cleaner transition
      } else {
        console.log('⚠️ Webcam not streaming, cannot restart detection');
      }
    }
  }, [selectedPose, currentSelectedPose, isDetecting, isStreaming]);
  
  // Session Management State
  const [sessionState, setSessionState] = useState({
    completedPoses: [],
    currentPoseIndex: 0,
    sessionStartTime: null,
    totalSessionTime: 0,
    isSessionActive: false,
    sessionPhase: 'single-pose' // 'single-pose', 'pose-selection', 'session-complete'
  });
  const [showPoseComplete, setShowPoseComplete] = useState(false);
  const [showPoseSelection, setShowPoseSelection] = useState(false);
  const [showSessionComplete, setShowSessionComplete] = useState(false);
  const [sessionData, setSessionData] = useState({
    startTime: null,
    attempts: 0,
    accuracyScores: [],
    feedbackGiven: [],
    correctionsNeeded: []
  });

  // Live Guided Instructions State
  const [guidancePhase, setGuidancePhase] = useState('preparation'); // 'preparation', 'guidance', 'analysis', 'completed'
  const [currentInstructionStep, setCurrentInstructionStep] = useState(0);
  const [instructionTimer, setInstructionTimer] = useState(null);
  const [isGivingInstructions, setIsGivingInstructions] = useState(true);

  // Auto-start detection when webcam is ready
  useEffect(() => {
    if (isStreaming && showLandmarks && !isDetecting && !showCelebration) {
      // CRITICAL: Clean up any shared localStorage data when starting a session
      if (user?._id || user?.id) {
        const cleanupSharedData = () => {
          const sharedKeys = [
            'yogaProgressData',
            'yogaSessionData', 
            'lastYogaSessionTime'
          ];
          
          sharedKeys.forEach(key => {
            if (localStorage.getItem(key)) {
              console.log(`🧹 Removing shared localStorage key: ${key}`);
              localStorage.removeItem(key);
            }
          });
        };
        
        cleanupSharedData();
      }
      
      // INSTANT START - Skip instructions, start detection immediately
      console.log('⚡ INSTANT START - Skipping instructions, starting detection now!');
      setTimeout(() => {
        setGuidancePhase('analysis');
        setIsGivingInstructions(false);
        startDetection();
      }, 500); // Minimal 500ms delay for webcam to stabilize
    }
  }, [isStreaming, showLandmarks, showCelebration, user]);

  // Live Guided Session Management - RESTORED ORIGINAL
  const startLiveGuidedSession = () => {
    console.log('🎯 Starting Live Guided Session for:', selectedPose);
    setGuidancePhase('preparation');
    setCurrentInstructionStep(0);
    setIsGivingInstructions(true);
    
    // Start with first instruction
    setTimeout(() => {
      startInstructionSequence();
    }, 1000);
  };

  const startInstructionSequence = () => {
    const poseInstructions = LIVE_INSTRUCTIONS[selectedPose] || LIVE_INSTRUCTIONS['yog2'];
    const currentStep = poseInstructions.steps[currentInstructionStep];
    
    if (currentStep) {
      console.log(`📢 Step ${currentInstructionStep + 1}: ${currentStep.instruction}`);
      
      // NO TTS - Just log the instruction but don't speak it
      console.log('🔇 TTS DISABLED - Instruction logged only:', currentStep.instruction);
      
      // Set timer for next instruction
      const timer = setTimeout(() => {
        if (currentInstructionStep < poseInstructions.steps.length - 1) {
          setCurrentInstructionStep(prev => prev + 1);
        } else {
          // All instructions completed, start pose analysis
          setGuidancePhase('analysis');
          setIsGivingInstructions(false);
          startDetection();
        }
      }, currentStep.duration);
      
      setInstructionTimer(timer);
    }
  };

  // Auto-advance to next instruction
  useEffect(() => {
    if (isGivingInstructions && guidancePhase === 'preparation') {
      startInstructionSequence();
    }
  }, [currentInstructionStep]);

  // Clean up timers
  useEffect(() => {
    return () => {
      if (instructionTimer) {
        clearTimeout(instructionTimer);
      }
    };
  }, [instructionTimer]);

  const startDetection = () => {
    if (isDetecting) return;

    // CLEAR CANVAS BEFORE STARTING - Ensure clean slate
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      console.log('🧹 Canvas cleared before starting detection');
    }

    setIsDetecting(true);
    setDebugInfo('Starting MediaPipe detection...');

    // START TTS SESSION
    ttsService.startSession();
    console.log('🎯 TTS Session started with detection');

    // Initialize session data
    setSessionData({
      startTime: new Date(),
      attempts: 0,
      accuracyScores: [],
      feedbackGiven: [],
      correctionsNeeded: []
    });

    // Initialize session state
    setSessionState(prev => ({
      ...prev,
      sessionStartTime: new Date(),
      isSessionActive: true,
      sessionPhase: 'single-pose'
    }));

    // Start detection loop - every 50ms for smooth real-time tracking (20 FPS)
    detectionIntervalRef.current = setInterval(async () => {
      await detectPose();
    }, 50);
  };

  const stopDetection = () => {
    // IMMEDIATELY END TTS SESSION
    ttsService.endSession();
    console.log('🛑 Detection stopped - TTS session ended');

    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    
    // Clean up instruction timers
    if (instructionTimer) {
      clearTimeout(instructionTimer);
      setInstructionTimer(null);
    }

    // Record session data even if not completed perfectly
    if (sessionData.startTime && sessionData.attempts > 0) {
      recordYogaSession(poseCompleted);
    }

    setIsDetecting(false);
    setPoseCompleted(false);
    setPerfectPoseCount(0);
    setShowCelebration(false);
    setConsecutiveFrames(0);
    setLastPoseState(false);
    setGuidancePhase('preparation');
    setCurrentInstructionStep(0);
    setIsGivingInstructions(false);

    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const stopWebcam = () => {
    // IMMEDIATELY END TTS SESSION
    ttsService.endSession();
    console.log('🛑 Webcam stopped - TTS session ended');

    stopDetection();
    setIsStreaming(false);
    setLandmarkCount(0);
    setPoseCompleted(false);
    setPerfectPoseCount(0);
    setShowCelebration(false);
    setConsecutiveFrames(0);
    setLastPoseState(false);
    onWebcamStop?.();
  };

  const detectPose = async () => {
    if (!webcamRef.current?.video || !isStreaming) return;
    
    // Skip if previous detection is still processing (prevents queue buildup)
    if (isProcessingRef.current) {
      console.log('⏭️ Skipping frame - previous detection still processing');
      return;
    }
    
    isProcessingRef.current = true; // Mark as processing

    try {
      const video = webcamRef.current.video;
      if (video.readyState !== 4) return;

      // Capture frame with optimized resolution for FAST real-time detection
      // Lower resolution = faster processing = less lag
      const canvas = document.createElement('canvas');
      canvas.width = 640;  // Reduced from 1280 for speed
      canvas.height = 480; // Reduced from 720 for speed
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, 640, 480);

      const imageData = canvas.toDataURL('image/jpeg', 0.6); // Reduced quality for speed

      setDebugInfo('Sending webcam frame to MediaPipe API...');

      // Call MediaPipe API with current selected pose
      // Use selectedPose directly to avoid stale closure issues
      const poseToDetect = selectedPose || currentSelectedPose;
      console.log(`📤 Sending to ML API: pose_type=${poseToDetect} (selectedPose=${selectedPose}, currentSelectedPose=${currentSelectedPose})`);
      const response = await fetch(`${ML_API_URL}/api/ml/detect-pose`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageData,
          pose_type: poseToDetect,
          user_name: 'User'
        })
      });

      if (!response.ok) {
        setDebugInfo(`API Error: ${response.status}`);
        return;
      }

      const result = await response.json();

      // Store result in state for canvas drawing
      setLastDetectionResult(result);

      if (result.success && result.landmarks && result.landmarks.length > 0) {
        setLandmarkCount(result.landmarks.length);
        setDebugInfo(`Got ${result.landmarks.length} landmarks - Drawing...`);

        // DRAW LANDMARKS IMMEDIATELY
        drawLandmarks(result.landmarks, result);

        // Record session data
        setSessionData(prev => ({
          ...prev,
          attempts: prev.attempts + 1,
          accuracyScores: [...prev.accuracyScores, result.accuracy_score],
          feedbackGiven: result.feedback ? [...prev.feedbackGiven, ...result.feedback] : prev.feedbackGiven,
          correctionsNeeded: result.corrections ? [...prev.correctionsNeeded, ...result.corrections] : prev.correctionsNeeded
        }));

        // AUTO-STOP WHEN POSE IS PERFECT - Hold for 2 seconds (40 frames at 50ms = 2 seconds)
        if (result.accuracy_score >= 90) {
          setConsecutiveFrames(prev => {
            const newFrames = prev + 1;
            const secondsHeld = Math.floor(newFrames * 0.05); // 50ms per frame = 0.05 seconds
            
            // If pose held for 40 consecutive frames (2 seconds)
            if (newFrames >= 40 && !lastPoseState) {
              setPerfectPoseCount(prevCount => {
                const newCount = prevCount + 1;
                
                if (newCount >= 1) {
                  // BRAVO! CELEBRATION TIME - 2 seconds held!
                  ttsService.stopAll();
                  
                  setPoseCompleted(true);
                  setShowCelebration(true);
                  
                  // Use TTS service for celebration with "BRAVO!" message
                  setTimeout(() => {
                    ttsService.speak("BRAVO! You held the perfect pose! Amazing work!", true);
                  }, 200);
                  
                  // Record pose completion in session
                  const currentPose = PROFESSIONAL_POSES.find(p => p.id === currentSelectedPose);
                  const poseEndTime = new Date();
                  const poseStartTime = sessionData.startTime || new Date();
                  const poseDuration = Math.min(Math.max(Math.round((poseEndTime - poseStartTime) / 1000), 30), 300);
                  
                  const completedPose = {
                    ...currentPose,
                    completionTime: poseEndTime,
                    duration: poseDuration,
                    averageAccuracy: sessionData.accuracyScores.length > 0 ? 
                      Math.round(sessionData.accuracyScores.reduce((a, b) => a + b, 0) / sessionData.accuracyScores.length) : 90,
                    attempts: sessionData.attempts,
                    perfectCount: 1,
                    maxAccuracy: sessionData.accuracyScores.length > 0 ? Math.max(...sessionData.accuracyScores) : 90
                  };
                  
                  setSessionState(prev => ({
                    ...prev,
                    completedPoses: [...prev.completedPoses, completedPose],
                    totalSessionTime: Math.round((poseEndTime - prev.sessionStartTime) / 1000)
                  }));
                  
                  // Record successful completion and STOP DETECTION IMMEDIATELY
                  recordYogaSession(true);
                  
                  // Notify parent that pose is completed
                  if (onPoseComplete) {
                    onPoseComplete(currentSelectedPose);
                    console.log('✅ Notified parent: Pose completed -', currentSelectedPose);
                  }
                  
                  // Prepare session data for post-yoga meal card
                  const mealSessionData = {
                    caloriesBurned: currentPose?.estimatedCalories || 8,
                    duration: Math.round(poseDuration / 60), // Convert to minutes
                    poses: [{
                      poseName: currentPose?.name || currentSelectedPose,
                      category: currentPose?.category || 'Balance'
                    }],
                    accuracy: sessionData.accuracyScores.length > 0 ? 
                      Math.round(sessionData.accuracyScores.reduce((a, b) => a + b, 0) / sessionData.accuracyScores.length) : 90,
                    timeOfDay: getTimeOfDay()
                  };
                  
                  console.log('🍽️ Preparing meal card with session data:', mealSessionData);
                  setMealCardSessionData(mealSessionData);
                  
                  // STOP DETECTION AUTOMATICALLY after 2 seconds hold
                  setTimeout(() => {
                    stopDetection();
                    setShowCelebration(false);
                    setShowPoseComplete(true);
                    setDebugInfo('🎉 BRAVO! Pose held for 2 seconds - Detection stopped.');
                    
                    // Show meal card after a short delay
                    setTimeout(() => {
                      setShowPoseComplete(false); // HIDE pose complete modal
                      setShowMealCard(true);
                      console.log('🍽️ Showing post-yoga meal card');
                    }, 2000); // Show meal card 2 seconds after pose complete modal
                  }, 3000);
                }
                
                return newCount;
              });
              setLastPoseState(true);
            }
            
            return newFrames;
          });
        } else {
          // Reset when pose becomes imperfect
          if (result.accuracy_score < 90) {
            setConsecutiveFrames(0);
            setLastPoseState(false);
          }
        }

        // ONLY give TTS feedback for corrections (accuracy < 85%)
        if (result.landmarks && result.landmarks.length >= 25 && result.accuracy_score > 0 && result.accuracy_score < 85) {
          ttsService.provideFeedback(
            currentSelectedPose, 
            result.accuracy_score, 
            true,
            result.landmarks.length
          );
        }

      } else {
        setDebugInfo('No pose detected in webcam frame - Check lighting and distance');
        setLandmarkCount(0);
        ttsService.validateLandmarks(false, 0);
      }

    } catch (error) {
      setDebugInfo(`Detection error: ${error.message}`);
      console.error('Detection error:', error);
    } finally {
      // Always reset processing flag when done
      isProcessingRef.current = false;
    }
  };

  const drawLandmarks = (landmarks, result) => {
    if (!canvasRef.current || !webcamRef.current?.video) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = webcamRef.current.video;

    // CRITICAL: Set canvas size to match video display size exactly
    const rect = video.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Clear canvas with semi-transparent background for visibility
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    console.log(`🎯 DRAWING ${landmarks.length} LANDMARKS ON ${canvas.width}x${canvas.height} CANVAS`);
    console.log(`📊 RESULT OBJECT:`, result ? `accuracy_score=${result.accuracy_score}, pose_name=${result.pose_name}` : 'NULL');

    // Draw skeleton connections FIRST (BRIGHT GREEN lines)
    const connections = [
      [11, 12], [11, 13], [13, 15], [12, 14], [14, 16], // Arms
      [11, 23], [12, 24], [23, 24], // Torso
      [23, 25], [25, 27], [24, 26], [26, 28], // Legs
      [0, 1], [1, 2], [2, 3], [3, 7], // Face outline
      [0, 4], [4, 5], [5, 6], [6, 8] // Face outline
    ];

    ctx.strokeStyle = '#00FF00'; // Bright Green
    ctx.lineWidth = 4;
    ctx.shadowColor = '#00FF00';
    ctx.shadowBlur = 2;

    connections.forEach(([start, end]) => {
      if (landmarks[start] && landmarks[end]) {
        // MediaPipe returns non-mirrored coordinates, but webcam is mirrored
        // So we need to flip X coordinates to match the mirrored video
        const startX = mirrored ? (1 - landmarks[start].x) * canvas.width : landmarks[start].x * canvas.width;
        const startY = landmarks[start].y * canvas.height;
        const endX = mirrored ? (1 - landmarks[end].x) * canvas.width : landmarks[end].x * canvas.width;
        const endY = landmarks[end].y * canvas.height;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
    });

    // Reset shadow for landmarks
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // Draw landmark points (BRIGHT RED circles with glow)
    landmarks.forEach((landmark, index) => {
      // MediaPipe returns non-mirrored coordinates, but webcam is mirrored
      // So we need to flip X coordinates to match the mirrored video
      const x = mirrored ? (1 - landmark.x) * canvas.width : landmark.x * canvas.width;
      const y = landmark.y * canvas.height;
      const visibility = landmark.visibility || 0.8;

      if (visibility > 0.3) {
        // Outer glow circle
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.fill();

        // Main red circle for landmark
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.fillStyle = '#FF0000'; // Bright Red
        ctx.fill();

        // White border for contrast
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Landmark number with background
        if (index % 5 === 0) { // Show every 5th landmark number to avoid clutter
          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
          ctx.fillRect(x + 12, y - 15, 20, 16);
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 12px Arial';
          ctx.fillText(index.toString(), x + 15, y - 5);
        }
      }
    });

    // Draw correction circles for bad joints (LARGE RED CIRCLES)
    if (result.corrections && result.corrections.length > 0) {
      result.corrections.forEach((correction, index) => {
        if (correction.joint_index !== undefined && landmarks[correction.joint_index]) {
          const landmark = landmarks[correction.joint_index];
          // MediaPipe returns non-mirrored coordinates, but webcam is mirrored
          // So we need to flip X coordinates to match the mirrored video
          const x = mirrored ? (1 - landmark.x) * canvas.width : landmark.x * canvas.width;
          const y = landmark.y * canvas.height;

          // Pulsing large red correction circle with animation
          const pulseSize = 35 + Math.sin(Date.now() / 200) * 10; // Animated pulsing
          ctx.beginPath();
          ctx.arc(x, y, pulseSize, 0, 2 * Math.PI);
          ctx.strokeStyle = '#FF0000';
          ctx.lineWidth = 8;
          ctx.setLineDash([15, 8]);
          ctx.stroke();
          ctx.setLineDash([]); // Reset dash

          // Inner solid red circle
          ctx.beginPath();
          ctx.arc(x, y, 25, 0, 2 * Math.PI);
          ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
          ctx.fill();
          ctx.strokeStyle = '#FF0000';
          ctx.lineWidth = 4;
          ctx.stroke();

          // Correction text with better visibility
          const message = correction.message || 'ADJUST';
          ctx.fillStyle = 'rgba(255, 0, 0, 0.95)';
          ctx.fillRect(x - 60, y - 80, 120, 25);
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2;
          ctx.strokeRect(x - 60, y - 80, 120, 25);
          
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 14px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(message.toUpperCase(), x, y - 60);
          ctx.textAlign = 'left';
          
          // Add joint number for debugging
          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
          ctx.fillRect(x + 30, y - 15, 25, 20);
          ctx.fillStyle = '#FFFF00';
          ctx.font = 'bold 12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(`${correction.joint_index}`, x + 42, y - 2);
          ctx.textAlign = 'left';
        }
      });
    }

    // Score overlay with better visibility and responsive colors
    console.log(`🎯 SCORE OVERLAY CHECK: result=${!!result}, accuracy_score=${result?.accuracy_score}`);
    if (result && result.accuracy_score !== undefined) {
      console.log(`✅ DRAWING SCORE OVERLAY: ${result.accuracy_score}%`);
      // Background with border - color changes based on score
      let bgColor, borderColor, textColor;
      if (result.accuracy_score >= 90) {
        bgColor = 'rgba(0, 255, 0, 0.9)';
        borderColor = '#00FF00';
        textColor = '#000000';
      } else if (result.accuracy_score >= 75) {
        bgColor = 'rgba(255, 255, 0, 0.9)';
        borderColor = '#FFFF00';
        textColor = '#000000';
      } else if (result.accuracy_score >= 50) {
        bgColor = 'rgba(255, 165, 0, 0.9)';
        borderColor = '#FFA500';
        textColor = '#000000';
      } else {
        bgColor = 'rgba(255, 0, 0, 0.9)';
        borderColor = '#FF0000';
        textColor = '#FFFFFF';
      }
      
      ctx.fillStyle = bgColor;
      ctx.fillRect(10, 10, 350, 100);
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 3;
      ctx.strokeRect(10, 10, 350, 100);

      // Score text with dynamic color
      ctx.fillStyle = textColor;
      ctx.font = 'bold 28px Arial';
      ctx.fillText(`Score: ${Math.round(result.accuracy_score)}%`, 20, 45);

      // Status text with color and better feedback
      ctx.font = 'bold 20px Arial';
      if (result.accuracy_score >= 95) {
        ctx.fillStyle = '#000000';
        ctx.fillText('PERFECT! 🎯', 20, 70);
      } else if (result.accuracy_score >= 85) {
        ctx.fillStyle = '#000000';
        ctx.fillText('EXCELLENT! 🌟', 20, 70);
      } else if (result.accuracy_score >= 75) {
        ctx.fillStyle = '#000000';
        ctx.fillText('VERY GOOD! 👍', 20, 70);
      } else if (result.accuracy_score >= 60) {
        ctx.fillStyle = '#000000';
        ctx.fillText('GOOD! 💪', 20, 70);
      } else if (result.accuracy_score >= 40) {
        ctx.fillStyle = textColor;
        ctx.fillText('GETTING THERE! 📈', 20, 70);
      } else {
        ctx.fillStyle = textColor;
        ctx.fillText('ADJUST POSE! ⚠️', 20, 70);
      }

      // Show EXPECTED pose (what user selected) instead of detected pose for clarity
      const expectedPoseName = PROFESSIONAL_POSES.find(p => p.id === selectedPose)?.name || 
                               PROFESSIONAL_POSES.find(p => p.id === currentSelectedPose)?.name || 
                               'Unknown';
      ctx.fillStyle = textColor;
      ctx.font = 'bold 16px Arial';
      ctx.fillText(`Pose: ${expectedPoseName}`, 20, 95);
      
      // Show if detected pose is different from expected
      if (result.pose_name && result.pose_name !== expectedPoseName) {
        ctx.font = '12px Arial';
        ctx.fillStyle = '#FF6B6B';
        ctx.fillText(`(Detected: ${result.pose_name})`, 20, 112);
      }
      
      // Feedback preview (first feedback item)
      if (result.feedback && result.feedback.length > 0) {
        ctx.font = '14px Arial';
        const feedback = result.feedback[0].substring(0, 40) + (result.feedback[0].length > 40 ? '...' : '');
        ctx.fillText(`💡 ${feedback}`, 20, 110);
      }
    }

    console.log('✅ LANDMARKS DRAWN WITH ENHANCED VISIBILITY!');
  };

  // Old speak function removed - now using ttsService

  // Save completed session to database
  const saveSessionToDatabase = async (sessionState) => {
    try {
      if (!user?._id && !user?.id) {
        console.error('❌ No authenticated user found to save session');
        return false;
      }

      const userId = user._id || user.id;
      
      // Prepare session data for backend
      const sessionPayload = {
        user_id: userId,
        total_duration: Math.round(sessionState.totalSessionTime / 60), // Convert to minutes
        poses_practiced: sessionState.completedPoses.map(pose => ({
          pose_id: pose.id || 'yog1',
          pose_name: pose.name,
          accuracy_score: pose.maxAccuracy || pose.averageAccuracy || 90,
          duration: Math.max(pose.duration || 30, 30), // At least 30 seconds
          completed_successfully: true,
          timestamp: new Date()
        })),
        session_notes: `Multi-pose session completed with ${sessionState.completedPoses.length} poses`,
        overall_performance: {
          average_accuracy: sessionState.completedPoses.length > 0 ? 
            Math.round(sessionState.completedPoses.reduce((total, pose) => total + (pose.maxAccuracy || pose.averageAccuracy || 90), 0) / sessionState.completedPoses.length) : 90,
          total_poses_completed: sessionState.completedPoses.length,
          session_rating: 'Good'
        },
        calories_burned: sessionState.completedPoses.reduce((total, pose) => total + (pose.estimatedCalories || 5), 0)
      };

      console.log('💾 Saving session to database:', sessionPayload);

      const response = await fetch('http://localhost:5001/api/analytics/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify(sessionPayload)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Session saved successfully:', result);
        return true;
      } else {
        console.error('❌ Failed to save session:', response.status, response.statusText);
        return false;
      }
    } catch (error) {
      console.error('❌ Error saving session to database:', error);
      return false;
    }
  };

  // Helper function to get time of day
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    return 'evening';
  };

  // Record yoga session data to backend
  const recordYogaSession = async (completedSuccessfully = false) => {
    try {
      // Get user from auth context instead of localStorage
      const userId = user?._id || user?.id;

      if (!userId || !sessionData.startTime) {
        console.log('❌ No user ID or session data to record');
        return;
      }

      const endTime = new Date();
      const durationMs = endTime - (sessionData.startTime || new Date());
      const duration = Math.min(Math.max(Math.round(durationMs / 1000 / 60), 1), 10); // Between 1-10 minutes
      
      // CRITICAL FIX: Use currentSelectedPose (state) instead of selectedPose (prop) to avoid stale closure
      const poseId = currentSelectedPose || selectedPose;
      const poseName = PROFESSIONAL_POSES.find(p => p.id === poseId)?.name || 'Unknown Pose';
      
      console.log(`🔍 Recording session with pose_id: ${poseId} (currentSelectedPose=${currentSelectedPose}, selectedPose=${selectedPose})`);

      const sessionPayload = {
        user_id: userId,
        total_duration: Math.max(duration, 1), // At least 1 minute
        poses_practiced: [{
          pose_id: poseId, // FIXED: Use poseId variable instead of selectedPose directly
          pose_name: poseName,
          accuracy_score: sessionData.accuracyScores.length > 0 ?
            Math.max(...sessionData.accuracyScores) : (completedSuccessfully ? 90 : 75),
          attempts_count: sessionData.attempts,
          hold_duration: Math.max(duration * 60, 30), // At least 30 seconds
          completed_successfully: completedSuccessfully,
          feedback_given: [...new Set(sessionData.feedbackGiven)], // Remove duplicates
          corrections_needed: sessionData.correctionsNeeded.map(c => ({
            joint: c.joint_index?.toString() || 'unknown',
            message: c.message || 'Adjustment needed'
          })),
          timestamp: new Date()
        }],
        session_notes: `${poseName} practice session - ${completedSuccessfully ? 'Completed successfully' : 'Practice session'}`
      };

      console.log(`📊 Recording yoga session for user ${userId}:`, sessionPayload);

      const response = await fetch('http://localhost:5001/api/analytics/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionPayload)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Session recorded successfully:', result);

        // IMPORTANT: Save session completion to localStorage for dashboard unlock
        const sessionCompletionData = {
          sessionDate: new Date().toISOString(),
          userId: userId,
          poseName: poseName,
          accuracy: sessionPayload.poses_practiced[0].accuracy_score,
          duration: duration,
          completedSuccessfully: completedSuccessfully
        };

        // Save multiple keys for different components to check
        localStorage.setItem('lastYogaSessionTime', new Date().toISOString());
        localStorage.setItem('yogaSessionData', JSON.stringify(sessionCompletionData));
        localStorage.setItem('hasCompletedYogaSession', 'true');
        
        console.log('✅ Session completion saved to localStorage - Dashboard features will be unlocked');

        // Show achievement notifications if any
        if (result.new_achievements && result.new_achievements.length > 0) {
          result.new_achievements.forEach(achievement => {
            ttsService.speak(`Achievement unlocked: ${achievement.name}!`, true);
          });
        }

        return true; // Indicate successful recording
      } else {
        console.error('❌ Failed to record session:', response.statusText);
        return false;
      }

    } catch (error) {
      console.error('❌ Error recording yoga session:', error);
      return false;
    }
  };

  return (
    <div className="relative w-full max-w-full mx-auto px-2">  {/* Full width, minimal padding */}
      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Simple instruction - no big boxes */}
      <div className="mb-2 text-center">
        <p className="text-green-300 text-sm">
          🧘‍♀️ <strong>Stand 3-4 meters back for full body view</strong> • Hold pose with {'>'}90% accuracy for 2 seconds to complete! 🎉
        </p>
      </div>

      {/* Compact Debug Info */}
      <div className="mb-2 p-2 bg-blue-500/20 border border-blue-500 rounded-lg">
        <p className="text-blue-300 text-xs">
          <strong>Status:</strong> {debugInfo} | <strong>Landmarks:</strong> {landmarkCount} | <strong>Hold Time:</strong> {Math.floor(consecutiveFrames * 0.05)}s / 2s | <strong>Expected:</strong> {PROFESSIONAL_POSES.find(p => p.id === currentSelectedPose)?.name || 'Unknown'}
          {landmarkCount === 0 && isDetecting && (
            <span className="text-red-300 ml-2 animate-pulse">⚠️ Move back more • Improve lighting</span>
          )}
        </p>
      </div>

      {/* Webcam Container - MAXIMUM SIZE FOR FULL BODY */}
      <div className="relative bg-black rounded-xl overflow-hidden" style={{ aspectRatio: '4/3', minHeight: '85vh', width: '100%' }}>
        {isActive ? (
          <>
            {/* Webcam Video - Full Body View */}
            <Webcam
              ref={webcamRef}
              audio={false}
              mirrored={mirrored}
              screenshotFormat="image/jpeg"
              className="w-full h-full object-contain"
              videoConstraints={{
                width: { ideal: 1920, min: 1280 },
                height: { ideal: 1080, min: 720 },
                facingMode: "user",
                aspectRatio: 16/9,
                frameRate: { ideal: 30, min: 15 },
                // MAXIMUM FIELD OF VIEW for full body capture
                zoom: 0.3, // Try to zoom out more if supported
                focusMode: "continuous",
                // Request widest possible field of view
                fieldOfView: { ideal: 120, min: 90 }
              }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
                // Remove the transform since mirrored prop handles it
              }}
              onUserMedia={() => {
                setIsStreaming(true);
                setDebugInfo('Webcam stream active - Full body view ready');
                console.log('📹 Webcam started with full body view');
                onWebcamStart?.();

                // NO AUTOMATIC TTS WELCOME - Strict mode
                console.log('🔇 TTS Welcome DISABLED - Strict mode active, only corrective feedback during detection');
              }}
              onUserMediaError={(err) => {
                setError(`Webcam failed: ${err.message}`);
                setDebugInfo(`Webcam error: ${err.message}`);
              }}
            />

            {/* Canvas Overlay for Landmarks - CRITICAL POSITIONING */}
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 pointer-events-none"
              style={{
                width: '100%',
                height: '100%',
                zIndex: 20
              }}
            />

            {/* SESSION COMPLETE OVERLAY - Phase 3 */}
            {showSessionComplete && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-[9999] p-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-8 rounded-3xl shadow-2xl text-center max-w-lg mx-4">
                  <div className="text-8xl mb-6">🎊</div>
                  <h1 className="text-5xl font-bold text-white mb-4">Session Complete!</h1>
                  <p className="text-xl text-white mb-6">Amazing work! You've completed your yoga session.</p>
                  
                  {/* Session Summary */}
                  <div className="bg-white/20 rounded-xl p-4 mb-6 text-white">
                    <h3 className="font-bold mb-3">Session Summary</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Poses Completed:</div>
                      <div className="font-bold">{sessionState.completedPoses.length}</div>
                      <div>Total Time:</div>
                      <div className="font-bold">{Math.round(sessionState.totalSessionTime / 60)}m {sessionState.totalSessionTime % 60}s</div>
                      <div>Calories Burned:</div>
                      <div className="font-bold">~{sessionState.completedPoses.reduce((total, pose) => total + pose.estimatedCalories, 0)}</div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="font-bold mb-2">Completed Poses:</h4>
                      {sessionState.completedPoses.map((pose, index) => (
                        <div key={index} className="text-xs bg-white/20 rounded px-2 py-1 mb-1">
                          {pose.name} - {pose.maxAccuracy || pose.averageAccuracy || 90}% accuracy - {Math.max(pose.duration || 30, 30)}s
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <button
                      onClick={async () => {
                        // Navigate to Diet Recommendations with session data
                        setShowSessionComplete(false);
                        ttsService.speak("Great job! Let's get your personalized diet plan based on your workout!", true);
                        
                        // Save session to database first
                        const sessionSaved = await saveSessionToDatabase(sessionState);
                        if (sessionSaved) {
                          console.log('✅ Session saved to database for diet recommendations');
                        }
                        
                        // Store session data in localStorage for diet page - USER SPECIFIC ONLY
                        const userId = user?._id || user?.id;
                        if (!userId) {
                          console.error('❌ No user ID found - cannot store session data');
                          return;
                        }
                        
                        const sessionSummary = {
                          completedPoses: sessionState.completedPoses,
                          totalTime: sessionState.totalSessionTime,
                          totalCalories: sessionState.completedPoses.reduce((total, pose) => total + pose.estimatedCalories, 0),
                          sessionDate: new Date().toISOString(),
                          averageAccuracy: sessionState.completedPoses.length > 0 ? 
                            Math.round(sessionState.completedPoses.reduce((total, pose) => total + (pose.maxAccuracy || pose.averageAccuracy || 90), 0) / sessionState.completedPoses.length) : 90
                        };
                        
                        // IMPORTANT: Save session completion to localStorage for dashboard unlock
                        const sessionCompletionData = {
                          sessionDate: new Date().toISOString(),
                          userId: userId,
                          completedPoses: sessionState.completedPoses,
                          totalTime: sessionState.totalSessionTime,
                          averageAccuracy: sessionState.completedPoses.length > 0 ? 
                            Math.round(sessionState.completedPoses.reduce((total, pose) => total + (pose.maxAccuracy || pose.averageAccuracy || 90), 0) / sessionState.completedPoses.length) : 90
                        };

                        // Save with standard keys for dashboard detection
                        localStorage.setItem('lastYogaSessionTime', new Date().toISOString());
                        localStorage.setItem('yogaSessionData', JSON.stringify(sessionCompletionData));
                        localStorage.setItem('hasCompletedYogaSession', 'true');
                        
                        console.log('✅ Multi-pose session completion saved to localStorage - Dashboard features will be unlocked');
                        
                        // Navigate using React Router (maintains auth state)
                        navigate('/diet-plan', { 
                          state: { 
                            yogaSession: sessionSummary,
                            fromSession: true 
                          } 
                        });
                      }}
                      className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors"
                    >
                      🍎 Get My Diet Plan (Recommended)
                    </button>
                    
                    <button
                      onClick={async () => {
                        // Navigate to Progress Dashboard with session data
                        setShowSessionComplete(false);
                        ttsService.speak("Checking your progress dashboard!", true);
                        
                        // Save session to database first
                        const sessionSaved = await saveSessionToDatabase(sessionState);
                        if (sessionSaved) {
                          console.log('✅ Session saved to database for progress tracking');
                        }
                        
                        // Store session data in localStorage for progress page - USER SPECIFIC ONLY
                        const userId = user?._id || user?.id;
                        if (!userId) {
                          console.error('❌ No user ID found - cannot store progress data');
                          return;
                        }
                        
                        const progressData = {
                          latestSession: {
                            completedPoses: sessionState.completedPoses.map(pose => ({
                              ...pose,
                              duration: Math.max(pose.duration || 30, 30),
                              averageAccuracy: pose.maxAccuracy || pose.averageAccuracy || 90,
                              maxAccuracy: pose.maxAccuracy || pose.averageAccuracy || 90
                            })),
                            totalTime: sessionState.totalSessionTime,
                            totalCalories: sessionState.completedPoses.reduce((total, pose) => total + pose.estimatedCalories, 0),
                            sessionDate: new Date().toISOString(),
                            averageAccuracy: sessionState.completedPoses.length > 0 ? 
                              Math.round(sessionState.completedPoses.reduce((total, pose) => total + (pose.maxAccuracy || pose.averageAccuracy || 90), 0) / sessionState.completedPoses.length) : 90
                          }
                        };
                        
                        // IMPORTANT: Save session completion to localStorage for dashboard unlock
                        const progressCompletionData = {
                          sessionDate: new Date().toISOString(),
                          userId: userId,
                          completedPoses: sessionState.completedPoses,
                          totalTime: sessionState.totalSessionTime,
                          averageAccuracy: sessionState.completedPoses.length > 0 ? 
                            Math.round(sessionState.completedPoses.reduce((total, pose) => total + (pose.maxAccuracy || pose.averageAccuracy || 90), 0) / sessionState.completedPoses.length) : 90
                        };

                        // Save with standard keys for dashboard detection
                        localStorage.setItem('lastYogaSessionTime', new Date().toISOString());
                        localStorage.setItem('yogaProgressData', JSON.stringify({ latestSession: progressCompletionData }));
                        localStorage.setItem('hasCompletedYogaSession', 'true');
                        
                        console.log('✅ Multi-pose progress completion saved to localStorage - Dashboard features will be unlocked');
                        
                        // Navigate using React Router (maintains auth state)
                        navigate('/progress', { 
                          state: { 
                            yogaProgress: progressData,
                            fromSession: true 
                          } 
                        });
                      }}
                      className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors"
                    >
                      📈 View My Progress
                    </button>
                    
                    <button
                      onClick={() => {
                        // Close and reset
                        setShowSessionComplete(false);
                        setSessionState({
                          completedPoses: [],
                          currentPoseIndex: 0,
                          sessionStartTime: null,
                          totalSessionTime: 0,
                          isSessionActive: false,
                          sessionPhase: 'single-pose'
                        });
                      }}
                      className="w-full px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
            {showPoseSelection && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-[9999] p-4">
                <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 text-center border-b">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Choose Your Next Pose</h2>
                    <p className="text-gray-600">Select from the available yoga poses below</p>
                    <div className="mt-2 text-sm text-blue-600">
                      Session Progress: {sessionState.completedPoses.length} completed | {2 - sessionState.completedPoses.length} more for full benefits
                    </div>
                  </div>
                  
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {PROFESSIONAL_POSES
                      .filter(pose => !sessionState.completedPoses.some(completed => completed.id === pose.id))
                      .map((pose) => (
                        <div
                          key={pose.id}
                          onClick={() => {
                            // Select new pose and restart detection
                            console.log(`🔄 USER CLICKED NEW POSE: ${currentSelectedPose} → ${pose.id}`);
                            
                            // FIRST: Notify parent to update selectedPose prop
                            if (onPoseChange) {
                              console.log(`📤 Calling onPoseChange with: ${pose.id}`);
                              onPoseChange(pose.id);
                            }
                            
                            // Hide pose selection modal
                            setShowPoseSelection(false);
                            
                            // Announce new pose
                            ttsService.speak(`Starting ${pose.name}. Get ready!`, true);
                            
                            // The useEffect will detect the pose change and handle cleanup + restart
                            // But we need to ensure isStreaming is true for restart to work
                            if (!isStreaming) {
                              console.log('⚠️ Webcam not streaming, starting webcam...');
                              startWebcam();
                            }
                            
                            console.log(`✅ Pose selection complete. Waiting for useEffect to handle cleanup and restart...`);
                          }}
                          className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-gray-200 hover:border-blue-400 cursor-pointer transition-all hover:shadow-lg group"
                        >
                          <div className="text-center">
                            {/* Real Pose Image */}
                            <div className="w-24 h-24 mx-auto mb-4 rounded-lg overflow-hidden bg-gray-100">
                              <img 
                                src={pose.image} 
                                alt={pose.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  // Fallback to emoji if image fails to load
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              <div className="w-full h-full hidden items-center justify-center text-4xl bg-gradient-to-br from-blue-100 to-purple-100">
                                🧘‍♀️
                              </div>
                            </div>
                            
                            <h3 className="font-bold text-lg text-gray-800 mb-2">{pose.name}</h3>
                            <div className="flex justify-center gap-2 mb-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                pose.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                pose.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {pose.difficulty}
                              </span>
                              <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                                {pose.category}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mb-3 leading-relaxed">{pose.description}</p>
                            <div className="text-xs text-purple-600 font-semibold">~{pose.estimatedCalories} calories</div>
                          </div>
                        </div>
                      ))}
                  </div>
                  
                  <div className="p-6 border-t bg-gray-50 text-center">
                    <button
                      onClick={() => {
                        // End session if user doesn't want to continue
                        if (sessionState.completedPoses.length >= 2) {
                          setShowPoseSelection(false);
                          setShowSessionComplete(true);
                        } else {
                          setShowPoseSelection(false);
                          setSessionState(prev => ({ ...prev, isSessionActive: false }));
                          ttsService.speak("Session ended. Great work!", true);
                        }
                      }}
                      className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
                    >
                      End Session
                    </button>
                  </div>
                </div>
              </div>
            )}
            {showPoseComplete && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999]">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-2xl shadow-2xl text-center max-w-sm">
                  <div className="text-5xl mb-3">✅</div>
                  <h2 className="text-3xl font-bold text-white mb-3">Pose Complete!</h2>
                  
                  {sessionState.completedPoses.length > 0 && (
                    <div className="text-white mb-4">
                      <p className="text-lg mb-1">{sessionState.completedPoses[sessionState.completedPoses.length - 1]?.name}</p>
                      <p className="text-xs opacity-80">Duration: {Math.max(sessionState.completedPoses[sessionState.completedPoses.length - 1]?.duration || 30, 30)}s</p>
                      <p className="text-xs opacity-80">Accuracy: {sessionState.completedPoses[sessionState.completedPoses.length - 1]?.maxAccuracy || sessionState.completedPoses[sessionState.completedPoses.length - 1]?.averageAccuracy || 90}%</p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        // STOP detection completely
                        stopDetection();
                        
                        // Close the pose complete modal
                        setShowPoseComplete(false);
                        
                        // Show pose selection
                        setShowPoseSelection(true);
                        
                        // Reset pose state
                        setPerfectPoseCount(0);
                        setConsecutiveFrames(0);
                        setPoseCompleted(false);
                        setLastDetectionResult(null); // Clear old results
                        
                        console.log('🔄 Choose Next Pose clicked - Detection stopped, showing selection');
                      }}
                      className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-bold rounded-lg transition-colors"
                    >
                      🧘‍♀️ Choose Next Pose
                    </button>
                    
                    <button
                      onClick={() => {
                        // End session logic
                        if (sessionState.completedPoses.length >= 2) {
                          setShowPoseComplete(false);
                          setShowSessionComplete(true);
                        } else {
                          setShowPoseComplete(false);
                          setSessionState(prev => ({ ...prev, isSessionActive: false }));
                          ttsService.speak("Session ended. Great work!", true);
                        }
                      }}
                      className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-lg transition-colors"
                    >
                      🏁 End Session
                    </button>
                  </div>
                  
                  <p className="text-xs text-white/70 mt-3">
                    Completed: {sessionState.completedPoses.length} pose(s)
                  </p>
                </div>
              </div>
            )}
            {showCelebration && (
              <div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999]"
                style={{ 
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 9999
                }}
              >
                <div className="text-center animate-bounce bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-2xl shadow-2xl max-w-sm">
                  <div className="text-5xl mb-3">🎉</div>
                  <h1 className="text-4xl font-bold text-white mb-3 animate-pulse shadow-lg drop-shadow-lg">
                    BRAVO!
                  </h1>
                  <p className="text-xl text-white mb-2 font-bold">
                    Perfect Pose Held!
                  </p>
                  <p className="text-lg text-green-200 font-semibold">
                    Excellent work! 🌟
                  </p>
                  <div className="flex justify-center space-x-3 mt-3 text-3xl">
                    <span className="animate-bounce">🎊</span>
                    <span className="animate-bounce" style={{animationDelay: '0.1s'}}>✨</span>
                    <span className="animate-bounce" style={{animationDelay: '0.2s'}}>🎉</span>
                  </div>
                </div>
              </div>
            )}

            {/* Perfect Pose Progress Indicator */}
            {!showCelebration && perfectPoseCount > 0 && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
                <div className="bg-black/90 px-8 py-6 rounded-xl text-center border-2 border-yellow-400">
                  <div className="text-3xl font-bold text-yellow-400 mb-4">
                    Perfect Poses: {perfectPoseCount}/3
                  </div>
                  <div className="flex space-x-3 justify-center">
                    {[1, 2, 3].map((num) => (
                      <div
                        key={num}
                        className={`w-6 h-6 rounded-full border-2 ${
                          num <= perfectPoseCount 
                            ? 'bg-green-500 border-green-400' 
                            : 'bg-gray-700 border-gray-500'
                        }`}
                      />
                    ))}
                  </div>
                  {perfectPoseCount === 1 && (
                    <p className="text-green-400 mt-2 text-lg">Great! Keep going!</p>
                  )}
                  {perfectPoseCount === 2 && (
                    <p className="text-yellow-400 mt-2 text-lg">Almost there! One more!</p>
                  )}
                </div>
              </div>
            )}

            {/* Status Indicators */}
            <div className="absolute top-4 left-4 space-y-2">
              <div className="bg-black/80 px-3 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm font-bold">WEBCAM LIVE</span>
                </div>
              </div>

              {isDetecting && (
                <div className="bg-black/80 px-3 py-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-blue-400 text-sm font-bold">AUTO-DETECTING</span>
                  </div>
                </div>
              )}

              <div className="bg-black/80 px-3 py-2 rounded-lg">
                <span className="text-white text-sm">Landmarks: {landmarkCount}</span>
              </div>

              {perfectPoseCount > 0 && !showCelebration && (
                <div className="bg-black/80 px-3 py-2 rounded-lg">
                  <span className="text-yellow-400 text-sm font-bold">Perfect: {perfectPoseCount}/3</span>
                </div>
              )}
            </div>

            {/* Stop Detection Button (only when detecting and not celebrating) */}
            {isDetecting && !showCelebration && (
              <div className="absolute bottom-4 right-4">
                <button
                  onClick={stopDetection}
                  className="px-4 py-2 rounded-lg font-bold bg-red-500 hover:bg-red-600 text-white"
                >
                  ⏹️ Stop Detection
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center min-h-[480px] p-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">Auto-Detection Ready</h3>
              <p className="text-gray-500 mb-4">Detection starts automatically when camera loads</p>
              <div className="text-sm text-yellow-400 bg-yellow-400/10 p-3 rounded-lg">
                <strong>📏 Auto-Detection Ready:</strong> Position yourself 1-2 meters back<br/>
                Detection starts automatically when camera loads<br/>
                Get 3 perfect poses for "BRAVO!" celebration 🎉
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stop Camera Button */}
      {isActive && (
        <div className="mt-4 text-center">
          <button
            onClick={stopWebcam}
            className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg border border-red-500/30"
          >
            🛑 Stop Camera
          </button>
        </div>
      )}
      
      {/* Post-Yoga Meal Card */}
      {showMealCard && mealCardSessionData && (
        <PostYogaMealCard
          sessionData={mealCardSessionData}
          onClose={() => {
            setShowMealCard(false);
            setMealCardSessionData(null);
            console.log('🍽️ Meal card closed');
          }}
        />
      )}
    </div>
  );
};

export default PoseCamera;