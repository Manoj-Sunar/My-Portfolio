// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { AdminProfile } from '../types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: AdminProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<AdminProfile>) => Promise<boolean>;
  changePassword: (current: string, next: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  verifyOTP: (email: string, otp: string) => Promise<{ success: boolean; token?: string; message: string }>;
  resetPassword: (token: string, password: string) => Promise<{ success: boolean; message: string }>;
}

// Create context outside the component
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Export the provider as a separate component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize from LocalStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('portfolio_token');
    const savedUser = localStorage.getItem('portfolio_user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('portfolio_user');
        localStorage.removeItem('portfolio_token');
      }
    }
    setIsLoading(false);

    // Listen to global Axios interceptor events for 401s
    const handleSessionExpiry = () => {
      setUser(null);
      setToken(null);
      toast.error('Session expired. Please log in again.');
    };

    window.addEventListener('auth_session_expired', handleSessionExpiry);
    return () => {
      window.removeEventListener('auth_session_expired', handleSessionExpiry);
    };
  }, []);

  // 1. Log In
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: receivedToken, admin } = response.data;
      
      setToken(receivedToken);
      setUser(admin);
      localStorage.setItem('portfolio_token', receivedToken);
      localStorage.setItem('portfolio_user', JSON.stringify(admin));
      
      toast.success(`Welcome back, ${admin.name}!`);
      return true;
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Invalid administrator credentials';
      toast.error(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Log Out
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('portfolio_token');
    localStorage.removeItem('portfolio_user');
    toast.success('Logged out successfully.');
  };

  // 3. Update Administrative Profile Info
  const updateProfile = async (data: Partial<AdminProfile>): Promise<boolean> => {
    try {
      const response = await api.put('/auth/update-profile', data);
      const updatedAdmin = response.data.admin;
      setUser(updatedAdmin);
      localStorage.setItem('portfolio_user', JSON.stringify(updatedAdmin));
      toast.success('Profile settings updated successfully!');
      return true;
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to update administrative profile';
      toast.error(msg);
      return false;
    }
  };

  // 4. Change Admin Password
  const changePassword = async (current: string, next: string): Promise<boolean> => {
    try {
      await api.put('/auth/change-password', { currentPassword: current, newPassword: next });
      toast.success('Password updated successfully!');
      return true;
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to modify database password';
      toast.error(msg);
      return false;
    }
  };

  // 5. Trigger Forgot Password Dispatch
  const forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return { success: true, message: response.data.message };
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to trigger reset email';
      return { success: false, message: msg };
    }
  };

  // 5.5 Verify OTP
  const verifyOTP = async (email: string, otp: string): Promise<{ success: boolean; token?: string; message: string }> => {
    try {
      const response = await api.post('/auth/verify-otp', { email, otp });
      return { success: true, token: response.data.token, message: response.data.message };
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Invalid or expired verification code';
      return { success: false, message: msg };
    }
  };

  // 6. Reset password using email link token
  const resetPassword = async (resetToken: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.post('/auth/reset-password', { token: resetToken, password });
      return { success: true, message: response.data.message };
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to restore password';
      return { success: false, message: msg };
    }
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        logout,
        updateProfile,
        changePassword,
        forgotPassword,
        verifyOTP,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Export the hook separately
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be nested within an AuthProvider');
  }
  return context;
}