import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import './PoseDetection.css';

const PoseDetection = ({ onNavigate }) => {
  const webcamRef = useRef(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [selectedPose, setSelectedPose] = useState('tadasana');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Available yoga poses with descriptions
  const yogaPoses = [
    { 
      id: 'tadasana', 
      name: 'Mountain Pose', 
      icon: '🧍',
      description: 'Stand straight with feet together, arms by your side'
    },
    { 
      id: 'vrikshasana', 
      name: 'Tree Pose', 
      icon: '🌳',
      description: 'Stand on one leg, other foot on inner thigh'
    },
    { 
      id: 'adho_mukha_svanasana', 
      name: 'Downward Dog', 
      icon: '🐕',
      description: 'Form an inverted V shape with your body'
    },
    { 
      id: 'trikonasana', 
      name: 'Triangle Pose', 
      icon: '🔺',
      description: 'Feet wide apart, arms extended, bend to one side'
    },
    { 
      id: 'virabhadrasana', 
      name: 'Warrior Pose', 
      icon: '⚔️',
      description: 'Lunge position with arms extended'
    },
    { 
      id: 'balasana', 
      name: 'Child\'s Pose', 
      icon: '🧘',
      description: 'Kneeling with torso resting on thighs'
    }
  ];

  // Simulated backend response data
  const simulatePoseAnalysis = (poseId) => {
    const pose = yogaPoses.find(p => p.id === poseId);
    const score = Math.floor(Math.random() * 30) + 70; // Random score 70-100
    
    const feedback = [];
    if (score < 80) {
      feedback.push(`Adjust your shoulder alignment: ${85 + Math.random() * 10}° (target: 90°)`);
      feedback.push(`Improve knee bend: ${45 + Math.random() * 20}° (target: 60°)`);
    }
    
    const angles = {
      left_elbow: 175 + Math.random() * 10,
      right_elbow: 175 + Math.random() * 10,
      left_knee: 170 + Math.random() * 20,
      right_knee: 170 + Math.random() * 20,
      left_hip: 180 + Math.random() * 10,
      right_hip: 180 + Math.random() * 10
    };
    
    // Simulated landmarks (21 key points like MediaPipe)
    const landmarks = {};
    for (let i = 0; i < 33; i++) {
      landmarks[i] = [
        320 + Math.random() * 200, // x: 320-520
        240 + Math.random() * 200, // y: 240-440
        Math.random() // z: 0-1
      ];
    }
    
    return {
      pose: pose.name,
      score,
      feedback,
      angles,
      landmarks,
      message: score > 85 ? 'Excellent form!' : score > 70 ? 'Good, but needs improvement' : 'Needs practice'
    };
  };

  // Capture image from webcam
  const captureImage = () => {
    if (!webcamRef.current) {
      setError('Webcam not available');
      return null;
    }
    
    try {
      const imageSrc = webcamRef.current.getScreenshot();
      return imageSrc;
    } catch (err) {
      setError('Failed to capture image');
      return null;
    }
  };

  // Simulate sending image to backend API
  const detectPose = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const image = captureImage();
      
      if (!image) {
        setError('Unable to capture image. Please allow camera access.');
        setIsLoading(false);
        return;
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get simulated response
      const data = simulatePoseAnalysis(selectedPose);
      
      setResult(data);
      setError('');
    } catch (err) {
      setError('Failed to analyze pose. Please try again.');
      console.error('Pose detection error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Draw landmarks on canvas
  useEffect(() => {
    if (!result?.landmarks || !showLandmarks) return;

    const canvas = document.getElementById('landmarks-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw landmarks as points
    Object.entries(result.landmarks).forEach(([key, [x, y]]) => {
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#667eea';
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Draw skeleton connections (simplified MediaPipe pose connections)
    const connections = [
      [11, 13], [13, 15], // Left arm
      [12, 14], [14, 16], // Right arm
      [11, 23], [12, 24], // Torso
      [23, 25], [25, 27], [27, 29], [29, 31], // Left leg
      [24, 26], [26, 28], [28, 30], [30, 32], // Right leg
      [23, 24], // Hips
      [11, 12], // Shoulders
    ];

    connections.forEach(([start, end]) => {
      if (result.landmarks[start] && result.landmarks[end]) {
        ctx.beginPath();
        ctx.moveTo(result.landmarks[start][0], result.landmarks[start][1]);
        ctx.lineTo(result.landmarks[end][0], result.landmarks[end][1]);
        ctx.strokeStyle = '#764ba2';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    });
  }, [result, showLandmarks]);

  // Auto-detect every 3 seconds when enabled
  useEffect(() => {
    let interval;
    if (isDetecting) {
      detectPose(); // Initial detection
      interval = setInterval(detectPose, 3000);
    }
    return () => clearInterval(interval);
  }, [isDetecting, selectedPose]);

  const selectedPoseInfo = yogaPoses.find(p => p.id === selectedPose);

  return (
    <div className="pose-detection-container">
      <div className="pose-header">
        <h1>AI Yoga Pose Detection</h1>
        <p>Get real-time feedback on your yoga poses using computer vision technology</p>
      </div>

      <div className="pose-layout">
        {/* Left Column: Webcam and Controls */}
        <div className="webcam-section">
          <div className="webcam-container">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="webcam-view"
              mirrored={true}
              width={640}
              height={480}
            />
            <canvas 
              id="landmarks-canvas" 
              className="landmarks-canvas"
              width={640}
              height={480}
            />
            
            {!webcamRef.current && (
              <div className="webcam-placeholder">
                <div className="placeholder-icon">📷</div>
                <p>Camera feed will appear here</p>
                <p className="placeholder-hint">Please allow camera access</p>
              </div>
            )}
          </div>

          <div className="controls">
            <div className="control-group">
              <label>Select Yoga Pose:</label>
              <div className="pose-buttons">
                {yogaPoses.map(pose => (
                  <button
                    key={pose.id}
                    className={`pose-btn ${selectedPose === pose.id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedPose(pose.id);
                      setResult(null);
                    }}
                  >
                    <span className="pose-icon">{pose.icon}</span>
                    {pose.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="control-buttons">
              <button
                className={`detect-btn ${isDetecting ? 'stop' : 'start'}`}
                onClick={() => {
                  setIsDetecting(!isDetecting);
                  if (!isDetecting) setResult(null);
                }}
                disabled={isLoading}
              >
                {isLoading ? '🔃 Processing...' : 
                 isDetecting ? '⏸️ Stop Detection' : '▶️ Start Real-time Detection'}
              </button>
              
              <button
                className="single-detect-btn"
                onClick={detectPose}
                disabled={isLoading || isDetecting}
              >
                📸 Capture & Analyze
              </button>

              <button
                className={`landmark-btn ${showLandmarks ? 'active' : ''}`}
                onClick={() => setShowLandmarks(!showLandmarks)}
              >
                {showLandmarks ? '👁️ Hide Skeleton' : '👁️ Show Skeleton'}
              </button>
            </div>
            
            <div className="pose-instructions">
              <h4>Instructions for {selectedPoseInfo?.name}:</h4>
              <p>{selectedPoseInfo?.description}</p>
              <ul>
                <li>Stand 2-3 meters away from camera</li>
                <li>Ensure good lighting</li>
                <li>Wear form-fitting clothes for better detection</li>
                <li>Face the camera directly</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="results-section">
          <div className="current-pose">
            <div className="pose-card">
              <div className="pose-icon-large">{selectedPoseInfo?.icon}</div>
              <h3>Try: {selectedPoseInfo?.name}</h3>
              <p className="pose-description">{selectedPoseInfo?.description}</p>
            </div>
          </div>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          {isLoading ? (
            <div className="loading-section">
              <div className="spinner"></div>
              <p>Analyzing your pose...</p>
            </div>
          ) : result && (
            <div className="results-card">
              <div className="score-display">
                <div className="score-circle">
                  <span className="score-value">{result.score}%</span>
                  <span className="score-label">Accuracy</span>
                </div>
                
                <div className="pose-name">
                  <h3>{result.pose} Detected</h3>
                  <div className="score-message">{result.message}</div>
                  <div className={`score-badge ${result.score > 85 ? 'good' : result.score > 70 ? 'average' : 'poor'}`}>
                    {result.score > 85 ? 'Excellent!' : result.score > 70 ? 'Good' : 'Needs Practice'}
                  </div>
                </div>
              </div>

              {result.feedback && result.feedback.length > 0 ? (
                <div className="feedback-section">
                  <h4>Improvement Suggestions:</h4>
                  <ul className="feedback-list">
                    {result.feedback.map((item, index) => (
                      <li key={index}>
                        <span className="feedback-icon">💡</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="perfect-feedback">
                  <span className="perfect-icon">✅</span>
                  Perfect form! Keep up the great work!
                </div>
              )}

              {result.angles && (
                <div className="angles-section">
                  <h4>Joint Angles Analysis:</h4>
                  <div className="angles-grid">
                    {Object.entries(result.angles).map(([joint, angle]) => (
                      <div key={joint} className="angle-item">
                        <span className="angle-name">{joint.replace('_', ' ')}:</span>
                        <span className="angle-value">{angle.toFixed(1)}°</span>
                        <div className="angle-bar">
                          <div 
                            className="angle-fill"
                            style={{ width: `${Math.min(angle / 2, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="result-actions">
                <button className="save-result-btn" onClick={() => alert('Result saved to your profile!')}>
                  💾 Save This Result
                </button>
                <button className="compare-btn" onClick={() => alert('Opening comparison view...')}>
                  📊 Compare with Previous
                </button>
              </div>
            </div>
          )}

          {/* How it Works */}
          <div className="instructions">
            <h3>How AI Pose Detection Works:</h3>
            <div className="steps">
              <div className="step">
                <div className="step-number">1</div>
                <h4>Camera Capture</h4>
                <p>Your camera captures your yoga pose in real-time</p>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <h4>AI Analysis</h4>
                <p>Computer vision algorithms detect 33 body landmarks</p>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <h4>Pose Comparison</h4>
                <p>Your pose is compared with ideal yoga pose templates</p>
              </div>
              <div className="step">
                <div className="step-number">4</div>
                <h4>Feedback</h4>
                <p>You receive instant feedback and improvement tips</p>
              </div>
            </div>
            
            <button className="back-btn" onClick={() => onNavigate('home')}>
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoseDetection;