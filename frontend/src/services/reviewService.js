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
        productName: reviewData.productName || reviewData.productId,
        rating: reviewData.rating,
        comment: reviewData.review || reviewData.comment,
        customerName: reviewData.customerName,
        customerEmail: reviewData.customerEmail,
        orderNumber: reviewData.orderNumber
      });
      
      console.log('⭐ Review saved to database:', response.data.review._id);
      return response.data;
    } catch (error) {
      console.error('Failed to save review to database:', error.message);
      throw error;
    }
  },

  // Get reviews for a product - DATABASE FIRST approach
  getProductReviews: async (productId) => {
    try {
      const response = await api.get(`/reviews/product/${encodeURIComponent(productId)}`);
      console.log('⭐ Product reviews from database:', response.data.reviews.length);
      return response.data.reviews;
    } catch (error) {
      console.error('Failed to load product reviews:', error.message);
      return [];
    }
  },

  // Get all reviews - DATABASE FIRST approach
  getAllReviews: async () => {
    try {
      const response = await api.get('/reviews/all');
      console.log('⭐ All reviews from database:', response.data.reviews.length);
      return response.data.reviews;
    } catch (error) {
      console.error('Failed to load all reviews:', error.message);
      return [];
    }
  }
};

export default reviewService;