import cv2
import mediapipe as mp
import numpy as np
import json
import time
from datetime import datetime
from typing import List, Dict, Any
import base64

class YogaPoseDetector:
    def __init__(self):
        """Initialize MediaPipe Pose and other components"""
        self.mp_pose = mp.solutions.pose
        self.mp_drawing = mp.solutions.drawing_utils
        self.mp_drawing_styles = mp.solutions.drawing_styles
        
        # Initialize pose detector with configurations
        self.pose = self.mp_pose.Pose(
            static_image_mode=False,
            model_complexity=1,
            smooth_landmarks=True,
            enable_segmentation=False,
            smooth_segmentation=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        
        # Define pose connections for different exercises
        self.pose_connections = {
            "tree_pose": {
                "angles_to_check": ["left_hip_knee_ankle", "right_hip_knee_ankle"],
                "keypoints": ["LEFT_SHOULDER", "LEFT_HIP", "LEFT_KNEE", "LEFT_ANKLE",
                            "RIGHT_SHOULDER", "RIGHT_HIP", "RIGHT_KNEE", "RIGHT_ANKLE"]
            },
            "warrior_pose": {
                "angles_to_check": ["front_knee_angle", "back_leg_angle"],
                "keypoints": ["LEFT_SHOULDER", "LEFT_HIP", "LEFT_KNEE", "LEFT_ANKLE",
                            "RIGHT_SHOULDER", "RIGHT_HIP", "RIGHT_KNEE", "RIGHT_ANKLE"]
            },
            "downward_dog": {
                "angles_to_check": ["hip_shoulder_wrist_angle", "knee_hip_shoulder_angle"],
                "keypoints": ["LEFT_SHOULDER", "LEFT_ELBOW", "LEFT_WRIST", "LEFT_HIP",
                            "LEFT_KNEE", "LEFT_ANKLE"]
            },
            "mountain_pose": {
                "angles_to_check": ["shoulder_hip_ankle_alignment"],
                "keypoints": ["LEFT_SHOULDER", "LEFT_HIP", "LEFT_ANKLE",
                            "RIGHT_SHOULDER", "RIGHT_HIP", "RIGHT_ANKLE"]
            }
        }
    
    def calculate_angle(self, a, b, c):
        """Calculate angle between three points"""
        a = np.array(a)
        b = np.array(b)
        c = np.array(c)
        
        radians = np.arctan2(c[1]-b[1], c[0]-b[0]) - np.arctan2(a[1]-b[1], a[0]-b[0])
        angle = np.abs(radians * 180.0 / np.pi)
        
        if angle > 180.0:
            angle = 360 - angle
        
        return angle
    
    def get_landmark_coordinates(self, landmarks, landmark_name):
        """Get coordinates of a specific landmark"""
        landmark_index = self.mp_pose.PoseLandmark[landmark_name].value
        landmark = landmarks[landmark_index]
        return [landmark.x, landmark.y, landmark.z]
    
    def detect_pose_from_frame(self, frame, pose_type):
        """
        Detect pose from a single frame
        Args:
            frame: RGB image frame
            pose_type: Type of pose to detect
        Returns:
            Dictionary with detection results
        """
        try:
            # Convert BGR to RGB
            image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            image_rgb.flags.writeable = False
            
            # Process the image
            results = self.pose.process(image_rgb)
            
            if not results.pose_landmarks:
                return {
                    "success": False,
                    "error": "No pose detected",
                    "landmarks": None,
                    "angles": {},
                    "feedback": []
                }
            
            # Get landmarks
            landmarks = results.pose_landmarks.landmark
            
            # Calculate angles based on pose type
            angles = {}
            feedback = []
            
            if pose_type in self.pose_connections:
                pose_config = self.pose_connections[pose_type]
                
                # Calculate specific angles for the pose
                if pose_type == "tree_pose":
                    # Calculate knee angles
                    left_knee_angle = self.calculate_angle(
                        self.get_landmark_coordinates(landmarks, "LEFT_HIP"),
                        self.get_landmark_coordinates(landmarks, "LEFT_KNEE"),
                        self.get_landmark_coordinates(landmarks, "LEFT_ANKLE")
                    )
                    
                    right_knee_angle = self.calculate_angle(
                        self.get_landmark_coordinates(landmarks, "RIGHT_HIP"),
                        self.get_landmark_coordinates(landmarks, "RIGHT_KNEE"),
                        self.get_landmark_coordinates(landmarks, "RIGHT_ANKLE")
                    )
                    
                    angles["left_knee_angle"] = left_knee_angle
                    angles["right_knee_angle"] = right_knee_angle
                    
                    # Provide feedback
                    if left_knee_angle < 160 or right_knee_angle < 160:
                        feedback.append("Bend your knees more for better balance")
                    
                elif pose_type == "warrior_pose":
                    # Calculate front knee angle
                    front_knee_angle = self.calculate_angle(
                        self.get_landmark_coordinates(landmarks, "LEFT_HIP"),
                        self.get_landmark_coordinates(landmarks, "LEFT_KNEE"),
                        self.get_landmark_coordinates(landmarks, "LEFT_ANKLE")
                    )
                    
                    angles["front_knee_angle"] = front_knee_angle
                    
                    # Ideal angle for warrior pose is around 90 degrees
                    if front_knee_angle < 80:
                        feedback.append("Bend your front knee more")
                    elif front_knee_angle > 100:
                        feedback.append("Straighten your front knee slightly")
                    
                elif pose_type == "downward_dog":
                    # Calculate shoulder-hip angle
                    shoulder_hip_angle = self.calculate_angle(
                        self.get_landmark_coordinates(landmarks, "LEFT_WRIST"),
                        self.get_landmark_coordinates(landmarks, "LEFT_SHOULDER"),
                        self.get_landmark_coordinates(landmarks, "LEFT_HIP")
                    )
                    
                    angles["shoulder_hip_angle"] = shoulder_hip_angle
                    
                    if shoulder_hip_angle < 160:
                        feedback.append("Straighten your back more")
            
            # Get all landmarks in a serializable format
            landmarks_list = []
            for idx, landmark in enumerate(landmarks):
                landmarks_list.append({
                    "x": landmark.x,
                    "y": landmark.y,
                    "z": landmark.z,
                    "visibility": landmark.visibility,
                    "name": self.mp_pose.PoseLandmark(idx).name
                })
            
            # Calculate pose confidence
            confidence = np.mean([lm.visibility for lm in landmarks])
            
            # Check pose correctness
            is_correct = len(feedback) == 0
            
            return {
                "success": True,
                "pose_type": pose_type,
                "landmarks": landmarks_list,
                "angles": angles,
                "confidence": float(confidence),
                "is_correct": is_correct,
                "feedback": feedback,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "landmarks": None,
                "angles": {},
                "feedback": []
            }
    
    def process_video_stream(self, video_data, pose_type, duration_seconds=30):
        """
        Process video stream for pose detection
        Args:
            video_data: Base64 encoded video data or video path
            pose_type: Type of pose to analyze
            duration_seconds: Duration to analyze
        Returns:
            Analysis results
        """
        results = {
            "pose_type": pose_type,
            "total_frames": 0,
            "correct_frames": 0,
            "avg_confidence": 0,
            "session_duration": duration_seconds,
            "frame_analysis": [],
            "summary": {}
        }
        
        # For demo purposes, simulating video processing
        # In production, you would decode base64 video or read from file
        frame_count = int(duration_seconds * 30)  # Assuming 30 FPS
        
        confidences = []
        
        for i in range(min(100, frame_count)):  # Process max 100 frames for demo
            # Simulate frame analysis
            # In actual implementation, you would extract frames from video
            
            # Create a mock result for demo
            mock_result = {
                "frame": i,
                "success": True,
                "confidence": 0.7 + np.random.random() * 0.3,
                "is_correct": np.random.choice([True, False], p=[0.8, 0.2]),
                "feedback": []
            }
            
            if mock_result["is_correct"]:
                results["correct_frames"] += 1
            
            confidences.append(mock_result["confidence"])
            results["frame_analysis"].append(mock_result)
            results["total_frames"] += 1
        
        if confidences:
            results["avg_confidence"] = float(np.mean(confidences))
            results["accuracy_percentage"] = (results["correct_frames"] / results["total_frames"]) * 100
        
        # Generate summary
        results["summary"] = {
            "accuracy": results.get("accuracy_percentage", 0),
            "duration_seconds": duration_seconds,
            "pose_quality": "Good" if results.get("accuracy_percentage", 0) > 70 else "Needs Improvement",
            "recommendations": [
                "Practice consistently for better form",
                "Focus on alignment in your poses"
            ]
        }
        
        return results
    
    def generate_progress_report(self, user_sessions):
        """
        Generate progress report from user sessions
        Args:
            user_sessions: List of session data
        Returns:
            Progress report
        """
        if not user_sessions:
            return {"error": "No sessions found"}
        
        # Calculate metrics
        total_sessions = len(user_sessions)
        total_duration = sum(session.get("duration", 0) for session in user_sessions)
        avg_accuracy = np.mean([session.get("accuracy", 0) for session in user_sessions])
        
        # Identify improvement areas
        common_feedback = []
        for session in user_sessions:
            if "feedback" in session:
                common_feedback.extend(session["feedback"])
        
        # Find most frequent feedback
        if common_feedback:
            from collections import Counter
            feedback_counts = Counter(common_feedback)
            top_feedback = feedback_counts.most_common(3)
        else:
            top_feedback = []
        
        return {
            "total_sessions": total_sessions,
            "total_practice_minutes": total_duration / 60,
            "average_accuracy": float(avg_accuracy),
            "improvement_areas": [fb[0] for fb in top_feedback],
            "recommendations": [
                f"Practice {3 - total_sessions} more times this week" if total_sessions < 3 else "Great consistency!",
                "Focus on alignment in your poses",
                "Try holding poses for longer durations"
            ],
            "next_goals": [
                "Achieve 80% accuracy in all poses",
                "Complete 5 sessions this week",
                "Try advanced variations of your current poses"
            ]
        }


# Utility function to handle base64 image/video data
def process_media_data(data_string, is_video=False):
    """Process base64 encoded image or video data"""
    try:
        # Remove header if present
        if ',' in data_string:
            data_string = data_string.split(',')[1]
        
        # Decode base64
        decoded_data = base64.b64decode(data_string)
        
        if is_video:
            # For video, save to temporary file
            import tempfile
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.mp4')
            temp_file.write(decoded_data)
            temp_file.close()
            return temp_file.name
        else:
            # For image, convert to numpy array
            nparr = np.frombuffer(decoded_data, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            return img
            
    except Exception as e:
        print(f"Error processing media data: {e}")
        return None