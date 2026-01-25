#!/usr/bin/env python3
"""Test the pose detection API"""

import requests
import base64
import cv2
import json

def test_pose_api():
    """Test pose detection API with webcam"""
    print("🧘 Testing pose detection API...")
    
    # Capture a frame from webcam
    cap = cv2.VideoCapture(0)
    ret, frame = cap.read()
    cap.release()
    
    if not ret:
        print("❌ Cannot capture frame from webcam")
        return
    
    # Encode frame as base64
    _, buffer = cv2.imencode('.jpg', frame)
    image_base64 = base64.b64encode(buffer).decode('utf-8')
    image_data = f"data:image/jpeg;base64,{image_base64}"
    
    # Test API
    url = "http://localhost:5000/api/ml/detect-pose"
    payload = {
        "image": image_data,
        "pose_type": "yog3",
        "user_name": "TestUser"
    }
    
    try:
        response = requests.post(url, json=payload, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ API Response: {json.dumps(result, indent=2)}")
            
            if result.get('success') and result.get('landmarks'):
                landmarks = result['landmarks']
                print(f"✅ Detected {len(landmarks)} landmarks!")
                
                # Print first few landmarks
                for i, lm in enumerate(landmarks[:5]):
                    print(f"   Landmark {i}: x={lm['x']:.3f}, y={lm['y']:.3f}, visibility={lm.get('visibility', 0):.3f}")
            else:
                print("❌ No landmarks detected")
        else:
            print(f"❌ API Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Request failed: {e}")

if __name__ == "__main__":
    test_pose_api()