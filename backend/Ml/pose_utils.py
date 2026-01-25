#!/usr/bin/env python3
"""
Pose Detection Utilities
Helper functions for pose analysis and comparison
"""

import numpy as np
import math
from scipy import spatial
from typing import List, Dict, Any

def calculate_angle(a, b, c):
    """
    Calculate angle between three points
    Args:
        a, b, c: Points as [x, y] coordinates
    Returns:
        angle: Angle in degrees
    """
    a = np.array(a)
    b = np.array(b)
    c = np.array(c)
    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(radians * 180.0 / np.pi)
    
    if angle > 180.0:
        angle = 360 - angle
        
    return angle

def compare_poses_cosine(user_keypoints, target_keypoints):
    """
    Compare poses using cosine similarity
    Args:
        user_keypoints: List of user keypoint dictionaries
        target_keypoints: List of target keypoint dictionaries
    Returns:
        similarity_score: Float between 0 and 1
    """
    if not target_keypoints or not user_keypoints:
        return 0.75  # Default similarity
    
    try:
        similarities = []
        min_length = min(len(user_keypoints), len(target_keypoints))
        
        for i in range(min_length):
            user_values = list(user_keypoints[i].values())
            target_values = list(target_keypoints[i].values())
            
            # Calculate cosine similarity
            similarity = 1 - spatial.distance.cosine(user_values, target_values)
            similarities.append(similarity)
        
        average_similarity = sum(similarities) / len(similarities)
        score = math.sqrt(2 * (1 - round(average_similarity, 2)))
        return score
        
    except Exception as e:
        print(f"Error in pose comparison: {e}")
        return 0.75

def compare_angles(user_angles, target_angles):
    """
    Compare angles between user and target pose
    Args:
        user_angles: List of user angles
        target_angles: List of target angles
    Returns:
        difference_score: Float representing average difference
    """
    if not user_angles or not target_angles:
        return 0.5
    
    try:
        differences = []
        min_length = min(len(user_angles), len(target_angles))
        
        for i in range(min_length):
            if user_angles[i] + target_angles[i] > 0:  # Avoid division by zero
                diff = abs(user_angles[i] - target_angles[i]) / ((user_angles[i] + target_angles[i]) / 2)
                differences.append(diff)
        
        return sum(differences) / len(differences) if differences else 0.5
        
    except Exception as e:
        print(f"Error in angle comparison: {e}")
        return 0.5

def classify_pose(landmarks, mp_pose):
    """
    Classify pose based on angle analysis
    Args:
        landmarks: MediaPipe landmarks
        mp_pose: MediaPipe pose module
    Returns:
        pose_label: String label of detected pose
    """
    try:
        # Extract key points
        left_shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x, 
                        landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
        left_elbow = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x, 
                     landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]
        left_wrist = [landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x, 
                     landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y]
        right_shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x, 
                         landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
        right_elbow = [landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].x, 
                      landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].y]
        right_wrist = [landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].x, 
                      landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].y]
        left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x, 
                   landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
        left_knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x, 
                    landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
        left_ankle = [landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x, 
                     landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y]
        right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x, 
                    landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
        right_knee = [landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x, 
                     landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y]
        right_ankle = [landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x, 
                      landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].y]
        
        # Calculate angles
        angle1 = calculate_angle(right_shoulder, right_elbow, right_wrist)
        angle2 = calculate_angle(left_shoulder, left_elbow, left_wrist)
        angle3 = calculate_angle(right_elbow, right_shoulder, right_hip)
        angle4 = calculate_angle(left_elbow, left_shoulder, left_hip)
        angle5 = calculate_angle(right_shoulder, right_hip, right_knee)
        angle6 = calculate_angle(left_shoulder, left_hip, left_knee)
        angle7 = calculate_angle(right_hip, right_knee, right_ankle)
        angle8 = calculate_angle(left_hip, left_knee, left_ankle)
        
        # Pose classification logic
        label = 'Unknown Pose'
        
        # Warrior II Pose detection
        if (160 < angle2 < 195 and 160 < angle1 < 195 and 
            70 < angle4 < 110 and 70 < angle3 < 110):
            if ((165 < angle8 < 195 or 165 < angle7 < 195) and 
                (80 < angle8 < 120 or 80 < angle7 < 120)):
                label = 'Warrior II Pose'
            elif (160 < angle8 < 195 and 160 < angle7 < 195):
                label = 'T Pose'
        
        # Tree Pose detection
        if ((165 < angle8 < 195 or 165 < angle7 < 195) and 
            (25 < angle7 < 45 or 25 < angle8 < 45)):
            label = 'Tree Pose'
        
        return label
        
    except Exception as e:
        print(f"Error in pose classification: {e}")
        return 'Unknown Pose'

def generate_feedback_messages(user_angles, target_angles, threshold=15):
    """
    Generate feedback messages based on angle comparison
    Args:
        user_angles: List of user angles
        target_angles: List of target angles
        threshold: Angle difference threshold for feedback
    Returns:
        feedback_messages: List of feedback strings
    """
    feedback_messages = []
    
    angle_descriptions = [
        "right arm at elbow",
        "left arm at elbow", 
        "right arm position",
        "left arm position",
        "right hip angle",
        "left hip angle",
        "right knee angle", 
        "left knee angle"
    ]
    
    for i, (user_angle, target_angle, description) in enumerate(zip(user_angles, target_angles, angle_descriptions)):
        difference = abs(user_angle - target_angle)
        
        if difference > threshold:
            if user_angle < target_angle - threshold:
                feedback_messages.append(f"Extend your {description}")
            elif user_angle > target_angle + threshold:
                feedback_messages.append(f"Reduce the angle of your {description}")
    
    if not feedback_messages:
        feedback_messages.append("Perfect pose! Well done!")
    
    return feedback_messages

