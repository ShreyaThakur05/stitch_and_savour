// Configuration file for environment variables
export const config = {
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  WHATSAPP_NUMBER: process.env.REACT_APP_WHATSAPP_NUMBER || '+919970944685',
  GEMINI_API_KEY: process.env.REACT_APP_GEMINI_API_KEY || ''
};

// Debug function for production
export const debugConfig = () => {
  console.log('Environment Config:', {
    API_URL: config.API_URL,
    WHATSAPP_NUMBER: config.WHATSAPP_NUMBER,
    NODE_ENV: process.env.NODE_ENV
  });
};

// Make debug available globally
if (typeof window !== 'undefined') {
  window.debugConfig = debugConfig;
}