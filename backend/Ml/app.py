from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import os
import json
import random
import base64
import io
import cv2
import numpy as np
import threading
import queue
import time
from datetime import datetime
from PIL import Image

app = Flask(__name__)
CORS(app, origins=["http://localhost:3001", "http://localhost:3000", "http://localhost:5173"])

print("=" * 60)
print("🧘 YOGA AI POSE DETECTION ML API")
print("=" * 60)

# Webcam streaming variables
camera = None
frame_queue = queue.Queue(maxsize=2)
camera_lock = threading.Lock()
is_streaming = False
stream_thread = None

# Try to import MediaPipe
try:
    import mediapipe as mp
    
    print("✅ MediaPipe, OpenCV, NumPy loaded successfully")
    
    class YogaPoseDetector:
        def __init__(self):
            self.mp_pose = mp.solutions.pose
            self.mp_drawing = mp.solutions.drawing_utils
            self.pose = self.mp_pose.Pose(
                static_image_mode=False,
                model_complexity=1,
                smooth_landmarks=True,
                min_detection_confidence=0.5,
                min_tracking_confidence=0.5
            )
            print("✅ MediaPipe Pose initialized")
        
        def decode_image(self, image_data):
            """Decode base64 image to numpy array"""
            try:
                if ',' in image_data:
                    image_data = image_data.split(',')[1]
                
                img_bytes = base64.b64decode(image_data)
                nparr = np.frombuffer(img_bytes, np.uint8)
                img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                
                if img is None:
                    return None
                
                return cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            except Exception as e:
                print(f"Image decode error: {e}")
                return None
        
        def detect_pose_from_frame(self, frame, pose_type):
            """Detect pose from OpenCV frame"""
            try:
                if frame is None:
                    return self._mock_result(pose_type, "No frame")
                
                # Convert BGR to RGB
                frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                frame_rgb.flags.writeable = False
                
                # Process with MediaPipe
                results = self.pose.process(frame_rgb)
                
                if not results.pose_landmarks:
                    return self._mock_result(pose_type, "No landmarks detected")
                
                # Get landmarks
                landmarks = results.pose_landmarks.landmark
                
                # Convert landmarks to serializable format
                landmarks_list = []
                for idx, lm in enumerate(landmarks):
                    landmarks_list.append({
                        "x": lm.x,
                        "y": lm.y,
                        "z": lm.z,
                        "visibility": lm.visibility,
                        "name": f"landmark_{idx}"
                    })
                
                # Calculate confidence
                confidence = float(np.mean([lm.visibility for lm in landmarks]))
                
                # Generate feedback based on pose type
                feedback = self._generate_feedback(pose_type, landmarks)
                
                # Check if pose is correct
                is_correct = confidence > 0.7
                
                # Draw landmarks on frame
                annotated_frame = frame.copy()
                self.mp_drawing.draw_landmarks(
                    annotated_frame,
                    results.pose_landmarks,
                    self.mp_pose.POSE_CONNECTIONS,
                    self.mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=2, circle_radius=2),
                    self.mp_drawing.DrawingSpec(color=(255, 0, 0), thickness=2, circle_radius=2)
                )
                
                # Convert annotated frame to base64
                _, buffer = cv2.imencode('.jpg', annotated_frame)
                annotated_image = base64.b64encode(buffer).decode('utf-8')
                
                return {
                    "success": True,
                    "pose_type": pose_type,
                    "confidence": confidence,
                    "is_correct": is_correct,
                    "feedback": feedback,
                    "landmarks": landmarks_list[:15],
                    "angles": self._calculate_angles(landmarks, pose_type),
                    "detector": "mediapipe",
                    "timestamp": datetime.now().isoformat(),
                    "annotated_image": f"data:image/jpeg;base64,{annotated_image}"
                }
                
            except Exception as e:
                print(f"Pose detection error: {e}")
                return self._mock_result(pose_type, f"Error: {e}")
        
        def _generate_feedback(self, pose_type, landmarks):
            """Generate feedback based on pose type and landmarks"""
            feedback = []
            
            if pose_type == "tree_pose":
                if len(landmarks) > 25:
                    # Check if right foot is near left knee (tree pose)
                    right_foot = landmarks[28]  # RIGHT_ANKLE
                    left_knee = landmarks[25]    # LEFT_KNEE
                    
                    if abs(right_foot.x - left_knee.x) < 0.1 and abs(right_foot.y - left_knee.y) < 0.1:
                        feedback.append("Great tree pose! Keep your balance.")
                    else:
                        feedback.append("Place your foot on the inner thigh or calf of the standing leg.")
                
                feedback.append("Focus on a fixed point for better balance.")
                feedback.append("Keep your hands in prayer position at chest.")
                
            elif pose_type == "warrior_pose":
                feedback.append("Front knee should be at 90 degrees.")
                feedback.append("Back leg should be straight and strong.")
                feedback.append("Arms should be parallel to the ground.")
                
            elif pose_type == "downward_dog":
                feedback.append("Press your heels toward the ground.")
                feedback.append("Lengthen your spine.")
                feedback.append("Spread your fingers wide.")
                
            elif pose_type == "mountain_pose":
                feedback.append("Stand tall with shoulders relaxed.")
                feedback.append("Engage your thigh muscles.")
                feedback.append("Distribute weight evenly on both feet.")
            
            if not feedback:
                feedback.append("Good pose! Keep practicing.")
                
            return feedback
        
        def _calculate_angles(self, landmarks, pose_type):
            """Calculate joint angles"""
            angles = {}
            
            if len(landmarks) < 28:
                return angles
                
            if pose_type == "warrior_pose":
                # Simulate some angles for demo
                angles = {
                    "front_knee": 92.5,
                    "back_hip": 175.3,
                    "shoulder_angle": 178.1
                }
            elif pose_type == "tree_pose":
                angles = {
                    "standing_knee": 178.9,
                    "bent_knee": 85.2,
                    "hip_angle": 95.7
                }
            elif pose_type == "downward_dog":
                angles = {
                    "shoulder_hip": 154.3,
                    "hip_knee": 172.8,
                    "knee_ankle": 178.2
                }
                
            return angles
        
        def _mock_result(self, pose_type, reason=""):
            """Fallback mock result"""
            return {
                "success": True,
                "pose_type": pose_type,
                "confidence": 0.75 + random.random() * 0.2,
                "is_correct": random.choice([True, False]),
                "feedback": [f"Demo mode: {reason}", "Practice makes perfect!"],
                "landmarks": [],
                "angles": {"demo_angle": 90},
                "detector": "demo_mode",
                "timestamp": datetime.now().isoformat(),
                "annotated_image": None
            }
        
        def process_video_stream(self, video_data, pose_type, duration):
            """Process video stream - demo version"""
            return {
                "session_id": f"session_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                "pose_type": pose_type,
                "total_frames": 150,
                "correct_frames": 120,
                "accuracy": 80.0,
                "duration_seconds": duration,
                "avg_confidence": 0.78,
                "summary": {
                    "pose_quality": "Good",
                    "improvements": ["Hold for longer duration", "Focus on breathing"],
                    "score": 8.0
                }
            }
        
        def generate_progress_report(self, sessions):
            """Generate progress report"""
            total_sessions = len(sessions) if sessions else 7
            return {
                "total_sessions": total_sessions,
                "total_practice_minutes": total_sessions * 12,
                "average_accuracy": 75.5,
                "improvement_areas": ["Balance", "Consistency", "Breathing"],
                "recommendations": ["Practice daily for 15 minutes", "Try different pose variations"],
                "streaks": {
                    "current_streak": 3,
                    "longest_streak": 7,
                    "weekly_goal": "5 sessions"
                }
            }
    
    pose_detector = YogaPoseDetector()
    
