const axios = require('axios');

// Exact product array - update this when admin adds new products
const PRODUCTS = [
  "Boho Chic Granny Square Crochet Top",
  "Classic Striped V-Neck Crochet Vest",
  "Minimalist Pink Crochet Tank Top",
  "Serene Blue & Pink Hand-Crocheted Pooja Mat",
  "Festive Multicolor Hand-Crocheted Pooja Mat",
  "Homestyle Poha Chivda",
  "Sweet & Flaky Shakarpara",
  "Crispy & Savory Namak Pare (Nimki)",
  "Spicy Mixture Namkeen",
  "Classic Salty Mathri",
  "Baked Jeera Biscuits",
  "Homemade Gujiya"
];

class RAGService {
  constructor() {
    this.groqApiKey = process.env.GROQ_API_KEY || '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';
    this.groqApiUrl = 'https://api.groq.com/openai/v1/chat/completions';
    this.knowledgeBase = [];
    this.initializeKnowledgeBase();
  }

  initializeKnowledgeBase() {
    // Comprehensive knowledge base with all website content
    this.knowledgeBase = [
      // About & Company Info
      {
        id: 'about-company',
        content: 'Stitch & Savour is founded by Sangita Thakur, offering handmade crochet items and homemade food. Started as a hobby in kitchen and passion for crocheting, grew into a business. Contact: sangita.shreyas@gmail.com, +91 9970944685, +91 8668806190. Located in Alkasa Society, Mohammadwadi, Pune. Assistant name is Savi.',
        category: 'about',
        keywords: ['about', 'founder', 'sangita', 'thakur', 'contact', 'phone', 'email', 'location', 'pune', 'story', 'savi', 'assistant', 'name'],
        metadata: { type: 'company_info', page: '/about', confidence: 0.9 }
      },
      {
        id: 'company-philosophy',
        content: 'Stitch & Savour philosophy: Making simple things special. Home-cooked meals and handmade gifts carry love, effort, and memories. Food and craft come together, straight from home to your heart. Everything made with warmth, care, and creativity.',
        category: 'about',
        keywords: ['philosophy', 'values', 'love', 'care', 'handmade', 'homemade', 'special', 'memories'],
        metadata: { type: 'company_info', page: '/about', confidence: 0.8 }
      },

      // Crochet Products
      {
        id: 'crochet-tops',
        content: 'We have 3 beautiful crochet tops: Boho Chic Granny Square Top (₹1299), Classic Striped V-Neck Vest (₹1199), and Minimalist Pink Tank Top (₹999). All are handmade, customizable in colors and sizes, and take 14 days to make.',
        category: 'products',
        keywords: ['tops', 'top', 'crochet', 'boho', 'vest', 'tank', 'what tops', 'sell tops', 'do you have tops', 'do you sell tops'],
        metadata: { type: 'product', page: '/products?category=crochet', price: 999, category: 'crochet', confidence: 0.95 }
      },
      {
        id: 'crochet-striped-vest',
        content: 'Classic Striped V-Neck Crochet Vest - ₹1199. Timeless elegant V-neck vest with chic teal green and cream stripes. Made to order, 14 days delivery. Customizable: thread type, colors, sizes S/M/L.',
        category: 'products',
        keywords: ['striped', 'vest', 'v-neck', 'teal', 'green', 'cream', '1199', 'elegant', 'classic'],
        metadata: { type: 'product', page: '/product/2', price: 1199, category: 'crochet', confidence: 0.95 }
      },
      {
        id: 'crochet-pink-tank',
        content: 'Minimalist Pink Crochet Tank Top - ₹999. Simple sweet essential solid pink crochet tank top, versatile wardrobe staple. Made to order, 10 days delivery. Available in Bubblegum Pink and 30+ colors, sizes S/M/L/XL.',
        category: 'products',
        keywords: ['pink', 'tank', 'top', 'minimalist', '999', 'bubblegum', 'colors', 'versatile'],
        metadata: { type: 'product', page: '/product/3', price: 999, category: 'crochet', confidence: 0.95 }
      },
      {
        id: 'crochet-pooja-mats',
        content: 'Crochet Pooja Mats: Serene Blue & Pink (₹449), Festive Multicolor (₹499). Beautiful circular mats lovingly crocheted. Blue mat in calming shades, multicolor brightens sacred space. Available stock, 7 days delivery. Customizable colors.',
        category: 'products',
        keywords: ['pooja', 'mat', 'blue', 'pink', 'multicolor', '449', '499', 'circular', 'sacred', 'festive'],
        metadata: { type: 'product', page: '/products?category=crochet', price: 449, category: 'crochet', confidence: 0.9 }
      },

      // Food Products
      {
        id: 'food-poha-chivda',
        content: 'Homestyle Poha Chivda - ₹25 per 100g packet (₹480/kg). Light crispy savory Maharashtrian snack made with thin flattened rice. Ingredients: Poha, Peanuts, Curry Leaves, Spices. Allergens: Peanuts. Available stock, 2 days delivery.',
        category: 'products',
        keywords: ['poha', 'chivda', '25', 'maharashtrian', 'crispy', 'peanuts', 'curry', 'leaves'],
        metadata: { type: 'product', page: '/product/6', price: 25, category: 'food', confidence: 0.95 }
      },
      {
        id: 'food-shakarpara',
        content: 'Sweet & Flaky Shakarpara - ₹25 per 100g packet (₹480/kg). Traditional Indian sweet snack that melts in mouth. Ingredients: Maida, Ghee, Sugar, Cardamom. Allergens: Gluten, Dairy. Available stock, 2 days delivery.',
        category: 'products',
        keywords: ['shakarpara', 'sweet', 'flaky', '25', 'traditional', 'melts', 'maida', 'ghee', 'cardamom'],
        metadata: { type: 'product', page: '/product/7', price: 25, category: 'food', confidence: 0.95 }
      },
      {
        id: 'food-namak-pare',
        content: 'Crispy & Savory Namak Pare (Nimki) - ₹480/kg (₹48 per 100g). Perfect savory companion for tea. Ingredients: Maida, Ajwain, Salt. Allergens: Gluten. Available stock, 2 days delivery.',
        category: 'products',
        keywords: ['namak', 'pare', 'nimki', 'crispy', 'savory', '480', '48', 'tea', 'companion', 'ajwain', 'salt'],
        metadata: { type: 'product', page: '/product/8', price: 48, category: 'food', confidence: 0.95 }
      },
      {
        id: 'food-mixture',
        content: 'Spicy Mixture Namkeen - ₹25 per 100g packet (₹500/kg). Flavor-packed medley of crispy sev, fried peanuts, lentils. Ingredients: Besan, Peanuts, Lentils, Spices. Allergens: Peanuts, Gluten. Available stock, 2 days delivery.',
        category: 'products',
        keywords: ['mixture', 'namkeen', 'spicy', '25', 'sev', 'peanuts', 'lentils', 'besan'],
        metadata: { type: 'product', page: '/product/9', price: 25, category: 'food', confidence: 0.95 }
      },
      {
        id: 'food-mathri',
        content: 'Classic Salty Mathri - ₹25 per 100g packet (₹480/kg). Traditional North Indian flaky biscuit seasoned with ajwain. Ingredients: Maida, Ghee, Ajwain, Salt. Allergens: Gluten, Dairy. Available stock, 2 days delivery.',
        category: 'products',
        keywords: ['mathri', 'salty', 'classic', '25', 'north', 'indian', 'flaky', 'biscuit', 'ajwain'],
        metadata: { type: 'product', page: '/product/10', price: 25, category: 'food', confidence: 0.95 }
      },
      {
        id: 'food-jeera-biscuits',
        content: 'Baked Jeera Biscuits - ₹25 per 100g packet (₹480/kg). Light savory crumbly biscuits flavored with roasted cumin. Ingredients: Maida, Butter, Jeera, Salt. Allergens: Gluten, Dairy. Available stock, 2 days delivery.',
        category: 'products',
        keywords: ['jeera', 'biscuits', 'baked', '25', 'cumin', 'crumbly', 'roasted', 'butter'],
        metadata: { type: 'product', page: '/product/11', price: 25, category: 'food', confidence: 0.95 }
      },
      {
        id: 'food-gujiya',
        content: 'Homemade Gujiya - ₹150 for 6 pieces, ₹300 for 12 pieces, ₹600 for 24 pieces (₹25 per piece). Classic festive delicacy filled with khoya, nuts, coconut. Made to order, 3 days delivery. Ingredients: Maida, Khoya, Coconut, Nuts. Allergens: Gluten, Dairy, Nuts.',
        category: 'products',
        keywords: ['gujiya', 'festive', '150', '300', '600', '25', 'pieces', 'khoya', 'nuts', 'coconut', 'delicacy', 'classic'],
        metadata: { type: 'product', page: '/product/12', price: 150, category: 'food', confidence: 0.95 }
      },

      // Delivery & Shipping
      {
        id: 'delivery-info',
        content: 'Delivery Options: Home delivery within 1km of Alkasa Society, Mohammadwadi, Pune (same day for orders before 10 AM). Self pickup available at Alkasa Society, Mohammadwadi, Pune. FREE delivery on all orders. Food items: 2 days delivery. Crochet items: 14 days (made-to-order).',
        category: 'shipping',
        keywords: ['delivery', 'shipping', 'alkasa', 'mohammadwadi', 'pune', '1km', 'free', 'same day', 'pickup', 'self pickup'],
        metadata: { type: 'service_info', page: '/checkout', confidence: 0.9 }
      },

      // Payment
      {
        id: 'payment-methods',
        content: 'Payment Methods: QR Code payment (instant), Cash on Delivery (COD). Both methods 100% secure, no extra charges. QR code supports PhonePe, GPay, Paytm, BHIM, all UPI apps.',
        category: 'payment',
        keywords: ['payment', 'qr', 'code', 'cod', 'cash', 'delivery', 'phonepe', 'gpay', 'paytm', 'upi'],
        metadata: { type: 'service_info', page: '/checkout', confidence: 0.9 }
      },

      // Customization
      {
        id: 'crochet-customization',
        content: 'Crochet Customization: Colors, sizes, thread types available. Custom sizing available for ₹200 extra. Choose from 100% Cotton or Acrylic Blend threads. Custom colors and designs possible. Takes 14 days for made-to-order items.',
        category: 'customization',
        keywords: ['customization', 'custom', 'colors', 'sizes', 'thread', 'cotton', 'acrylic', '200', 'extra'],
        metadata: { type: 'service_info', page: '/products?category=crochet', confidence: 0.85 }
      },

      // Policies & FAQ
      {
        id: 'cancellation-policy',
        content: 'Cancellation Policy: Food items - cancellation possible within 6 hours of order. Crochet items - cancellation possible within 24 hours of order (made-to-order). No returns due to perishable food and custom crochet nature.',
        category: 'policy',
        keywords: ['cancellation', 'cancel', 'policy', 'returns', 'refund', '6 hours', '24 hours'],
        metadata: { type: 'policy_info', confidence: 0.8 }
      },
      {
        id: 'bulk-orders',
        content: 'Bulk Orders: Accepted for both food and crochet items. Food items more than 2kg may have longer delivery timeline. Multiple crochet products may take longer. Contact for special requests and bulk pricing.',
        category: 'service',
        keywords: ['bulk', 'orders', 'special', 'requests', '2kg', 'multiple', 'pricing'],
        metadata: { type: 'service_info', page: '/contact', confidence: 0.8 }
      },

      // General Info
      {
        id: 'quality-freshness',
        content: 'Quality & Freshness: All food items homemade, prepared to order, delivered quickly for maximum freshness. Made in small batches with fresh ingredients and traditional methods. Crochet items handcrafted with attention to detail.',
        category: 'quality',
        keywords: ['quality', 'freshness', 'homemade', 'fresh', 'traditional', 'small', 'batches', 'handcrafted'],
        metadata: { type: 'company_info', confidence: 0.8 }
      },
      {
        id: 'product-overview',
        content: `Stitch & Savour offers these exact products: ${PRODUCTS.join(', ')}. We have handmade crochet items and homemade food. Crochet items are customizable and made-to-order in 14 days. Food items are fresh, homemade, and delivered in 2 days.`,
        category: 'products',
        keywords: ['products', 'categories', 'what', 'sell', 'offer', 'have', 'items', 'types', 'kind', 'do you have', 'what kind', 'what products'],
        metadata: { type: 'product_overview', page: '/products', confidence: 0.95 }
      }
    ];

    console.log(`📚 Knowledge base initialized with ${this.knowledgeBase.length} documents`);
  }

