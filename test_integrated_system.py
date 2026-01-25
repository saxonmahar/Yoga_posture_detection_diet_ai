#!/usr/bin/env python3
"""
Test script to verify our integrated pose detection system is working
This tests the complete flow: Frontend -> Backend -> ML API
"""

import requests
import json
import base64
import cv2
import numpy as np
import time

def test_ml_api():
    """Test the ML API endpoints"""
    
    print("🧘 Testing Integrated Pose Detection System")
    print("=" * 60)
    
    # Test 1: Health check
    print("📋 Test 1: ML API Health Check")
    try:
        response = requests.get("http://localhost:5000/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ ML API Status: {data['status']}")
            print(f"   Detector: {data['detector']}")
            print(f"   Service: {data['service']}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False
    
    # Test 2: Available poses
    print("\n📋 Test 2: Available Poses")
    try:
        response = requests.get("http://localhost:5000/api/ml/available-poses", timeout=5)
        if response.status_code == 200:
            data = response.json()
            poses = data.get('poses', {})
            print(f"✅ Found {len(poses)} available poses:")
            for pose_id, pose_info in poses.items():
                print(f"   {pose_id}: {pose_info['name']} ({pose_info['difficulty']})")
        else:
            print(f"❌ Available poses failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Available poses error: {e}")
        return False
    
    # Test 3: Pose detection with sample image
    print("\n📋 Test 3: Pose Detection API")
    try:
        # Create a simple test image (black image)
        test_image_path = "backend/Ml/Video/yoga12.jpg"
        test_image = cv2.imread(test_image_path)
        
        if test_image is None:
            # Create a dummy image if file doesn't exist
            test_image = np.zeros((480, 640, 3), dtype=np.uint8)
            print("⚠️ Using dummy image (original not found)")
        else:
            print("✅ Using sample yoga image")
        
        # Convert to base64
        _, buffer = cv2.imencode('.jpg', test_image)
        image_base64 = base64.b64encode(buffer).decode('utf-8')
        
        # Test pose detection
        payload = {
            "pose_type": "yog3",  # Tree pose
            "image": f"data:image/jpeg;base64,{image_base64}"
        }
        
        response = requests.post(
            "http://localhost:5000/api/ml/detect-pose", 
            json=payload, 
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data['success']:
                print(f"✅ Pose detection successful!")
                print(f"   Pose: {data.get('pose_name', 'Unknown')}")
                print(f"   Landmarks: {len(data.get('landmarks', []))}")
                print(f"   Confidence: {data.get('confidence', 0):.2f}")
                print(f"   Accuracy: {data.get('accuracy_score', 0):.1f}%")
                print(f"   Is Correct: {data.get('is_correct', False)}")
                
                feedback = data.get('feedback', [])
                if feedback:
                    print(f"   Feedback: {feedback[0]}")
                
            else:
                print(f"❌ Pose detection failed: {data.get('error', 'Unknown error')}")
                return False
        else:
            print(f"❌ Pose detection API failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Pose detection error: {e}")
        return False
    
    # Test 4: Professional pose endpoints
    print("\n📋 Test 4: Professional Pose Endpoints")
    try:
        for pose_id in ['yog1', 'yog2', 'yog3']:
            response = requests.post(f"http://localhost:5000/api/ml/pose/{pose_id}", timeout=5)
            if response.status_code == 200:
                data = response.json()
                print(f"✅ {pose_id}: {data.get('pose_name', 'Unknown')}")
            else:
                print(f"❌ {pose_id} failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Professional pose endpoints error: {e}")
        return False
    
    return True

def test_backend_api():
    """Test the backend API"""
    
    print("\n📋 Test 5: Backend API Health")
    try:
        response = requests.get("http://localhost:5001/health", timeout=5)
        if response.status_code == 200:
            print("✅ Backend API is healthy")
        else:
            print(f"❌ Backend API failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Backend API error: {e}")
        return False
    
    return True

def test_frontend():
    """Test if frontend is accessible"""
    
    print("\n📋 Test 6: Frontend Accessibility")
    try:
        response = requests.get("http://localhost:3001", timeout=5)
        if response.status_code == 200:
            print("✅ Frontend is accessible")
        else:
            print(f"❌ Frontend failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Frontend error: {e}")
        return False
    
    return True

if __name__ == "__main__":
    print("🚀 INTEGRATED SYSTEM TEST")
    print("Testing the complete yoga pose detection system...")
    print()
    
    # Run all tests
    ml_success = test_ml_api()
    backend_success = test_backend_api()
    frontend_success = test_frontend()
    
    print("\n" + "=" * 60)
    print("📊 FINAL TEST RESULTS:")
    print(f"   ML API: {'✅ PASS' if ml_success else '❌ FAIL'}")
    print(f"   Backend API: {'✅ PASS' if backend_success else '❌ FAIL'}")
    print(f"   Frontend: {'✅ PASS' if frontend_success else '❌ FAIL'}")
    
    if ml_success and backend_success and frontend_success:
        print("\n🎉 ALL SYSTEMS WORKING!")
        print("💡 Your integrated pose detection system is ready!")
        print("🌐 Open: http://localhost:3001/pose-detection")
        print("🧘 Click 'Start Webcam & Detection' to begin")
    else:
        print("\n⚠️ Some systems need attention")
        if not ml_success:
            print("   - Check ML service on port 5000")
        if not backend_success:
            print("   - Check Backend service on port 5001")
        if not frontend_success:
            print("   - Check Frontend service on port 3001")
    
    print("=" * 60)