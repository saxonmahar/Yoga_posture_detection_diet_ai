import { createContext, useContext, useState, useEffect } from "react";
import {
  registerRequest,
  loginRequest,
  getMeRequest,
  logoutRequest
} from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 👈 start true for initial load

  // Register
  const register = async ({ name, email, password, level, age, weight, height, bodyType, goal, bmi }) => {
    setLoading(true);
    try {
      const response = await registerRequest({
        name,
        email,
        password,
        confirmPassword: password,
        level,
        age,
        weight,
        height,
        bodyType,
        goal,
        bmi
      });

      // Don't set user here - they need to verify email first
      // setUser(response.user); // ❌ REMOVED - This was auto-logging in users
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const response = await loginRequest({ email, password });
      console.log('🔍 Login Response:', response);
      console.log('🔍 User Data:', response.data?.user);
      console.log('🔍 Profile Photo:', response.data?.user?.profilePhoto);
      setUser(response.data.user);
      return response;
    } catch (error) {
      setUser(null); // 👈 ensure clean state on failure
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    try {
      await logoutRequest(); // backend clears cookie
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null); // 👈 ALWAYS clear user
      
      // Clear any cached user data from localStorage
      try {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.includes('user') || key.includes('User'))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        console.log('🧹 Cleared cached user data from localStorage');
      } catch (error) {
        console.error('Error clearing localStorage:', error);
      }
      
      setLoading(false);
    }
  };

  // Update user stats - NEW FUNCTION
  const updateUserStats = async (newStats) => {
    if (!user) return;
    
    try {
      const updatedUser = {
        ...user,
        stats: {
          ...user.stats,
          ...newStats
        }
      };
      setUser(updatedUser);
      
      // If you want to persist to backend, add API call here:
      // await updateUserStatsRequest(newStats);
      
      return updatedUser;
    } catch (error) {
      console.error("Error updating user stats:", error);
      throw error;
    }
  };

  // Update user profile photo
  const updateUserPhoto = (photoUrl) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      profilePhoto: photoUrl
    };
    setUser(updatedUser);
    return updatedUser;
  };

  // Load user on refresh
  const loadUser = async () => {
    try {
      const response = await getMeRequest();
      
      // Handle different response structures
      // Login response: {success: true, data: {user: {...}}}
      // /me response: {success: true, user: {...}}
      const userData = response?.data?.user || response?.user;
      
      if (userData) {
        console.log('✅ User loaded from /me endpoint:', userData.name || userData.email);
        console.log('📸 Profile photo from /me:', userData.profilePhoto);
        setUser(userData);
      } else {
        setUser(null);
        console.log('⚠️ No user data in /me response');
      }
    } catch (error) {
      // Suppress 401 error logs - these are expected for non-authenticated users
      if (error.response?.status === 401 || error.response?.status === 403) {
        setUser(null);
        console.log('ℹ️ User not authenticated - showing guest experience');
      } else {
        // Only log unexpected errors
        console.error('❌ Unexpected error loading user:', error.message);
        // For network errors, don't clear user - might be temporary
        if (!error.response) {
          console.log('🌐 Network error - keeping existing user state');
        } else {
          setUser(null);
        }
      }
    } finally {
      setLoading(false); // 👈 CRITICAL
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        register,
        login,
        logout,
        updateUserStats, // 👈 Added to context
        updateUserPhoto, // 👈 Added photo update function
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};