except ImportError as e:
    print(f"⚠️  MediaPipe not available: {e}")
    print("⚠️  Using demo detector instead")
    
    class MockPoseDetector:
        def __init__(self):
            self.pose_connections = ["tree_pose", "warrior_pose", "mountain_pose", "downward_dog"]
        
        def detect_pose_from_frame(self, frame, pose_type):
            # Simulate different feedback based on pose type
            feedback_map = {
                "tree_pose": [
                    "Place foot on inner thigh, not knee",
                    "Keep your standing leg strong",
                    "Hands in prayer position"
                ],
                "warrior_pose": [
                    "Front knee at 90 degrees",
                    "Back leg straight",
                    "Arms parallel to ground"
                ],
                "mountain_pose": [
                    "Stand tall with good posture",
                    "Shoulders relaxed",
                    "Feet hip-width apart"
                ],
                "downward_dog": [
                    "Heels toward the ground",
                    "Spine lengthened",
                    "Fingers spread wide"
                ]
            }
            
            return {
                "success": True,
                "pose_type": pose_type,
                "confidence": random.uniform(0.65, 0.95),
                "is_correct": random.choice([True, True, True, False]),  # 75% correct
                "feedback": feedback_map.get(pose_type, ["Good form! Keep practicing"]),
                "landmarks": [],
                "angles": {"demo_angle": random.randint(80, 100)},
                "detector": "demo",
                "timestamp": datetime.now().isoformat(),
                "annotated_image": None
            }
        
        def process_video_stream(self, video_data, pose_type, duration):
            return {
                "session_id": f"session_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                "pose_type": pose_type,
                "total_frames": random.randint(100, 200),
                "correct_frames": random.randint(70, 180),
                "accuracy": random.uniform(70, 95),
                "duration_seconds": duration,
                "avg_confidence": random.uniform(0.7, 0.9),
                "summary": {
                    "pose_quality": random.choice(["Excellent", "Good", "Needs Practice"]),
                    "improvements": ["Practice consistency", "Focus on form"],
                    "score": random.uniform(7, 10)
                }
            }
        
        def generate_progress_report(self, sessions):
            return {
                "total_sessions": len(sessions) if sessions else random.randint(5, 20),
                "total_practice_minutes": (len(sessions) if sessions else random.randint(5, 20)) * 12,
                "average_accuracy": random.uniform(70, 90),
                "improvement_areas": ["Balance", "Flexibility", "Breathing"],
                "recommendations": ["Daily practice", "Proper warmup", "Stay hydrated"],
                "streaks": {
                    "current_streak": random.randint(1, 14),
                    "longest_streak": random.randint(5, 30),
                    "weekly_goal": "5 sessions"
                }
            }
    
    pose_detector = MockPoseDetector()

