// WORKING REAL-TIME MEDIAPIPE LANDMARKS - REGULAR WEBCAM
import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';

const ML_API_URL = 'http://localhost:5000';

// Professional yoga poses data for TTS feedback and live guidance
const PROFESSIONAL_POSES = [
  { id: 'yog1', name: 'Warrior II' },
  { id: 'yog2', name: 'T Pose' },
  { id: 'yog3', name: 'Tree Pose' },
  { id: 'yog4', name: 'Goddess Pose' },
  { id: 'yog5', name: 'Downward Facing Dog' },
  { id: 'yog6', name: 'Plank Pose' }
];

// Live guided instructions for each pose
const LIVE_INSTRUCTIONS = {
  'yog1': {
    name: 'Warrior II',
    steps: [
      { instruction: "Welcome! Let's practice Warrior II together. Stand in the center of the camera.", duration: 4000 },
      { instruction: "Great! Now step your feet wide apart, about 4 feet distance.", duration: 5000 },
      { instruction: "Perfect! Turn your right foot out 90 degrees to the right.", duration: 4000 },
      { instruction: "Excellent! Now bend your right knee directly over your ankle.", duration: 5000 },
      { instruction: "Amazing! Raise both arms parallel to the floor, reaching in opposite directions.", duration: 5000 },
      { instruction: "Beautiful! Hold this strong Warrior II position. I'm now analyzing your form.", duration: 2000 }
    ]
  },
  'yog2': {
    name: 'T Pose',
    steps: [
      { instruction: "Welcome! Let's practice T Pose together. Stand straight in the center of the camera.", duration: 4000 },
      { instruction: "Great! Keep your feet hip-width apart and engage your core.", duration: 4000 },
      { instruction: "Perfect! Now slowly lift both arms out to your sides.", duration: 5000 },
      { instruction: "Excellent! Bring your arms to shoulder height, parallel to the floor.", duration: 4000 },
      { instruction: "Amazing! Extend your arms fully, reaching through your fingertips.", duration: 4000 },
      { instruction: "Beautiful T Pose! Hold this position steady. I'm now analyzing your form.", duration: 2000 }
    ]
  },
  'yog3': {
    name: 'Tree Pose',
    steps: [
      { instruction: "Welcome! Let's practice Tree Pose together. Stand tall in the center of the camera.", duration: 4000 },
      { instruction: "Great! Find a focal point ahead to help with balance.", duration: 3000 },
      { instruction: "Perfect! Shift your weight onto your left foot and ground it firmly.", duration: 4000 },
      { instruction: "Excellent! Lift your right foot and place it on your inner left thigh.", duration: 6000 },
      { instruction: "Amazing! Bring your palms together in prayer position at your heart.", duration: 4000 },
      { instruction: "Beautiful Tree Pose! Find your balance and breathe. I'm analyzing your form.", duration: 2000 }
    ]
  },
  'yog4': {
    name: 'Goddess Pose',
    steps: [
      { instruction: "Welcome! Let's practice Goddess Pose together. Stand with feet wide apart.", duration: 4000 },
      { instruction: "Great! Turn both feet out at 45-degree angles.", duration: 4000 },
      { instruction: "Perfect! Lower into a wide squat, keeping your back straight.", duration: 5000 },
      { instruction: "Excellent! Lift your arms up and bend your elbows at 90 degrees.", duration: 5000 },
      { instruction: "Amazing! Make strong goal post arms and sink deeper into the squat.", duration: 4000 },
      { instruction: "Powerful Goddess Pose! Hold this strength. I'm analyzing your form.", duration: 2000 }
    ]
  },
  'yog5': {
    name: 'Downward Facing Dog',
    steps: [
      { instruction: "Welcome! Let's practice Downward Dog. Start on your hands and knees.", duration: 5000 },
      { instruction: "Great! Place your hands under your shoulders, knees under hips.", duration: 4000 },
      { instruction: "Perfect! Curl your toes under and prepare to lift your hips.", duration: 4000 },
      { instruction: "Excellent! Straighten your legs and lift your hips up and back.", duration: 5000 },
      { instruction: "Amazing! Create an inverted V-shape, pressing through your hands.", duration: 5000 },
      { instruction: "Beautiful Downward Dog! Hold steady. I'm analyzing your form.", duration: 2000 }
    ]
  },
  'yog6': {
    name: 'Plank Pose',
    steps: [
      { instruction: "Welcome! Let's practice Plank Pose. Start in a push-up position.", duration: 4000 },
      { instruction: "Great! Place your hands directly under your shoulders.", duration: 4000 },
      { instruction: "Perfect! Create a straight line from your head to your heels.", duration: 4000 },
      { instruction: "Excellent! Engage your core muscles strongly.", duration: 4000 },
      { instruction: "Amazing! Keep your body straight and strong like a plank.", duration: 4000 },
      { instruction: "Perfect Plank! Hold this strength. I'm analyzing your form.", duration: 2000 }
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
  onPoseDetection
}) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const detectionIntervalRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const [landmarkCount, setLandmarkCount] = useState(0);
  const [poseCompleted, setPoseCompleted] = useState(false);
  const [perfectPoseCount, setPerfectPoseCount] = useState(0);
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
    if (isStreaming && showLandmarks && !isDetecting) {
      setTimeout(() => {
        startLiveGuidedSession();
      }, 1000);
    }
  }, [isStreaming, showLandmarks]);

  // Live Guided Session Management
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
      
      // Speak the instruction
      speak(currentStep.instruction);
      
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
    
    setIsDetecting(true);
    setDebugInfo('Starting MediaPipe detection...');
    
    // Initialize session data
    setSessionData({
      startTime: new Date(),
      attempts: 0,
      accuracyScores: [],
      feedbackGiven: [],
      correctionsNeeded: []
    });
    
    // Start detection loop - every 200ms
    detectionIntervalRef.current = setInterval(async () => {
      await detectPose();
    }, 200);
  };

  const stopDetection = () => {
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
    setGuidancePhase('preparation');
    setCurrentInstructionStep(0);
    setIsGivingInstructions(false);
    
    // STOP ALL TTS IMMEDIATELY
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const stopWebcam = () => {
    // STOP ALL TTS IMMEDIATELY
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    stopDetection();
    setIsStreaming(false);
    setLandmarkCount(0);
    setPoseCompleted(false);
    setPerfectPoseCount(0);
    onWebcamStop?.();
  };

  const detectPose = async () => {
    if (!webcamRef.current?.video || !isStreaming) return;

    try {
      const video = webcamRef.current.video;
      if (video.readyState !== 4) return;

      // Capture frame with higher resolution for better detection
      const canvas = document.createElement('canvas');
      canvas.width = 1280;
      canvas.height = 720;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, 1280, 720);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      
      setDebugInfo('Sending webcam frame to MediaPipe API...');

      // Call MediaPipe API
      const response = await fetch(`${ML_API_URL}/api/ml/detect-pose`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageData,
          pose_type: selectedPose,
          user_name: 'User'
        })
      });

      if (!response.ok) {
        setDebugInfo(`API Error: ${response.status}`);
        return;
      }

      const result = await response.json();
      
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
        
        // AUTO-STOP WHEN POSE IS PERFECT
        if (result.accuracy_score >= 90) {
          setPerfectPoseCount(prev => prev + 1);
          
          // If perfect pose held for 3 consecutive detections (about 1 second)
          if (perfectPoseCount >= 2 && !poseCompleted) {
            setPoseCompleted(true);
            const poseName = PROFESSIONAL_POSES.find(p => p.id === selectedPose)?.name || 'pose';
            speak(`Bravo! Your ${poseName} is perfect! Well done!`);
            
            // Record successful completion
            await recordYogaSession(true);
            
            // Auto-stop detection after 3 seconds
            setTimeout(() => {
              if (isDetecting) {
                stopDetection();
                setDebugInfo('Pose completed successfully! Detection stopped.');
              }
            }, 3000);
          }
        } else {
          setPerfectPoseCount(0); // Reset if pose becomes imperfect
        }
        
        // TTS Feedback - only if not completed and detecting
        if (!poseCompleted && isDetecting) {
          if (result.accuracy_score < 60 && result.feedback?.length > 0) {
            const poseName = PROFESSIONAL_POSES.find(p => p.id === selectedPose)?.name || 'pose';
            const feedback = result.feedback[0];
            speak(`For ${poseName}: ${feedback}`);
          } else if (result.accuracy_score >= 85 && result.accuracy_score < 90) {
            if (Math.random() < 0.2) {
              speak('Almost perfect! Hold steady!');
            }
          } else if (result.accuracy_score >= 70 && Math.random() < 0.1) {
            speak('Good form! Minor adjustments needed.');
          }
        }
        
      } else {
        setDebugInfo('No pose detected in webcam frame');
        setLandmarkCount(0);
      }

    } catch (error) {
      setDebugInfo(`Detection error: ${error.message}`);
      console.error('Detection error:', error);
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
      result.corrections.forEach(correction => {
        if (correction.joint_index !== undefined && landmarks[correction.joint_index]) {
          const landmark = landmarks[correction.joint_index];
          // MediaPipe returns non-mirrored coordinates, but webcam is mirrored
          // So we need to flip X coordinates to match the mirrored video
          const x = mirrored ? (1 - landmark.x) * canvas.width : landmark.x * canvas.width;
          const y = landmark.y * canvas.height;
          
          // Pulsing large red correction circle
          ctx.beginPath();
          ctx.arc(x, y, 35, 0, 2 * Math.PI);
          ctx.strokeStyle = '#FF0000';
          ctx.lineWidth = 6;
          ctx.setLineDash([10, 5]);
          ctx.stroke();
          ctx.setLineDash([]); // Reset dash
          
          // Correction text
          ctx.fillStyle = 'rgba(255, 0, 0, 0.9)';
          ctx.fillRect(x - 40, y - 60, 80, 20);
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('ADJUST', x, y - 45);
          ctx.textAlign = 'left';
        }
      });
    }

    // Score overlay with better visibility
    if (result.accuracy_score !== undefined) {
      // Background with border
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(10, 10, 320, 80);
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 10, 320, 80);
      
      // Score text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px Arial';
      ctx.fillText(`Score: ${Math.round(result.accuracy_score)}%`, 20, 40);
      
      // Status text with color
      ctx.font = 'bold 18px Arial';
      if (result.accuracy_score >= 85) {
        ctx.fillStyle = '#00FF00';
        ctx.fillText('PERFECT! 🎯', 20, 65);
      } else if (result.accuracy_score >= 70) {
        ctx.fillStyle = '#FFAA00';
        ctx.fillText('GOOD! 👍', 20, 65);
      } else if (result.accuracy_score >= 50) {
        ctx.fillStyle = '#FF8800';
        ctx.fillText('GETTING THERE! 💪', 20, 65);
      } else {
        ctx.fillStyle = '#FF0000';
        ctx.fillText('ADJUST POSE! ⚠️', 20, 65);
      }
      
      // Pose name
      ctx.fillStyle = '#CCCCCC';
      ctx.font = '14px Arial';
      ctx.fillText(`Pose: ${result.pose_name || 'Unknown'}`, 20, 85);
    }

    console.log('✅ LANDMARKS DRAWN WITH ENHANCED VISIBILITY!');
  };

  const speak = (text) => {
    // Speak during guidance phase or analysis phase (but not when completed)
    if ('speechSynthesis' in window && (isGivingInstructions || (isDetecting && !poseCompleted))) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8; // Slightly slower for better understanding
      utterance.volume = 0.9;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Record yoga session data to backend
  const recordYogaSession = async (completedSuccessfully = false) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = userData._id || userData.id;
      
      if (!userId || !sessionData.startTime) {
        console.log('No user ID or session data to record');
        return;
      }

      const endTime = new Date();
      const duration = Math.round((endTime - sessionData.startTime) / 1000 / 60); // minutes
      const poseName = PROFESSIONAL_POSES.find(p => p.id === selectedPose)?.name || 'Unknown Pose';
      
      const sessionPayload = {
        user_id: userId,
        total_duration: Math.max(duration, 1), // At least 1 minute
        poses_practiced: [{
          pose_id: selectedPose,
          pose_name: poseName,
          accuracy_score: sessionData.accuracyScores.length > 0 ? 
            Math.max(...sessionData.accuracyScores) : 0,
          attempts_count: sessionData.attempts,
          hold_duration: duration * 60, // seconds
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

      console.log('📊 Recording yoga session:', sessionPayload);

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
        
        // Show achievement notifications if any
        if (result.new_achievements && result.new_achievements.length > 0) {
          result.new_achievements.forEach(achievement => {
            speak(`Achievement unlocked: ${achievement.name}!`);
          });
        }
      } else {
        console.error('❌ Failed to record session:', response.statusText);
      }

    } catch (error) {
      console.error('❌ Error recording yoga session:', error);
    }
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Error Display */}
      {error && (
        <div className="mb-2 p-2 bg-red-500/20 border border-red-500 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Instructions for PC camera setup - Compact */}
      <div className="mb-2 p-2 bg-green-500/20 border border-green-500 rounded-lg">
        <p className="text-green-300 text-xs">
          📏 <strong>Live Guidance:</strong> I'll guide you step-by-step with voice instructions. Position yourself 1-2 meters back for best results.
        </p>
      </div>

      {/* Debug Info - Compact */}
      <div className="mb-2 p-2 bg-blue-500/20 border border-blue-500 rounded-lg">
        <p className="text-blue-300 text-xs">
          Phase: {guidancePhase} | Step: {currentInstructionStep + 1} | Landmarks: {landmarkCount} | Detection: {isDetecting ? 'ON' : 'OFF'} | Perfect Count: {perfectPoseCount}/3 {poseCompleted ? '✅ COMPLETED!' : ''}
        </p>
      </div>

      {/* Webcam Container - Optimized Height */}
      <div className="relative bg-black rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9', height: '65vh' }}>
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
                // WIDER FIELD OF VIEW for better full body capture
                zoom: 0.5 // Try to zoom out if supported
              }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
                // Remove the transform since mirrored prop handles it
              }}
              onUserMedia={() => {
                setIsStreaming(true);
                setDebugInfo('Webcam stream active - Live guidance will begin shortly');
                console.log('📹 Webcam started - Live Guided Session will begin');
                onWebcamStart?.();
                
                // Welcome message - guidance will start automatically
                const userData = JSON.parse(localStorage.getItem('user') || '{}');
                const userName = userData.name || userData.username || 'User';
                const poseName = PROFESSIONAL_POSES.find(p => p.id === selectedPose)?.name || 'yoga pose';
                speak(`Hello ${userName}! Get ready for live guided ${poseName} practice. I'll guide you step by step.`);
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

            {/* Live Guidance Overlay */}
            {isGivingInstructions && guidancePhase === 'preparation' && (
              <div className="absolute top-4 left-4 right-4 z-30">
                <div className="bg-black/80 backdrop-blur-sm rounded-xl p-4 border border-emerald-500/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-emerald-400 font-bold text-sm">LIVE GUIDANCE</span>
                    <span className="text-slate-400 text-sm">
                      Step {currentInstructionStep + 1} of {LIVE_INSTRUCTIONS[selectedPose]?.steps.length || 6}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-700 rounded-full h-2 mb-3">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${((currentInstructionStep + 1) / (LIVE_INSTRUCTIONS[selectedPose]?.steps.length || 6)) * 100}%` 
                      }}
                    ></div>
                  </div>
                  
                  {/* Current Instruction */}
                  <div className="text-white text-sm leading-relaxed">
                    {LIVE_INSTRUCTIONS[selectedPose]?.steps[currentInstructionStep]?.instruction || 'Follow the guidance...'}
                  </div>
                  
                  {/* Skip Button */}
                  <button
                    onClick={() => {
                      setIsGivingInstructions(false);
                      setGuidancePhase('analysis');
                      if (instructionTimer) clearTimeout(instructionTimer);
                      startDetection();
                    }}
                    className="mt-3 px-3 py-1 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 text-xs rounded-lg transition-colors"
                  >
                    Skip to Analysis
                  </button>
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
              
              {guidancePhase === 'analysis' && isDetecting && (
                <div className="bg-black/80 px-3 py-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-blue-400 text-sm font-bold">ANALYZING POSE</span>
                  </div>
                </div>
              )}

              {guidancePhase === 'preparation' && isGivingInstructions && (
                <div className="bg-black/80 px-3 py-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-emerald-400 text-sm font-bold">LIVE GUIDANCE</span>
                  </div>
                </div>
              )}

              <div className="bg-black/80 px-3 py-2 rounded-lg">
                <span className="text-white text-sm">Landmarks: {landmarkCount}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-4 right-4 space-x-2">
              {guidancePhase === 'analysis' && (
                <button
                  onClick={isDetecting ? stopDetection : startDetection}
                  className={`px-4 py-2 rounded-lg font-bold ${
                    isDetecting
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {isDetecting ? '⏹️ Stop' : '▶️ Start'} Analysis
                </button>
              )}
              
              {guidancePhase === 'preparation' && isGivingInstructions && (
                <button
                  onClick={() => {
                    setIsGivingInstructions(false);
                    setGuidancePhase('analysis');
                    if (instructionTimer) clearTimeout(instructionTimer);
                    startDetection();
                  }}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-bold"
                >
                  ⏭️ Skip to Analysis
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center min-h-[480px] p-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">Live Guided Yoga Practice Ready</h3>
              <p className="text-gray-500 mb-4">Click "Start Pose" to begin live step-by-step guidance</p>
              <div className="text-sm text-emerald-400 bg-emerald-400/10 p-3 rounded-lg">
                <strong>🎤 Live Guidance:</strong> I'll guide you through each step with voice instructions<br/>
                <strong>📏 Camera Setup:</strong> Position yourself 1-2 meters back for best results<br/>
                <strong>🎯 Auto-Analysis:</strong> After guidance, I'll analyze your pose automatically
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stop Camera Button */}
      {isActive && (
        <div className="mt-2 text-center">
          <button
            onClick={stopWebcam}
            className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg border border-red-500/30"
          >
            🛑 Stop Camera
          </button>
        </div>
      )}
    </div>
  );
};

export default PoseCamera;