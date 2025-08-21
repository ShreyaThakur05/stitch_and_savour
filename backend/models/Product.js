const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['food', 'crochet']
  },
  subcategory: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  costPrice: {
    type: Number,
    required: true,
    min: 0
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: { type: Boolean, default: false }
  }],
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  stockStatus: {
    type: String,
    enum: ['available', 'made-to-order', 'out-of-stock'],
    default: 'available'
  },
  
  // Food specific fields
  ingredients: [String],
  allergens: [String],
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  shelfLife: {
    type: Number, // in days
    default: 7
  },
  weight: {
    value: Number,
    unit: { type: String, enum: ['g', 'kg'], default: 'g' }
  },
  
  // Crochet specific fields
  materials: [String],
  colors: [String],
  sizes: [String],
  threadTypes: [String],
  careInstructions: [String],
  customizable: {
    type: Boolean,
    default: false
  },
  customizationOptions: {
    colors: [String],
    sizes: [String],
    threadTypes: [String],
    patterns: [String]
  },
  
  // Common fields
  deliveryTime: {
    min: Number, // in days
    max: Number
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  // SEO fields
  slug: {
    type: String,
    unique: true
  },
  metaTitle: String,
  metaDescription: String,
  
  // Analytics
  views: {
    type: Number,
    default: 0
  },
  sales: {
    type: Number,
    default: 0
  },
  
  // Reviews
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    images: [String],
    createdAt: { type: Date, default: Date.now }
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Generate slug before saving
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  next();
});

// Calculate average rating
productSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
    this.totalReviews = 0;
  } else {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.averageRating = sum / this.reviews.length;
    this.totalReviews = this.reviews.length;
  }
};

// Virtual for profit margin
productSchema.virtual('profitMargin').get(function() {
  return ((this.price - this.costPrice) / this.price * 100).toFixed(2);
});

module.exports = mongoose.model('Product', productSchema);