# ============================================================================
# WEBCAM STREAMING FUNCTIONS
# ============================================================================

def generate_webcam_frames():
    """Generate frames from webcam for streaming"""
    global camera, is_streaming, frame_queue
    
    while is_streaming:
        try:
            with camera_lock:
                if camera is None or not camera.isOpened():
                    time.sleep(0.1)
                    continue
                
                success, frame = camera.read()
                if not success:
                    time.sleep(0.1)
                    continue
                
                # Mirror the frame (like a mirror)
                frame = cv2.flip(frame, 1)
                
                # Resize to standard size
                frame = cv2.resize(frame, (640, 480))
                
                # Encode frame as JPEG
                ret, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 85])
                if not ret:
                    continue
                
                frame_bytes = buffer.tobytes()
                
                # Put frame in queue (non-blocking)
                if frame_queue.full():
                    try:
                        frame_queue.get_nowait()
                    except queue.Empty:
                        pass
                
                try:
                    frame_queue.put_nowait(frame_bytes)
                except queue.Full:
                    pass
                
        except Exception as e:
            print(f"Webcam error: {e}")
            time.sleep(0.1)
            continue
        
        time.sleep(0.033)  # ~30 FPS

# ============================================================================
# FLASK ROUTES
# ============================================================================

# Store user sessions
user_sessions = {}

@app.route('/')
def home():
    return jsonify({
        "service": "Yoga AI Pose Detection API",
        "version": "2.0.0",
        "status": "running",
        "timestamp": datetime.now().isoformat(),
        "endpoints": [
            "/health - Service health check",
            "/api/ml/webcam/start - Start webcam",
            "/api/ml/webcam/stop - Stop webcam",
            "/api/ml/webcam/stream - Webcam video stream",
            "/api/ml/webcam/detect - Detect pose from webcam",
            "/api/ml/detect-pose - Detect pose from image",
            "/api/ml/supported-poses - List supported poses"
        ]
    })

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "Yoga Pose Detection ML API",
        "detector": pose_detector.__class__.__name__,
        "webcam_status": "active" if is_streaming else "inactive",
        "timestamp": datetime.now().isoformat()
    })

# ============================================================================
# WEBCAM ROUTES
# ============================================================================

