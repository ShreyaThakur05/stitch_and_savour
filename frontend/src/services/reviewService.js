import axios from 'axios';

import { config } from '../config/config';

const API_URL = config.API_URL;

// Create axios instance
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

export const reviewService = {
  // Create review - save to both backend and localStorage
  createReview: async (reviewData) => {
    try {
      // Try to save to backend first
      const response = await api.post('/reviews', reviewData);
      
      // If backend succeeds, also save to localStorage
      const existingReviews = JSON.parse(localStorage.getItem('productReviews') || '[]');
      existingReviews.push({
        ...reviewData,
        id: response.data.review._id,
        createdAt: response.data.review.createdAt
      });
      localStorage.setItem('productReviews', JSON.stringify(existingReviews));
      
      return response.data;
    } catch (error) {
      // Fallback to localStorage if backend fails
      console.warn('Backend unavailable, saving review locally:', error.message);
      const localReview = {
        ...reviewData,
        id: 'local_' + Date.now(),
        createdAt: new Date().toISOString(),
        isLocal: true
      };
      
      const existingReviews = JSON.parse(localStorage.getItem('productReviews') || '[]');
      existingReviews.push(localReview);
      localStorage.setItem('productReviews', JSON.stringify(existingReviews));
      
      return { success: true, review: localReview };
    }
  },

  // Get reviews for a product - try backend first, fallback to localStorage
  getProductReviews: async (productId) => {
    try {
      const response = await api.get(`/reviews/product/${productId}`);
      
      // Merge with local reviews
      const localReviews = JSON.parse(localStorage.getItem('productReviews') || '[]')
        .filter(r => r.productId === productId && r.isLocal);
      
      return [...response.data.reviews, ...localReviews];
    } catch (error) {
      console.warn('Backend unavailable, using local reviews:', error.message);
      return JSON.parse(localStorage.getItem('productReviews') || '[]')
        .filter(r => r.productId === productId);
    }
  },

  // Get all reviews - try backend first, fallback to localStorage
  getAllReviews: async () => {
    try {
      const response = await api.get('/reviews');
      
      // Merge with local reviews
      const localReviews = JSON.parse(localStorage.getItem('productReviews') || '[]')
        .filter(r => r.isLocal);
      
      return [...response.data.reviews, ...localReviews];
    } catch (error) {
      console.warn('Backend unavailable, using local reviews:', error.message);
      return JSON.parse(localStorage.getItem('productReviews') || '[]');
    }
  }
};

export default reviewService;