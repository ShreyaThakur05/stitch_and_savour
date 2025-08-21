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

export const orderService = {
  // Create order - save to both backend and localStorage
  createOrder: async (orderData) => {
    try {
      // Try to save to backend first
      const response = await api.post('/orders', orderData);
      
      // Save to user-specific localStorage key
      const userEmail = orderData.customerEmail || orderData.email;
      const userSpecificKey = `userOrders_${userEmail}`;
      const existingOrders = JSON.parse(localStorage.getItem(userSpecificKey) || '[]');
      existingOrders.push({
        ...orderData,
        orderId: response.data.order._id,
        createdAt: response.data.order.createdAt,
        status: response.data.order.status
      });
      localStorage.setItem(userSpecificKey, JSON.stringify(existingOrders));
      
      return response.data;
    } catch (error) {
      // Fallback to localStorage if backend fails
      console.warn('Backend unavailable, saving order locally:', error.message);
      const orderId = 'local_' + Date.now();
      const localOrder = {
        ...orderData,
        orderId,
        createdAt: new Date().toISOString(),
        status: 'pending',
        isLocal: true
      };
      
      const userEmail = orderData.customerEmail || orderData.email;
      const userSpecificKey = `userOrders_${userEmail}`;
      const existingOrders = JSON.parse(localStorage.getItem(userSpecificKey) || '[]');
      existingOrders.push(localOrder);
      localStorage.setItem(userSpecificKey, JSON.stringify(existingOrders));
      
      return { success: true, order: localOrder };
    }
  },

  // Get user orders - try backend first, fallback to localStorage
  getUserOrders: async () => {
    try {
      const response = await api.get('/orders/user');
      
      // Get user email from token or current user
      const currentUser = JSON.parse(localStorage.getItem('stitch_savour_user') || '{}');
      const userSpecificKey = `userOrders_${currentUser.email}`;
      const localOrders = JSON.parse(localStorage.getItem(userSpecificKey) || '[]');
      const allOrders = [...response.data.orders, ...localOrders.filter(o => o.isLocal)];
      
      return allOrders;
    } catch (error) {
      console.warn('Backend unavailable, using local orders:', error.message);
      const currentUser = JSON.parse(localStorage.getItem('stitch_savour_user') || '{}');
      const userSpecificKey = `userOrders_${currentUser.email}`;
      return JSON.parse(localStorage.getItem(userSpecificKey) || '[]');
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.put(`/orders/${orderId}/status`, { status });
      
      // Update user-specific localStorage
      const currentUser = JSON.parse(localStorage.getItem('stitch_savour_user') || '{}');
      const userSpecificKey = `userOrders_${currentUser.email}`;
      const orders = JSON.parse(localStorage.getItem(userSpecificKey) || '[]');
      const orderIndex = orders.findIndex(o => o.orderId === orderId);
      if (orderIndex > -1) {
        orders[orderIndex].status = status;
        localStorage.setItem(userSpecificKey, JSON.stringify(orders));
      }
      
      return response.data;
    } catch (error) {
      // Update only localStorage if backend fails
      const currentUser = JSON.parse(localStorage.getItem('stitch_savour_user') || '{}');
      const userSpecificKey = `userOrders_${currentUser.email}`;
      const orders = JSON.parse(localStorage.getItem(userSpecificKey) || '[]');
      const orderIndex = orders.findIndex(o => o.orderId === orderId);
      if (orderIndex > -1) {
        orders[orderIndex].status = status;
        localStorage.setItem(userSpecificKey, JSON.stringify(orders));
      }
      throw error;
    }
  }
};

export default orderService;