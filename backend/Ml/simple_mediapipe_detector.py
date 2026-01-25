#!/usr/bin/env python3
"""
Simple MediaPipe Pose Detection - Works with current MediaPipe versions
Real-time pose detection using MediaPipe's latest API
"""

import cv2
import numpy as np
import json
import time
import base64
import math
from datetime import datetime
from typing import List, Dict, Any

# Try to import MediaPipe with proper error handling
try:
    import mediapipe as mp
    print(f"📦 MediaPipe version: {mp.__version__}")
    
    # Initialize MediaPipe Pose
    mp_pose = mp.solutions.pose if hasattr(mp, 'solutions') else None
    mp_drawing = mp.solutions.drawing_utils if hasattr(mp, 'solutions') else None
    mp_drawing_styles = mp.solutions.drawing_styles if hasattr(mp, 'solutions') else None
    
    if mp_pose is None:
        # Try new Tasks API for newer versions
        try:
            from mediapipe.tasks import python
            from mediapipe.tasks.python import vision
            MEDIAPIPE_API = "tasks"
        except:
            MEDIAPIPE_API = "none"
    else:
        MEDIAPIPE_API = "solutions"
    
    MEDIAPIPE_AVAILABLE = True
    print(f"✅ MediaPipe available using {MEDIAPIPE_API} API")
    
except Exception as e:
    MEDIAPIPE_AVAILABLE = False
    MEDIAPIPE_API = "none"
    print(f"❌ MediaPipe not available: {e}")

