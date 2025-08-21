import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const userService = {
  // Update user profile - save to both backend and localStorage
  updateProfile: async (userData) => {
    try {
      // Try to save to backend first
      const response = await api.put('/users/profile', userData);
      
      // Update localStorage
      const currentUser = JSON.parse(localStorage.getItem('stitch_savour_user') || '{}');
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem('stitch_savour_user', JSON.stringify(updatedUser));
      
      return response.data;
    } catch (error) {
      // Fallback to localStorage only
      console.warn('Backend unavailable, updating localStorage only:', error.message);
      const currentUser = JSON.parse(localStorage.getItem('stitch_savour_user') || '{}');
      const updatedUser = { ...currentUser, ...userData, isLocal: true };
      localStorage.setItem('stitch_savour_user', JSON.stringify(updatedUser));
      
      return { success: true, user: updatedUser };
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      
      // Update localStorage with latest data
      localStorage.setItem('stitch_savour_user', JSON.stringify(response.data.user));
      
      return response.data;
    } catch (error) {
      console.warn('Backend unavailable, using localStorage:', error.message);
      const localUser = JSON.parse(localStorage.getItem('stitch_savour_user') || '{}');
      return { user: localUser };
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/users/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to change password');
    }
  }
};

export default userService;