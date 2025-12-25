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
  const register = async ({ name, email, password, level }) => {
    setLoading(true);
    try {
      const response = await registerRequest({
        name,
        email,
        password,
        confirmPassword: password,
        level
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

  // Load user on refresh
  const loadUser = async () => {
    try {
      const response = await getMeRequest();
      setUser(response.data.user);
    } catch (error) {
      setUser(null);
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