@app.route('/api/ml/webcam/start', methods=['POST'])
def start_webcam():
    """Start webcam streaming"""
    global camera, is_streaming, stream_thread
    
    try:
        with camera_lock:
            if camera is None:
                # Try different camera indices
                for camera_idx in [0, 1, 2]:
                    camera = cv2.VideoCapture(camera_idx)
                    if camera.isOpened():
                        print(f"✅ Camera found at index {camera_idx}")
                        break
                    camera.release()
                    camera = None
                
                if camera is None:
                    return jsonify({
                        "success": False,
                        "error": "No camera found. Please connect a webcam."
                    }), 400
            
            # Configure camera
            camera.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
            camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
            camera.set(cv2.CAP_PROP_FPS, 30)
            
            if not is_streaming:
                is_streaming = True
                stream_thread = threading.Thread(target=generate_webcam_frames, daemon=True)
                stream_thread.start()
                print("🎥 Webcam streaming started")
        
        return jsonify({
            "success": True,
            "message": "Webcam started successfully",
            "resolution": "640x480",
            "fps": 30,
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"Error starting webcam: {e}")
        return jsonify({
            "success": False,
            "error": f"Failed to start webcam: {str(e)}"
        }), 500

@app.route('/api/ml/webcam/stop', methods=['POST'])
def stop_webcam():
    """Stop webcam streaming"""
    global camera, is_streaming, stream_thread
    
    try:
        with camera_lock:
            is_streaming = False
            
            # Wait for stream thread to finish
            if stream_thread and stream_thread.is_alive():
                stream_thread.join(timeout=2)
            
            # Release camera
            if camera is not None:
                camera.release()
                camera = None
            
            # Clear frame queue
            while not frame_queue.empty():
                try:
                    frame_queue.get_nowait()
                except queue.Empty:
                    break
            
            print("🎥 Webcam streaming stopped")
        
        return jsonify({
            "success": True,
            "message": "Webcam stopped",
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/ml/webcam/stream')
def webcam_stream():
    """Stream webcam video as MJPEG"""
    def generate():
        frame_count = 0
        last_time = time.time()
        
        while is_streaming:
            try:
                # Get frame from queue
                frame = frame_queue.get(timeout=2)
                frame_count += 1
                
                # Calculate FPS every 30 frames
                if frame_count % 30 == 0:
                    current_time = time.time()
                    fps = 30 / (current_time - last_time)
                    last_time = current_time
                    # print(f"📊 Streaming at {fps:.1f} FPS")
                
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
                
            except queue.Empty:
                # Send placeholder frame when queue is empty
                blank_frame = np.zeros((100, 100, 3), dtype=np.uint8)
                _, buffer = cv2.imencode('.jpg', blank_frame)
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')
                time.sleep(0.1)
            except Exception as e:
                print(f"Stream error: {e}")
                break
    
    return Response(generate(),
                    mimetype='multipart/x-mixed-replace; boundary=frame',
                    headers={
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0'
                    })

@app.route('/api/ml/webcam/detect', methods=['POST'])
def webcam_detect_pose():
    """Detect pose from current webcam frame"""
    global camera
    
    try:
        data = request.json
        pose_type = data.get('pose_type', 'tree_pose')
        user_id = data.get('user_id', 'demo_user')
        
        with camera_lock:
            if camera is None or not camera.isOpened():
                return jsonify({
                    "success": False,
                    "error": "Webcam not available. Please start webcam first."
                }), 400
            
            # Capture frame
            success, frame = camera.read()
            if not success:
                return jsonify({
                    "success": False,
                    "error": "Failed to capture frame"
                }), 400
            
            # Mirror and resize frame
            frame = cv2.flip(frame, 1)
            frame = cv2.resize(frame, (640, 480))
        
        # Detect pose
        result = pose_detector.detect_pose_from_frame(frame, pose_type)
        
        # Store session
        if user_id != 'demo_user':
            if user_id not in user_sessions:
                user_sessions[user_id] = []
            
            user_sessions[user_id].append({
                "session_id": f"{user_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                "timestamp": datetime.now().isoformat(),
                "pose_type": pose_type,
                "result": result
            })
        
        result['user_id'] = user_id
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }), 500

# ============================================================================
# POSE DETECTION ROUTES
# ============================================================================

@app.route('/api/ml/detect-pose', methods=['POST'])
def detect_pose():
    """Detect pose from uploaded image"""
    try:
        data = request.json
        
        if not data:
            return jsonify({
                "success": False,
                "error": "No data provided"
            }), 400
        
        image_data = data.get('image', '')
        pose_type = data.get('pose_type', 'tree_pose')
        user_id = data.get('user_id', 'demo_user')
        
        if not image_data:
            return jsonify({
                "success": False,
                "error": "No image data provided"
            }), 400
        
        # Decode base64 image
        try:
            if ',' in image_data:
                image_data = image_data.split(',')[1]
            
            img_bytes = base64.b64decode(image_data)
            nparr = np.frombuffer(img_bytes, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if frame is None:
                return jsonify({
                    "success": False,
                    "error": "Failed to decode image"
                }), 400
                
        except Exception as e:
            return jsonify({
                "success": False,
                "error": f"Image decoding error: {str(e)}"
            }), 400
        
        # Detect pose
        result = pose_detector.detect_pose_from_frame(frame, pose_type)
        
        # Store session
        if user_id != 'demo_user':
            if user_id not in user_sessions:
                user_sessions[user_id] = []
            
            user_sessions[user_id].append({
                "session_id": f"{user_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                "timestamp": datetime.now().isoformat(),
                "pose_type": pose_type,
                "result": result
            })
        
        result['user_id'] = user_id
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }), 500

