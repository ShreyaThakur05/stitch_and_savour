import axios from 'axios';

import { config } from '../config/config';

const API_URL = config.API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const contactService = {
  // Submit contact message - database first approach
  submitMessage: async (messageData) => {
    try {
      // Try to save to backend first
      const response = await api.post('/contact/submit', messageData);
      console.log('📧 Contact message saved to database:', response.data.message._id);
      
      // Only save to localStorage as backup reference
      const existingMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
      existingMessages.push({
        ...messageData,
        _id: response.data.message._id,
        id: response.data.message._id,
        createdAt: response.data.message.createdAt,
        status: 'sent'
      });
      localStorage.setItem('contactMessages', JSON.stringify(existingMessages));
      
      return response.data;
    } catch (error) {
      // Fallback to localStorage if backend fails
      console.warn('Backend unavailable, saving message locally:', error.message);
      const localMessage = {
        ...messageData,
        _id: 'local_' + Date.now(),
        id: 'local_' + Date.now(),
        createdAt: new Date().toISOString(),
        status: 'pending',
        isLocal: true
      };
      
      const existingMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
      existingMessages.push(localMessage);
      localStorage.setItem('contactMessages', JSON.stringify(existingMessages));
      
      return { success: true, message: localMessage };
    }
  },

  // Get user's contact messages
  getUserMessages: async () => {
    try {
      const response = await api.get('/contact/user');
      
      // Merge with local messages
      const localMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]')
        .filter(m => m.isLocal);
      
      return [...response.data.messages, ...localMessages];
    } catch (error) {
      console.warn('Backend unavailable, using local messages:', error.message);
      return JSON.parse(localStorage.getItem('contactMessages') || '[]');
    }
  }
};

export default contactService;