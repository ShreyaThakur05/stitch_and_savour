const mongoose = require('mongoose');

const adminProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  shortDescription: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  pricePerKg: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    enum: ['food', 'crochet'],
    required: true
  },
  images: [{
    type: String
  }],
  ingredients: [{
    type: String
  }],
  allergens: [{
    type: String
  }],
  weightOptions: [{
    type: String
  }],
  yarnType: String,
  careInstructions: String,
  deliveryTime: {
    type: Number,
    default: function() {
      return this.category === 'crochet' ? 14 : 2;
    }
  },
  stockStatus: {
    type: String,
    enum: ['available', 'made-to-order', 'out-of-stock'],
    default: 'available'
  },
  customization: [{
    type: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    options: [{
      type: String
    }],
    priceModifier: mongoose.Schema.Types.Mixed
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AdminProduct', adminProductSchema);