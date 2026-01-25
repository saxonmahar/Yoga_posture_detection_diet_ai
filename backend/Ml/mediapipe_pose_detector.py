#!/usr/bin/env python
# coding: utf-8

import cv2
import numpy as np
import mediapipe as mp
import time
import math
import sys
import pyttsx3
import threading
import os
import json
import base64
from collections import deque
from datetime import datetime

class MediaPipePoseDetector:
    def __init__(self):
        print("🔧 Initializing MediaPipe Pose Detector with TTS feedback")
        
        # Initialize MediaPipe with the new Tasks API
        self.BaseOptions = mp.tasks.BaseOptions
        self.PoseLandmarker = mp.tasks.vision.PoseLandmarker
        self.PoseLandmarkerOptions = mp.tasks.vision.PoseLandmarkerOptions
        self.VisionRunningMode = mp.tasks.vision.RunningMode
        
        # Initialize Text-to-Speech
        self.tts_engine = pyttsx3.init()
        self.tts_engine.setProperty('rate', 150)
        self.tts_engine.setProperty('volume', 0.8)
        
        # TTS management
        self.is_speaking = False
        self.last_feedback_time = 0
        self.feedback_cooldown = 2.0
        
        # Pose configurations
        self.pose_names = {
            "warrior": "Warrior Pose",
            "tree": "Tree Pose", 
            "goddess": "Goddess Pose",
            "downdog": "Downward Dog",
            "plank": "Plank Pose",
            "warrior2": "Warrior 2 Pose"
        }
        
        # Pose landmark connections for drawing skeleton
        self.POSE_CONNECTIONS = [
            # Face
            (0, 1), (1, 2), (2, 3), (3, 7), (0, 4), (4, 5), (5, 6), (6, 8),
            # Arms
            (9, 10), (11, 12), (11, 13), (13, 15), (15, 17), (15, 19), (15, 21),
            (16, 18), (16, 20), (16, 22), (12, 14), (14, 16),
            # Body
            (11, 23), (12, 24), (23, 24),
            # Legs
            (23, 25), (25, 27), (27, 29), (29, 31), (27, 31),
            (24, 26), (26, 28), (28, 30), (30, 32), (28, 32)
        ]
        
        # Initialize pose landmarker
        self.landmarker = None
        self._initialize_landmarker()
        
        print("✅ MediaPipe Pose Detector initialized successfully")
    
    def _initialize_landmarker(self):
        """Initialize the MediaPipe pose landmarker"""
        try:
            model_path = os.path.join(os.path.dirname(__file__), "pose_landmarker_heavy.task")
            if not os.path.exists(model_path):
                # Fallback to lite model if heavy model not found
                model_path = os.path.join(os.path.dirname(__file__), "pose_landmarker_lite.task")
            
            if not os.path.exists(model_path):
                print("⚠️ MediaPipe model file not found. Please download pose_landmarker_heavy.task")
                return False
            
            options = self.PoseLandmarkerOptions(
                base_options=self.BaseOptions(model_asset_path=model_path),
                running_mode=self.VisionRunningMode.IMAGE
            )
            
            self.landmarker = self.PoseLandmarker.create_from_options(options)
            return True
        except Exception as e:
            print(f"Error initializing landmarker: {e}")
            return False
    
    def speak_async(self, text):
        """Speak text asynchronously without blocking the main thread"""
        current_time = time.time()
        
        if current_time - self.last_feedback_time < self.feedback_cooldown:
            return
        
        if not self.is_speaking:
            self.is_speaking = True
            self.last_feedback_time = current_time
            
            def speak():
                try:
                    print(f"TTS: {text}")
                    self.tts_engine.say(text)
                    self.tts_engine.runAndWait()
                except Exception as e:
                    print(f"TTS Error: {e}")
                finally:
                    self.is_speaking = False
            
            thread = threading.Thread(target=speak, daemon=True)
            thread.start()
    
    def calculate_angle(self, a, b, c):
        """Calculate angle between three points"""
        a = np.array(a)
        b = np.array(b)
        c = np.array(c)
        
        radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
        angle = np.abs(radians * 180.0 / np.pi)
        
        if angle > 180.0:
            angle = 360 - angle
            
        return angle
    
    def analyze_warrior_pose(self, landmarks):
        """Analyze Warrior Pose with detailed feedback"""
        feedback = []
        is_perfect = True
        
        try:
            # Get key landmarks
            left_shoulder = [landmarks[11].x, landmarks[11].y]
            right_shoulder = [landmarks[12].x, landmarks[12].y]
            left_hip = [landmarks[23].x, landmarks[23].y]
            right_hip = [landmarks[24].x, landmarks[24].y]
            left_knee = [landmarks[25].x, landmarks[25].y]
            right_knee = [landmarks[26].x, landmarks[26].y]
            left_ankle = [landmarks[27].x, landmarks[27].y]
            right_ankle = [landmarks[28].x, landmarks[28].y]
            left_wrist = [landmarks[15].x, landmarks[15].y]
            right_wrist = [landmarks[16].x, landmarks[16].y]
            left_elbow = [landmarks[13].x, landmarks[13].y]
            right_elbow = [landmarks[14].x, landmarks[14].y]
            
            # Calculate angles
            left_knee_angle = self.calculate_angle(left_hip, left_knee, left_ankle)
            right_knee_angle = self.calculate_angle(right_hip, right_knee, right_ankle)
            left_arm_angle = self.calculate_angle(left_shoulder, left_elbow, left_wrist)
            right_arm_angle = self.calculate_angle(right_shoulder, right_elbow, right_wrist)
            
            # Perfect thresholds
            perfect_front_knee_min = 80
            perfect_front_knee_max = 110
            perfect_back_knee_min = 160
            perfect_arm_alignment = 0.10
            perfect_arm_extension = 150
            
            # Analyze legs
            if left_knee_angle < perfect_front_knee_min:
                feedback.append("Bend your front left knee deeper")
                is_perfect = False
            elif left_knee_angle > perfect_front_knee_max:
                feedback.append("Your front knee is bent too much")
                is_perfect = False
            
            if right_knee_angle < perfect_back_knee_min:
                feedback.append("Straighten your back right leg completely")
                is_perfect = False
            
            # Analyze arms
            if left_arm_angle < perfect_arm_extension or right_arm_angle < perfect_arm_extension:
                feedback.append("Extend your arms fully")
                is_perfect = False
            
            arm_diff = abs(left_wrist[1] - right_wrist[1])
            if arm_diff > perfect_arm_alignment:
                feedback.append("Balance your arms at the same height")
                is_perfect = False
            
            if is_perfect:
                feedback.append("Excellent! Perfect Warrior Pose!")
                
        except Exception as e:
            feedback.append(f"Error analyzing pose: {str(e)}")
            is_perfect = False
        
        return feedback, is_perfect
    
    def analyze_tree_pose(self, landmarks):
        """Analyze Tree Pose with balance feedback"""
        feedback = []
        is_perfect = True
        
        try:
            # Get key landmarks
            left_ankle = [landmarks[27].x, landmarks[27].y]
            right_ankle = [landmarks[28].x, landmarks[28].y]
            left_knee = [landmarks[25].x, landmarks[25].y]
            right_knee = [landmarks[26].x, landmarks[26].y]
            left_hip = [landmarks[23].x, landmarks[23].y]
            right_hip = [landmarks[24].x, landmarks[24].y]
            
            # Determine standing leg
            if left_ankle[1] > right_ankle[1]:
                standing_leg = "left"
                lifted_knee_pos = right_knee
                standing_ankle_pos = left_ankle
            else:
                standing_leg = "right"
                lifted_knee_pos = left_knee
                standing_ankle_pos = right_ankle
            
            # Check lifted leg position
            lift_difference = standing_ankle_pos[1] - lifted_knee_pos[1]
            if lift_difference < 0.12:
                feedback.append(f"Lift your leg higher and place foot on inner thigh")
                is_perfect = False
            
            # Check balance
            hip_difference = abs(left_hip[0] - right_hip[0])
            if hip_difference > 0.06:
                feedback.append("Balance your hips and engage your core")
                is_perfect = False
            
            if is_perfect:
                feedback.append("Perfect Tree Pose! Excellent balance!")
                
        except Exception as e:
            feedback.append(f"Error analyzing pose: {str(e)}")
            is_perfect = False
        
        return feedback, is_perfect
    
    def get_pose_analyzer(self, pose_type):
        """Return the appropriate pose analyzer function"""
        analyzers = {
            "warrior": self.analyze_warrior_pose,
            "tree": self.analyze_tree_pose,
            # Add other pose analyzers as needed
        }
        return analyzers.get(pose_type, self.analyze_warrior_pose)
    
    def detect_pose_from_frame(self, frame, pose_type="warrior", enable_tts=True):
        """Detect pose from a single frame"""
        try:
            if self.landmarker is None:
                return {
                    "success": False,
                    "error": "MediaPipe landmarker not initialized",
                    "feedback": ["Please check MediaPipe installation"]
                }
            
            # Convert BGR to RGB
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            # Create MediaPipe Image
            mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)
            
            # Process the frame
            pose_landmarker_result = self.landmarker.detect(mp_image)
            
            if pose_landmarker_result.pose_landmarks:
                landmarks = pose_landmarker_result.pose_landmarks[0]
                
                # Analyze pose
                pose_analyzer = self.get_pose_analyzer(pose_type)
                feedback, is_perfect = pose_analyzer(landmarks)
                
                # Convert landmarks to serializable format
                landmarks_data = []
                for landmark in landmarks:
                    landmarks_data.append({
                        "x": float(landmark.x),
                        "y": float(landmark.y),
                        "z": float(landmark.z),
                        "visibility": float(landmark.visibility)
                    })
                
                # Draw landmarks on frame
                annotated_frame = self.draw_landmarks_and_connections(frame.copy(), landmarks)
                
                # Encode frame to base64
                _, buffer = cv2.imencode('.jpg', annotated_frame)
                annotated_image = base64.b64encode(buffer).decode('utf-8')
                
                # Provide TTS feedback
                if enable_tts and feedback:
                    self.speak_async(feedback[0])
                
                return {
                    "success": True,
                    "pose_type": pose_type,
                    "pose_name": self.pose_names.get(pose_type, "Unknown Pose"),
                    "landmarks": landmarks_data,
                    "feedback": feedback,
                    "is_perfect": is_perfect,
                    "confidence": 0.95,  # MediaPipe provides high confidence
                    "annotated_image": f"data:image/jpeg;base64,{annotated_image}",
                    "timestamp": datetime.now().isoformat()
                }
            else:
                return {
                    "success": True,
                    "pose_detected": False,
                    "feedback": ["No pose detected - please step into camera view"],
                    "landmarks": [],
                    "is_perfect": False
                }
                
        except Exception as e:
            print(f"Detection error: {e}")
            return {
                "success": False,
                "error": f"Detection error: {str(e)}",
                "feedback": ["Unable to process image. Please try again."]
            }
    
    def draw_landmarks_and_connections(self, image, landmarks):
        """Draw pose landmarks and connections on the image"""
        if not landmarks:
            return image
        
        height, width = image.shape[:2]
        
        # Convert landmarks to pixel coordinates
        landmark_points = []
        for landmark in landmarks:
            x = int(landmark.x * width)
            y = int(landmark.y * height)
            landmark_points.append((x, y))
        
        # Draw connections
        for connection in self.POSE_CONNECTIONS:
            start_idx, end_idx = connection
            if start_idx < len(landmark_points) and end_idx < len(landmark_points):
                start_point = landmark_points[start_idx]
                end_point = landmark_points[end_idx]
                cv2.line(image, start_point, end_point, (0, 255, 0), 2)
        
        # Draw landmarks
        for i, point in enumerate(landmark_points):
            if i <= 10:  # Face landmarks
                color = (255, 0, 0)  # Blue
            elif i <= 22:  # Upper body
                color = (0, 255, 0)  # Green
            else:  # Lower body
                color = (0, 0, 255)  # Red
            
            cv2.circle(image, point, 5, color, -1)
            cv2.circle(image, point, 6, (255, 255, 255), 1)
        
        return image

# For standalone testing
if __name__ == "__main__":
    detector = MediaPipePoseDetector()
    
    # Test with webcam
    cap = cv2.VideoCapture(0)
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        result = detector.detect_pose_from_frame(frame, "warrior")
        
        if result["success"] and "annotated_image" in result:
            # Decode and display annotated frame
            img_data = base64.b64decode(result["annotated_image"].split(',')[1])
            nparr = np.frombuffer(img_data, np.uint8)
            annotated_frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            cv2.imshow('MediaPipe Pose Detection', annotated_frame)
        
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    cap.release()
    cv2.destroyAllWindows()