  // Simple text similarity using TF-IDF-like approach
  calculateSimilarity(query, document) {
    const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 2);
    const docWords = document.content.toLowerCase().split(/\s+/);
    const keywords = document.keywords || [];
    
    let score = 0;
    let matches = 0;
    
    // Check query words against document content
    queryWords.forEach(queryWord => {
      // Exact matches in content
      if (docWords.some(docWord => docWord.includes(queryWord) || queryWord.includes(docWord))) {
        score += 1;
        matches++;
      }
      
      // Keyword matches (higher weight)
      if (keywords.some(keyword => keyword.includes(queryWord) || queryWord.includes(keyword))) {
        score += 2;
        matches++;
      }
    });
    
    // Normalize score
    const similarity = queryWords.length > 0 ? (score / (queryWords.length * 2)) : 0;
    
    return {
      similarity,
      matches,
      totalWords: queryWords.length
    };
  }

  // Search knowledge base with vector-like similarity
  searchKnowledgeBase(query, threshold = 0.1) {
    const queryLower = query.toLowerCase();
    
    const results = this.knowledgeBase
      .map(doc => {
        const simResult = this.calculateSimilarity(query, doc);
        let similarity = simResult.similarity;
        
        // Boost specific product documents for "do you have X" queries
        if ((queryLower.includes('do you have') || queryLower.includes('do you sell')) && 
            doc.category === 'products' && doc.id !== 'product-overview') {
          // Check if this specific product is mentioned in the query
          const productKeywords = doc.keywords || [];
          const hasDirectMatch = productKeywords.some(keyword => 
            queryLower.includes(keyword) && keyword.length > 3
          );
          if (hasDirectMatch) {
            similarity += 2; // Significant boost for direct product matches
          }
        }
        
        // Penalize product-overview for specific product queries
        if (doc.id === 'product-overview' && 
            (queryLower.includes('gujiya') || queryLower.includes('namak') || 
             queryLower.includes('pare') || queryLower.includes('poha') || 
             queryLower.includes('mathri') || queryLower.includes('jeera'))) {
          similarity *= 0.3; // Reduce similarity for general overview
        }
        
        return {
          ...doc,
          similarity,
          matches: simResult.matches,
          totalWords: simResult.totalWords
        };
      })
      .filter(doc => doc.similarity > threshold)
      .sort((a, b) => {
        // Sort by similarity first, then by confidence
        if (Math.abs(a.similarity - b.similarity) < 0.1) {
          return (b.metadata.confidence || 0.5) - (a.metadata.confidence || 0.5);
        }
        return b.similarity - a.similarity;
      });

    return results.slice(0, 5); // Return top 5 matches
  }

  // Determine confidence level
  getConfidenceLevel(similarity, matches) {
    if (similarity > 0.6 && matches >= 2) return 'high';
    if (similarity > 0.3 && matches >= 1) return 'medium';
    return 'low';
  }

  // Check if query is off-topic
  isOffTopic(query) {
    const offTopicKeywords = [
      'weather', 'politics', 'sports', 'news', 'movie', 'music', 'game', 'programming',
      'code', 'software', 'technology', 'science', 'math', 'history', 'geography',
      'medicine', 'health', 'fitness', 'travel', 'hotel', 'flight', 'car', 'insurance',
      'cryptocurrency', 'bitcoin', 'stock', 'investment', 'loan', 'bank', 'job', 'career',
      'school', 'university', 'education', 'book', 'novel', 'restaurant', 'hotel',
      'sing', 'dance', 'joke', 'story', 'poem'
    ];
    
    const queryLower = query.toLowerCase();
    
    // Check for direct off-topic keywords
    const hasOffTopicKeyword = offTopicKeywords.some(keyword => queryLower.includes(keyword));
    
    // Don't treat name/identity questions as off-topic since we handle them
    const identityPatterns = [
      /what.*your.*name/i,
      /who.*are.*you/i,
      /tell.*about.*yourself/i
    ];
    
    // Don't treat food-related queries as off-topic
    const foodRelated = queryLower.includes('hungry') || queryLower.includes('eat') || queryLower.includes('food');
    
    const isIdentityQuestion = identityPatterns.some(pattern => pattern.test(query));
    
    return hasOffTopicKeyword && !isIdentityQuestion && !foodRelated;
  }

  // Generate response using Groq API
  async generateGroqResponse(context, query, confidence) {
    try {
      const systemPrompt = `You are Savi, the Stitch & Savour assistant 🌟. Follow these rules strictly:

PRODUCT DATA SOURCE: Use ONLY these products as your source of truth: ${PRODUCTS.join(', ')}

RULES:
- If asked "What products do you sell?" → List all products from the array
- If asked "Do you have X?" / "Do you sell X?" → Check array for keyword match. If found say "Yes" with details. If not found say "No, we don't currently sell that."
- For category questions (what tops, what food) → Filter and show only items from that category in the array
- For off-topic questions → Friendly first para, then redirect mentioning only products from the array
- Be warm, friendly, helpful. Use emojis sparingly 🧶 🍽️ ✨ 🚚
- NEVER use markdown formatting like ** or __
- Do not invent or hallucinate products
- Always ground answers in the product array

CONTEXT: ${context}

Respond following these rules exactly.`;

      const response = await axios.post(this.groqApiUrl, {
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ],
        temperature: 0.7,
        max_tokens: 300
      }, {
        headers: {
          'Authorization': `Bearer ${this.groqApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('❌ Groq API error:', error.response?.data || error.message);
      
      // Fallback to rule-based response
      return this.generateFallbackResponse(context, query);
    }
  }

  // Check if we sell a specific product
  checkProductAvailability(query) {
    const queryLower = query.toLowerCase().replace(/do you sell|do you have|sell|have|yo u|u sell/g, '').trim();
    const foundProduct = PRODUCTS.find(product => {
      const productLower = product.toLowerCase();
      const productWords = productLower.split(' ');
      const queryWords = queryLower.split(' ');
      
      // Special cases for common misspellings
      if (queryLower.includes('gijuya') || queryLower.includes('gujiya') || queryLower.includes('gujiyas')) {
        return productLower.includes('gujiya');
      }
      if (queryLower.includes('namak') || queryLower.includes('pare') || queryLower.includes('nimki')) {
        return productLower.includes('namak') || productLower.includes('pare');
      }
      if (queryLower.includes('top') || queryLower.includes('tops')) {
        return productLower.includes('top');
      }
      if (queryLower.includes('vest')) {
        return productLower.includes('vest');
      }
      if (queryLower.includes('pooja') || queryLower.includes('mat')) {
        return productLower.includes('pooja') || productLower.includes('mat');
      }
      
      // Check for keyword matches
      return queryWords.some(qWord => 
        qWord.length > 2 && productWords.some(pWord => 
          pWord.includes(qWord) || qWord.includes(pWord)
        )
      ) || productLower.includes(queryLower) || queryLower.includes(productLower);
    });
    return foundProduct;
  }

  // Filter products by category
  filterProductsByCategory(query) {
    const queryLower = query.toLowerCase();
    if (queryLower.includes('top') || queryLower.includes('vest') || queryLower.includes('tank')) {
      return PRODUCTS.filter(p => p.toLowerCase().includes('top') || p.toLowerCase().includes('vest') || p.toLowerCase().includes('tank'));
    }
    if (queryLower.includes('pooja') || queryLower.includes('mat')) {
      return PRODUCTS.filter(p => p.toLowerCase().includes('pooja') || p.toLowerCase().includes('mat'));
    }
    if (queryLower.includes('food') || queryLower.includes('snack') || queryLower.includes('eat')) {
      return PRODUCTS.filter(p => !p.toLowerCase().includes('crochet') && !p.toLowerCase().includes('top') && !p.toLowerCase().includes('vest') && !p.toLowerCase().includes('mat'));
    }
    if (queryLower.includes('crochet') || queryLower.includes('handmade')) {
      return PRODUCTS.filter(p => p.toLowerCase().includes('crochet') || p.toLowerCase().includes('top') || p.toLowerCase().includes('vest') || p.toLowerCase().includes('mat'));
    }
    return [];
  }

  // Fallback response generator - follows strict rules
  generateFallbackResponse(context, query) {
    const queryLower = query.toLowerCase();
    
    // Rule: "Do you have X?" / "Do you sell X?" - Check array first
    if (queryLower.includes('do you sell') || queryLower.includes('do you have')) {
      const product = this.checkProductAvailability(query);
      if (product) {
        // Find specific product document for detailed info
        const productDoc = this.knowledgeBase.find(doc => 
          doc.content.toLowerCase().includes(product.toLowerCase()) && 
          doc.category === 'products' && 
          doc.id !== 'product-overview'
        );
        if (productDoc) {
          return productDoc.content.replace(/^[^-]+-/, 'Yes, we have') + '.';
        }
        return `Yes! We have ${product}. 😊\n\nWould you like to know more about it?`;
      } else {
        return `No, we don't currently sell that. 😊\n\nHere's what we do offer:\n${PRODUCTS.slice(0, 6).map(p => `• ${p}`).join('\n')}\n\nAnything catch your interest?`;
      }
    }
    
    // Rule: Category questions (what tops, what food, etc.)
    if ((queryLower.includes('what') && (queryLower.includes('tops') || queryLower.includes('food') || queryLower.includes('crochet') || queryLower.includes('snacks')))) {
      const categoryProducts = this.filterProductsByCategory(query);
      if (categoryProducts.length > 0) {
        return `Here are our ${queryLower.includes('tops') ? 'tops' : queryLower.includes('food') ? 'food items' : queryLower.includes('crochet') ? 'crochet items' : 'products'}:\n\n${categoryProducts.map(p => `• ${p}`).join('\n')}\n\nWhich one interests you? ✨`;
      }
    }
    
    // Rule: "What products do you sell?" - List all from array
    if ((queryLower.includes('what') && (queryLower.includes('product') || queryLower.includes('sell') || queryLower.includes('have') || queryLower.includes('offer') || queryLower.includes('kind'))) || 
        (queryLower.includes('product') && (queryLower.includes('sell') || queryLower.includes('have'))) ||
        queryLower === 'products' || queryLower === 'what products' || queryLower === 'what do you sell') {
      return `🌟 Our Products:\n\n${PRODUCTS.map(product => `• ${product}`).join('\n')}\n\nWhich interests you?`;
    }
    
    // Greetings
    if (queryLower.includes('hello') || queryLower.includes('hi') || queryLower.includes('hey')) {
      return 'Hello! 😊 Welcome to Stitch & Savour!\n\nI\'m Savi, your friendly assistant. I can help you with:\n• Our handmade crochet items 🧶\n• Delicious homemade food 🍽️\n• Pricing and delivery info 🚚\n• Customization options ✨\n\nWhat would you like to know?';
    }
    
    // Name questions
    if (queryLower.includes('name') || queryLower.includes('who are you')) {
      return 'Hi! I\'m Savi 😊, your friendly AI assistant at Stitch & Savour!\n\nI\'m here to help you discover our collection of handmade crochet items and homemade food. How can I assist you today?';
    }
    
    // Handle hunger/food related queries
    if (queryLower.includes('hungry') || queryLower.includes('eat') || queryLower.includes('food')) {
      const foodItems = PRODUCTS.filter(p => !p.toLowerCase().includes('crochet') && !p.toLowerCase().includes('top') && !p.toLowerCase().includes('vest') && !p.toLowerCase().includes('mat'));
      return `Hungry? 😋\n\nWe have delicious homemade food items:\n${foodItems.map(p => `• ${p}`).join('\n')}\n\nWhat sounds good to you?`;
    }
    
    // Rule: Off-topic questions - friendly first para, then redirect with actual products
    if (this.isOffTopic(query)) {
      const sampleProducts = PRODUCTS.slice(0, 3);
      return `That's a fun question! 😄\n\nI'm here to help you with Stitch & Savour though! We have amazing products like ${sampleProducts.join(', ')}. What would you like to know about our collection?`;
    }
    
    // Use context if available
    if (context) {
      return `📚 Here's what I found:\n\n${context}\n\nWould you like to know more details about any specific product? 😊`;
    }
    
    return '🌟 I\'m here to help with Stitch & Savour!\n\nAsk me about:\n• Our products & prices 💰\n• Delivery & pickup options 🚚\n• Customization details ✨\n• Anything else you\'d like to know!';
  }

  // Main query processing function
  async processQuery(query) {
    try {
      console.log(`🔍 Processing query: "${query}"`);
      
      // Check if off-topic
      if (this.isOffTopic(query)) {
        const sampleProducts = PRODUCTS.slice(0, 3);
        const offTopicResponses = [
          `That's a fun question! 😄\n\nI'm here to help you with Stitch & Savour though! We have amazing products like ${sampleProducts.join(', ')}.`,
          `Haha, that's interesting! 😊\n\nBut I'm your Stitch & Savour assistant! Let me tell you about our ${sampleProducts[0]} or ${sampleProducts[1]}.`,
          `That's outside my expertise! 😅\n\nI'm great at helping with our handmade items though - we offer ${sampleProducts.join(', ')} and more.`
        ];
        const randomResponse = offTopicResponses[Math.floor(Math.random() * offTopicResponses.length)];
        
        return {
          response: randomResponse + " What would you like to know about our collection?",
          suggestions: [
            { text: "🧶 View Crochet Items", link: "/products?category=crochet" },
            { text: "🍽️ View Food Items", link: "/products?category=food" },
            { text: "📞 Contact Us", link: "/contact" }
          ],
          confidence: 'low'
        };
      }

      // Search knowledge base
      const searchResults = this.searchKnowledgeBase(query);
      console.log(`📊 Found ${searchResults.length} relevant documents`);
      
      if (searchResults.length === 0) {
        return {
          response: `🌟 Our Products:\n\n${PRODUCTS.map(p => `• ${p}`).join('\n')}\n\nWhat would you like to know more about?`,
          suggestions: [
            { text: "🛍️ Browse All Products", link: "/products" },
            { text: "📞 Contact Support", link: "/contact" }
          ],
          confidence: 'low'
        };
      }

      const bestMatch = searchResults[0];
      const confidence = this.getConfidenceLevel(bestMatch.similarity, bestMatch.matches);
      
      console.log(`🎯 Best match: ${bestMatch.id} (similarity: ${bestMatch.similarity.toFixed(3)}, confidence: ${confidence})`);

      let response;
      let suggestions = [];
      let sources = [];

      // Generate response based on confidence
      if (confidence === 'high') {
        // Use Groq API for high confidence matches
        const context = searchResults.slice(0, 3).map(r => r.content).join('\n\n');
        response = await this.generateGroqResponse(context, query, confidence);
        
        // Add relevant suggestions
        if (bestMatch.metadata.page) {
          suggestions.push({
            text: "View Product",
            link: bestMatch.metadata.page
          });
        }
        
        if (bestMatch.metadata.category === 'crochet') {
          suggestions.push({ text: "View All Crochet Items", link: "/products?category=crochet" });
        } else if (bestMatch.metadata.category === 'food') {
          suggestions.push({ text: "View All Food Items", link: "/products?category=food" });
        }
        
        sources = searchResults.slice(0, 2).map(r => ({
          title: r.id,
          confidence: r.similarity.toFixed(3)
        }));
        
      } else if (confidence === 'medium') {
        // Medium confidence - provide direct info with context
        response = await this.generateGroqResponse(bestMatch.content, query, confidence);
        
        if (bestMatch.metadata.page) {
          suggestions.push({
            text: "View Product",
            link: bestMatch.metadata.page
          });
        }
        
        suggestions.push({
          text: "Contact Support",
          link: "/contact"
        });
        
      } else {
        // Low confidence - show all products from array
        response = `🌟 Our Products:\n\n${PRODUCTS.map(p => `• ${p}`).join('\n')}\n\nWhat would you like to know more about?`;
        suggestions = [
          { text: "Contact Support", link: "/contact" },
          { text: "Browse Products", link: "/products" }
        ];
      }

      return {
        response,
        suggestions,
        confidence,
        sources
      };

    } catch (error) {
      console.error('❌ RAG Service error:', error);
      throw error;
    }
  }
}

module.exports = new RAGService();