class SimpleMediaPipePoseDetector:
    def __init__(self):
        """Initialize Simple MediaPipe pose detector"""
        
        self.pose = None
        self.detector_type = "simple_mediapipe"
        
        if MEDIAPIPE_AVAILABLE and MEDIAPIPE_API == "solutions":
            try:
                # Initialize MediaPipe Pose with solutions API
                self.pose = mp_pose.Pose(
                    static_image_mode=False,
                    model_complexity=1,  # Use medium complexity for better performance
                    enable_segmentation=False,
                    min_detection_confidence=0.5,
                    min_tracking_confidence=0.5
                )
                
                print("✅ Simple MediaPipe Pose detector initialized successfully")
                print("🎯 This will track your ACTUAL body movements!")
                
            except Exception as e:
                print(f"❌ Failed to initialize MediaPipe: {e}")
                self.pose = None
                self.detector_type = "error"
        else:
            self.detector_type = "unavailable"
            print("❌ MediaPipe Solutions API not available")
    
    def detect_pose_from_frame(self, frame, pose_type="tree_pose"):
        """
        Detect REAL pose from webcam frame using MediaPipe
        """
        try:
            if frame is None:
                return self._create_error_response("No frame provided")
            
            if not MEDIAPIPE_AVAILABLE or self.pose is None:
                return self._create_error_response("MediaPipe detection not available")
            
            # Convert BGR to RGB for MediaPipe
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            print("🎯 Processing frame with MediaPipe...")
            
            # Process frame with MediaPipe
            results = self.pose.process(rgb_frame)
            
            # Check if pose landmarks were detected
            if not results.pose_landmarks:
                print("❌ No person detected by MediaPipe")
                return {
                    "success": True,
                    "pose_detected": False,
                    "feedback": ["No person detected - please ensure you're fully visible in good lighting"],
                    "landmarks": [],
                    "is_correct": False,
                    "confidence": 0.0,
                    "accuracy_score": 0,
                    "detector": "simple_mediapipe"
                }
            
            print("✅ Person detected by MediaPipe!")
            
            # Extract landmarks
            landmarks = self._extract_landmarks(results.pose_landmarks, frame.shape)
            
            if not landmarks:
                return self._create_error_response("Failed to extract landmarks")
            
            # Calculate pose metrics
            angles = self._calculate_angles(landmarks, pose_type)
            confidence = self._calculate_confidence(results.pose_landmarks)
            
            # Generate feedback
            feedback, corrections, accuracy_score = self._generate_feedback(
                angles, pose_type, confidence, landmarks
            )
            
            # Draw landmarks on frame
            annotated_frame = self._draw_landmarks(frame.copy(), results.pose_landmarks)
            self._add_overlay(annotated_frame, pose_type, accuracy_score, confidence, len(landmarks))
            
            # Convert to base64
            _, buffer = cv2.imencode('.jpg', annotated_frame)
            annotated_image = base64.b64encode(buffer).decode('utf-8')
            
            print(f"✅ MediaPipe detection: {len(landmarks)} landmarks, confidence: {confidence:.2f}")
            
            return {
                "success": True,
                "pose_type": pose_type,
                "landmarks": landmarks,
                "angles": angles,
                "confidence": confidence,
                "accuracy_score": accuracy_score,
                "is_correct": accuracy_score >= 70,
                "feedback": feedback,
                "corrections": corrections,
                "timestamp": datetime.now().isoformat(),
                "annotated_image": f"data:image/jpeg;base64,{annotated_image}",
                "pose_name": self._get_pose_name(pose_type),
                "detector": "simple_mediapipe_real",
                "real_tracking": True,
                "landmarks_count": len(landmarks),
                "tracking_method": "mediapipe_solutions"
            }
            
        except Exception as e:
            print(f"❌ MediaPipe detection error: {e}")
            return self._create_error_response(f"Detection failed: {str(e)}")
    
    def _extract_landmarks(self, pose_landmarks, frame_shape):
        """Extract landmarks from MediaPipe detection results"""
        landmarks = []
        height, width = frame_shape[:2]
        
        try:
            print(f"🔍 Extracting landmarks from MediaPipe detection...")
            
            # MediaPipe landmark names
            landmark_names = [
                'nose', 'left_eye_inner', 'left_eye', 'left_eye_outer',
                'right_eye_inner', 'right_eye', 'right_eye_outer',
                'left_ear', 'right_ear', 'mouth_left', 'mouth_right',
                'left_shoulder', 'right_shoulder', 'left_elbow', 'right_elbow',
                'left_wrist', 'right_wrist', 'left_pinky', 'right_pinky',
                'left_index', 'right_index', 'left_thumb', 'right_thumb',
                'left_hip', 'right_hip', 'left_knee', 'right_knee',
                'left_ankle', 'right_ankle', 'left_heel', 'right_heel',
                'left_foot_index', 'right_foot_index'
            ]
            
            # Extract each landmark
            for idx, landmark in enumerate(pose_landmarks.landmark):
                landmark_name = landmark_names[idx] if idx < len(landmark_names) else f"landmark_{idx}"
                
                # Get real coordinates from MediaPipe
                x_real = landmark.x  # Normalized X coordinate (0-1)
                y_real = landmark.y  # Normalized Y coordinate (0-1)
                z_real = landmark.z  # Depth information
                visibility_real = landmark.visibility  # Visibility score
                
                # Only include visible landmarks
                if visibility_real > 0.1:
                    # Validate coordinates
                    if 0 <= x_real <= 1 and 0 <= y_real <= 1:
                        landmarks.append({
                            "x": float(x_real),
                            "y": float(y_real),
                            "z": float(z_real),
                            "visibility": float(visibility_real),
                            "name": landmark_name,
                            "index": idx,
                            "pixel_x": int(x_real * width),
                            "pixel_y": int(y_real * height)
                        })
            
            print(f"✅ Extracted {len(landmarks)} real landmarks")
            return landmarks
            
        except Exception as e:
            print(f"❌ Error extracting landmarks: {e}")
            return []
    
    def _calculate_confidence(self, pose_landmarks):
        """Calculate confidence from MediaPipe detection"""
        if not pose_landmarks:
            return 0.0
        
        # Get visibility scores for key body parts
        key_indices = [0, 11, 12, 23, 24, 25, 26]  # nose, shoulders, hips, knees
        visibilities = []
        
        for idx in key_indices:
            if idx < len(pose_landmarks.landmark):
                visibilities.append(pose_landmarks.landmark[idx].visibility)
        
        confidence = np.mean(visibilities) if visibilities else 0.0
        return float(confidence)
    
    def _calculate_angles(self, landmarks, pose_type):
        """Calculate angles using real landmark positions"""
        angles = {}
        
        try:
            def calc_angle(p1, p2, p3):
                """Calculate angle between three points"""
                a = np.array([p1["x"], p1["y"]])
                b = np.array([p2["x"], p2["y"]])
                c = np.array([p3["x"], p3["y"]])
                
                radians = np.arctan2(c[1]-b[1], c[0]-b[0]) - np.arctan2(a[1]-b[1], a[0]-b[0])
                angle = np.abs(radians * 180.0 / np.pi)
                
                if angle > 180.0:
                    angle = 360 - angle
                
                return float(angle)
            
            # Create lookup by landmark name
            landmark_dict = {lm["name"]: lm for lm in landmarks}
            
            if pose_type == "tree_pose":
                # Calculate knee angles
                if all(key in landmark_dict for key in ["left_hip", "left_knee", "left_ankle"]):
                    angles["left_knee"] = calc_angle(
                        landmark_dict["left_hip"], 
                        landmark_dict["left_knee"], 
                        landmark_dict["left_ankle"]
                    )
                
                if all(key in landmark_dict for key in ["right_hip", "right_knee", "right_ankle"]):
                    angles["right_knee"] = calc_angle(
                        landmark_dict["right_hip"], 
                        landmark_dict["right_knee"], 
                        landmark_dict["right_ankle"]
                    )
                
                # Calculate hip alignment
                if "left_hip" in landmark_dict and "right_hip" in landmark_dict:
                    angles["hip_alignment"] = abs(
                        landmark_dict["left_hip"]["y"] - landmark_dict["right_hip"]["y"]
                    ) * 100
            
        except Exception as e:
            print(f"❌ Error calculating angles: {e}")
            angles = {"error": str(e)}
        
        return angles
    
    def _generate_feedback(self, angles, pose_type, confidence, landmarks):
        """Generate feedback based on real body position"""
        feedback = []
        corrections = []
        accuracy_score = 60  # Base score
        
        try:
            feedback.append(f"🎯 MediaPipe tracking {len(landmarks)} real body landmarks")
            
            if pose_type == "tree_pose":
                if "left_knee" in angles and "right_knee" in angles:
                    left_knee = angles["left_knee"]
                    right_knee = angles["right_knee"]
                    
                    # Determine standing leg
                    if left_knee > right_knee:
                        standing_leg = left_knee
                        bent_leg = right_knee
                        feedback.append("✅ Left leg is standing leg")
                    else:
                        standing_leg = right_knee
                        bent_leg = left_knee
                        feedback.append("✅ Right leg is standing leg")
                    
                    # Analyze standing leg
                    if standing_leg > 160:
                        feedback.append("✅ Standing leg perfectly straight!")
                        accuracy_score += 15
                    else:
                        feedback.append("⚠️ Straighten your standing leg more")
                        accuracy_score -= 5
                    
                    # Analyze bent leg
                    if bent_leg < 120:
                        feedback.append("✅ Great bend in lifted leg!")
                        accuracy_score += 10
                    else:
                        feedback.append("⚠️ Lift your foot higher")
                        accuracy_score -= 5
            
            # Confidence-based feedback
            if confidence > 0.8:
                feedback.append("📹 Excellent detection quality!")
                accuracy_score += 5
            elif confidence < 0.6:
                feedback.append("📹 Improve lighting for better tracking")
                accuracy_score -= 5
            
        except Exception as e:
            print(f"❌ Error generating feedback: {e}")
            feedback = ["⚠️ Unable to analyze pose"]
            accuracy_score = 50
        
        return feedback, corrections, max(30, min(95, accuracy_score))
    
    def _draw_landmarks(self, frame, pose_landmarks):
        """Draw landmarks using MediaPipe's drawing utilities"""
        if not MEDIAPIPE_AVAILABLE or not pose_landmarks or not mp_drawing:
            return frame
        
        try:
            print("🎨 Drawing real body landmarks...")
            
            # Use MediaPipe's official drawing utilities
            mp_drawing.draw_landmarks(
                frame,
                pose_landmarks,
                mp_pose.POSE_CONNECTIONS,
                landmark_drawing_spec=mp_drawing_styles.get_default_pose_landmarks_style()
            )
            
        except Exception as e:
            print(f"❌ Error drawing landmarks: {e}")
        
        return frame
    
    def _add_overlay(self, frame, pose_type, accuracy_score, confidence, landmarks_count):
        """Add information overlay"""
        try:
            # Add semi-transparent background
            overlay = frame.copy()
            cv2.rectangle(overlay, (10, 10), (500, 180), (0, 0, 0), -1)
            cv2.addWeighted(overlay, 0.7, frame, 0.3, 0, frame)
            
            # Add pose information
            pose_name = self._get_pose_name(pose_type)
            cv2.putText(frame, f"{pose_name} - REAL TRACKING", (20, 35), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            
            # Add accuracy score
            accuracy_color = (0, 255, 0) if accuracy_score >= 70 else (0, 165, 255) if accuracy_score >= 50 else (0, 0, 255)
            cv2.putText(frame, f"Accuracy: {accuracy_score:.1f}%", (20, 65), cv2.FONT_HERSHEY_SIMPLEX, 0.6, accuracy_color, 2)
            
            # Add confidence
            cv2.putText(frame, f"Detection: {confidence:.2f}", (20, 95), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
            
            # Add landmarks count
            cv2.putText(frame, f"Landmarks: {landmarks_count}/33", (20, 125), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2)
            
            # Add tracking status
            cv2.putText(frame, "MEDIAPIPE REAL TRACKING", (20, 155), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
            
        except Exception as e:
            print(f"❌ Error adding overlay: {e}")
    
    def _get_pose_name(self, pose_type):
        """Get human-readable pose name"""
        pose_names = {
            "tree_pose": "Tree Pose",
            "warrior_pose": "Warrior II",
            "downward_dog": "Downward Dog",
            "mountain_pose": "Mountain Pose"
        }
        return pose_names.get(pose_type, pose_type.replace("_", " ").title())
    
    def _create_error_response(self, error_message):
        """Create error response"""
        return {
            "success": False,
            "error": error_message,
            "landmarks": [],
            "angles": {},
            "feedback": ["⚠️ " + error_message],
            "corrections": [],
            "accuracy_score": 0,
            "confidence": 0,
            "timestamp": datetime.now().isoformat(),
            "detector": self.detector_type,
            "real_tracking": False,
            "tracking_method": "none"
        }

# For standalone testing
if __name__ == "__main__":
    detector = SimpleMediaPipePoseDetector()
    
    # Test with webcam
    cap = cv2.VideoCapture(0)
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        result = detector.detect_pose_from_frame(frame, "tree_pose")
        
        if result["success"] and "annotated_image" in result:
            # Decode and display annotated frame
            img_data = base64.b64decode(result["annotated_image"].split(',')[1])
            nparr = np.frombuffer(img_data, np.uint8)
            annotated_frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            cv2.imshow('Simple MediaPipe Pose Detection', annotated_frame)
        
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    cap.release()
    cv2.destroyAllWindows()