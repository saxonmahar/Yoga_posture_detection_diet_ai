#!/usr/bin/env python
# coding: utf-8

"""
MediaPipe Pose Detection API Script
This script can be called from Node.js to perform pose detection
"""

import sys
import json
import argparse
import cv2
import numpy as np
from mediapipe_pose_detector import MediaPipePoseDetector

def main():
    parser = argparse.ArgumentParser(description='MediaPipe Pose Detection API')
    parser.add_argument('--image', type=str, help='Path to input image')
    parser.add_argument('--pose', type=str, default='warrior', 
                       choices=['warrior', 'tree', 'goddess', 'downdog', 'plank', 'warrior2'],
                       help='Type of yoga pose to detect')
    parser.add_argument('--tts', type=str, default='true', help='Enable TTS feedback')
    parser.add_argument('--realtime', action='store_true', help='Start real-time detection')
    
    args = parser.parse_args()
    
    try:
        detector = MediaPipePoseDetector()
        
        if args.realtime:
            # Real-time detection mode
            print(f"Starting real-time {args.pose} pose detection...")
            
            cap = cv2.VideoCapture(0)
            if not cap.isOpened():
                result = {
                    "success": False,
                    "error": "Could not open webcam"
                }
                print(json.dumps(result))
                return
            
            frame_count = 0
            perfect_poses = 0
            
            while True:
                ret, frame = cap.read()
                if not ret:
                    break
                
                frame_count += 1
                
                # Process every 5th frame for performance
                if frame_count % 5 == 0:
                    result = detector.detect_pose_from_frame(
                        frame, 
                        args.pose, 
                        enable_tts=(args.tts.lower() == 'true')
                    )
                    
                    if result.get("is_perfect"):
                        perfect_poses += 1
                        if perfect_poses >= 3:  # 3 consecutive perfect poses
                            print("Perfect pose achieved! Stopping detection...")
                            break
                    else:
                        perfect_poses = 0
                
                # Display frame (optional, can be removed for headless operation)
                cv2.imshow('Real-time Pose Detection', frame)
                
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break
            
            cap.release()
            cv2.destroyAllWindows()
            
            result = {
                "success": True,
                "message": "Real-time detection completed",
                "frames_processed": frame_count,
                "perfect_poses_achieved": perfect_poses
            }
            
        else:
            # Single image detection mode
            if not args.image:
                result = {
                    "success": False,
                    "error": "Image path is required for single image detection"
                }
                print(json.dumps(result))
                return
            
            # Load image
            frame = cv2.imread(args.image)
            if frame is None:
                result = {
                    "success": False,
                    "error": f"Could not load image: {args.image}"
                }
                print(json.dumps(result))
                return
            
            # Detect pose
            result = detector.detect_pose_from_frame(
                frame, 
                args.pose, 
                enable_tts=(args.tts.lower() == 'true')
            )
        
        # Output result as JSON
        print(json.dumps(result, indent=2))
        
    except Exception as e:
        error_result = {
            "success": False,
            "error": f"Unexpected error: {str(e)}"
        }
        print(json.dumps(error_result))
        sys.exit(1)

if __name__ == "__main__":
    main()