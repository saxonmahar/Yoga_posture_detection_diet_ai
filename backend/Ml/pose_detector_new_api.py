#!/usr/bin/env python3
"""
MediaPipe New API Pose Detection - Uses MediaPipe 0.10+ for REAL body tracking
This will actually track your body movements using the new MediaPipe API
"""

import cv2
import numpy as np
import json
import time
import base64
import math
from datetime import datetime
from typing import List, Dict, Any

# Import MediaPipe with new API
try:
    import mediapipe as mp
    from mediapipe.tasks import vision
    from mediapipe.tasks.python import BaseOptions
    
    MEDIAPIPE_AVAILABLE = True
    print("✅ MediaPipe NEW API available for REAL pose detection!")
    
except Exception as e:
    MEDIAPIPE_AVAILABLE = False
    print(f"❌ MediaPipe NEW API not available: {e}")

class NewAPIMediaPipePoseDetector:
    def __init__(self):
        """Initialize MediaPipe pose detector with new API"""
        
        self.pose_landmarker = None
        self.detector_type = "none"
        
        if MEDIAPIPE_AVAILABLE:
            try:
                # Create base options
                base_options = BaseOptions(model_asset_path=None)  # Use default model
                
                # Create pose landmarker options
                options = vision.PoseLandmarkerOptions(
                    base_options=base_options,
                    running_mode=vision.RunningMode.IMAGE,
                    num_poses=1,
                    min_pose_detection_confidence=0.5,
                    min_pose_presence_confidence=0.5,
                    min_tracking_confidence=0.5
                )
                
                # Create the pose landmarker
                self.pose_landmarker = vision.PoseLandmarker.create_from_options(options)
                self.detector_type = "mediapipe_new_api"
                print("✅ MediaPipe NEW API pose detector initialized successfully")
                print("🎯 Ready to track your REAL body movements!")
                
            except Exception as e:
                print(f"❌ Failed to initialize MediaPipe NEW API: {e}")
                self.detector_type = "error"
        else:
            self.detector_type = "unavailable"
    
    def detect_pose_from_frame(self, frame, pose_type="tree_pose"):
        """
        Detect REAL pose using MediaPipe NEW API
        """
        try:
            if frame is None:
                return self._create_error_response("No frame provided")
            
            if not MEDIAPIPE_AVAILABLE or self.pose_landmarker is None:
                return self._create_error_response("MediaPipe NEW API not available for real pose detection")
            
            # Convert frame to MediaPipe Image format
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)
            
            print("🎯 Processing frame with MediaPipe NEW API for REAL pose detection...")
            
            # Detect pose using MediaPipe NEW API
            detection_result = self.pose_landmarker.detect(mp_image)
            
            # Check if pose landmarks were detected
            if not detection_result.pose_landmarks or len(detection_result.pose_landmarks) == 0:
                print("❌ No REAL person detected by MediaPipe NEW API")
                return self._create_error_response("No person detected - please ensure you're fully visible with good lighting")
            
            print("✅ REAL person detected by MediaPipe NEW API!")
            
            # Extract REAL landmarks