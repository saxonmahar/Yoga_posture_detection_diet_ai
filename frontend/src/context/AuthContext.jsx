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

      setUser(response.user);
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

  // Load user on refresh
  const loadUser = async () => {
    try {
      const response = await getMeRequest();
      if (response?.data?.user) {
        setUser(response.data.user);
        console.log('✅ User loaded successfully:', response.data.user.name || response.data.user.email);
      } else {
        setUser(null);
        console.log('⚠️ No user data in response');
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