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
  // Create review - DATABASE FIRST approach
  createReview: async (reviewData) => {
    try {
      // Always try database first
      const response = await api.post('/reviews', {
        productId: reviewData.productId,
        rating: reviewData.rating,
        comment: reviewData.review || reviewData.comment,
        customerName: reviewData.customerName,
        customerEmail: reviewData.customerEmail,
        orderNumber: reviewData.orderNumber,
        productName: reviewData.productName
      });
      
      console.log('⭐ Review saved to database:', response.data.review._id);
      return response.data;
    } catch (error) {
      // Only fallback to localStorage if database completely fails
      console.error('Database unavailable, saving review locally:', error.message);
      const localReview = {
        ...reviewData,
        id: 'local_' + Date.now(),
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        isLocal: true
      };
      
      const existingReviews = JSON.parse(localStorage.getItem('productReviews') || '[]');
      existingReviews.push(localReview);
      localStorage.setItem('productReviews', JSON.stringify(existingReviews));
      
      return { success: true, review: localReview };
    }
  },

  // Get reviews for a product - DATABASE FIRST approach
  getProductReviews: async (productId) => {
    try {
      const response = await api.get(`/reviews/product/${productId}`);
      console.log('⭐ Product reviews from database:', response.data.reviews.length);
      return response.data.reviews;
    } catch (error) {
      console.error('Database unavailable, using local reviews:', error.message);
      return JSON.parse(localStorage.getItem('productReviews') || '[]')
        .filter(r => r.productId === productId || r.product === productId);
    }
  },

  // Get all reviews - DATABASE FIRST approach
  getAllReviews: async () => {
    try {
      const response = await api.get('/reviews/all');
      console.log('⭐ All reviews from database:', response.data.reviews.length);
      return response.data.reviews;
    } catch (error) {
      console.error('Database unavailable, using local reviews:', error.message);
      return JSON.parse(localStorage.getItem('productReviews') || '[]');
    }
  }
};

export default reviewService;