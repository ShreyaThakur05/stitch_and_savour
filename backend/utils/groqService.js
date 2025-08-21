class GroqService {
  async generateResponse(context, query) {
    const queryLower = query.toLowerCase();
    
    // Greetings
    if (queryLower.includes('hello') || queryLower.includes('hi') || queryLower.includes('hey')) {
      return 'Hello! 😊 Welcome to Stitch & Savour! I can help you with our handmade crochet items and homemade food. What would you like to know?';
    }
    
    // What can you do
    if (queryLower.includes('what') && (queryLower.includes('do') || queryLower.includes('help'))) {
      return 'I can help you with: 🌟\n• Our crochet products (tops, vests, pooja mats)\n• Homemade food items (snacks & sweets)\n• Pricing and delivery info\n• Payment options\n• Custom orders\n\nWhat interests you most?';
    }
    
    // Products
    if (queryLower.includes('product') || queryLower.includes('sell') || queryLower.includes('item')) {
      return 'We sell two main categories: 🛍️\n\n🧶 **Crochet Items:**\n• Boho Tops (₹999-1299)\n• Vests & Tank Tops\n• Pooja Mats (₹449-499)\n\n🍽️ **Homemade Food:**\n• Poha Chivda, Shakarpara\n• Namak Pare, Mixture\n• Mathri, Jeera Biscuits\n• Gujiya (₹25-600)\n\nWhich category interests you?';
    }
    
    // Food specific
    if (queryLower.includes('food') || queryLower.includes('snack') || queryLower.includes('sweet')) {
      return '🍽️ Our homemade food specialties:\n• Poha Chivda - ₹25\n• Sweet Shakarpara - ₹25\n• Namak Pare - ₹25\n• Spicy Mixture - ₹25\n• Mathri - ₹25\n• Jeera Biscuits - ₹25\n• Gujiya - ₹600\n\nAll made fresh daily! Delivered in 2 days. Want to order?';
    }
    
    // Crochet specific
    if (queryLower.includes('crochet') || queryLower.includes('top') || queryLower.includes('vest') || queryLower.includes('handmade')) {
      return '🧶 Our beautiful crochet collection:\n• Boho Granny Square Top - ₹1299\n• Striped V-Neck Vest - ₹1199\n• Pink Tank Top - ₹999\n• Pooja Mats - ₹449-499\n\nAll customizable (colors, sizes)! Takes 14 days to craft with love. Interested in any?';
    }
    
    // Delivery
    if (queryLower.includes('delivery') || queryLower.includes('shipping') || queryLower.includes('time')) {
      return '🚚 Delivery Options:\n• Local (Sirul area) - Same day\n• Maharashtra - 1-2 days\n• Pan-India - 3-7 days\n• FREE delivery on all orders!\n\nFood items: 2 days\nCrochet items: 14 days (made-to-order)';
    }
    
    // Payment
    if (queryLower.includes('payment') || queryLower.includes('pay') || queryLower.includes('price')) {
      return '💳 Easy Payment Options:\n• QR Code Payment (instant)\n• Cash on Delivery (COD)\n• No extra charges!\n\nBoth methods are 100% secure. Which do you prefer?';
    }
    
    // Contact
    if (queryLower.includes('contact') || queryLower.includes('phone') || queryLower.includes('email')) {
      return '📞 Contact Sangita Thakur:\n• WhatsApp: +91 9970944685\n• Email: sangita.shreyas@gmail.com\n• Alt Phone: +91 8668806190\n\nFeel free to reach out anytime!';
    }
    
    // Custom/order
    if (queryLower.includes('custom') || queryLower.includes('order') || queryLower.includes('buy')) {
      return '🎆 Ready to order?\n\n🧶 Crochet items can be customized:\n• Colors, sizes, thread types\n• Custom sizing +₹200\n\n🛍️ Browse our products or contact us directly for custom orders!';
    }
    
    // Default response
    return 'I\'m here to help with Stitch & Savour! 🌟\n\nAsk me about:\n• Our products & prices\n• Delivery & payment\n• Custom orders\n• Contact info\n\nWhat would you like to know?';
  }

  isOffTopic(query) {
    return false; // Always handle queries with rule-based responses
  }
}

module.exports = new GroqService();