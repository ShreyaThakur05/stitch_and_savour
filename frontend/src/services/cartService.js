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

export const cartService = {
  // Sync cart to backend
  syncCart: async (cartItems) => {
    try {
      const response = await api.put('/cart', { items: cartItems });
      return response.data;
    } catch (error) {
      console.warn('Failed to sync cart to backend:', error.message);
      return { success: false };
    }
  },

  // Get cart from backend
  getCart: async () => {
    try {
      const response = await api.get('/cart');
      return response.data.cart.items || [];
    } catch (error) {
      console.warn('Failed to get cart from backend:', error.message);
      return [];
    }
  },

  // Clear cart
  clearCart: async () => {
    try {
      await api.delete('/cart');
      return { success: true };
    } catch (error) {
      console.warn('Failed to clear cart on backend:', error.message);
      return { success: false };
    }
  }
};

export default cartService;