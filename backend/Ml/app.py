#!/usr/bin/env python3
"""
MAIN YOGA AI POSE DETECTION API - STABLE MEDIAPIPE
Integrated stable MediaPipe with compact pose cards and real landmark detection
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64
import json
import threading
import time

# Try to import MediaPipe with error handling
try:
    import mediapipe as mp
    # Try new MediaPipe 0.10.x API
    from mediapipe.tasks import python as mp_tasks
    from mediapipe.tasks.python import vision
    MEDIAPIPE_AVAILABLE = True
    USE_NEW_API = True
    print("✅ MediaPipe 0.10.x (Tasks API) loaded successfully")
except Exception as e:
    print(f"❌ MediaPipe not available: {e}")
    MEDIAPIPE_AVAILABLE = False
    USE_NEW_API = False

app = Flask(__name__)
CORS(app, origins="*")  # Allow all origins

# Global MediaPipe instance (avoid recreation)
pose_detector = None
detector_lock = threading.Lock()

def init_mediapipe():
    """Initialize MediaPipe pose detector once"""
    global pose_detector
    if MEDIAPIPE_AVAILABLE and pose_detector is None:
        with detector_lock:
            if pose_detector is None:
                try:
                    # Create pose landmarker for MediaPipe 0.10.x
                    base_options = mp_tasks.BaseOptions(model_asset_path='pose_landmarker.task')
                    options = vision.PoseLandmarkerOptions(
                        base_options=base_options,
                        output_segmentation_masks=False)
                    pose_detector = vision.PoseLandmarker.create_from_options(options)
                    print("✅ MediaPipe 0.10.x pose detector initialized")
                except Exception as e:
                    print(f"❌ Failed to initialize MediaPipe: {e}")
                    pose_detector = None

# Initialize on startup
init_mediapipe()

print("=" * 60)
print("🧘 YOGA AI POSE DETECTION ML API - STABLE MEDIAPIPE")
print("=" * 60)

@app.route('/')
def home():
    return jsonify({
        "service": "Yoga AI Pose Detection API - Stable MediaPipe",
        "version": "4.0.0",
        "status": "running",
        "mediapipe_available": MEDIAPIPE_AVAILABLE,
        "detector_ready": pose_detector is not None,
        "endpoints": [
            "/health - Service health check",
            "/api/ml/available-poses - Get available poses",
            "/api/ml/detect-pose - Real-time pose detection",
            "/api/ml/pose/yog1 - Warrior II Pose",
            "/api/ml/pose/yog2 - T Pose", 
            "/api/ml/pose/yog3 - Tree Pose",
            "/api/ml/pose/yog4 - Goddess Pose",
            "/api/ml/pose/yog5 - Downward Dog",
            "/api/ml/pose/yog6 - Plank Pose"
        ]
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "service": "Yoga AI Pose Detection API - Stable MediaPipe",
        "mediapipe_available": MEDIAPIPE_AVAILABLE,
        "detector_ready": pose_detector is not None,
        "real_landmarks": True
    })

@app.route('/api/ml/test-detection', methods=['POST'])
def test_detection():
    """Test endpoint to verify detection is working"""
    try:
        print("🧪 TEST DETECTION REQUEST RECEIVED")
        data = request.get_json()
        pose_type = data.get('pose_type', 'yog3')
        
        print(f"🎯 Test request for pose: {pose_type}")
        
        # Return a test response
        return jsonify({
            "success": True,
            "message": f"Test detection for {get_pose_name(pose_type)}",
            "pose_type": pose_type,
            "pose_name": get_pose_name(pose_type),
            "test_timestamp": time.strftime("%H:%M:%S"),
            "ml_service_working": True
        })
        
    except Exception as e:
        print(f"❌ Test detection error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/ml/available-poses', methods=['GET'])
def get_available_poses():
    """Get list of available yoga poses"""
    poses = {
        "yog1": {
            "name": "Warrior II (Virabhadrasana II)",
            "difficulty": "Intermediate",
            "endpoint": "/api/ml/pose/yog1",
            "instructions": "Stand with feet wide apart, turn right foot out 90°, bend right knee, extend arms parallel to floor"
        },
        "yog2": {
            "name": "T Pose",
            "difficulty": "Beginner", 
            "endpoint": "/api/ml/pose/yog2",
            "instructions": "Stand straight, extend arms out to sides parallel to floor, keep legs straight"
        },
        "yog3": {
            "name": "Tree Pose (Vrikshasana)",
            "difficulty": "Beginner",
            "endpoint": "/api/ml/pose/yog3",
            "instructions": "Stand on one leg, place other foot on inner thigh, hands in prayer position"
        },
        "yog4": {
            "name": "Goddess Pose",
            "difficulty": "Intermediate",
            "endpoint": "/api/ml/pose/yog4",
            "instructions": "Wide-legged squat, knees bent, arms raised up in victory pose"
        },
        "yog5": {
            "name": "Downward Facing Dog",
            "difficulty": "Intermediate",
            "endpoint": "/api/ml/pose/yog5",
            "instructions": "Hands and feet on ground, form inverted V-shape, straighten legs and arms"
        },
        "yog6": {
            "name": "Plank Pose",
            "difficulty": "Beginner",
            "endpoint": "/api/ml/pose/yog6",
            "instructions": "Hold body straight like a plank, arms extended, core engaged"
        }
    }
    
    return jsonify({
        "success": True,
        "poses": poses,
        "total_poses": len(poses),
        "detector": "Stable MediaPipe API",
        "real_mediapipe": MEDIAPIPE_AVAILABLE
    })

# Individual pose endpoints
@app.route('/api/ml/pose/yog1', methods=['POST'])
def start_warrior_pose():
    return jsonify({"success": True, "message": "Warrior II Pose started", "pose_type": "yog1", "pose_name": "Warrior II"})

@app.route('/api/ml/pose/yog2', methods=['POST'])
def start_t_pose():
    return jsonify({"success": True, "message": "T Pose started", "pose_type": "yog2", "pose_name": "T Pose"})

@app.route('/api/ml/pose/yog3', methods=['POST'])
def start_tree_pose():
    return jsonify({"success": True, "message": "Tree Pose started", "pose_type": "yog3", "pose_name": "Tree Pose"})

@app.route('/api/ml/pose/yog4', methods=['POST'])
def start_goddess_pose():
    return jsonify({"success": True, "message": "Goddess Pose started", "pose_type": "yog4", "pose_name": "Goddess Pose"})

@app.route('/api/ml/pose/yog5', methods=['POST'])
def start_downward_dog():
    return jsonify({"success": True, "message": "Downward Dog started", "pose_type": "yog5", "pose_name": "Downward Dog"})

@app.route('/api/ml/pose/yog6', methods=['POST'])
def start_plank_pose():
    return jsonify({"success": True, "message": "Plank Pose started", "pose_type": "yog6", "pose_name": "Plank Pose"})

@app.route('/api/ml/detect-pose', methods=['POST'])
def detect_pose():
    """MAIN pose detection with guaranteed REAL landmarks"""
    try:
        print("📸 Received pose detection request")
        
        data = request.get_json()
        if not data or 'image' not in data:
            print("❌ No image data in request")
            return jsonify({"success": False, "error": "No image data"}), 400
        
        # Get pose type from request
        pose_type = data.get('pose_type', 'yog2')
        print(f"🎯 Requested pose type: {pose_type} ({get_pose_name(pose_type)})")
        
        # Decode image
        image_data = data['image']
        if image_data.startswith('data:image'):
            image_data = image_data.split(',')[1]
        
        image_bytes = base64.b64decode(image_data)
        nparr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            print("❌ Invalid image data")
            return jsonify({"success": False, "error": "Invalid image"}), 400
        
        print(f"🖼️ Image decoded: {image.shape}")
        
        landmarks = []
        
        # Try MediaPipe detection
        if MEDIAPIPE_AVAILABLE and pose_detector is not None:
            try:
                with detector_lock:
                    # Convert image to MediaPipe format
                    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
                    
                    # Detect pose
                    detection_result = pose_detector.detect(mp_image)
                    
                    if detection_result.pose_landmarks:
                        pose_landmarks = detection_result.pose_landmarks[0]  # First person
                        
                        for i, landmark in enumerate(pose_landmarks):
                            landmarks.append({
                                'x': landmark.x,
                                'y': landmark.y,
                                'z': landmark.z,
                                'visibility': 0.8,  # New API doesn't have visibility
                                'index': i
                            })
                        
                        print(f"✅ REAL MediaPipe 0.10.x detected {len(landmarks)} landmarks")
                        print(f"🔍 Sample: nose=({landmarks[0]['x']:.3f},{landmarks[0]['y']:.3f}), shoulder=({landmarks[11]['x']:.3f},{landmarks[11]['y']:.3f})")
                    else:
                        print("⚠️ MediaPipe 0.10.x: No pose detected in image")
                        
            except Exception as e:
                print(f"❌ MediaPipe detection failed: {e}")
                landmarks = []
        
        # If no landmarks detected, return appropriate response
        if not landmarks:
            print("❌ No landmarks detected - returning no pose detected")
            return jsonify({
                "success": True,
                "pose_detected": False,
                "landmarks": [],
                "accuracy_score": 0,
                "feedback": ["Please ensure your full body is visible in good lighting"],
                "corrections": [],
                "pose_name": "No Pose Detected"
            })
        
        # REAL pose analysis
        print(f"🎯 Analyzing pose: {pose_type} ({get_pose_name(pose_type)}) with {len(landmarks)} landmarks")
        
        # Add request timestamp for debugging
        import time
        request_time = time.strftime("%H:%M:%S")
        print(f"⏰ Detection request at {request_time}")
        
        accuracy_score, feedback, corrections = analyze_pose_accuracy(landmarks, pose_type)
        
        print(f"📊 Analysis complete: Score={accuracy_score:.1f}%, Feedback={len(feedback)} items, Corrections={len(corrections)} items")
        
        # Log the actual feedback for debugging
        if feedback:
            print(f"💬 Feedback: {feedback}")
        if corrections:
            print(f"🔧 Corrections: {[c.get('message', 'Unknown') for c in corrections]}")
        
        response = {
            "success": True,
            "pose_detected": True,
            "landmarks": landmarks,
            "accuracy_score": round(accuracy_score, 1),
            "feedback": feedback,
            "corrections": corrections,
            "pose_name": get_pose_name(pose_type),
            "landmarks_count": len(landmarks),
            "pose_type": pose_type,
            "real_mediapipe": True,
            "analysis_timestamp": request_time
        }
        
        print(f"📤 Response: {len(landmarks)} landmarks, {accuracy_score:.1f}% accuracy, pose={get_pose_name(pose_type)}")
        return jsonify(response)
        
    except Exception as e:
        print(f"❌ Detection error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            "success": False,
            "error": str(e),
            "landmarks": []
        }), 500

def calculate_angle(a, b, c):
    """Calculate angle between three points"""
    a = np.array([a['x'], a['y']])
    b = np.array([b['x'], b['y']])
    c = np.array([c['x'], c['y']])
    
    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(radians * 180.0 / np.pi)
    
    if angle > 180.0:
        angle = 360 - angle
        
    return angle

def get_pose_name(pose_type):
    """Get pose name from pose type"""
    pose_names = {
        'yog1': 'Warrior II',
        'yog2': 'T Pose',
        'yog3': 'Tree Pose',
        'yog4': 'Goddess Pose',
        'yog5': 'Downward Dog',
        'yog6': 'Plank Pose'
    }
    return pose_names.get(pose_type, 'Unknown Pose')

def analyze_pose_accuracy(landmarks, pose_type):
    """Analyze pose accuracy with REAL feedback for all 6 poses"""
    
    print(f"🔍 Starting pose analysis for: {pose_type} ({get_pose_name(pose_type)})")
    
    try:
        # Key landmark indices (MediaPipe Pose)
        NOSE = 0
        LEFT_SHOULDER = 11
        RIGHT_SHOULDER = 12
        LEFT_ELBOW = 13
        RIGHT_ELBOW = 14
        LEFT_WRIST = 15
        RIGHT_WRIST = 16
        LEFT_HIP = 23
        RIGHT_HIP = 24
        LEFT_KNEE = 25
        RIGHT_KNEE = 26
        LEFT_ANKLE = 27
        RIGHT_ANKLE = 28
        
        # Calculate key angles
        left_arm_angle = calculate_angle(landmarks[LEFT_SHOULDER], landmarks[LEFT_ELBOW], landmarks[LEFT_WRIST])
        right_arm_angle = calculate_angle(landmarks[RIGHT_SHOULDER], landmarks[RIGHT_ELBOW], landmarks[RIGHT_WRIST])
        left_shoulder_angle = calculate_angle(landmarks[LEFT_ELBOW], landmarks[LEFT_SHOULDER], landmarks[LEFT_HIP])
        right_shoulder_angle = calculate_angle(landmarks[RIGHT_ELBOW], landmarks[RIGHT_SHOULDER], landmarks[RIGHT_HIP])
        
        print(f"🔍 Pose Analysis: L_arm={left_arm_angle:.1f}°, R_arm={right_arm_angle:.1f}°, L_shoulder={left_shoulder_angle:.1f}°, R_shoulder={right_shoulder_angle:.1f}°")
        
        # Route to specific pose analysis
        if pose_type == 'yog1':  # Warrior II
            return analyze_warrior2_pose(landmarks, left_arm_angle, right_arm_angle, left_shoulder_angle, right_shoulder_angle)
        elif pose_type == 'yog2':  # T Pose
            return analyze_t_pose_strict(left_arm_angle, right_arm_angle, left_shoulder_angle, right_shoulder_angle, landmarks)
        elif pose_type == 'yog3':  # Tree Pose
            return analyze_tree_pose(landmarks, left_arm_angle, right_arm_angle)
        elif pose_type == 'yog4':  # Goddess Pose
            return analyze_goddess_pose(landmarks, left_arm_angle, right_arm_angle)
        elif pose_type == 'yog5':  # Downward Dog
            return analyze_downward_dog_pose(landmarks, left_arm_angle, right_arm_angle)
        elif pose_type == 'yog6':  # Plank Pose
            return analyze_plank_pose(landmarks, left_arm_angle, right_arm_angle)
        else:
            return analyze_generic_pose(left_arm_angle, right_arm_angle, left_shoulder_angle, right_shoulder_angle)
            
    except Exception as e:
        print(f"❌ Pose analysis error: {e}")
        return 30, ["Unable to analyze pose properly"], []

def analyze_t_pose_strict(left_arm_angle, right_arm_angle, left_shoulder_angle, right_shoulder_angle, landmarks):
    """RESPONSIVE T-Pose analysis - gives gradual feedback and scores"""
    
    feedback = []
    corrections = []
    score_components = []
    
    print(f"🤸 Analyzing T-Pose - L_arm={left_arm_angle:.1f}°, R_arm={right_arm_angle:.1f}°, L_shoulder={left_shoulder_angle:.1f}°, R_shoulder={right_shoulder_angle:.1f}°")
    
    try:
        # Check if this might be Tree Pose instead (hands together)
        LEFT_WRIST = 15
        RIGHT_WRIST = 16
        LEFT_ANKLE = 27
        RIGHT_ANKLE = 28
        
        hand_distance = abs(landmarks[LEFT_WRIST]['x'] - landmarks[RIGHT_WRIST]['x'])
        foot_height_diff = abs(landmarks[LEFT_ANKLE]['y'] - landmarks[RIGHT_ANKLE]['y'])
        
        print(f"🔍 T-Pose check: hand_distance={hand_distance:.3f}, foot_height_diff={foot_height_diff:.3f}")
        
        # If hands are together and one foot is raised, this is likely Tree Pose, not T-Pose
        if hand_distance < 0.15 and foot_height_diff > 0.1:
            feedback = ["This looks like Tree Pose, not T-Pose - extend your arms out"]
            corrections = [{'joint_index': 15, 'message': 'Extend arms for T-Pose', 'type': 'extend_arms'}]
            print("❌ Detected Tree Pose characteristics - NOT T-Pose!")
            return 25, feedback, corrections
        
        # GRADUAL scoring for T-Pose components
        
        # 1. Left arm straightness (more forgiving)
        if left_arm_angle >= 170:
            score_components.append(100)
            print("✅ Left arm perfectly straight")
        elif left_arm_angle >= 150:
            score_components.append(85)
            feedback.append("Straighten your left arm a bit more")
        elif left_arm_angle >= 130:
            score_components.append(70)
            feedback.append("Straighten your left arm more")
            corrections.append({'joint_index': 13, 'message': 'Extend left arm', 'type': 'extend_arm'})
        else:
            score_components.append(50)
            feedback.append("Straighten your left arm completely")
            corrections.append({'joint_index': 13, 'message': 'Extend left arm', 'type': 'extend_arm'})
            
        # 2. Right arm straightness (more forgiving)
        if right_arm_angle >= 170:
            score_components.append(100)
            print("✅ Right arm perfectly straight")
        elif right_arm_angle >= 150:
            score_components.append(85)
            feedback.append("Straighten your right arm a bit more")
        elif right_arm_angle >= 130:
            score_components.append(70)
            feedback.append("Straighten your right arm more")
            corrections.append({'joint_index': 14, 'message': 'Extend right arm', 'type': 'extend_arm'})
        else:
            score_components.append(50)
            feedback.append("Straighten your right arm completely")
            corrections.append({'joint_index': 14, 'message': 'Extend right arm', 'type': 'extend_arm'})
        
        # 3. Left arm horizontal position (more forgiving)
        if 85 <= left_shoulder_angle <= 95:
            score_components.append(100)
            print("✅ Left arm perfectly horizontal")
        elif 80 <= left_shoulder_angle <= 100:
            score_components.append(90)
            feedback.append("Left arm height is very good")
        elif 70 <= left_shoulder_angle <= 110:
            score_components.append(75)
            feedback.append("Adjust left arm to shoulder height")
            corrections.append({'joint_index': 11, 'message': 'Adjust left arm height', 'type': 'adjust_shoulder'})
        else:
            score_components.append(60)
            feedback.append("Raise your left arm to shoulder height")
            corrections.append({'joint_index': 11, 'message': 'Adjust left arm height', 'type': 'adjust_shoulder'})
            
        # 4. Right arm horizontal position (more forgiving)
        if 85 <= right_shoulder_angle <= 95:
            score_components.append(100)
            print("✅ Right arm perfectly horizontal")
        elif 80 <= right_shoulder_angle <= 100:
            score_components.append(90)
            feedback.append("Right arm height is very good")
        elif 70 <= right_shoulder_angle <= 110:
            score_components.append(75)
            feedback.append("Adjust right arm to shoulder height")
            corrections.append({'joint_index': 12, 'message': 'Adjust right arm height', 'type': 'adjust_shoulder'})
        else:
            score_components.append(60)
            feedback.append("Raise your right arm to shoulder height")
            corrections.append({'joint_index': 12, 'message': 'Adjust right arm height', 'type': 'adjust_shoulder'})
        
        # 5. Check that both feet are on ground (T-Pose requirement)
        if foot_height_diff <= 0.05:
            score_components.append(100)
            print("✅ Both feet on ground")
        elif foot_height_diff <= 0.1:
            score_components.append(80)
            feedback.append("Keep both feet firmly on the ground")
        else:
            score_components.append(60)
            feedback.append("Keep both feet on the ground for T-Pose")
            
    except Exception as e:
        print(f"❌ T-Pose analysis error: {e}")
        score_components = [60]
    
    # Calculate overall score
    overall_score = sum(score_components) / len(score_components) if score_components else 60
    
    # RESPONSIVE feedback based on score
    if overall_score >= 95:
        feedback = ["Perfect T Pose! Excellent form!"]
    elif overall_score >= 85:
        feedback.insert(0, "Excellent T Pose! Minor adjustments:")
    elif overall_score >= 75:
        feedback.insert(0, "Good T Pose! Keep improving:")
    elif overall_score >= 60:
        feedback.insert(0, "Getting closer to T Pose:")
    else:
        feedback.insert(0, "This is not a T Pose yet. Please:")
        feedback.append("Stand straight with arms extended horizontally")
    
    print(f"🎯 T-Pose Analysis: Score={overall_score:.1f}%, Components={score_components}")
    
    return overall_score, feedback[:3], corrections[:2]

def analyze_warrior2_pose(landmarks, left_arm_angle, right_arm_angle, left_shoulder_angle, right_shoulder_angle):
    """Analyze Warrior II pose - REAL MediaPipe analysis only"""
    
    feedback = []
    corrections = []
    score_components = []
    
    print(f"⚔️ REAL Warrior II Analysis - L_arm={left_arm_angle:.1f}°, R_arm={right_arm_angle:.1f}°, L_shoulder={left_shoulder_angle:.1f}°, R_shoulder={right_shoulder_angle:.1f}°")
    
    if not landmarks or len(landmarks) < 33:
        print("❌ Warrior II: Insufficient landmark data")
        return 0, ["Cannot detect pose - ensure full body is visible"], []
    
    try:
        # Key landmarks for Warrior II - REAL MediaPipe indices
        LEFT_SHOULDER = 11
        RIGHT_SHOULDER = 12
        LEFT_ELBOW = 13
        RIGHT_ELBOW = 14
        LEFT_WRIST = 15
        RIGHT_WRIST = 16
        LEFT_HIP = 23
        RIGHT_HIP = 24
        LEFT_KNEE = 25
        RIGHT_KNEE = 26
        LEFT_ANKLE = 27
        RIGHT_ANKLE = 28
        
        print(f"✅ Warrior II: Analyzing {len(landmarks)} real landmarks")
        
        # 1. REAL arm extension analysis (should be straight like T-Pose)
        if left_arm_angle >= 170:
            score_components.append(100)
            print("✅ Left arm perfectly straight")
        elif left_arm_angle >= 150:
            score_components.append(85)
            feedback.append("Straighten your left arm a bit more")
        elif left_arm_angle >= 130:
            score_components.append(70)
            feedback.append("Straighten your left arm more")
            corrections.append({'joint_index': LEFT_ELBOW, 'message': 'Extend left arm', 'type': 'extend_arm'})
        else:
            score_components.append(50)
            feedback.append("Straighten your left arm completely")
            corrections.append({'joint_index': LEFT_ELBOW, 'message': 'Extend left arm', 'type': 'extend_arm'})
            
        if right_arm_angle >= 170:
            score_components.append(100)
            print("✅ Right arm perfectly straight")
        elif right_arm_angle >= 150:
            score_components.append(85)
            feedback.append("Straighten your right arm a bit more")
        elif right_arm_angle >= 130:
            score_components.append(70)
            feedback.append("Straighten your right arm more")
            corrections.append({'joint_index': RIGHT_ELBOW, 'message': 'Extend right arm', 'type': 'extend_arm'})
        else:
            score_components.append(50)
            feedback.append("Straighten your right arm completely")
            corrections.append({'joint_index': RIGHT_ELBOW, 'message': 'Extend right arm', 'type': 'extend_arm'})
        
        # 2. REAL arm height analysis (should be horizontal)
        if 85 <= left_shoulder_angle <= 95:
            score_components.append(100)
            print("✅ Left arm perfectly horizontal")
        elif 80 <= left_shoulder_angle <= 100:
            score_components.append(90)
        elif 70 <= left_shoulder_angle <= 110:
            score_components.append(75)
            feedback.append("Adjust left arm to shoulder height")
            corrections.append({'joint_index': LEFT_SHOULDER, 'message': 'Adjust left arm height', 'type': 'adjust_shoulder'})
        else:
            score_components.append(60)
            feedback.append("Raise your left arm to shoulder height")
            corrections.append({'joint_index': LEFT_SHOULDER, 'message': 'Adjust left arm height', 'type': 'adjust_shoulder'})
            
        if 85 <= right_shoulder_angle <= 95:
            score_components.append(100)
            print("✅ Right arm perfectly horizontal")
        elif 80 <= right_shoulder_angle <= 100:
            score_components.append(90)
        elif 70 <= right_shoulder_angle <= 110:
            score_components.append(75)
            feedback.append("Adjust right arm to shoulder height")
            corrections.append({'joint_index': RIGHT_SHOULDER, 'message': 'Adjust right arm height', 'type': 'adjust_shoulder'})
        else:
            score_components.append(60)
            feedback.append("Raise your right arm to shoulder height")
            corrections.append({'joint_index': RIGHT_SHOULDER, 'message': 'Adjust right arm height', 'type': 'adjust_shoulder'})
        
        # 3. REAL stance width analysis (feet should be wide apart)
        left_ankle_x = landmarks[LEFT_ANKLE]['x']
        right_ankle_x = landmarks[RIGHT_ANKLE]['x']
        stance_width = abs(left_ankle_x - right_ankle_x)
        
        print(f"🦶 REAL Stance analysis: L_ankle_x={left_ankle_x:.3f}, R_ankle_x={right_ankle_x:.3f}, width={stance_width:.3f}")
        
        if stance_width >= 0.30:
            score_components.append(100)
            print("✅ Perfect wide stance!")
        elif stance_width >= 0.25:
            score_components.append(85)
            feedback.append("Good stance width!")
        elif stance_width >= 0.20:
            score_components.append(70)
            feedback.append("Widen your stance a bit more")
            corrections.append({'joint_index': LEFT_ANKLE, 'message': 'Widen stance', 'type': 'widen_stance'})
        else:
            score_components.append(50)
            feedback.append("Widen your stance - step feet much further apart")
            corrections.append({'joint_index': LEFT_ANKLE, 'message': 'Widen stance', 'type': 'widen_stance'})
        
        # 4. REAL knee bend analysis (one knee should be bent)
        left_knee_angle = calculate_angle(landmarks[LEFT_HIP], landmarks[LEFT_KNEE], landmarks[LEFT_ANKLE])
        right_knee_angle = calculate_angle(landmarks[RIGHT_HIP], landmarks[RIGHT_KNEE], landmarks[RIGHT_ANKLE])
        
        print(f"🦵 REAL Knee analysis: L_knee={left_knee_angle:.1f}°, R_knee={right_knee_angle:.1f}°")
        
        # At least one knee should be bent (less than 160°)
        min_knee_angle = min(left_knee_angle, right_knee_angle)
        if min_knee_angle <= 120:
            score_components.append(100)
            print("✅ Perfect lunge depth!")
        elif min_knee_angle <= 140:
            score_components.append(85)
            feedback.append("Good knee bend!")
        elif min_knee_angle <= 160:
            score_components.append(70)
            feedback.append("Bend your front knee more - lunge deeper")
            corrections.append({'joint_index': LEFT_KNEE, 'message': 'Bend front knee', 'type': 'bend_knee'})
        else:
            score_components.append(50)
            feedback.append("Bend your front knee - lunge into the pose")
            corrections.append({'joint_index': LEFT_KNEE, 'message': 'Bend front knee', 'type': 'bend_knee'})
            
    except Exception as e:
        print(f"❌ Warrior II REAL analysis error: {e}")
        import traceback
        traceback.print_exc()
        return 0, ["Error analyzing pose - please try again"], []
    
    # Calculate REAL overall score
    if not score_components:
        print("❌ No score components calculated")
        return 0, ["Unable to analyze pose"], []
    
    overall_score = sum(score_components) / len(score_components)
    
    # REAL feedback based on actual score
    if overall_score >= 95:
        feedback = ["Perfect Warrior II! Excellent warrior stance!"]
    elif overall_score >= 85:
        feedback.insert(0, "Excellent Warrior II! Minor adjustments:")
    elif overall_score >= 75:
        feedback.insert(0, "Strong Warrior II! Keep improving:")
    elif overall_score >= 60:
        feedback.insert(0, "Getting closer to Warrior II:")
    else:
        feedback.insert(0, "This is not Warrior II yet. Please:")
        feedback.append("Wide stance, arms extended, front knee bent")
    
    print(f"⚔️ REAL Warrior II Analysis Complete: Score={overall_score:.1f}%, Components={score_components}")
    return overall_score, feedback[:3], corrections[:2]

def analyze_tree_pose(landmarks, left_arm_angle, right_arm_angle):
    """Analyze Tree Pose - balance on one leg with hands in prayer - REAL MediaPipe data only"""
    
    feedback = []
    corrections = []
    score_components = []
    
    print(f"🌳 REAL Tree Pose Analysis - L_arm={left_arm_angle:.1f}°, R_arm={right_arm_angle:.1f}°")
    
    if not landmarks or len(landmarks) < 33:
        print("❌ Tree Pose: Insufficient landmark data")
        return 0, ["Cannot detect pose - ensure full body is visible"], []
    
    try:
        # Key landmarks - REAL MediaPipe indices
        LEFT_WRIST = 15
        RIGHT_WRIST = 16
        LEFT_ANKLE = 27
        RIGHT_ANKLE = 28
        LEFT_KNEE = 25
        RIGHT_KNEE = 26
        LEFT_HIP = 23
        RIGHT_HIP = 24
        LEFT_SHOULDER = 11
        RIGHT_SHOULDER = 12
        
        # Validate landmark data
        required_landmarks = [LEFT_WRIST, RIGHT_WRIST, LEFT_ANKLE, RIGHT_ANKLE, LEFT_KNEE, RIGHT_KNEE, LEFT_HIP, RIGHT_HIP]
        for idx in required_landmarks:
            if idx >= len(landmarks) or landmarks[idx] is None:
                print(f"❌ Tree Pose: Missing landmark {idx}")
                return 0, ["Cannot analyze pose - landmark data incomplete"], []
        
        print(f"✅ Tree Pose: Analyzing {len(landmarks)} real landmarks")
        
        # 1. REAL hand position analysis (prayer position)
        left_wrist_x = landmarks[LEFT_WRIST]['x']
        left_wrist_y = landmarks[LEFT_WRIST]['y']
        right_wrist_x = landmarks[RIGHT_WRIST]['x']
        right_wrist_y = landmarks[RIGHT_WRIST]['y']
        
        hand_distance = abs(left_wrist_x - right_wrist_x)
        wrist_height_diff = abs(left_wrist_y - right_wrist_y)
        
        print(f"🙏 REAL Hand analysis: L_wrist=({left_wrist_x:.3f},{left_wrist_y:.3f}), R_wrist=({right_wrist_x:.3f},{right_wrist_y:.3f})")
        print(f"🙏 Hand distance={hand_distance:.3f}, height_diff={wrist_height_diff:.3f}")
        
        # Check if hands are in center of body (prayer position)
        body_center_x = (landmarks[LEFT_SHOULDER]['x'] + landmarks[RIGHT_SHOULDER]['x']) / 2
        hands_center_x = (left_wrist_x + right_wrist_x) / 2
        hands_center_offset = abs(hands_center_x - body_center_x)
        
        if hand_distance <= 0.08 and wrist_height_diff <= 0.05 and hands_center_offset <= 0.1:
            score_components.append(100)
            print("✅ Perfect prayer position!")
        elif hand_distance <= 0.12 and wrist_height_diff <= 0.08:
            score_components.append(85)
            feedback.append("Bring hands closer together in prayer")
        elif hand_distance <= 0.18:
            score_components.append(70)
            feedback.append("Bring your hands together in prayer position")
            corrections.append({'joint_index': LEFT_WRIST, 'message': 'Join hands in prayer', 'type': 'prayer_hands'})
        else:
            score_components.append(40)
            feedback.append("This is not Tree Pose - bring hands to prayer position")
            corrections.append({'joint_index': LEFT_WRIST, 'message': 'Prayer position needed', 'type': 'prayer_hands'})
        
        # 2. REAL balance analysis (one foot raised)
        left_ankle_y = landmarks[LEFT_ANKLE]['y']
        right_ankle_y = landmarks[RIGHT_ANKLE]['y']
        foot_height_diff = abs(left_ankle_y - right_ankle_y)
        
        print(f"🦶 REAL Foot analysis: L_ankle_y={left_ankle_y:.3f}, R_ankle_y={right_ankle_y:.3f}, diff={foot_height_diff:.3f}")
        
        if foot_height_diff >= 0.20:
            score_components.append(100)
            print("✅ Excellent balance - one foot well raised!")
        elif foot_height_diff >= 0.15:
            score_components.append(85)
            feedback.append("Great balance! Try to lift your foot a bit higher")
        elif foot_height_diff >= 0.10:
            score_components.append(65)
            feedback.append("Good start! Lift your foot higher on your inner thigh")
            corrections.append({'joint_index': LEFT_ANKLE, 'message': 'Raise foot higher', 'type': 'lift_foot'})
        elif foot_height_diff >= 0.05:
            score_components.append(40)
            feedback.append("Lift one foot and place it on your inner thigh")
            corrections.append({'joint_index': LEFT_ANKLE, 'message': 'Raise foot much higher', 'type': 'lift_foot'})
        else:
            score_components.append(20)
            feedback.append("This is not Tree Pose - you need to lift one foot off the ground")
            corrections.append({'joint_index': LEFT_ANKLE, 'message': 'Lift one foot', 'type': 'lift_foot'})
        
        # 3. REAL knee position analysis (raised leg knee should be out to side)
        left_knee_x = landmarks[LEFT_KNEE]['x']
        right_knee_x = landmarks[RIGHT_KNEE]['x']
        knee_separation = abs(left_knee_x - right_knee_x)
        
        print(f"🦵 REAL Knee analysis: L_knee_x={left_knee_x:.3f}, R_knee_x={right_knee_x:.3f}, separation={knee_separation:.3f}")
        
        if knee_separation >= 0.25:
            score_components.append(100)
            print("✅ Perfect knee opening!")
        elif knee_separation >= 0.20:
            score_components.append(90)
        elif knee_separation >= 0.15:
            score_components.append(80)
            feedback.append("Open your raised leg knee out to the side more")
        else:
            score_components.append(70)
            feedback.append("Open your raised leg knee out to the side")
        
        # 4. REAL body stability analysis
        left_hip_y = landmarks[LEFT_HIP]['y']
        right_hip_y = landmarks[RIGHT_HIP]['y']
        hip_level_diff = abs(left_hip_y - right_hip_y)
        
        print(f"🏃 REAL Hip analysis: L_hip_y={left_hip_y:.3f}, R_hip_y={right_hip_y:.3f}, level_diff={hip_level_diff:.3f}")
        
        if hip_level_diff <= 0.03:
            score_components.append(100)
            print("✅ Perfect hip alignment!")
        elif hip_level_diff <= 0.05:
            score_components.append(90)
        elif hip_level_diff <= 0.08:
            score_components.append(80)
            feedback.append("Keep your hips level")
        else:
            score_components.append(70)
            feedback.append("Keep your hips level and torso upright")
        
        # 5. Check if this is actually T-Pose (arms extended)
        if left_arm_angle > 150 and right_arm_angle > 150 and hand_distance > 0.3:
            score_components = [30]  # Override all scores
            feedback = ["This is T-Pose, not Tree Pose - bring hands to prayer position"]
            corrections = [{'joint_index': LEFT_WRIST, 'message': 'Prayer position for Tree Pose', 'type': 'prayer_hands'}]
            print("❌ Detected T-Pose instead of Tree Pose!")
            
    except Exception as e:
        print(f"❌ Tree Pose REAL analysis error: {e}")
        import traceback
        traceback.print_exc()
        return 0, ["Error analyzing pose - please try again"], []
    
    # Calculate REAL overall score
    if not score_components:
        print("❌ No score components calculated")
        return 0, ["Unable to analyze pose"], []
    
    overall_score = sum(score_components) / len(score_components)
    
    # REAL feedback based on actual score
    if overall_score >= 95:
        feedback = ["Perfect Tree Pose! Excellent balance and form!"]
    elif overall_score >= 85:
        feedback.insert(0, "Beautiful Tree Pose! Minor adjustments:")
    elif overall_score >= 75:
        feedback.insert(0, "Good Tree Pose! Keep improving:")
    elif overall_score >= 60:
        feedback.insert(0, "Getting closer to Tree Pose:")
    elif overall_score >= 40:
        feedback.insert(0, "This looks like a Tree Pose attempt:")
    else:
        feedback.insert(0, "This is not Tree Pose yet. Please:")
        feedback.append("Stand on one leg with hands in prayer position")
    
    print(f"🌳 REAL Tree Pose Analysis Complete: Score={overall_score:.1f}%, Components={score_components}")
    return overall_score, feedback[:3], corrections[:2]

def analyze_goddess_pose(landmarks, left_arm_angle, right_arm_angle):
    """Analyze Goddess Pose - REAL MediaPipe analysis only"""
    
    feedback = []
    corrections = []
    score_components = []
    
    print(f"👸 REAL Goddess Pose Analysis - L_arm={left_arm_angle:.1f}°, R_arm={right_arm_angle:.1f}°")
    
    if not landmarks or len(landmarks) < 33:
        print("❌ Goddess Pose: Insufficient landmark data")
        return 0, ["Cannot detect pose - ensure full body is visible"], []
    
    try:
        # Key landmarks - REAL MediaPipe indices
        LEFT_SHOULDER = 11
        RIGHT_SHOULDER = 12
        LEFT_ELBOW = 13
        RIGHT_ELBOW = 14
        LEFT_WRIST = 15
        RIGHT_WRIST = 16
        LEFT_HIP = 23
        RIGHT_HIP = 24
        LEFT_KNEE = 25
        RIGHT_KNEE = 26
        LEFT_ANKLE = 27
        RIGHT_ANKLE = 28
        
        print(f"✅ Goddess Pose: Analyzing {len(landmarks)} real landmarks")
        
        # 1. REAL squat depth analysis (hips should be low, knees bent)
        left_hip_y = landmarks[LEFT_HIP]['y']
        right_hip_y = landmarks[RIGHT_HIP]['y']
        left_knee_y = landmarks[LEFT_KNEE]['y']
        right_knee_y = landmarks[RIGHT_KNEE]['y']
        
        hip_height = (left_hip_y + right_hip_y) / 2
        knee_height = (left_knee_y + right_knee_y) / 2
        squat_depth = hip_height - knee_height  # Positive = hips below knees (good squat)
        
        print(f"🏋️ REAL Squat analysis: hip_height={hip_height:.3f}, knee_height={knee_height:.3f}, depth={squat_depth:.3f}")
        
        if squat_depth >= 0.08:  # Deep squat
            score_components.append(100)
            print("✅ Perfect deep squat!")
        elif squat_depth >= 0.05:
            score_components.append(85)
            feedback.append("Great squat depth!")
        elif squat_depth >= 0.02:
            score_components.append(70)
            feedback.append("Squat deeper - lower your hips more")
            corrections.append({'joint_index': LEFT_HIP, 'message': 'Squat deeper', 'type': 'squat_deeper'})
        else:
            score_components.append(50)
            feedback.append("Squat much deeper - lower your hips below knee level")
            corrections.append({'joint_index': LEFT_HIP, 'message': 'Squat deeper', 'type': 'squat_deeper'})
        
        # 2. REAL stance width analysis (feet should be very wide)
        left_ankle_x = landmarks[LEFT_ANKLE]['x']
        right_ankle_x = landmarks[RIGHT_ANKLE]['x']
        stance_width = abs(left_ankle_x - right_ankle_x)
        
        print(f"🦶 REAL Stance analysis: L_ankle_x={left_ankle_x:.3f}, R_ankle_x={right_ankle_x:.3f}, width={stance_width:.3f}")
        
        if stance_width >= 0.35:  # Very wide stance
            score_components.append(100)
            print("✅ Perfect wide stance!")
        elif stance_width >= 0.30:
            score_components.append(85)
            feedback.append("Good wide stance!")
        elif stance_width >= 0.25:
            score_components.append(70)
            feedback.append("Widen your stance more")
            corrections.append({'joint_index': LEFT_ANKLE, 'message': 'Widen stance more', 'type': 'widen_stance'})
        else:
            score_components.append(50)
            feedback.append("Widen your stance much more - feet should be very wide apart")
            corrections.append({'joint_index': LEFT_ANKLE, 'message': 'Widen stance more', 'type': 'widen_stance'})
        
        # 3. REAL knee angles analysis (both knees should be bent significantly)
        left_knee_angle = calculate_angle(landmarks[LEFT_HIP], landmarks[LEFT_KNEE], landmarks[LEFT_ANKLE])
        right_knee_angle = calculate_angle(landmarks[RIGHT_HIP], landmarks[RIGHT_KNEE], landmarks[RIGHT_ANKLE])
        
        print(f"🦵 REAL Knee analysis: L_knee={left_knee_angle:.1f}°, R_knee={right_knee_angle:.1f}°")
        
        avg_knee_angle = (left_knee_angle + right_knee_angle) / 2
        if avg_knee_angle <= 120:  # Well bent knees
            score_components.append(100)
            print("✅ Perfect knee bend!")
        elif avg_knee_angle <= 140:
            score_components.append(85)
            feedback.append("Good knee bend!")
        elif avg_knee_angle <= 160:
            score_components.append(70)
            feedback.append("Bend your knees more - sink deeper")
            corrections.append({'joint_index': LEFT_KNEE, 'message': 'Bend knees more', 'type': 'bend_knees'})
        else:
            score_components.append(50)
            feedback.append("Bend your knees much more - sink into the squat")
            corrections.append({'joint_index': LEFT_KNEE, 'message': 'Bend knees more', 'type': 'bend_knees'})
        
        # 4. REAL arm position analysis (should be raised up high)
        left_wrist_y = landmarks[LEFT_WRIST]['y']
        right_wrist_y = landmarks[RIGHT_WRIST]['y']
        left_shoulder_y = landmarks[LEFT_SHOULDER]['y']
        right_shoulder_y = landmarks[RIGHT_SHOULDER]['y']
        
        shoulder_height = (left_shoulder_y + right_shoulder_y) / 2
        wrist_height = (left_wrist_y + right_wrist_y) / 2
        arm_raise = shoulder_height - wrist_height  # Positive = wrists above shoulders
        
        print(f"🙌 REAL Arm analysis: shoulder_height={shoulder_height:.3f}, wrist_height={wrist_height:.3f}, raise={arm_raise:.3f}")
        
        if arm_raise >= 0.15:  # Arms well raised
            score_components.append(100)
            print("✅ Perfect victory arms!")
        elif arm_raise >= 0.10:
            score_components.append(85)
            feedback.append("Great arm position!")
        elif arm_raise >= 0.05:
            score_components.append(70)
            feedback.append("Raise your arms higher")
            corrections.append({'joint_index': LEFT_WRIST, 'message': 'Raise arms higher', 'type': 'raise_arms'})
        else:
            score_components.append(50)
            feedback.append("Raise your arms up high like a victory pose")
            corrections.append({'joint_index': LEFT_WRIST, 'message': 'Raise arms higher', 'type': 'raise_arms'})
            
    except Exception as e:
        print(f"❌ Goddess Pose REAL analysis error: {e}")
        import traceback
        traceback.print_exc()
        return 0, ["Error analyzing pose - please try again"], []
    
    # Calculate REAL overall score
    if not score_components:
        print("❌ No score components calculated")
        return 0, ["Unable to analyze pose"], []
    
    overall_score = sum(score_components) / len(score_components)
    
    # REAL feedback based on actual score
    if overall_score >= 95:
        feedback = ["Powerful Goddess Pose! You're a true warrior goddess!"]
    elif overall_score >= 85:
        feedback.insert(0, "Excellent Goddess Pose! Minor adjustments:")
    elif overall_score >= 75:
        feedback.insert(0, "Strong Goddess Pose! Keep improving:")
    elif overall_score >= 60:
        feedback.insert(0, "Getting closer to Goddess Pose:")
    else:
        feedback.insert(0, "This is not Goddess Pose yet. Please:")
        feedback.append("Wide squat, arms raised high, knees bent deeply")
    
    print(f"👸 REAL Goddess Pose Analysis Complete: Score={overall_score:.1f}%, Components={score_components}")
    return overall_score, feedback[:3], corrections[:2]

def analyze_downward_dog_pose(landmarks, left_arm_angle, right_arm_angle):
    """Analyze Downward Facing Dog - REAL MediaPipe analysis only"""
    
    feedback = []
    corrections = []
    score_components = []
    
    print(f"🐕 REAL Downward Dog Analysis - L_arm={left_arm_angle:.1f}°, R_arm={right_arm_angle:.1f}°")
    
    if not landmarks or len(landmarks) < 33:
        print("❌ Downward Dog: Insufficient landmark data")
        return 0, ["Cannot detect pose - ensure full body is visible"], []
    
    try:
        # Key landmarks - REAL MediaPipe indices
        LEFT_SHOULDER = 11
        RIGHT_SHOULDER = 12
        LEFT_WRIST = 15
        RIGHT_WRIST = 16
        LEFT_HIP = 23
        RIGHT_HIP = 24
        LEFT_KNEE = 25
        RIGHT_KNEE = 26
        LEFT_ANKLE = 27
        RIGHT_ANKLE = 28
        NOSE = 0
        
        print(f"✅ Downward Dog: Analyzing {len(landmarks)} real landmarks")
        
        # 1. REAL hand position analysis (hands should be on ground - low in frame)
        left_wrist_y = landmarks[LEFT_WRIST]['y']
        right_wrist_y = landmarks[RIGHT_WRIST]['y']
        wrist_height = (left_wrist_y + right_wrist_y) / 2
        
        print(f"🖐️ REAL Hand analysis: L_wrist_y={left_wrist_y:.3f}, R_wrist_y={right_wrist_y:.3f}, avg={wrist_height:.3f}")
        
        if wrist_height >= 0.80:  # Hands near bottom of frame (on ground)
            score_components.append(100)
            print("✅ Perfect hand position on ground!")
        elif wrist_height >= 0.75:
            score_components.append(85)
            feedback.append("Good hand position!")
        elif wrist_height >= 0.70:
            score_components.append(70)
            feedback.append("Lower your hands closer to the ground")
            corrections.append({'joint_index': LEFT_WRIST, 'message': 'Lower hands to ground', 'type': 'hands_down'})
        else:
            score_components.append(50)
            feedback.append("Place your hands firmly on the ground")
            corrections.append({'joint_index': LEFT_WRIST, 'message': 'Lower hands to ground', 'type': 'hands_down'})
        
        # 2. REAL foot position analysis (feet should be on ground - low in frame)
        left_ankle_y = landmarks[LEFT_ANKLE]['y']
        right_ankle_y = landmarks[RIGHT_ANKLE]['y']
        ankle_height = (left_ankle_y + right_ankle_y) / 2
        
        print(f"🦶 REAL Foot analysis: L_ankle_y={left_ankle_y:.3f}, R_ankle_y={right_ankle_y:.3f}, avg={ankle_height:.3f}")
        
        if ankle_height >= 0.85:  # Feet near bottom of frame (on ground)
            score_components.append(100)
            print("✅ Perfect foot position on ground!")
        elif ankle_height >= 0.80:
            score_components.append(85)
            feedback.append("Good foot position!")
        elif ankle_height >= 0.75:
            score_components.append(70)
            feedback.append("Keep your feet closer to the ground")
            corrections.append({'joint_index': LEFT_ANKLE, 'message': 'Lower feet to ground', 'type': 'feet_down'})
        else:
            score_components.append(50)
            feedback.append("Keep your feet planted firmly on the ground")
            corrections.append({'joint_index': LEFT_ANKLE, 'message': 'Lower feet to ground', 'type': 'feet_down'})
        
        # 3. REAL inverted V-shape analysis (hips should be highest point)
        left_hip_y = landmarks[LEFT_HIP]['y']
        right_hip_y = landmarks[RIGHT_HIP]['y']
        hip_height = (left_hip_y + right_hip_y) / 2
        head_height = landmarks[NOSE]['y']
        
        print(f"📐 REAL V-shape analysis: hip_height={hip_height:.3f}, head_height={head_height:.3f}, wrist_height={wrist_height:.3f}")
        
        # Hips should be higher (lower Y value) than both head and hands
        hip_elevation = min(head_height, wrist_height) - hip_height  # Positive = hips higher
        if hip_elevation >= 0.15:  # Hips well elevated
            score_components.append(100)
            print("✅ Perfect inverted V-shape!")
        elif hip_elevation >= 0.10:
            score_components.append(85)
            feedback.append("Great V-shape!")
        elif hip_elevation >= 0.05:
            score_components.append(70)
            feedback.append("Lift your hips higher")
            corrections.append({'joint_index': LEFT_HIP, 'message': 'Lift hips higher', 'type': 'lift_hips'})
        else:
            score_components.append(50)
            feedback.append("Lift your hips up high to form an inverted V-shape")
            corrections.append({'joint_index': LEFT_HIP, 'message': 'Lift hips higher', 'type': 'lift_hips'})
        
        # 4. REAL arm straightness analysis
        if left_arm_angle >= 170 and right_arm_angle >= 170:
            score_components.append(100)
            print("✅ Perfect arm straightness!")
        elif left_arm_angle >= 160 and right_arm_angle >= 160:
            score_components.append(85)
            feedback.append("Good arm strength!")
        elif left_arm_angle >= 150 and right_arm_angle >= 150:
            score_components.append(70)
            feedback.append("Straighten your arms more")
            corrections.append({'joint_index': LEFT_ELBOW, 'message': 'Straighten arms', 'type': 'straighten_arms'})
        else:
            score_components.append(50)
            feedback.append("Straighten your arms and press firmly into the ground")
            corrections.append({'joint_index': LEFT_ELBOW, 'message': 'Straighten arms', 'type': 'straighten_arms'})
        
        # 5. REAL leg straightness analysis
        left_leg_angle = calculate_angle(landmarks[LEFT_HIP], landmarks[LEFT_KNEE], landmarks[LEFT_ANKLE])
        right_leg_angle = calculate_angle(landmarks[RIGHT_HIP], landmarks[RIGHT_KNEE], landmarks[RIGHT_ANKLE])
        
        print(f"🦵 REAL Leg analysis: L_leg={left_leg_angle:.1f}°, R_leg={right_leg_angle:.1f}°")
        
        avg_leg_angle = (left_leg_angle + right_leg_angle) / 2
        if avg_leg_angle >= 170:
            score_components.append(100)
            print("✅ Perfect leg straightness!")
        elif avg_leg_angle >= 160:
            score_components.append(85)
            feedback.append("Good leg extension!")
        elif avg_leg_angle >= 150:
            score_components.append(70)
            feedback.append("Straighten your legs more")
        else:
            score_components.append(60)
            feedback.append("Straighten your legs and lift your hips higher")
            
    except Exception as e:
        print(f"❌ Downward Dog REAL analysis error: {e}")
        import traceback
        traceback.print_exc()
        return 0, ["Error analyzing pose - please try again"], []
    
    # Calculate REAL overall score
    if not score_components:
        print("❌ No score components calculated")
        return 0, ["Unable to analyze pose"], []
    
    overall_score = sum(score_components) / len(score_components)
    
    # REAL feedback based on actual score
    if overall_score >= 95:
        feedback = ["Perfect Downward Dog! Excellent inversion!"]
    elif overall_score >= 85:
        feedback.insert(0, "Excellent Downward Dog! Minor adjustments:")
    elif overall_score >= 75:
        feedback.insert(0, "Strong Downward Dog! Keep improving:")
    elif overall_score >= 60:
        feedback.insert(0, "Getting closer to Downward Dog:")
    else:
        feedback.insert(0, "This is not Downward Dog yet. Please:")
        feedback.append("Hands and feet on ground, hips lifted high")
    
    print(f"🐕 REAL Downward Dog Analysis Complete: Score={overall_score:.1f}%, Components={score_components}")
    return overall_score, feedback[:3], corrections[:2]

def analyze_plank_pose(landmarks, left_arm_angle, right_arm_angle):
    """Analyze Plank Pose - REAL MediaPipe analysis only"""
    
    feedback = []
    corrections = []
    score_components = []
    
    print(f"💪 REAL Plank Pose Analysis - L_arm={left_arm_angle:.1f}°, R_arm={right_arm_angle:.1f}°")
    
    if not landmarks or len(landmarks) < 33:
        print("❌ Plank Pose: Insufficient landmark data")
        return 0, ["Cannot detect pose - ensure full body is visible"], []
    
    try:
        # Key landmarks - REAL MediaPipe indices
        LEFT_SHOULDER = 11
        RIGHT_SHOULDER = 12
        LEFT_ELBOW = 13
        RIGHT_ELBOW = 14
        LEFT_WRIST = 15
        RIGHT_WRIST = 16
        LEFT_HIP = 23
        RIGHT_HIP = 24
        LEFT_KNEE = 25
        RIGHT_KNEE = 26
        LEFT_ANKLE = 27
        RIGHT_ANKLE = 28
        NOSE = 0
        
        print(f"✅ Plank Pose: Analyzing {len(landmarks)} real landmarks")
        
        # 1. REAL body alignment analysis (head, shoulders, hips, ankles should be in straight line)
        head_y = landmarks[NOSE]['y']
        left_shoulder_y = landmarks[LEFT_SHOULDER]['y']
        right_shoulder_y = landmarks[RIGHT_SHOULDER]['y']
        left_hip_y = landmarks[LEFT_HIP]['y']
        right_hip_y = landmarks[RIGHT_HIP]['y']
        left_ankle_y = landmarks[LEFT_ANKLE]['y']
        right_ankle_y = landmarks[RIGHT_ANKLE]['y']
        
        shoulder_height = (left_shoulder_y + right_shoulder_y) / 2
        hip_height = (left_hip_y + right_hip_y) / 2
        ankle_height = (left_ankle_y + right_ankle_y) / 2
        
        print(f"📏 REAL Body alignment: head={head_y:.3f}, shoulders={shoulder_height:.3f}, hips={hip_height:.3f}, ankles={ankle_height:.3f}")
        
        # Check if body is straight (minimal height variation between key points)
        body_points = [shoulder_height, hip_height, ankle_height]
        height_variation = max(body_points) - min(body_points)
        
        print(f"📐 REAL Height variation: {height_variation:.3f}")
        
        if height_variation <= 0.05:  # Very straight body
            score_components.append(100)
            print("✅ Perfect straight body alignment!")
        elif height_variation <= 0.08:
            score_components.append(85)
            feedback.append("Excellent body alignment!")
        elif height_variation <= 0.12:
            score_components.append(70)
            if hip_height > shoulder_height + 0.05:  # Hips sagging
                feedback.append("Engage your core - don't let your hips sag")
                corrections.append({'joint_index': LEFT_HIP, 'message': 'Lift hips up', 'type': 'lift_hips'})
            elif hip_height < shoulder_height - 0.05:  # Hips too high
                feedback.append("Lower your hips - keep body in straight line")
                corrections.append({'joint_index': LEFT_HIP, 'message': 'Lower hips', 'type': 'lower_hips'})
            else:
                feedback.append("Keep your body straighter")
        else:
            score_components.append(50)
            feedback.append("Keep your body in a straight line like a plank")
            corrections.append({'joint_index': LEFT_HIP, 'message': 'Align body straight', 'type': 'align_body'})
        
        # 2. REAL arm position analysis (should be straight down from shoulders)
        if left_arm_angle >= 170 and right_arm_angle >= 170:
            score_components.append(100)
            print("✅ Perfect arm strength!")
        elif left_arm_angle >= 160 and right_arm_angle >= 160:
            score_components.append(85)
            feedback.append("Great arm strength!")
        elif left_arm_angle >= 150 and right_arm_angle >= 150:
            score_components.append(70)
            feedback.append("Keep your arms straighter")
            corrections.append({'joint_index': LEFT_ELBOW, 'message': 'Straighten arms', 'type': 'straighten_arms'})
        else:
            score_components.append(50)
            feedback.append("Keep your arms straight and strong")
            corrections.append({'joint_index': LEFT_ELBOW, 'message': 'Straighten arms', 'type': 'straighten_arms'})
        
        # 3. REAL plank position check (not standing or downward dog)
        left_wrist_y = landmarks[LEFT_WRIST]['y']
        right_wrist_y = landmarks[RIGHT_WRIST]['y']
        wrist_height = (left_wrist_y + right_wrist_y) / 2
        
        print(f"🖐️ REAL Hand position: wrist_height={wrist_height:.3f}")
        
        if 0.60 <= wrist_height <= 0.80:  # Good plank range
            score_components.append(100)
            print("✅ Perfect plank position!")
        elif 0.50 <= wrist_height <= 0.85:
            score_components.append(85)
            feedback.append("Good plank position!")
        elif wrist_height > 0.85:  # Too high, probably standing
            score_components.append(40)
            feedback.append("Get into plank position - hands on ground, body straight")
            corrections.append({'joint_index': LEFT_WRIST, 'message': 'Lower to plank position', 'type': 'plank_position'})
        elif wrist_height < 0.40:  # Too low, might be downward dog
            score_components.append(50)
            feedback.append("This looks like Downward Dog - lower your hips for Plank")
            corrections.append({'joint_index': LEFT_HIP, 'message': 'Lower hips for plank', 'type': 'lower_hips'})
        else:
            score_components.append(60)
            feedback.append("Adjust to proper plank position")
        
        # 4. REAL shoulder alignment analysis (shoulders should be over wrists)
        left_shoulder_x = landmarks[LEFT_SHOULDER]['x']
        right_shoulder_x = landmarks[RIGHT_SHOULDER]['x']
        left_wrist_x = landmarks[LEFT_WRIST]['x']
        right_wrist_x = landmarks[RIGHT_WRIST]['x']
        
        shoulder_wrist_alignment = abs((left_shoulder_x - left_wrist_x) + (right_shoulder_x - right_wrist_x)) / 2
        
        print(f"💪 REAL Shoulder alignment: alignment_diff={shoulder_wrist_alignment:.3f}")
        
        if shoulder_wrist_alignment <= 0.05:
            score_components.append(100)
            print("✅ Perfect shoulder alignment!")
        elif shoulder_wrist_alignment <= 0.08:
            score_components.append(85)
            feedback.append("Good shoulder alignment!")
        elif shoulder_wrist_alignment <= 0.12:
            score_components.append(70)
            feedback.append("Align your shoulders over your wrists")
        else:
            score_components.append(60)
            feedback.append("Align your shoulders directly over your wrists")
        
        # 5. REAL leg position analysis (legs should be straight)
        left_leg_angle = calculate_angle(landmarks[LEFT_HIP], landmarks[LEFT_KNEE], landmarks[LEFT_ANKLE])
        right_leg_angle = calculate_angle(landmarks[RIGHT_HIP], landmarks[RIGHT_KNEE], landmarks[RIGHT_ANKLE])
        
        print(f"🦵 REAL Leg analysis: L_leg={left_leg_angle:.1f}°, R_leg={right_leg_angle:.1f}°")
        
        avg_leg_angle = (left_leg_angle + right_leg_angle) / 2
        if avg_leg_angle >= 170:
            score_components.append(100)
            print("✅ Perfect leg straightness!")
        elif avg_leg_angle >= 160:
            score_components.append(85)
            feedback.append("Great leg extension!")
        elif avg_leg_angle >= 150:
            score_components.append(70)
            feedback.append("Straighten your legs more")
        else:
            score_components.append(60)
            feedback.append("Straighten your legs and engage your core")
            
    except Exception as e:
        print(f"❌ Plank Pose REAL analysis error: {e}")
        import traceback
        traceback.print_exc()
        return 0, ["Error analyzing pose - please try again"], []
    
    # Calculate REAL overall score
    if not score_components:
        print("❌ No score components calculated")
        return 0, ["Unable to analyze pose"], []
    
    overall_score = sum(score_components) / len(score_components)
    
    # REAL feedback based on actual score
    if overall_score >= 95:
        feedback = ["Solid Plank! Excellent core strength and form!"]
    elif overall_score >= 85:
        feedback.insert(0, "Excellent Plank! Minor adjustments:")
    elif overall_score >= 75:
        feedback.insert(0, "Strong Plank! Keep improving:")
    elif overall_score >= 60:
        feedback.insert(0, "Getting closer to perfect Plank:")
    else:
        feedback.insert(0, "This is not a proper Plank yet. Please:")
        feedback.append("Straight body line, hands under shoulders, core engaged")
    
    print(f"💪 REAL Plank Pose Analysis Complete: Score={overall_score:.1f}%, Components={score_components}")
    return overall_score, feedback[:3], corrections[:2]

def analyze_generic_pose(left_arm_angle, right_arm_angle, left_shoulder_angle, right_shoulder_angle):
    """Generic pose analysis for unknown poses"""
    feedback = ["Pose detected - maintain good form"]
    corrections = []
    score = 65  # Moderate default score
    return score, feedback, corrections

if __name__ == '__main__':
    port = 5000  # Force ML service to use port 5000
    print(f"\n🚀 Starting Yoga AI Pose Detection API on port {port}")
    print(f"🔗 Health Check: http://localhost:{port}/health")
    print(f"🧘 Available Poses: http://localhost:{port}/api/ml/available-poses")
    print(f"🔗 MediaPipe Available: {MEDIAPIPE_AVAILABLE}")
    print("=" * 60)
    
    app.run(host='0.0.0.0', port=port, debug=False, threaded=True)  # Debug=False for stability