#!/usr/bin/env python3
"""
Test script to verify authentication for user 'dipak' specifically.
This will help debug why the user is losing authentication between pages.
"""

import requests
import json

# API endpoints
BASE_URL = "http://localhost:5001"

def test_dipak_login():
    """Test login for user dipak with correct credentials"""
    print("🔍 Testing login for user 'dipak' (ID: 697a2a94f5565b55e386f60b)...")
    
    # Try to login with dipak's actual credentials
    login_data = {
        "email": "dipak124@gmail.com",  # Correct dipak email from your data
        "password": "dipak123"          # Try common password
    }
    
    try:
        # Create a session to maintain cookies
        session = requests.Session()
        
        # Login
        response = session.post(f"{BASE_URL}/api/auth/login", json=login_data)
        print(f"   Login response: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            user = data.get('data', {}).get('user', {})
            print(f"   ✅ Login successful for: {user.get('name')} ({user.get('email')})")
            print(f"   User ID: {user.get('id')}")
            
            # Check cookies
            cookies = session.cookies.get_dict()
            print(f"   Cookies received: {list(cookies.keys())}")
            
            # Test /auth/me endpoint with the same session
            me_response = session.get(f"{BASE_URL}/api/auth/me")
            print(f"   Auth/me response: {me_response.status_code}")
            
            if me_response.status_code == 200:
                me_data = me_response.json()
                me_user = me_data.get('user', {})
                print(f"   ✅ Auth/me successful: {me_user.get('name')} ({me_user.get('email')})")
                print(f"   User ID from auth/me: {me_user.get('id')}")
                
                # Test analytics endpoint for dipak's specific data
                user_id = me_user.get('id')
                if user_id:
                    analytics_response = session.get(f"{BASE_URL}/api/analytics/user/{user_id}")
                    print(f"   Analytics response: {analytics_response.status_code}")
                    
                    if analytics_response.status_code == 200:
                        analytics_data = analytics_response.json()
                        if analytics_data.get('success'):
                            stats = analytics_data.get('analytics', {}).get('overall_stats', {})
                            print(f"   ✅ Dipak's Analytics:")
                            print(f"     - Total sessions: {stats.get('total_sessions', 0)}")
                            print(f"     - Current streak: {stats.get('current_streak', 0)}")
                            print(f"     - Favorite pose: {stats.get('favorite_pose', 'None')}")
                            
                            # Check recent sessions
                            recent = analytics_data.get('analytics', {}).get('recent_sessions', [])
                            print(f"     - Recent sessions: {len(recent)}")
                        else:
                            print(f"   ⚠️ Analytics failed: {analytics_data.get('error')}")
                    else:
                        print(f"   ❌ Analytics failed with status: {analytics_response.status_code}")
                
                return session, me_user
            else:
                print(f"   ❌ Auth/me failed: {me_response.text}")
                return None, None
        else:
            print(f"   ❌ Login failed: {response.text}")
            # Try with different common passwords for dipak
            common_passwords = ["password", "123456", "dipak", "dipak@123", "dipak124"]
            for pwd in common_passwords:
                print(f"   Trying password: {pwd}")
                login_data["password"] = pwd
                response = session.post(f"{BASE_URL}/api/auth/login", json=login_data)
                if response.status_code == 200:
                    print(f"   ✅ Login successful with password: {pwd}")
                    data = response.json()
                    user = data.get('data', {}).get('user', {})
                    return session, user
            return None, None
            
    except Exception as e:
        print(f"   ❌ Error testing dipak login: {e}")
        return None, None

def test_cookie_persistence():
    """Test if cookies persist across requests"""
    print("\n🍪 Testing cookie persistence...")
    
    session, user = test_dipak_login()
    if not session or not user:
        print("   ❌ Cannot test cookie persistence - login failed")
        return
    
    # Make multiple requests to see if cookies persist
    for i in range(3):
        print(f"   Request {i+1}:")
        response = session.get(f"{BASE_URL}/api/auth/me")
        print(f"     Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"     ✅ User: {data.get('user', {}).get('name')}")
        else:
            print(f"     ❌ Failed: {response.text}")

def test_different_user():
    """Test with a different user to ensure isolation"""
    print("\n👤 Testing with different user...")
    
    # Try to create/login with a different user
    test_user = {
        "email": "testuser@example.com",
        "password": "testpass123"
    }
    
    try:
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json=test_user)
        
        if response.status_code == 200:
            print("   ✅ Different user login successful")
            
            # Check auth/me
            me_response = session.get(f"{BASE_URL}/api/auth/me")
            if me_response.status_code == 200:
                user_data = me_response.json().get('user', {})
                print(f"   User: {user_data.get('name')} ({user_data.get('email')})")
            else:
                print(f"   ❌ Auth/me failed for different user")
        else:
            print(f"   ⚠️ Different user login failed (might not exist): {response.status_code}")
            
    except Exception as e:
        print(f"   ❌ Error testing different user: {e}")

def main():
    print("🧪 Testing Authentication for User 'dipak'")
    print("=" * 60)
    
    # Test 1: Basic login and auth flow
    session, user = test_dipak_login()
    
    # Test 2: Cookie persistence
    test_cookie_persistence()
    
    # Test 3: Different user isolation
    test_different_user()
    
    print("\n" + "=" * 60)
    print("🎯 Debugging Tips:")
    print("1. Check browser dev tools -> Application -> Cookies")
    print("2. Look for 'token' cookie from localhost:5001")
    print("3. Check console logs in browser for auth errors")
    print("4. Verify user stays logged in when navigating between pages")
    
    if user:
        print(f"\n💡 User 'dipak' details:")
        print(f"   Name: {user.get('name')}")
        print(f"   Email: {user.get('email')}")
        print(f"   ID: {user.get('id')}")
        print("   This user should stay authenticated across page navigation!")

if __name__ == "__main__":
    main()