#!/usr/bin/env python3
"""
Collect training data for yoga poses with MediaPipe landmarks
"""

import cv2
import mediapipe as mp
import numpy as np
import json
import os
from datetime import datetime
import argparse

class YogaDataCollector:
    def __init__(self, output_dir="training_data"):
        """Initialize the data collector"""
        self.output_dir = output_dir
        self.mp_pose = mp.solutions.pose
        self.mp_drawing = mp.solutions.drawing_utils
        
        # Initialize pose detector
        self.pose = self.mp_pose.Pose(
            static_image_mode=False,
            model_complexity=1,
            smooth_landmarks=True,
            min_detection_confidence=0.7,
            min_tracking_confidence=0.5
        )
        
        # Create output directories
        os.makedirs(output_dir, exist_ok=True)
        os.makedirs(f"{output_dir}/images", exist_ok=True)
        os.makedirs(f"{output_dir}/landmarks", exist_ok=True)
        
        # Supported poses
        self.poses = {
            '1': 'tree_pose',
            '2': 'warrior_pose', 
            '3': 'downward_dog',
            '4': 'mountain_pose',
            '5': 'child_pose',
            '6': 'cobra_pose'
        }
        
        print(f"📁 Output directory: {output_dir}")
        print("🎯 Supported poses:")
        for key, pose in self.poses.items():
            print(f"   {key}: {pose}")
    
    def collect_data(self, pose_name):
        """Collect training data for a specific pose"""
        print(f"\n🧘 Collecting data for: {pose_name}")
        print("📹 Position yourself in the pose and press:")
        print("   SPACE: Capture image with landmarks")
        print("   'q': Quit collection")
        print("   'n': Next pose")
        
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            print("❌ Cannot open webcam")
            return
        
        # Set camera resolution
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        
        capture_count = 0
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            # Mirror frame for better user experience
            frame = cv2.flip(frame, 1)
            
            # Convert BGR to RGB
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            frame_rgb.flags.writeable = False
            
            # Process with MediaPipe
            results = self.pose.process(frame_rgb)
            
            # Convert back to BGR for display
            frame_rgb.flags.writeable = True
            frame_bgr = cv2.cvtColor(frame_rgb, cv2.COLOR_RGB2BGR)
            
            # Draw landmarks if detected
            if results.pose_landmarks:
                self.mp_drawing.draw_landmarks(
                    frame_bgr,
                    results.pose_landmarks,
                    self.mp_pose.POSE_CONNECTIONS,
                    self.mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=2, circle_radius=2),
                    self.mp_drawing.DrawingSpec(color=(255, 0, 0), thickness=2, circle_radius=2)
                )
                
                # Show pose info
                cv2.putText(frame_bgr, f"Pose: {pose_name}", (10, 30), 
                           cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                cv2.putText(frame_bgr, f"Captured: {capture_count}", (10, 70), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
                cv2.putText(frame_bgr, "SPACE: Capture | Q: Quit | N: Next", (10, 450), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
                
                # Calculate confidence
                landmarks = results.pose_landmarks.landmark
                confidence = np.mean([lm.visibility for lm in landmarks])
                
                # Show confidence
                color = (0, 255, 0) if confidence > 0.7 else (0, 165, 255) if confidence > 0.5 else (0, 0, 255)
                cv2.putText(frame_bgr, f"Confidence: {confidence:.2f}", (10, 110), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)
                
            else:
                cv2.putText(frame_bgr, "No pose detected", (10, 30), 
                           cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
                cv2.putText(frame_bgr, "Position yourself fully in frame", (10, 70), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            
            cv2.imshow('Yoga Data Collection', frame_bgr)
            
            key = cv2.waitKey(1) & 0xFF
            
            if key == ord('q'):
                break
            elif key == ord('n'):
                print(f"✅ Finished collecting {capture_count} samples for {pose_name}")
                break
            elif key == ord(' ') and results.pose_landmarks:
                # Capture the image and landmarks
                success = self.save_sample(frame, results.pose_landmarks, pose_name, capture_count)
                if success:
                    capture_count += 1
                    print(f"📸 Captured sample {capture_count} for {pose_name}")
        
        cap.release()
        cv2.destroyAllWindows()
        
        print(f"✅ Collection complete: {capture_count} samples for {pose_name}")
        return capture_count
    
    def save_sample(self, frame, landmarks, pose_name, sample_id):
        """Save image and landmark data"""
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"{pose_name}_{sample_id:03d}_{timestamp}"
            
            # Save image
            image_path = f"{self.output_dir}/images/{filename}.jpg"
            cv2.imwrite(image_path, frame)
            
            # Extract landmark data
            landmark_data = {
                "pose_name": pose_name,
                "sample_id": sample_id,
                "timestamp": timestamp,
                "image_path": image_path,
                "landmarks": []
            }
            
            # Convert landmarks to serializable format
            for idx, lm in enumerate(landmarks.landmark):
                try:
                    landmark_name = self.mp_pose.PoseLandmark(idx).name
                except:
                    landmark_name = f"landmark_{idx}"
                
                landmark_data["landmarks"].append({
                    "index": idx,
                    "name": landmark_name,
                    "x": float(lm.x),
                    "y": float(lm.y),
                    "z": float(lm.z),
                    "visibility": float(lm.visibility)
                })
            
            # Calculate some basic angles for this pose
            angles = self.calculate_pose_angles(landmarks.landmark, pose_name)
            landmark_data["angles"] = angles
            
            # Save landmark data
            landmark_path = f"{self.output_dir}/landmarks/{filename}.json"
            with open(landmark_path, 'w') as f:
                json.dump(landmark_data, f, indent=2)
            
            return True
            
        except Exception as e:
            print(f"❌ Error saving sample: {e}")
            return False
    
    def calculate_pose_angles(self, landmarks, pose_name):
        """Calculate key angles for the pose"""
        angles = {}
        
        try:
            def calc_angle(a, b, c):
                """Calculate angle between three points"""
                a = np.array([a.x, a.y])
                b = np.array([b.x, b.y])
                c = np.array([c.x, c.y])
                
                radians = np.arctan2(c[1]-b[1], c[0]-b[0]) - np.arctan2(a[1]-b[1], a[0]-b[0])
                angle = np.abs(radians * 180.0 / np.pi)
                
                if angle > 180.0:
                    angle = 360 - angle
                
                return float(angle)
            
            if pose_name == "tree_pose":
                # Key angles for tree pose
                angles["left_knee"] = calc_angle(landmarks[23], landmarks[25], landmarks[27])  # Hip-Knee-Ankle
                angles["right_knee"] = calc_angle(landmarks[24], landmarks[26], landmarks[28])
                angles["spine_alignment"] = calc_angle(landmarks[11], landmarks[23], landmarks[25])  # Shoulder-Hip-Knee
                
            elif pose_name == "warrior_pose":
                # Key angles for warrior pose
                angles["left_knee"] = calc_angle(landmarks[23], landmarks[25], landmarks[27])
                angles["right_knee"] = calc_angle(landmarks[24], landmarks[26], landmarks[28])
                angles["left_arm"] = calc_angle(landmarks[11], landmarks[13], landmarks[15])  # Shoulder-Elbow-Wrist
                angles["right_arm"] = calc_angle(landmarks[12], landmarks[14], landmarks[16])
                
            elif pose_name == "downward_dog":
                # Key angles for downward dog
                angles["hip_angle"] = calc_angle(landmarks[11], landmarks[23], landmarks[25])  # Shoulder-Hip-Knee
                angles["shoulder_angle"] = calc_angle(landmarks[15], landmarks[11], landmarks[23])  # Wrist-Shoulder-Hip
                angles["left_knee"] = calc_angle(landmarks[23], landmarks[25], landmarks[27])
                angles["right_knee"] = calc_angle(landmarks[24], landmarks[26], landmarks[28])
                
            # Add more poses as needed...
            
        except Exception as e:
            print(f"Error calculating angles: {e}")
        
        return angles
    
    def generate_dataset_summary(self):
        """Generate a summary of collected data"""
        summary = {
            "total_samples": 0,
            "poses": {},
            "collection_date": datetime.now().isoformat()
        }
        
        # Count samples per pose
        if os.path.exists(f"{self.output_dir}/landmarks"):
            for filename in os.listdir(f"{self.output_dir}/landmarks"):
                if filename.endswith('.json'):
                    with open(f"{self.output_dir}/landmarks/{filename}", 'r') as f:
                        data = json.load(f)
                        pose_name = data.get('pose_name', 'unknown')
                        
                        if pose_name not in summary["poses"]:
                            summary["poses"][pose_name] = 0
                        summary["poses"][pose_name] += 1
                        summary["total_samples"] += 1
        
        # Save summary
        with open(f"{self.output_dir}/dataset_summary.json", 'w') as f:
            json.dump(summary, f, indent=2)
        
        print(f"\n📊 Dataset Summary:")
        print(f"   Total samples: {summary['total_samples']}")
        for pose, count in summary["poses"].items():
            print(f"   {pose}: {count} samples")
        
        return summary

def main():
    parser = argparse.ArgumentParser(description='Collect yoga pose training data')
    parser.add_argument('--output', '-o', default='training_data', 
                       help='Output directory for training data')
    parser.add_argument('--pose', '-p', 
                       help='Specific pose to collect (skip interactive mode)')
    
    args = parser.parse_args()
    
    collector = YogaDataCollector(args.output)
    
    if args.pose:
        # Collect data for specific pose
        collector.collect_data(args.pose)
    else:
        # Interactive mode
        print("\n🧘 Yoga Pose Data Collection Tool")
        print("=" * 50)
        
        while True:
            print("\nSelect a pose to collect data for:")
            for key, pose in collector.poses.items():
                print(f"   {key}: {pose}")
            print("   0: Generate summary and exit")
            
            choice = input("\nEnter your choice: ").strip()
            
            if choice == '0':
                break
            elif choice in collector.poses:
                pose_name = collector.poses[choice]
                collector.collect_data(pose_name)
            else:
                print("❌ Invalid choice. Please try again.")
    
    # Generate final summary
    collector.generate_dataset_summary()
    print("\n✅ Data collection complete!")

if __name__ == "__main__":
    main()