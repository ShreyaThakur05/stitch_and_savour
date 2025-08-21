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

  // Mock users for demo (in real app, this would be API calls)
  const mockUsers = [
    {
      id: 1,
      name: 'Admin',
      email: 'admin@stitchandsavour.com',
      phone: '9970944685',
      address: 'Sirul, Maharashtra, India',
      role: 'admin',
      password: 'admin123'
    }
  ];

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('stitch_savour_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        localStorage.removeItem('stitch_savour_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      if (response.token) {
        localStorage.setItem('token', response.token);
        setUser(response.user);
        localStorage.setItem('stitch_savour_user', JSON.stringify(response.user));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authService.register(userData);
      if (response.token) {
        localStorage.setItem('token', response.token);
        setUser(response.user);
        localStorage.setItem('stitch_savour_user', JSON.stringify(response.user));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('stitch_savour_user');
      localStorage.removeItem('token');
      localStorage.removeItem('stitch_savour_cart');
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