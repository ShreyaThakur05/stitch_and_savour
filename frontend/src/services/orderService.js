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
  // Get all orders for admin
  getAllOrders: async () => {
    try {
      const response = await api.get('/orders/all');
      if (response.data.success) {
        return response.data.orders;
      }
    } catch (error) {
      console.warn('Backend unavailable, using local orders:', error.message);
    }
    
    // Fallback to localStorage
    return JSON.parse(localStorage.getItem('userOrders') || '[]');
  },
  // Create order - save to backend with localStorage fallback
  createOrder: async (orderData) => {
    try {
      // Try to save to backend first
      const response = await api.post('/orders', orderData);
      
      if (response.data.success) {
        // Also save to localStorage for offline access
        const userEmail = orderData.customerEmail || orderData.email;
        if (userEmail) {
          const userSpecificKey = `userOrders_${userEmail}`;
          const existingOrders = JSON.parse(localStorage.getItem(userSpecificKey) || '[]');
          existingOrders.push({
            ...response.data.order,
            isLocal: false
          });
          localStorage.setItem(userSpecificKey, JSON.stringify(existingOrders));
        }
        
        return response.data;
      }
    } catch (error) {
      // Fallback to localStorage if backend fails
      console.warn('Backend unavailable, saving order locally:', error.message);
      const orderId = 'local_' + Date.now();
      const localOrder = {
        ...orderData,
        _id: orderId,
        orderNumber: 'SS' + Date.now(),
        createdAt: new Date().toISOString(),
        status: 'pending',
        isLocal: true
      };
      
      const userEmail = orderData.customerEmail || orderData.email;
      if (userEmail) {
        const userSpecificKey = `userOrders_${userEmail}`;
        const existingOrders = JSON.parse(localStorage.getItem(userSpecificKey) || '[]');
        existingOrders.push(localOrder);
        localStorage.setItem(userSpecificKey, JSON.stringify(existingOrders));
      }
      
      // Also save to general localStorage for admin access
      const allOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      allOrders.push(localOrder);
      localStorage.setItem('userOrders', JSON.stringify(allOrders));
      
      return { success: true, order: localOrder };
    }
  },

  // Get user orders - try backend first, fallback to localStorage
  getUserOrders: async () => {
    try {
      const response = await api.get('/orders');
      
      if (response.data.success) {
        // Merge with local orders
        const currentUser = JSON.parse(localStorage.getItem('stitch_savour_user') || '{}');
        if (currentUser.email) {
          const userSpecificKey = `userOrders_${currentUser.email}`;
          const localOrders = JSON.parse(localStorage.getItem(userSpecificKey) || '[]');
          const localOnlyOrders = localOrders.filter(o => o.isLocal);
          return [...response.data.orders, ...localOnlyOrders];
        }
        return response.data.orders;
      }
    } catch (error) {
      console.warn('Backend unavailable, using local orders:', error.message);
      const currentUser = JSON.parse(localStorage.getItem('stitch_savour_user') || '{}');
      if (currentUser.email) {
        const userSpecificKey = `userOrders_${currentUser.email}`;
        return JSON.parse(localStorage.getItem(userSpecificKey) || '[]');
      }
      return JSON.parse(localStorage.getItem('userOrders') || '[]');
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.put(`/orders/${orderId}/status`, { status });
      
      if (response.data.success) {
        // Update localStorage as well
        const currentUser = JSON.parse(localStorage.getItem('stitch_savour_user') || '{}');
        if (currentUser.email) {
          const userSpecificKey = `userOrders_${currentUser.email}`;
          const orders = JSON.parse(localStorage.getItem(userSpecificKey) || '[]');
          const orderIndex = orders.findIndex(o => o._id === orderId || o.orderNumber === orderId);
          if (orderIndex > -1) {
            orders[orderIndex].status = status;
            localStorage.setItem(userSpecificKey, JSON.stringify(orders));
          }
        }
        
        // Update general localStorage for admin
        const allOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
        const orderIndex = allOrders.findIndex(o => o._id === orderId || o.orderNumber === orderId);
        if (orderIndex > -1) {
          allOrders[orderIndex].status = status;
          localStorage.setItem('userOrders', JSON.stringify(allOrders));
        }
        
        return response.data;
      }
    } catch (error) {
      // Update only localStorage if backend fails
      const currentUser = JSON.parse(localStorage.getItem('stitch_savour_user') || '{}');
      if (currentUser.email) {
        const userSpecificKey = `userOrders_${currentUser.email}`;
        const orders = JSON.parse(localStorage.getItem(userSpecificKey) || '[]');
        const orderIndex = orders.findIndex(o => o._id === orderId || o.orderNumber === orderId);
        if (orderIndex > -1) {
          orders[orderIndex].status = status;
          localStorage.setItem(userSpecificKey, JSON.stringify(orders));
        }
      }
      
      const allOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      const orderIndex = allOrders.findIndex(o => o._id === orderId || o.orderNumber === orderId);
      if (orderIndex > -1) {
        allOrders[orderIndex].status = status;
        localStorage.setItem('userOrders', JSON.stringify(allOrders));
      }
      
      throw error;
    }
  }
};

export default orderService;