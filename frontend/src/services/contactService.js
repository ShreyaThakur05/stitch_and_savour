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
  // Submit contact message - database only
  submitMessage: async (messageData) => {
    try {
      const response = await api.post('/contact/submit', messageData);
      console.log('📧 Contact message saved to database:', response.data.message._id);
      return response.data;
    } catch (error) {
      console.error('Failed to save contact message:', error.message);
      throw error;
    }
  },

  // Get user's contact messages
  getUserMessages: async () => {
    try {
      const response = await api.get('/contact/user');
      return response.data.messages;
    } catch (error) {
      console.error('Failed to load contact messages:', error.message);
      return [];
    }
  }
};

export default contactService;