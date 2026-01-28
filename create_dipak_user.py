#!/usr/bin/env python3
"""
Create a test user named 'dipak' for testing authentication flow.
"""

import requests
import json
import time

BASE_URL = "http://localhost:5001"

def create_dipak_user():
    """Create a user named dipak"""
    print("👤 Creating user 'dipak' with email dipak123@gmail.com...")
    
    dipak_user = {
        "name": "Dipak Kumar",
        "email": "dipak123@gmail.com",  # Correct email
        "password": "dipak123",
        "confirmPassword": "dipak123",
        "level": "beginner",
        "age": 28,
        "weight": 75,
        "height": 175,
        "bodyType": "mesomorphic",
        "goal": "weight-loss",
        "bmi": 24.5
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/auth/register", json=dipak_user)
        print(f"   Registration response: {response.status_code}")
        
        if response.status_code == 201:
            data = response.json()
            user = data.get('user', {})
            print(f"   ✅ User created successfully!")
            print(f"   Name: {user.get('name')}")
            print(f"   Email: {user.get('email')}")
            print(f"   ID: {user.get('_id') or user.get('id')}")
            
            # Now test login
            print("\n🔐 Testing login with new user...")
            login_data = {
                "email": "dipak123@gmail.com",  # Correct email
                "password": "dipak123"
            }
            
            session = requests.Session()
            login_response = session.post(f"{BASE_URL}/api/auth/login", json=login_data)
            print(f"   Login response: {login_response.status_code}")
            
            if login_response.status_code == 200:
                login_data = login_response.json()
                print(f"   ✅ Login successful!")
                print(f"   User: {login_data.get('data', {}).get('user', {}).get('name')}")
                
                # Test auth/me
                me_response = session.get(f"{BASE_URL}/api/auth/me")
                print(f"   Auth/me response: {me_response.status_code}")
                
                if me_response.status_code == 200:
                    me_data = me_response.json()
                    print(f"   ✅ Auth/me successful: {me_data.get('user', {}).get('name')}")
                    
                    # Test analytics
                    user_id = me_data.get('user', {}).get('id')
                    if user_id:
                        analytics_response = session.get(f"{BASE_URL}/api/analytics/user/{user_id}")
                        print(f"   Analytics response: {analytics_response.status_code}")
                        
                        if analytics_response.status_code == 200:
                            analytics_data = analytics_response.json()
                            if analytics_data.get('success'):
                                stats = analytics_data.get('analytics', {}).get('overall_stats', {})
                                print(f"   ✅ Analytics: {stats.get('total_sessions', 0)} sessions, {stats.get('current_streak', 0)} streak")
                            else:
                                print(f"   ⚠️ Analytics failed: {analytics_data.get('error')}")
                        else:
                            print(f"   ❌ Analytics failed: {analytics_response.status_code}")
                else:
                    print(f"   ❌ Auth/me failed: {me_response.text}")
            else:
                print(f"   ❌ Login failed: {login_response.text}")
                
        else:
            print(f"   ❌ Registration failed: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Error creating dipak user: {e}")

def main():
    print("🧪 Creating Test User 'Dipak'")
    print("=" * 50)
    
    create_dipak_user()
    
    print("\n" + "=" * 50)
    print("✅ Test user 'dipak' is ready!")
    print("📧 Email: dipak123@gmail.com")
    print("🔑 Password: dipak123")
    print("\nYou can now:")
    print("1. Login with these credentials in the frontend")
    print("2. Complete a yoga session")
    print("3. Check if progress page works correctly")

if __name__ == "__main__":
    main()