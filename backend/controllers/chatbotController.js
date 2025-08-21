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

      // Simple response logic
      const query = message.toLowerCase();
      let response = '';
      let suggestions = [];

      if (query.includes('gujiya')) {
        response = "Yes! We make delicious homemade Gujiya! 🥟\n\nAvailable in:\n• 6 pieces - ₹120\n• 12 pieces - ₹240\n• 24 pieces - ₹480\n\nFresh made to order with traditional recipe. Delivery in 2 days!";
        suggestions = [
          { text: "🛒 Order Gujiya", link: "/products?search=gujiya" },
          { text: "📞 Call to Order", link: "/contact" }
        ];
      } else if (query.includes('crochet') || query.includes('handmade')) {
        response = "We create beautiful handmade crochet items! 🧶\n\n• Tops & Tanks\n• Pooja Mats\n• Custom designs\n\nAll items are made to order with premium cotton/wool threads. Delivery in 2 weeks.";
        suggestions = [
          { text: "🧶 View Crochet Items", link: "/products?category=crochet" },
          { text: "✨ Custom Order", link: "/contact" }
        ];
      } else if (query.includes('food') || query.includes('snacks')) {
        response = "We make fresh homemade food items! 🍽️\n\n• Namak Pare\n• Mathri\n• Poha Chivda\n• Jeera Biscuits\n• Mixture\n• Shakarpara\n\nAll priced per kg, made fresh to order!";
        suggestions = [
          { text: "🍽️ View Food Items", link: "/products?category=food" },
          { text: "📞 Place Order", link: "/contact" }
        ];
      } else if (query.includes('price') || query.includes('cost')) {
        response = "Our pricing:\n\n🍽️ Food Items: ₹200-400/kg\n🧶 Crochet Items: ₹300-800\n🥟 Gujiya: ₹120 (6pcs), ₹240 (12pcs)\n\n🚚 Delivery: ₹25 (within 1km) or FREE pickup";
        suggestions = [
          { text: "📋 View All Products", link: "/products" },
          { text: "📞 Get Quote", link: "/contact" }
        ];
      } else if (query.includes('delivery') || query.includes('shipping')) {
        response = "Delivery Information: 🚚\n\n• Home Delivery: ₹25 (within 1km radius)\n• Self Pickup: FREE\n• Food Items: 2 days\n• Crochet Items: 2 weeks\n\nWe deliver in Sirul and nearby areas!";
        suggestions = [
          { text: "📍 Check Location", link: "/contact" },
          { text: "🛒 Place Order", link: "/products" }
        ];
      } else {
        response = "I can help you with:\n\n🧶 Handmade crochet items\n🍽️ Fresh homemade food\n🥟 Special items like Gujiya\n💰 Pricing information\n🚚 Delivery details\n\nWhat would you like to know more about?";
        suggestions = [
          { text: "🧶 Crochet Items", link: "/products?category=crochet" },
          { text: "🍽️ Food Items", link: "/products?category=food" },
          { text: "📞 Contact Us", link: "/contact" }
        ];
      }
      
      res.json({
        success: true,
        response,
        suggestions,
        confidence: 'high'
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