import axios from 'axios';
import { config } from '../config/config';

const API_URL = config.API_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration and auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const errorCode = error.response?.data?.code;
      const currentPath = window.location.pathname;
      
      // Don't auto-logout on admin pages unless explicitly token expired
      if (currentPath.includes('/admin') && errorCode !== 'TOKEN_EXPIRED') {
        console.log('Admin auth error, but not auto-redirecting:', errorCode);
        return Promise.reject(error);
      }
      
      // Clear all auth data
      localStorage.removeItem('token');
      localStorage.removeItem('stitch_savour_user');
      
      // Only redirect if not already on login page
      if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
        console.log('Token expired or invalid, redirecting to login');
        if (currentPath.includes('/admin')) {
          window.location.href = '/login';
        } else {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get user data');
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/auth/profile', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Profile update failed');
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Password change failed');
    }
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Server logout failed:', error);
    } finally {
      // Always clear all auth data locally
      localStorage.removeItem('token');
      localStorage.removeItem('stitch_savour_user');
      localStorage.removeItem('stitch_savour_cart');
      localStorage.removeItem('redirectAfterLogin');
    }
  }
};

export default api;