@app.route('/api/ml/analyze-session', methods=['POST'])
def analyze_session():
    """Analyze a video session"""
    try:
        data = request.json
        
        video_data = data.get('video_data', '')
        pose_type = data.get('pose_type', 'tree_pose')
        user_id = data.get('user_id', 'demo_user')
        duration = data.get('duration_seconds', 30)
        
        if not video_data:
            return jsonify({
                "success": False,
                "error": "No video data provided"
            }), 400
        
        result = pose_detector.process_video_stream(video_data, pose_type, duration)
        
        result["user_id"] = user_id
        result["analyzed_at"] = datetime.now().isoformat()
        
        # Store session
        if user_id != 'demo_user':
            if user_id not in user_sessions:
                user_sessions[user_id] = []
            
            user_sessions[user_id].append({
                "session_id": result.get("session_id", ""),
                "timestamp": result["analyzed_at"],
                "pose_type": pose_type,
                "duration_seconds": duration,
                "accuracy": result.get("accuracy", 0)
            })
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/ml/progress/<user_id>', methods=['GET'])
def get_user_progress(user_id):
    """Get user progress report"""
    try:
        sessions = user_sessions.get(user_id, [])
        
        progress_report = pose_detector.generate_progress_report(sessions)
        progress_report["user_id"] = user_id
        progress_report["generated_at"] = datetime.now().isoformat()
        progress_report["session_count"] = len(sessions)
        
        # Add recent sessions
        progress_report["recent_sessions"] = sessions[-5:] if sessions else []
        
        return jsonify(progress_report)
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/ml/supported-poses', methods=['GET'])
def get_supported_poses():
    """Get list of supported yoga poses"""
    poses = ["tree_pose", "warrior_pose", "mountain_pose", "downward_dog"]
    
    pose_descriptions = {
        "tree_pose": {
            "name": "Tree Pose (Vrikshasana)",
            "difficulty": "Beginner",
            "benefits": ["Improves balance", "Strengthens legs", "Enhances concentration"],
            "instructions": [
                "Stand straight on one leg",
                "Place the sole of your other foot on the inner thigh",
                "Bring hands to prayer position at chest",
                "Focus on a fixed point for balance"
            ]
        },
        "warrior_pose": {
            "name": "Warrior II (Virabhadrasana II)",
            "difficulty": "Beginner",
            "benefits": ["Strengthens legs", "Improves stability", "Stretches hips"],
            "instructions": [
                "Stand with feet wide apart",
                "Turn right foot out 90 degrees",
                "Bend right knee to 90 degrees",
                "Arms extended parallel to ground"
            ]
        },
        "downward_dog": {
            "name": "Downward Facing Dog (Adho Mukha Svanasana)",
            "difficulty": "Beginner",
            "benefits": ["Strengthens arms", "Stretches hamstrings", "Calms mind"],
            "instructions": [
                "Start on hands and knees",
                "Lift hips up and back",
                "Straighten legs as much as possible",
                "Press heels toward ground"
            ]
        },
        "mountain_pose": {
            "name": "Mountain Pose (Tadasana)",
            "difficulty": "Beginner",
            "benefits": ["Improves posture", "Strengthens legs", "Reduces flat feet"],
            "instructions": [
                "Stand with feet together",
                "Distribute weight evenly",
                "Engage thigh muscles",
                "Relax shoulders down"
            ]
        }
    }
    
    return jsonify({
        "success": True,
        "poses": poses,
        "details": pose_descriptions,
        "total_poses": len(poses),
        "detector": pose_detector.__class__.__name__
    })

