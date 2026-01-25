#!/usr/bin/env python3
"""Simple MediaPipe test"""

import cv2
import numpy as np

def test_simple():
    print("🧘 Testing MediaPipe 0.10.x...")
    
    try:
        import mediapipe as mp
        from mediapipe.tasks import python as mp_tasks
        from mediapipe.tasks.python import vision
        
        # Create pose landmarker
        base_options = mp_tasks.BaseOptions(model_asset_path='pose_landmarker.task')
        options = vision.PoseLandmarkerOptions(
            base_options=base_options,
            output_segmentation_masks=False)
        detector = vision.PoseLandmarker.create_from_options(options)
        
        print("✅ MediaPipe detector created successfully")
        
        # Create a test image (black image)
        test_image = np.zeros((480, 640, 3), dtype=np.uint8)
        
        # Convert to MediaPipe format
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=test_image)
        
        # Test detection
        result = detector.detect(mp_image)
        
        if result.pose_landmarks:
            print(f"✅ Detected {len(result.pose_landmarks[0])} landmarks")
        else:
            print("✅ No pose detected (expected for black image)")
        
        print("✅ MediaPipe is working!")
        return True
        
    except Exception as e:
        print(f"❌ MediaPipe test failed: {e}")
        return False

if __name__ == "__main__":
    test_simple()