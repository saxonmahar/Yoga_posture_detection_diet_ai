// WORKING REAL-TIME MEDIAPIPE LANDMARKS - 100% GUARANTEED
import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';

const ML_API_URL = 'http://localhost:5000';

// Professional yoga poses data for TTS feedback
const PROFESSIONAL_POSES = [
  { id: 'yog1', name: 'Warrior II' },
  { id: 'yog2', name: 'T Pose' },
  { id: 'yog3', name: 'Tree Pose' },
  { id: 'yog4', name: 'Goddess Pose' },
  { id: 'yog5', name: 'Downward Facing Dog' },
  { id: 'yog6', name: 'Plank Pose' }
];

const PoseCamera = ({ 
  isActive = false, 
  onWebcamStart, 
  onWebcamStop,
  onCapture,
  showLandmarks = true,
  mirrored = true,
  selectedPose = 'yog3',
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

  // Start webcam when active
  useEffect(() => {
    if (isActive && !isStreaming) {
      startWebcam();
    } else if (!isActive && isStreaming) {
      stopWebcam();
    }
  }, [isActive]);

  // Auto-start detection when webcam is ready
  useEffect(() => {
    if (isStreaming && showLandmarks && !isDetecting) {
      setTimeout(() => {
        startDetection();
      }, 1000);
    }
  }, [isStreaming, showLandmarks]);

  const startWebcam = async () => {
    try {
      setError(null);
      setDebugInfo('Starting webcam...');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280, min: 640 }, 
          height: { ideal: 720, min: 480 }, 
          facingMode: 'user',
          aspectRatio: 16/9
        }
      });

      setIsStreaming(true);
      setDebugInfo('Webcam started successfully');
      onWebcamStart?.();
      
      // TTS Welcome with user name
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const userName = userData.name || userData.username || 'User';
      const poseName = PROFESSIONAL_POSES.find(p => p.id === selectedPose)?.name || 'yoga pose';
      speak(`Welcome ${userName}! Let's practice ${poseName}. Position yourself 6 feet back so I can see your full body.`);
      
    } catch (err) {
      setError(`Webcam error: ${err.message}`);
      setDebugInfo(`Webcam failed: ${err.message}`);
    }
  };

  const stopWebcam = () => {
    setDebugInfo('Stopping webcam...');
    stopDetection();
    setIsStreaming(false);
    setLandmarkCount(0);
    onWebcamStop?.();
  };

  const startDetection = () => {
    if (isDetecting) return;
    
    setIsDetecting(true);
    setDebugInfo('Starting MediaPipe detection...');
    
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
    setIsDetecting(false);
    
    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
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
      
      setDebugInfo('Sending frame to MediaPipe API...');

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
        
        // TTS Feedback with pose-specific corrections
        if (result.accuracy_score < 60 && result.feedback?.length > 0) {
          const poseName = PROFESSIONAL_POSES.find(p => p.id === selectedPose)?.name || 'pose';
          const feedback = result.feedback[0];
          speak(`For ${poseName}: ${feedback}`);
        } else if (result.accuracy_score >= 85) {
          if (Math.random() < 0.3) { // Less frequent positive feedback
            const encouragements = [
              'Perfect form! Excellent!',
              'Outstanding pose!',
              'You nailed it!',
              'Beautiful alignment!',
              'Keep holding that perfect pose!'
            ];
            speak(encouragements[Math.floor(Math.random() * encouragements.length)]);
          }
        } else if (result.accuracy_score >= 70 && Math.random() < 0.2) {
          speak('Good form! Minor adjustments needed.');
        }
        
      } else {
        setDebugInfo('No pose detected in frame');
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
        // Fix mirroring issue - flip X coordinates if mirrored
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
      // Fix mirroring issue - flip X coordinates if mirrored
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
          // Fix mirroring issue - flip X coordinates if mirrored
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
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.volume = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Instructions for full body view */}
      <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg">
        <p className="text-green-300 text-sm">
          📏 <strong>Full Body Setup:</strong> Step back 6-8 feet from camera so your entire body (head to feet) is visible for accurate pose detection.
        </p>
      </div>

      {/* Debug Info */}
      <div className="mb-4 p-3 bg-blue-500/20 border border-blue-500 rounded-lg">
        <p className="text-blue-300 text-sm">
          Debug: {debugInfo} | Landmarks: {landmarkCount} | Detection: {isDetecting ? 'ON' : 'OFF'}
        </p>
      </div>

      {/* Webcam Container - FULL BODY VIEW */}
      <div className="relative bg-black rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9', maxHeight: '80vh' }}>
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
                frameRate: { ideal: 30, min: 15 }
              }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                transform: mirrored ? 'scaleX(-1)' : 'none'
              }}
              onUserMedia={() => {
                setIsStreaming(true);
                setDebugInfo('Webcam stream active - Full body view ready');
                console.log('📹 Webcam started with full body view');
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

            {/* Status Indicators */}
            <div className="absolute top-4 left-4 space-y-2">
              <div className="bg-black/80 px-3 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm font-bold">LIVE</span>
                </div>
              </div>
              
              {isDetecting && (
                <div className="bg-black/80 px-3 py-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-blue-400 text-sm font-bold">MediaPipe ACTIVE</span>
                  </div>
                </div>
              )}

              <div className="bg-black/80 px-3 py-2 rounded-lg">
                <span className="text-white text-sm">Landmarks: {landmarkCount}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-4 right-4 space-x-2">
              <button
                onClick={isDetecting ? stopDetection : startDetection}
                className={`px-4 py-2 rounded-lg font-bold ${
                  isDetecting
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isDetecting ? '⏹️ Stop' : '▶️ Start'} Detection
              </button>
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
              <h3 className="text-xl font-semibold text-gray-300 mb-2">Full Body Pose Detection Ready</h3>
              <p className="text-gray-500 mb-4">Click "Start Pose" to begin landmark detection</p>
              <div className="text-sm text-yellow-400 bg-yellow-400/10 p-3 rounded-lg">
                <strong>📏 Important:</strong> Position yourself 6-8 feet from camera<br/>
                Make sure your entire body (head to feet) is visible
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
    </div>
  );
};

export default PoseCamera;