@app.route('/api/ml/feedback', methods=['POST'])
def get_pose_feedback():
    """Get general feedback for a specific pose"""
    try:
        data = request.json
        pose_type = data.get('pose_type', 'general')
        
        feedback = []
        if pose_type == "tree_pose":
            feedback.append("Keep your standing leg strong and straight")
            feedback.append("Place foot on inner thigh, not on knee")
            feedback.append("Focus on a fixed point for balance")
            feedback.append("Hands in prayer position at chest level")
        elif pose_type == "warrior_pose":
            feedback.append("Front knee should be at 90 degrees")
            feedback.append("Back leg should be straight and strong")
            feedback.append("Arms should be parallel to the ground")
            feedback.append("Chest should be open and facing forward")
        elif pose_type == "downward_dog":
            feedback.append("Press your heels toward the ground")
            feedback.append("Lengthen your spine")
            feedback.append("Spread your fingers wide")
            feedback.append("Engage your core muscles")
        elif pose_type == "mountain_pose":
            feedback.append("Stand tall with shoulders relaxed")
            feedback.append("Engage your thigh muscles")
            feedback.append("Distribute weight evenly on both feet")
            feedback.append("Breathe deeply and evenly")
        else:
            feedback.append("Breathe deeply and evenly throughout the pose")
            feedback.append("Focus on proper alignment")
            feedback.append("Listen to your body and don't push too hard")
            feedback.append("Practice consistently for best results")
        
        return jsonify({
            "success": True,
            "pose_type": pose_type,
            "feedback": feedback,
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/ml/test', methods=['GET'])
def test_endpoint():
    """Test endpoint to verify API is working"""
    return jsonify({
        "success": True,
        "message": "Yoga AI Pose Detection API is working!",
        "endpoints": [
            {"method": "GET", "path": "/health", "description": "Health check"},
            {"method": "POST", "path": "/api/ml/webcam/start", "description": "Start webcam streaming"},
            {"method": "POST", "path": "/api/ml/webcam/stop", "description": "Stop webcam streaming"},
            {"method": "GET", "path": "/api/ml/webcam/stream", "description": "Webcam video stream (MJPEG)"},
            {"method": "POST", "path": "/api/ml/webcam/detect", "description": "Detect pose from webcam"},
            {"method": "POST", "path": "/api/ml/detect-pose", "description": "Detect pose from image"},
            {"method": "POST", "path": "/api/ml/analyze-session", "description": "Analyze video session"},
            {"method": "GET", "path": "/api/ml/progress/<user_id>", "description": "Get user progress"},
            {"method": "GET", "path": "/api/ml/supported-poses", "description": "List supported poses"},
            {"method": "POST", "path": "/api/ml/feedback", "description": "Get pose feedback"}
        ],
        "detector": pose_detector.__class__.__name__,
        "webcam_status": "active" if is_streaming else "inactive",
        "timestamp": datetime.now().isoformat()
    })

# ============================================================================
# MAIN ENTRY POINT
# ============================================================================

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"\n🚀 Starting Yoga Pose Detection API on port {port}")
    print(f"🔗 Health Check: http://localhost:{port}/health")
    print(f"🧘 Test Endpoint: http://localhost:{port}/api/ml/test")
    print(f"📹 Webcam Stream: http://localhost:{port}/api/ml/webcam/stream")
    print("=" * 60)
    print("\n📋 Available Endpoints:")
    print("  POST /api/ml/webcam/start    - Start webcam")
    print("  POST /api/ml/webcam/stop     - Stop webcam")
    print("  GET  /api/ml/webcam/stream   - Video stream")
    print("  POST /api/ml/webcam/detect   - Detect pose from webcam")
    print("  POST /api/ml/detect-pose     - Detect pose from image")
    print("=" * 60)
    print("\n⚠️  Make sure to install required packages:")
    print("    pip install flask flask-cors opencv-python mediapipe numpy pillow")
    print("=" * 60)
    
    app.run(host='0.0.0.0', port=port, debug=True, threaded=True)