def calculate_pose_score(pose_similarity, angle_similarity):
    """
    Calculate overall pose score
    Args:
        pose_similarity: Pose similarity score (0-1)
        angle_similarity: Angle similarity score (0-1)
    Returns:
        accuracy_score: Integer score (0-100)
    """
    # Use the better of the two scores
    if pose_similarity >= angle_similarity:
        score = int((1 - angle_similarity) * 100)
    else:
        score = int((1 - pose_similarity) * 100)
    
    # Clamp score between 30 and 95
    return max(30, min(95, score))

def extract_angle_points(landmarks, mp_pose):
    """
    Extract angle points for visual feedback
    Args:
        landmarks: MediaPipe landmarks
        mp_pose: MediaPipe pose module
    Returns:
        angle_points: List of [x, y] coordinates for angle visualization
    """
    angle_points = []
    
    try:
        # Key joint points for angle visualization
        joint_indices = [
            mp_pose.PoseLandmark.RIGHT_ELBOW.value,
            mp_pose.PoseLandmark.LEFT_ELBOW.value,
            mp_pose.PoseLandmark.RIGHT_SHOULDER.value,
            mp_pose.PoseLandmark.LEFT_SHOULDER.value,
            mp_pose.PoseLandmark.RIGHT_HIP.value,
            mp_pose.PoseLandmark.LEFT_HIP.value,
            mp_pose.PoseLandmark.RIGHT_KNEE.value,
            mp_pose.PoseLandmark.LEFT_KNEE.value
        ]
        
        for joint_idx in joint_indices:
            if joint_idx < len(landmarks):
                angle_points.append([
                    landmarks[joint_idx].x,
                    landmarks[joint_idx].y
                ])
        
        return angle_points
        
    except Exception as e:
        print(f"Error extracting angle points: {e}")
        return []

def format_landmarks_for_api(landmarks):
    """
    Format MediaPipe landmarks for API response
    Args:
        landmarks: MediaPipe landmarks
    Returns:
        formatted_landmarks: List of formatted landmark dictionaries
    """
    formatted_landmarks = []
    
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
    
    for idx, landmark in enumerate(landmarks):
        landmark_name = landmark_names[idx] if idx < len(landmark_names) else f"landmark_{idx}"
        
        # Only include visible landmarks
        if landmark.visibility > 0.1:
            formatted_landmarks.append({
                "x": float(landmark.x),
                "y": float(landmark.y),
                "z": float(landmark.z),
                "visibility": float(landmark.visibility),
                "name": landmark_name,
                "index": idx
            })
    
    return formatted_landmarks

def get_pose_target_angles():
    """
    Get target angles for different yoga poses
    Returns:
        target_angles: Dictionary of pose types and their target angles
    """
    return {
        "tree_pose": [180, 180, 90, 90, 180, 45, 180, 180],
        "warrior_pose": [180, 180, 90, 90, 90, 180, 90, 180],
        "goddess_pose": [90, 90, 180, 180, 90, 90, 90, 90],
        "downward_dog": [180, 180, 45, 45, 135, 135, 180, 180],
        "plank_pose": [180, 180, 180, 180, 180, 180, 180, 180],
        "cobra_pose": [90, 90, 45, 45, 180, 180, 180, 180]
    }

def get_pose_descriptions():
    """
    Get descriptions for different yoga poses
    Returns:
        descriptions: Dictionary of pose descriptions
    """
    return {
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
            "difficulty": "Intermediate",
            "benefits": ["Strengthens legs", "Improves stability", "Stretches hips"],
            "instructions": [
                "Stand with feet wide apart",
                "Turn right foot out 90 degrees",
                "Bend right knee to 90 degrees",
                "Arms extended parallel to ground"
            ]
        },
        "goddess_pose": {
            "name": "Goddess Pose (Utkata Konasana)",
            "difficulty": "Intermediate",
            "benefits": ["Strengthens legs", "Opens hips", "Improves posture"],
            "instructions": [
                "Stand with feet wide apart",
                "Turn feet out 45 degrees",
                "Bend knees and lower into squat",
                "Arms can be raised or at sides"
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
        "plank_pose": {
            "name": "Plank Pose (Phalakasana)",
            "difficulty": "Beginner",
            "benefits": ["Strengthens core", "Builds arm strength", "Improves posture"],
            "instructions": [
                "Start in push-up position",
                "Keep body in straight line",
                "Engage core muscles",
                "Hold position steadily"
            ]
        },
        "cobra_pose": {
            "name": "Cobra Pose (Bhujangasana)",
            "difficulty": "Intermediate",
            "benefits": ["Strengthens back", "Opens chest", "Improves flexibility"],
            "instructions": [
                "Lie face down on the floor",
                "Place palms under shoulders",
                "Lift chest using back muscles",
                "Keep hips grounded"
            ]
        }
    }