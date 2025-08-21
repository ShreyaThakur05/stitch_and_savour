const axios = require('axios');

class GroqService {
  constructor() {
    this.apiKey = process.env.GROQ_API_KEY;
    this.baseURL = 'https://api.groq.com/openai/v1';
  }

  async generateResponse(context, query) {
    try {
      // Enhanced prompt with better structure
      const systemPrompt = `You are Stitch & Savour's friendly customer assistant. We sell handmade crochet items and homemade food.

PRODUCTS:
- Crochet: Tops (₹999-1299), Vests, Tank Tops, Pooja Mats (₹449-499) - 14 days delivery
- Food: Poha Chivda, Shakarpara, Namak Pare, Mixture, Mathri, Jeera Biscuits, Gujiya (₹25-600) - 2 days delivery

SERVICES:
- Payment: QR Code, Cash on Delivery
- Delivery: Local (same day), Maharashtra (1-2 days), Pan-India (3-7 days)
- Customization: Colors, sizes, thread types for crochet items
- Contact: sangita.shreyas@gmail.com, +91 9970944685

Be helpful, friendly, and concise. Use emojis. If unsure, suggest contacting support.`;

      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: 'llama3-8b-8192', // Changed to more reliable model
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user', 
              content: `Context: ${context}\n\nQuestion: ${query}`
            }
          ],
          max_tokens: 200,
          temperature: 0.3, // Lower temperature for more consistent responses
          top_p: 0.9
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        }
      );

      if (response.data?.choices?.[0]?.message?.content) {
        return response.data.choices[0].message.content.trim();
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error('Groq API error:', error.response?.data || error.message);
      
      // Fallback responses based on query content
      const queryLower = query.toLowerCase();
      
      if (queryLower.includes('food') || queryLower.includes('snack')) {
        return '🍽️ We have delicious homemade snacks like Poha Chivda, Shakarpara, and more! All made fresh and delivered in 2 days. What would you like to know?';
      }
      
      if (queryLower.includes('crochet') || queryLower.includes('top') || queryLower.includes('vest')) {
        return '🧶 Our handcrafted crochet items are beautiful and customizable! We have tops, vests, and pooja mats. Takes 14 days to make with love. Interested in any specific item?';
      }
      
      if (queryLower.includes('delivery') || queryLower.includes('shipping')) {
        return '🚚 We deliver everywhere! Local (same day), Maharashtra (1-2 days), Pan-India (3-7 days). Free delivery on all orders!';
      }
      
      if (queryLower.includes('payment') || queryLower.includes('pay')) {
        return '💳 Easy payment options: QR Code or Cash on Delivery. Both are secure and convenient!';
      }
      
      return 'Hi! I can help you with our crochet items, homemade food, delivery, and payments. What would you like to know? 😊';
    }
  }

  isOffTopic(query) {
    const ecommerceKeywords = [
      'product', 'price', 'order', 'delivery', 'payment', 'crochet', 'food',
      'buy', 'purchase', 'cart', 'checkout', 'shipping', 'return', 'refund',
      'contact', 'about', 'help', 'support', 'available', 'stock', 'hello', 'hi'
    ];

    const queryLower = query.toLowerCase();
    return !ecommerceKeywords.some(keyword => queryLower.includes(keyword));
  }
}

module.exports = new GroqService();