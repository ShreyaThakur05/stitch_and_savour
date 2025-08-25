import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import userService from '../services/userService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // All authentication now handled by backend API

  // Validate token and load user on mount
  useEffect(() => {
    const validateAndLoadUser = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('stitch_savour_user');
      
      if (token && savedUser) {
        try {
          // Validate token by fetching current user from API
          const response = await authService.getCurrentUser();
          if (response.user) {
            setUser(response.user);
            // Update localStorage with fresh user data
            localStorage.setItem('stitch_savour_user', JSON.stringify(response.user));
          } else {
            // Token invalid, clear everything
            localStorage.removeItem('token');
            localStorage.removeItem('stitch_savour_user');
            setUser(null);
          }
        } catch (error) {
          console.error('Token validation failed:', error);
          
          // Don't clear admin data immediately, let them try to re-authenticate
          const currentPath = window.location.pathname;
          if (currentPath.includes('/admin')) {
            console.log('Admin token validation failed, keeping user data temporarily');
            // Keep user data but mark as potentially invalid
            const savedUserData = JSON.parse(savedUser);
            if (savedUserData.role === 'admin') {
              setUser({ ...savedUserData, tokenInvalid: true });
              setLoading(false);
              return;
            }
          }
          
          // Token expired or invalid, clear everything for regular users
          localStorage.removeItem('token');
          localStorage.removeItem('stitch_savour_user');
          localStorage.removeItem('stitch_savour_cart');
          localStorage.removeItem('redirectAfterLogin');
          setUser(null);
        }
      } else if (savedUser) {
        // User data exists but no token, clear stale data
        localStorage.removeItem('stitch_savour_user');
        setUser(null);
      }
      
      setLoading(false);
    };
    
    validateAndLoadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      if (response.token && response.user) {
        // Store token and user data
        localStorage.setItem('token', response.token);
        localStorage.setItem('stitch_savour_user', JSON.stringify(response.user));
        setUser(response.user);
        
        console.log('✅ Login successful for:', response.user.email);
        return { success: true };
      }
      return { success: false, error: 'Invalid response from server' };
    } catch (error) {
      console.error('❌ Login error:', error.message);
      
      // Clear any stale data
      localStorage.removeItem('token');
      localStorage.removeItem('stitch_savour_user');
      setUser(null);
      
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authService.register(userData);
      if (response.token && response.user) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('stitch_savour_user', JSON.stringify(response.user));
        setUser(response.user);
        
        console.log('✅ Signup successful for:', response.user.email);
        return { success: true };
      }
      return { success: false, error: 'Invalid response from server' };
    } catch (error) {
      console.error('❌ Signup error:', error.message);
      
      // Clear any stale data
      localStorage.removeItem('token');
      localStorage.removeItem('stitch_savour_user');
      setUser(null);
      
      return { success: false, error: error.message || 'Signup failed' };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all auth-related data
      setUser(null);
      localStorage.removeItem('stitch_savour_user');
      localStorage.removeItem('token');
      localStorage.removeItem('stitch_savour_cart');
      localStorage.removeItem('redirectAfterLogin');
      
      // Clear any cached form data
      const forms = document.querySelectorAll('form');
      forms.forEach(form => {
        if (form.reset) form.reset();
      });
      
      // Force page reload to clear any stale state
      window.location.href = '/login';
    }
  };

  const updateProfile = async (updatedData) => {
    try {
      const result = await userService.updateProfile(updatedData);
      if (result.success) {
        const updatedUser = { ...user, ...updatedData };
        setUser(updatedUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};