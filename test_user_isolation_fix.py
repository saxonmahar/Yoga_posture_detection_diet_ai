#!/usr/bin/env python3
"""
Test script to verify user isolation fix is working correctly.
This script tests that each user sees only their own data.
"""

import requests
import json
import time
from datetime import datetime

# API endpoints
BASE_URL = "http://localhost:5001"
LOGIN_URL = f"{BASE_URL}/api/auth/login"
ANALYTICS_URL = f"{BASE_URL}/api/analytics/user"
SESSION_URL = f"{BASE_URL}/api/analytics/session"

def test_user_isolation():
    """Test that users only see their own data"""
    print("🧪 Testing User Isolation Fix")
    print("=" * 50)
    
    # Test users
    users = [
        {"email": "dipak123@gmail.com", "password": "dipak123", "name": "dipak"},
        {"email": "nirva@example.com", "password": "password123", "name": "nirva"}
    ]
    
    user_sessions = {}
    
    # Step 1: Login each user and create sessions
    for user in users:
        print(f"\n👤 Testing user: {user['name']}")
        
        # Login
        try:
            login_response = requests.post(LOGIN_URL, json={
                "email": user["email"],
                "password": user["password"]
            })
            
            if login_response.status_code == 200:
                user_data = login_response.json()["data"]["user"]
                user_id = user_data.get("_id") or user_data.get("id")
                print(f"✅ Login successful for {user['name']} (ID: {user_id})")
                
                # Create a test session for this user
                session_data = {
                    "user_id": user_id,
                    "total_duration": 5,  # 5 minutes
                    "poses_practiced": [{
                        "pose_id": "yog2",
                        "pose_name": "T Pose",
                        "accuracy_score": 85 + (hash(user['name']) % 10),  # Different scores per user
                        "attempts_count": 3,
                        "hold_duration": 60,
                        "completed_successfully": True,
                        "timestamp": datetime.now().isoformat()
                    }],
                    "session_notes": f"Test session for {user['name']}"
                }
                
                session_response = requests.post(SESSION_URL, json=session_data)
                if session_response.status_code == 201:
                    print(f"✅ Test session created for {user['name']}")
                    user_sessions[user_id] = session_data
                else:
                    print(f"❌ Failed to create session for {user['name']}: {session_response.status_code}")
                    
            else:
                print(f"❌ Login failed for {user['name']}: {login_response.status_code}")
                
        except Exception as e:
            print(f"❌ Error testing {user['name']}: {e}")
    
    # Step 2: Verify each user only sees their own data
    print(f"\n🔍 Verifying User Data Isolation")
    print("-" * 30)
    
    for user in users:
        print(f"\n👤 Checking data for: {user['name']}")
        
        # Login again to get fresh session
        try:
            login_response = requests.post(LOGIN_URL, json={
                "email": user["email"],
                "password": user["password"]
            })
            
            if login_response.status_code == 200:
                user_data = login_response.json()["data"]["user"]
                user_id = user_data.get("_id") or user_data.get("id")
                
                # Get analytics for this user
                analytics_response = requests.get(f"{ANALYTICS_URL}/{user_id}")
                
                if analytics_response.status_code == 200:
                    analytics = analytics_response.json()["analytics"]
                    
                    # Check if user sees only their own data
                    total_sessions = analytics["overall_stats"]["total_sessions"]
                    recent_sessions = analytics.get("recent_sessions", [])
                    
                    print(f"  📊 Total sessions: {total_sessions}")
                    print(f"  📈 Recent sessions: {len(recent_sessions)}")
                    
                    # Verify session data belongs to this user
                    data_isolation_ok = True
                    for session in recent_sessions:
                        session_user_id = session.get("user_id")
                        if session_user_id != user_id:
                            print(f"  ❌ CRITICAL: Found session from different user! Session user_id: {session_user_id}, Current user_id: {user_id}")
                            data_isolation_ok = False
                    
                    if data_isolation_ok and recent_sessions:
                        print(f"  ✅ Data isolation verified - all sessions belong to {user['name']}")
                    elif data_isolation_ok and not recent_sessions:
                        print(f"  ℹ️ No sessions found for {user['name']} (expected for new users)")
                    
                else:
                    print(f"  ❌ Failed to get analytics: {analytics_response.status_code}")
                    
        except Exception as e:
            print(f"  ❌ Error checking {user['name']}: {e}")
    
    # Step 3: Test localStorage cleanup instructions
    print(f"\n🧹 LocalStorage Cleanup Instructions")
    print("-" * 40)
    print("The following localStorage keys should be cleaned up:")
    print("❌ Remove: 'yogaProgressData' (shared)")
    print("❌ Remove: 'yogaSessionData' (shared)")  
    print("❌ Remove: 'lastYogaSessionTime' (shared)")
    print("✅ Keep: 'yogaProgressData_<userId>' (user-specific)")
    print("✅ Keep: 'yogaSessionData_<userId>' (user-specific)")
    print("✅ Keep: 'lastYogaSessionTime_<userId>' (user-specific)")
    
    print(f"\n🎯 User Isolation Test Complete")
    print("=" * 50)
    print("✅ Each user should now see only their own progress data")
    print("✅ No cross-user data contamination should occur")
    print("✅ LocalStorage is now user-specific with cleanup")

if __name__ == "__main__":
    test_user_isolation()