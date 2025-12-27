// components/pose-detection/PoseCamera.jsx
import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';

const PoseCamera = ({ 
  isActive = false, 
  onWebcamStart, 
  onWebcamStop,
  onCapture,
  showLandmarks = true,
  mirrored = true
}) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const hasStartedRef = useRef(false); // Track if webcam has been started

  // Start/stop webcam when isActive changes
  useEffect(() => {
    console.log('PoseCamera: isActive changed to', isActive, 'hasStarted:', hasStartedRef.current);
    
    if (isActive && !hasStartedRef.current) {
      hasStartedRef.current = true;
      
      // Delay to ensure component is mounted
      const timer = setTimeout(() => {
        startWebcam();
      }, 300);
      
      return () => clearTimeout(timer);
    } else if (!isActive && hasStartedRef.current) {
      stopWebcam();
      hasStartedRef.current = false;
    }

    return () => {
      // Cleanup on unmount
      if (isActive) {
        stopWebcam();
      }
    };
  }, [isActive]);

  const startWebcam = async () => {
    try {
      console.log('🔄 Starting webcam...');
      setError(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });

      console.log('✅ Webcam stream obtained');
      
      // Wait for Webcam component to be ready
      if (webcamRef.current) {
        // Set srcObject on the video element directly
        const videoElement = webcamRef.current.video;
        if (videoElement) {
          videoElement.srcObject = stream;
          
          // Wait for video to be ready
          videoElement.onloadedmetadata = () => {
            console.log('📹 Video stream ready');
            setIsStreaming(true);
            onWebcamStart?.();
          };
        }
      }
      
      console.log('🎥 Webcam started successfully');
      
    } catch (err) {
      console.error('❌ Error starting webcam:', err);
      setError(`Could not access webcam: ${err.message}. Please check permissions.`);
      onWebcamStop?.();
      hasStartedRef.current = false;
    }
  };

  const stopWebcam = () => {
    console.log('🛑 Stopping webcam...');
    
    // Stop all tracks in the stream
    if (webcamRef.current && webcamRef.current.video) {
      const videoElement = webcamRef.current.video;
      if (videoElement.srcObject) {
        const stream = videoElement.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => {
          console.log(`Stopping track: ${track.kind}`);
          track.stop();
        });
        videoElement.srcObject = null;
      }
    }
    
    setIsStreaming(false);
    onWebcamStop?.();
    console.log('✅ Webcam stopped');
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

  const drawLandmarks = (landmarks = []) => {
    if (!canvasRef.current || !landmarks.length || !webcamRef.current?.video) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = webcamRef.current.video;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Draw landmarks
    landmarks.forEach(landmark => {
      const x = landmark.x * canvas.width;
      const y = landmark.y * canvas.height;

      // Draw circle for landmark
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fillStyle = landmark.confidence > 0.7 ? '#10B981' : '#EF4444';
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
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
                console.log('✅ Webcam component ready');
                if (!isStreaming) {
                  setIsStreaming(true);
                  onWebcamStart?.();
                }
              }}
              onUserMediaError={(err) => {
                console.error('❌ Webcam component error:', err);
                setError('Failed to access webcam. Please check browser permissions.');
                onWebcamStop?.();
              }}
              style={{
                display: 'block',
                width: '100%',
                height: 'auto'
              }}
            />
            
            {/* Canvas overlay for landmarks */}
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
            />

            {/* Status indicator */}
            {isStreaming && (
              <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-white text-sm">Live</span>
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
            <h3 className="text-xl font-semibold text-gray-300 mb-2">Webcam is inactive</h3>
            <p className="text-gray-500 text-center max-w-md">
              Click "Start Webcam" to begin pose detection and get real-time feedback on your yoga form.
            </p>
          </div>
        )}
      </div>

      {/* Controls */}
      {isActive && isStreaming && (
        <>
          {/* Capture button */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <button
              onClick={captureImage}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30 text-white p-3 rounded-full transition-all hover:scale-110 active:scale-95"
              title="Capture screenshot"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          {/* Stats bar */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Streaming
              </span>
              <span>640x480</span>
              <span>30 FPS</span>
            </div>
            <button
              onClick={() => {
                stopWebcam();
                onWebcamStop?.();
              }}
              className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
            >
              Stop Camera
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PoseCamera;