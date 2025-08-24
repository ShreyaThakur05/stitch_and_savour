const axios = require('axios');

class GroqService {
  constructor() {
    this.apiKey = process.env.GROQ_API_KEY;
    this.baseURL = 'https://api.groq.com/openai/v1';
    
    // Product database with detailed information
    this.products = {
      crochet: {
        'boho top': { name: 'Boho Chic Granny Square Crochet Top', price: 1299, rating: 4.8, reviews: 15, ingredients: null, allergens: null },
        'striped vest': { name: 'Classic Striped V-Neck Crochet Vest', price: 1199, rating: 4.7, reviews: 12, ingredients: null, allergens: null },
        'pink tank': { name: 'Minimalist Pink Crochet Tank Top', price: 999, rating: 4.9, reviews: 18, ingredients: null, allergens: null },
        'pooja mat blue': { name: 'Serene Blue & Pink Pooja Mat', price: 449, rating: 4.6, reviews: 8, ingredients: null, allergens: null },
        'pooja mat multicolor': { name: 'Festive Multicolor Pooja Mat', price: 499, rating: 4.8, reviews: 10, ingredients: null, allergens: null }
      },
      food: {
        'poha chivda': { name: 'Homestyle Poha Chivda', price: 25, pricePerKg: 480, rating: 4.9, reviews: 25, ingredients: ['Poha', 'Peanuts', 'Curry leaves', 'Turmeric', 'Salt', 'Oil'], allergens: ['Peanuts'] },
        'shakarpara': { name: 'Sweet & Flaky Shakarpara', price: 25, pricePerKg: 480, rating: 4.8, reviews: 22, ingredients: ['Maida', 'Ghee', 'Sugar', 'Cardamom'], allergens: ['Gluten', 'Dairy'] },
        'namak pare': { name: 'Crispy & Savory Namak Pare', price: 25, pricePerKg: 480, rating: 4.7, reviews: 20, ingredients: ['Maida', 'Oil', 'Salt', 'Ajwain', 'Black pepper'], allergens: ['Gluten'] },
        'mixture': { name: 'Spicy Mixture Namkeen', price: 25, pricePerKg: 500, rating: 4.9, reviews: 30, ingredients: ['Sev', 'Peanuts', 'Chana dal', 'Spices', 'Oil'], allergens: ['Peanuts', 'Gluten'] },
        'mathri': { name: 'Classic Salty Mathri', price: 25, pricePerKg: 480, rating: 4.6, reviews: 18, ingredients: ['Maida', 'Oil', 'Salt', 'Ajwain', 'Methi'], allergens: ['Gluten'] },
        'jeera biscuits': { name: 'Baked Jeera Biscuits', price: 25, pricePerKg: 480, rating: 4.8, reviews: 16, ingredients: ['Wheat flour', 'Ghee', 'Jeera', 'Salt', 'Baking powder'], allergens: ['Gluten', 'Dairy'] },
        'gujiya': { name: 'Homemade Gujiya', price: 150, rating: 4.9, reviews: 35, ingredients: ['Maida', 'Khoya', 'Sugar', 'Coconut', 'Dry fruits', 'Ghee'], allergens: ['Gluten', 'Dairy', 'Nuts'] }
      }
    };
    
    this.ownerInfo = {
      name: 'Sangita Thakur',
      story: 'A passionate homemaker who turned her love for cooking and crochet into a thriving business. With over 10 years of experience in traditional cooking and handcrafts, Sangita creates each product with love and attention to detail.',
      email: 'sangita.shreyas@gmail.com',
      phone: '+91 9970944685',
      location: 'Alkasa Society, Mohammadwadi, Pune - 411060'
    };
  }

