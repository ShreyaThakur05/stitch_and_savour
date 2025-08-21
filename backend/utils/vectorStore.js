const fs = require('fs');
const path = require('path');

// Simple in-memory vector store for minimal implementation
class VectorStore {
  constructor() {
    this.documents = [];
    this.embeddings = [];
    this.initializeKnowledgeBase();
  }

  initializeKnowledgeBase() {
    // Website knowledge base
    const knowledgeBase = [
      {
        id: 'about',
        content: 'Stitch & Savour is run by Sangita Thakur, offering handmade crochet items and homemade food. Contact: sangita.shreyas@gmail.com, +91 9970944685',
        category: 'about',
        metadata: { type: 'info', page: '/about' }
      },
      {
        id: 'crochet-products',
        content: 'Crochet products include Boho Chic Granny Square Top (₹1299), Classic Striped V-Neck Vest (₹1199), Minimalist Pink Tank Top (₹999), Pooja Mats (₹449-499). Made to order, 14 days delivery.',
        category: 'products',
        metadata: { type: 'products', page: '/products?category=crochet' }
      },
      {
        id: 'food-products',
        content: 'Food items include Poha Chivda, Shakarpara, Namak Pare, Mixture, Mathri, Jeera Biscuits, Gujiya. All homemade, fresh, ₹25 per 100g packet. 2 days delivery.',
        category: 'products',
        metadata: { type: 'products', page: '/products?category=food' }
      },
      {
        id: 'delivery',
        content: 'Delivery: Local Sirul (same day), Maharashtra (1-2 days), Pan-India (3-7 days). Free delivery on all orders.',
        category: 'shipping',
        metadata: { type: 'info' }
      },
      {
        id: 'payment',
        content: 'Payment methods: QR Code payment, Cash on Delivery (COD). Secure checkout available.',
        category: 'payment',
        metadata: { type: 'info', page: '/checkout' }
      },
      {
        id: 'customization',
        content: 'Crochet items can be customized: colors, sizes, thread types. Custom sizing available for ₹200 extra.',
        category: 'customization',
        metadata: { type: 'info' }
      }
    ];

    this.documents = knowledgeBase;
  }

  // Simple text similarity using word overlap
  calculateSimilarity(query, document) {
    const queryWords = query.toLowerCase().split(/\s+/);
    const docWords = document.content.toLowerCase().split(/\s+/);
    
    const intersection = queryWords.filter(word => docWords.includes(word));
    const union = [...new Set([...queryWords, ...docWords])];
    
    return intersection.length / union.length;
  }

  search(query, threshold = 0.1) {
    const results = this.documents
      .map(doc => ({
        ...doc,
        similarity: this.calculateSimilarity(query, doc)
      }))
      .filter(doc => doc.similarity > threshold)
      .sort((a, b) => b.similarity - a.similarity);

    return results;
  }

  getConfidenceLevel(similarity) {
    if (similarity > 0.3) return 'high';
    if (similarity > 0.15) return 'medium';
    return 'low';
  }
}

module.exports = new VectorStore();