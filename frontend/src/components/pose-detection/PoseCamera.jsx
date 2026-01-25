// components/pose-detection/PoseCamera.jsx - REAL MEDIAPIPE FROM POSE FOLDER
import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';

const ML_API_URL = 'http://localhost:5000';

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
  const [lastDetectionResult, setLastDetectionResult] = useState(null);
  const [realTimeStats, setRealTimeStats] = useState({
    fps: 0,
    accuracy: 0,
    corrections: 0,
    totalDetections: 0
  });
  const hasStartedRef = useRef(false);
  const frameCountRef = useRef(0);
  const lastFpsUpdateRef = useRef(Date.now());

  // Start/stop webcam when isActive changes
  useEffect(() => {
    console.log('🎥 PoseCamera: isActive changed to', isActive);
    
    if (isActive && !hasStartedRef.current) {
      hasStartedRef.current = true;
      startWebcam();
    } else if (!isActive && hasStartedRef.current) {
      stopWebcam();
      hasStartedRef.current = false;
    }

    return () => {
      if (isActive) {
        stopWebcam();
      }
    };
  }, [isActive]);

  // Auto-start pose detection when webcam is active
  useEffect(() => {
    if (isStreaming && showLandmarks && !isDetecting) {
      console.log('🔍 Auto-starting REAL MediaPipe detection from pose folder...');
      const timer = setTimeout(() => {
        startRealPoseDetection();
      }, 1000);
      return () => clearTimeout(timer);
    } else if (!isStreaming && isDetecting) {
      stopRealPoseDetection();
    }
  }, [isStreaming, showLandmarks]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, []);

  const startWebcam = async () => {
    try {
      console.log('🔄 Starting webcam for REAL MediaPipe from pose folder...');
      setError(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });

      console.log('✅ Webcam stream obtained');
      setIsStreaming(true);
      onWebcamStart?.();
      
    } catch (err) {
      console.error('❌ Error starting webcam:', err);
      setError(`Could not access webcam: ${err.message}. Please check permissions.`);
      onWebcamStop?.();
      hasStartedRef.current = false;
    }
  };

  const stopWebcam = async () => {
    console.log('🛑 Stopping webcam...');
    
    stopRealPoseDetection();
    
    if (webcamRef.current && webcamRef.current.video) {
      const videoElement = webcamRef.current.video;
      if (videoElement.srcObject) {
        const stream = videoElement.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => {
          track.stop();
        });
        videoElement.srcObject = null;
      }
    }
    
    setIsStreaming(false);
    setIsDetecting(false);
    setLastDetectionResult(null);
    setRealTimeStats({ fps: 0, accuracy: 0, corrections: 0, totalDetections: 0 });
    onWebcamStop?.();
    console.log('✅ Webcam stopped');
  };

  const startRealPoseDetection = () => {
    if (isDetecting || !isStreaming) return;
    
    console.log('🔍 Starting REAL MediaPipe detection using pose folder approach...');
    setIsDetecting(true);
    
    // Reset stats
    frameCountRef.current = 0;
    lastFpsUpdateRef.current = Date.now();
    
    // Start real-time detection with pose folder approach
    detectionIntervalRef.current = setInterval(async () => {
      await detectRealPoseFromFolder();
    }, 200); // 5 FPS for real-time accuracy
    
    console.log('✅ REAL MediaPipe detection started using pose folder method');
  };

  const stopRealPoseDetection = () => {
    if (!isDetecting) return;
    
    console.log('🛑 Stopping REAL pose detection...');
    setIsDetecting(false);
    
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    
    // Clear canvas
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const detectRealPoseFromFolder = async () => {
    if (!isStreaming || !webcamRef.current || !showLandmarks) return;

    try {
      const video = webcamRef.current.video;
      if (!video || video.readyState !== 4) {
        return;
      }

      // Capture frame exactly like pose folder does
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      
      ctx.drawImage(video, 0, 0, 640, 480);
      const imageData = canvas.toDataURL('image/jpeg', 0.9);
      
      // Send to REAL pose folder MediaPipe API
      const response = await fetch(`${ML_API_URL}/api/ml/pose/${selectedPose}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          image: imageData,
          user_id: 'realtime_detection',
          session_id: `session_${Date.now()}`
        })
      });

      if (!response.ok) {
        console.warn('API response not ok:', response.status);
        return;
      }

      const result = await response.json();
      console.log('🎯 REAL MediaPipe Result from pose folder:', result);

      if (result.success && result.landmarks) {
        // Update FPS counter
        frameCountRef.current++;
        const now = Date.now();
        if (now - lastFpsUpdateRef.current >= 1000) {
          const fps = frameCountRef.current;
          frameCountRef.current = 0;
          lastFpsUpdateRef.current = now;
          
          // Update real-time stats
          setRealTimeStats(prev => ({
            fps: fps,
            accuracy: Math.round(result.accuracy_score || 0),
            corrections: result.corrections ? result.corrections.length : 0,
            totalDetections: prev.totalDetections + 1
          }));
        }
        
        setLastDetectionResult(result);
        
        // Draw REAL landmarks using pose folder approach
        drawRealLandmarksFromPoseFolder(result.landmarks, result);
        
        // Notify parent with REAL data
        if (onPoseDetection) {
          onPoseDetection(result);
        }
      }
    } catch (error) {
      console.error('❌ REAL pose detection error:', error);
    }
  };

  const captureImage = () => {
    if (!webcamRef.current || !isStreaming) {
      alert('Webcam is not active');
      return null;
    }

    try {
      const imageSrc = webcamRef.current.getScreenshot({
        width: 640,
        height: 480
      });
      console.log('📸 Image captured');
      onCapture?.(imageSrc);
      return imageSrc;
    } catch (err) {
      console.error('Error capturing image:', err);
      alert('Failed to capture image. Please try again.');
      return null;
    }
  };

  const drawRealLandmarksFromPoseFolder = (landmarks = [], result = null) => {
    if (!canvasRef.current || !landmarks.length || !webcamRef.current?.video) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = webcamRef.current.video;

    // Set canvas to match video dimensions
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    const videoRect = video.getBoundingClientRect();
    canvas.style.width = `${videoRect.width}px`;
    canvas.style.height = `${videoRect.height}px`;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw MediaPipe landmarks exactly like pose folder
    // First draw all pose connections (skeleton)
    drawPoseConnections(ctx, landmarks, canvas.width, canvas.height);
    
    // Then draw landmark points
    landmarks.forEach((landmark, index) => {
      const x = landmark.x * canvas.width;
      const y = landmark.y * canvas.height;
      const visibility = landmark.visibility || 0.5;

      if (visibility > 0.3) {
        // Draw landmark circle - RED for landmarks, GREEN for connections (like pose folder)
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = '#FF0000'; // Red like pose folder
        ctx.fill();
        
        // Add white border
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    // Add correction circles exactly like pose folder compare_pose function
    if (result && result.corrections) {
      result.corrections.forEach(correction => {
        if (correction.joint_index !== undefined && landmarks[correction.joint_index]) {
          const landmark = landmarks[correction.joint_index];
          const x = landmark.x * canvas.width;
          const y = landmark.y * canvas.height;
          
          // Draw RED correction circle exactly like pose folder (30px radius)
          ctx.beginPath();
          ctx.arc(x, y, 30, 0, 2 * Math.PI);
          ctx.strokeStyle = '#FF0000';
          ctx.lineWidth = 5;
          ctx.stroke();
        }
      });
    }

    // Add pose folder style feedback overlay
    if (result) {
      // White background for text (like pose folder)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(0, 0, 370, 40);
      
      // Score text (like pose folder)
      ctx.fillStyle = '#009900'; // Green text like pose folder
      ctx.font = 'bold 16px Arial';
      ctx.fillText('Score:', 10, 25);
      
      const accuracy = Math.round(result.accuracy_score || 0);
      ctx.fillStyle = '#FF0000'; // Red text like pose folder
      ctx.font = 'bold 20px Arial';
      ctx.fillText(`${accuracy}%`, 80, 25);
      
      // Status text (like pose folder)
      if (accuracy >= 80) {
        ctx.fillStyle = '#FF0000';
        ctx.font = 'bold 20px Arial';
        ctx.fillText('PERFECT', 170, 25);
      } else {
        ctx.fillStyle = '#FF0000';
        ctx.font = 'bold 20px Arial';
        ctx.fillText('FIGHTING!', 170, 25);
      }

      // Correction feedback (like pose folder)
      if (result.corrections && result.corrections.length > 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(0, 40, 370, result.corrections.length * 20 + 10);
        
        result.corrections.forEach((correction, index) => {
          ctx.fillStyle = '#009900';
          ctx.font = 'bold 14px Arial';
          ctx.fillText(correction.message || 'Adjust pose', 10, 60 + (index * 20));
        });
      }
    }

    // Add real-time stats (pose folder style)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(canvas.width - 150, 10, 140, 80);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px Arial';
    ctx.fillText('REAL-TIME STATS', canvas.width - 145, 25);
    
    ctx.font = '11px Arial';
    ctx.fillStyle = '#00FF00';
    ctx.fillText(`FPS: ${realTimeStats.fps}`, canvas.width - 145, 40);
    
    ctx.fillStyle = realTimeStats.accuracy >= 70 ? '#00FF00' : '#FFAA00';
    ctx.fillText(`Accuracy: ${realTimeStats.accuracy}%`, canvas.width - 145, 55);
    
    ctx.fillStyle = realTimeStats.corrections > 0 ? '#FF0000' : '#00FF00';
    ctx.fillText(`Corrections: ${realTimeStats.corrections}`, canvas.width - 145, 70);
    
    ctx.fillStyle = '#AAAAAA';
    ctx.fillText(`Total: ${realTimeStats.totalDetections}`, canvas.width - 145, 85);
  };

  const drawPoseConnections = (ctx, landmarks, width, height) => {
    // MediaPipe pose connections exactly like pose folder
    const connections = [
      // Face
      [0, 1], [1, 2], [2, 3], [3, 7],
      [0, 4], [4, 5], [5, 6], [6, 8],
      // Arms
      [9, 10],
      [11, 12], [11, 13], [13, 15], [15, 17], [15, 19], [15, 21], [17, 19],
      [12, 14], [14, 16], [16, 18], [16, 20], [16, 22], [18, 20],
      // Body
      [11, 23], [12, 24], [23, 24],
      // Legs
      [23, 25], [25, 27], [27, 29], [27, 31], [29, 31],
      [24, 26], [26, 28], [28, 30], [28, 32], [30, 32]
    ];

    connections.forEach(([startIdx, endIdx]) => {
      const start = landmarks[startIdx];
      const end = landmarks[endIdx];
      
      if (start && end && 
          (start.visibility || 0) > 0.3 && 
          (end.visibility || 0) > 0.3) {
        
        ctx.beginPath();
        ctx.moveTo(start.x * width, start.y * height);
        ctx.lineTo(end.x * width, end.y * height);
        
        // GREEN connections like pose folder
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
    });
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-red-400">{error}</p>
          <button
            onClick={startWebcam}
            className="mt-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {/* Webcam Container */}
      <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
        {isActive ? (
          <>
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              mirrored={mirrored}
              className="w-full h-auto"
              videoConstraints={{
                width: 640,
                height: 480,
                facingMode: "user"
              }}
              onUserMedia={() => {
                console.log('✅ Webcam ready for REAL MediaPipe from pose folder');
                if (!isStreaming) {
                  setIsStreaming(true);
                  onWebcamStart?.();
                }
              }}
              onUserMediaError={(err) => {
                console.error('❌ Webcam error:', err);
                setError('Failed to access webcam. Please check browser permissions.');
                onWebcamStop?.();
              }}
            />
            
            {/* Canvas overlay for REAL landmarks from pose folder */}
            {showLandmarks && (
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 pointer-events-none"
                style={{ 
                  width: '100%',
                  height: '100%',
                  zIndex: 20,
                  position: 'absolute',
                  top: 0,
                  left: 0
                }}
              />
            )}

            {/* Status indicators */}
            <div className="absolute top-4 left-4 space-y-2">
              {isStreaming && (
                <div className="bg-black/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-green-500/30">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm font-bold">LIVE</span>
                  </div>
                </div>
              )}
              
              {isDetecting && (
                <div className="bg-black/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-blue-500/30">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-blue-400 text-sm font-bold">POSE FOLDER MediaPipe</span>
                  </div>
                </div>
              )}
            </div>

            {/* Real-time stats overlay */}
            {lastDetectionResult && (
              <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm px-4 py-3 rounded-lg border border-emerald-500/30">
                <div className="text-white text-sm space-y-1">
                  <div className="font-bold text-emerald-400">🎯 {selectedPose.toUpperCase()}</div>
                  <div className={`font-bold ${
                    (lastDetectionResult.accuracy_score || 0) >= 80 ? 'text-green-400' : 
                    (lastDetectionResult.accuracy_score || 0) >= 60 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {Math.round(lastDetectionResult.accuracy_score || 0)}% Accuracy
                  </div>
                  <div className="text-xs text-gray-300">
                    FPS: {realTimeStats.fps} | Detections: {realTimeStats.totalDetections}
                  </div>
                  {lastDetectionResult.corrections && lastDetectionResult.corrections.length > 0 && (
                    <div className="text-xs text-red-400">
                      {lastDetectionResult.corrections.length} corrections needed
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          // Placeholder when webcam is off
          <div className="flex flex-col items-center justify-center min-h-[480px] p-8">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">REAL MediaPipe from Pose Folder Ready</h3>
            <p className="text-gray-500 text-center max-w-md">
              Click "Start Pose" to begin professional yoga pose detection using the exact same MediaPipe implementation from the pose folder.
            </p>
          </div>
        )}
      </div>

      {/* Controls */}
      {isActive && isStreaming && (
        <>
          {/* Capture button */}
          <div className="absolute bottom-4 right-1/2 transform translate-x-1/2">
            <button
              onClick={captureImage}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30 text-white p-4 rounded-full transition-all hover:scale-110 active:scale-95 shadow-lg"
              title="Capture screenshot"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          {/* Detection toggle */}
          <div className="absolute bottom-4 right-4">
            <button
              onClick={isDetecting ? stopRealPoseDetection : startRealPoseDetection}
              className={`px-4 py-2 rounded-lg font-bold transition-all shadow-lg ${
                isDetecting
                  ? 'bg-red-500/90 hover:bg-red-500 text-white border border-red-400'
                  : 'bg-green-500/90 hover:bg-green-500 text-white border border-green-400'
              }`}
            >
              {isDetecting ? '⏹️ Stop Detection' : '▶️ Start Detection'}
            </button>
          </div>

          {/* Stop camera button */}
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                stopWebcam();
                onWebcamStop?.();
              }}
              className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors border border-red-500/30"
            >
              🛑 Stop Camera
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PoseCamera;