const ragService = require('../utils/ragService');

const chatbotController = {
  async handleQuery(req, res) {
    try {
      const { message } = req.body;

      if (!message || message.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a message'
        });
      }

      console.log(`🤖 Chatbot query: "${message}"`);

      // Use RAG service to process the query
      const result = await ragService.processQuery(message);
      
      res.json({
        success: true,
        response: result.response,
        suggestions: result.suggestions || [],
        confidence: result.confidence || 'medium',
        sources: result.sources || []
      });

    } catch (error) {
      console.error('❌ Chatbot error:', error);
      res.status(500).json({
        success: false,
        message: 'Sorry, I encountered an error. Please try again or contact support.',
        suggestions: [
          { text: "Contact Support", link: "/contact" },
          { text: "Browse Products", link: "/products" }
        ]
      });
    }
  }
};

module.exports = chatbotController;