  async generateResponse(context, query) {
    try {
      // Check for specific query types first
      const response = this.handleSpecificQueries(query);
      if (response) {
        return response;
      }

      // Enhanced prompt with comprehensive information
      const systemPrompt = `You are Savi, Stitch & Savour's friendly AI assistant. We sell handmade crochet items and homemade food.

OWNER: Sangita Thakur - A passionate homemaker with 10+ years experience in traditional cooking and handcrafts.

PRODUCTS:
CROCHET (14 days delivery):
- Boho Chic Granny Square Top: ₹1299 (4.8★, 15 reviews)
- Classic Striped V-Neck Vest: ₹1199 (4.7★, 12 reviews) 
- Minimalist Pink Tank Top: ₹999 (4.9★, 18 reviews)
- Serene Blue & Pink Pooja Mat: ₹449 (4.6★, 8 reviews)
- Festive Multicolor Pooja Mat: ₹499 (4.8★, 10 reviews)

FOOD (2 days delivery):
- Poha Chivda: ₹480/kg (4.9★, 25 reviews) - Contains peanuts
- Shakarpara: ₹480/kg (4.8★, 22 reviews) - Contains gluten, dairy
- Namak Pare: ₹480/kg (4.7★, 20 reviews) - Contains gluten
- Spicy Mixture: ₹500/kg (4.9★, 30 reviews) - Contains peanuts, gluten
- Mathri: ₹480/kg (4.6★, 18 reviews) - Contains gluten
- Jeera Biscuits: ₹480/kg (4.8★, 16 reviews) - Contains gluten, dairy
- Gujiya: ₹150 for 6 pieces (4.9★, 35 reviews) - Contains gluten, dairy, nuts

SERVICES:
- Payment: QR Code/UPI, Cash on Delivery
- Delivery: Local (same day), Maharashtra (1-2 days), Pan-India (3-7 days)
- Customization: Colors, sizes, thread types for crochet
- Return Policy: 7-day return for defects
- Contact: sangita.shreyas@gmail.com, +91 9970944685

Be helpful, friendly, and use emojis. Always provide specific product details when asked.`;

      const apiResponse = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: 'llama3-8b-8192',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Context: ${context}\n\nQuestion: ${query}` }
          ],
          max_tokens: 250,
          temperature: 0.3,
          top_p: 0.9
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      if (apiResponse.data?.choices?.[0]?.message?.content) {
        return apiResponse.data.choices[0].message.content.trim();
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error('Groq API error:', error.response?.data || error.message);
      return this.getFallbackResponse(query);
    }
  }

  handleSpecificQueries(query) {
    const queryLower = query.toLowerCase();
    
    // Best product queries
    if (queryLower.includes('best product') || queryLower.includes('most popular') || queryLower.includes('recommend')) {
      return '🌟 Our best products:\n\n🥇 **Gujiya** - ₹150 (4.9★, 35 reviews) - Our most loved item!\n🥈 **Pink Tank Top** - ₹999 (4.9★, 18 reviews) - Highest rated crochet item\n🥉 **Spicy Mixture** - ₹500/kg (4.9★, 30 reviews) - Customer favorite snack\n\nAll made with love by Sangita! 💕';
    }
    
    // Ingredient queries
    if (queryLower.includes('ingredient')) {
      const productName = this.extractProductName(queryLower);
      if (productName) {
        const product = this.findProduct(productName);
        if (product && product.ingredients) {
          return `🥘 **${product.name}** ingredients:\n${product.ingredients.join(', ')}\n\n${product.allergens ? `⚠️ Contains: ${product.allergens.join(', ')}` : '✅ No major allergens'}`;
        }
      }
      return '🥘 Our food items use fresh, traditional ingredients. Which specific product would you like to know about? (Gujiya, Poha Chivda, Shakarpara, etc.)';
    }
    
    // Allergen queries
    if (queryLower.includes('allergen') || queryLower.includes('allergy')) {
      const productName = this.extractProductName(queryLower);
      if (productName) {
        const product = this.findProduct(productName);
        if (product) {
          return `⚠️ **${product.name}** allergen info:\n${product.allergens ? `Contains: ${product.allergens.join(', ')}` : 'No major allergens detected'}\n\nPlease check ingredients if you have specific allergies! 🙏`;
        }
      }
      return '⚠️ Common allergens in our products:\n• Gluten (wheat products)\n• Dairy (ghee, khoya)\n• Nuts (dry fruits, peanuts)\n\nWhich product are you asking about?';
    }
    
    // Owner/brand queries
    if (queryLower.includes('owner') || queryLower.includes('founder') || queryLower.includes('who runs') || queryLower.includes('about brand')) {
      return `👩‍🍳 **Meet Sangita Thakur** - Our founder & heart of Stitch & Savour!\n\n${this.ownerInfo.story}\n\n📍 Based in ${this.ownerInfo.location}\n📞 ${this.ownerInfo.phone}\n📧 ${this.ownerInfo.email}\n\nEvery product is made with love and traditional techniques! 💕`;
    }
    
    // Price queries
    if (queryLower.includes('price') || queryLower.includes('cost') || queryLower.includes('how much')) {
      const productName = this.extractProductName(queryLower);
      if (productName) {
        const product = this.findProduct(productName);
        if (product) {
          return `💰 **${product.name}** pricing:\n₹${product.price}${product.pricePerKg ? ` (₹${product.pricePerKg}/kg)` : ''}\n\n⭐ ${product.rating}/5 (${product.reviews} reviews)\n🚚 ${product.name.includes('Crochet') || product.name.includes('Top') || product.name.includes('Vest') || product.name.includes('Mat') ? '14 days' : '2 days'} delivery`;
        }
      }
      return '💰 Our pricing:\n\n🧶 **Crochet**: ₹449-1299\n🍽️ **Food**: ₹25-600\n\nWhich specific product interests you?';
    }
    
    // Stock/availability queries
    if (queryLower.includes('stock') || queryLower.includes('available') || queryLower.includes('in stock')) {
      return '✅ All our products are available!\n\n🧶 **Crochet items**: Made to order (14 days)\n🍽️ **Food items**: Fresh batches daily (2 days)\n\nReady to place an order? 🛒';
    }
    
    // Delivery queries
    if (queryLower.includes('delivery') || queryLower.includes('shipping') || queryLower.includes('when will') || queryLower.includes('arrive')) {
      return '🚚 **Delivery Information:**\n\n📍 **Local** (Pune): Same day\n🏠 **Maharashtra**: 1-2 days\n🇮🇳 **Pan-India**: 3-7 days\n\n💰 **Delivery Charges:**\n• Home delivery: ₹25 (within 1km)\n• Self pickup: FREE\n\n📦 All orders packed with care!';
    }
    
    // Return/refund queries
    if (queryLower.includes('return') || queryLower.includes('refund') || queryLower.includes('exchange')) {
      return '🔄 **Return Policy:**\n\n✅ 7-day return for manufacturing defects\n❌ No returns for food items (hygiene reasons)\n🔄 Exchange available for wrong size/color\n\n📞 Contact us: ${this.ownerInfo.phone}\n📧 Email: ${this.ownerInfo.email}';
    }
    
    // Customization queries
    if (queryLower.includes('custom') || queryLower.includes('personalize') || queryLower.includes('modify')) {
      return '✨ **Customization Options:**\n\n🧶 **Crochet Items:**\n• Colors (as per availability)\n• Sizes (S, M, L, Custom +₹200)\n• Thread type (Cotton/Wool)\n\n🍽️ **Food Items:**\n• Weight options available\n• Special packaging for gifts\n\nCustomization adds 2-3 extra days! 🕐';
    }
    
    // Nutritional info
    if (queryLower.includes('calorie') || queryLower.includes('nutrition') || queryLower.includes('healthy')) {
      return '🥗 **Nutritional Information:**\n\nOur food items are made with traditional recipes using quality ingredients. For specific nutritional details, please contact us directly.\n\n📞 ${this.ownerInfo.phone}\n📧 ${this.ownerInfo.email}\n\nWe can provide detailed info for dietary requirements! 🙏';
    }
    
    // Usage/how-to queries
    if (queryLower.includes('how to use') || queryLower.includes('how to wear') || queryLower.includes('care')) {
      if (queryLower.includes('crochet') || queryLower.includes('top') || queryLower.includes('vest')) {
        return '👕 **Crochet Care Instructions:**\n\n🧼 Hand wash in cold water\n🚫 No bleach or harsh detergents\n🌬️ Air dry in shade\n🧺 Store folded, not hanging\n\nWith proper care, they last for years! 💪';
      }
      return '📋 **Usage Instructions:**\n\n🍽️ **Food items**: Store in airtight containers, consume within 15-20 days\n🧶 **Crochet items**: Hand wash, air dry\n\nNeed specific care instructions? Ask away! 😊';
    }
    
    // Discount/offers
    if (queryLower.includes('discount') || queryLower.includes('offer') || queryLower.includes('sale') || queryLower.includes('coupon')) {
      return '🎉 **Current Offers:**\n\n💝 **Festival Special**: 10% off on orders above ₹500\n🛒 **Bulk Orders**: Special pricing for 5+ items\n🎁 **First Order**: Free packaging\n\nContact us for personalized deals! 📞 ${this.ownerInfo.phone}';
    }
    
    return null;
  }
  
  extractProductName(query) {
    const products = ['gujiya', 'poha', 'chivda', 'shakarpara', 'namak pare', 'mixture', 'mathri', 'jeera', 'biscuit', 'crochet', 'top', 'vest', 'tank', 'pooja mat'];
    return products.find(product => query.includes(product));
  }
  
  findProduct(productName) {
    for (const category of Object.values(this.products)) {
      for (const [key, product] of Object.entries(category)) {
        if (key.includes(productName) || product.name.toLowerCase().includes(productName)) {
          return product;
        }
      }
    }
    return null;
  }

  getFallbackResponse(query) {
    const queryLower = query.toLowerCase();
    
    if (queryLower.includes('food') || queryLower.includes('snack')) {
      return '🍽️ We have delicious homemade snacks like Poha Chivda, Shakarpara, Gujiya and more! All made fresh with traditional recipes. What would you like to know?';
    }
    
    if (queryLower.includes('crochet') || queryLower.includes('top') || queryLower.includes('vest')) {
      return '🧶 Our handcrafted crochet items are beautiful and customizable! We have tops, vests, and pooja mats. Takes 14 days to make with love. Interested in any specific item?';
    }
    
    if (queryLower.includes('delivery') || queryLower.includes('shipping')) {
      return '🚚 We deliver everywhere! Local (same day), Maharashtra (1-2 days), Pan-India (3-7 days). Home delivery ₹25, pickup FREE!';
    }
    
    if (queryLower.includes('payment') || queryLower.includes('pay')) {
      return '💳 Easy payment options: QR Code/UPI or Cash on Delivery. Both are secure and convenient!';
    }
    
    return 'Hi! I\'m Savi, your Stitch & Savour assistant! 🌟\n\nI can help you with:\n🧶 Crochet items & customization\n🍽️ Homemade food & ingredients\n💰 Pricing & offers\n🚚 Delivery & returns\n👩‍🍳 About our founder Sangita\n\nWhat would you like to know? 😊';
  }

  isOffTopic(query) {
    const ecommerceKeywords = [
      'product', 'price', 'order', 'delivery', 'payment', 'crochet', 'food',
      'buy', 'purchase', 'cart', 'checkout', 'shipping', 'return', 'refund',
      'contact', 'about', 'help', 'support', 'available', 'stock', 'hello', 'hi',
      'ingredient', 'allergen', 'owner', 'founder', 'custom', 'discount', 'offer'
    ];

    const queryLower = query.toLowerCase();
    return !ecommerceKeywords.some(keyword => queryLower.includes(keyword));
  }
}

module.exports = new GroqService();