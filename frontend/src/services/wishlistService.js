import axios from 'axios';

import { config } from '../config/config';

const API_URL = config.API_URL;

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

export const wishlistService = {
  // Add to wishlist - save to both backend and localStorage
  addToWishlist: async (product, userEmail) => {
    try {
      // Try to save to backend first
      const response = await api.post('/wishlist/add', {
        productId: product._id,
        productName: product.name,
        productPrice: product.price,
        productImage: product.images?.[0] || ''
      });
      
      // Update localStorage
      const existingWishlist = JSON.parse(localStorage.getItem(`wishlist_${userEmail}`) || '[]');
      if (!existingWishlist.find(item => item._id === product._id)) {
        existingWishlist.push(product);
        localStorage.setItem(`wishlist_${userEmail}`, JSON.stringify(existingWishlist));
      }
      
      return response.data;
    } catch (error) {
      // Fallback to localStorage only
      console.warn('Backend unavailable, saving to localStorage only:', error.message);
      const existingWishlist = JSON.parse(localStorage.getItem(`wishlist_${userEmail}`) || '[]');
      if (!existingWishlist.find(item => item._id === product._id)) {
        existingWishlist.push({ ...product, isLocal: true });
        localStorage.setItem(`wishlist_${userEmail}`, JSON.stringify(existingWishlist));
      }
      return { success: true };
    }
  },

  // Remove from wishlist
  removeFromWishlist: async (productId, userEmail) => {
    try {
      await api.delete(`/wishlist/remove/${productId}`);
      
      // Update localStorage
      const existingWishlist = JSON.parse(localStorage.getItem(`wishlist_${userEmail}`) || '[]');
      const updatedWishlist = existingWishlist.filter(item => item._id !== productId);
      localStorage.setItem(`wishlist_${userEmail}`, JSON.stringify(updatedWishlist));
      
      return { success: true };
    } catch (error) {
      // Fallback to localStorage only
      const existingWishlist = JSON.parse(localStorage.getItem(`wishlist_${userEmail}`) || '[]');
      const updatedWishlist = existingWishlist.filter(item => item._id !== productId);
      localStorage.setItem(`wishlist_${userEmail}`, JSON.stringify(updatedWishlist));
      return { success: true };
    }
  },

  // Get user wishlist
  getUserWishlist: async (userEmail) => {
    try {
      const response = await api.get('/wishlist');
      
      // Merge with localStorage
      const localWishlist = JSON.parse(localStorage.getItem(`wishlist_${userEmail}`) || '[]');
      const backendIds = response.data.wishlist.map(item => item._id);
      const localOnlyItems = localWishlist.filter(item => !backendIds.includes(item._id));
      
      return [...response.data.wishlist, ...localOnlyItems];
    } catch (error) {
      console.warn('Backend unavailable, using localStorage:', error.message);
      return JSON.parse(localStorage.getItem(`wishlist_${userEmail}`) || '[]');
    }
  }
};

export default wishlistService;