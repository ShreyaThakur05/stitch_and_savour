const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: false
    },
    name: String,
    price: Number,
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    customization: {
      color: String,
      size: String,
      threadType: String,
      pattern: String,
      specialInstructions: String
    },
    subtotal: Number
  }],
  
  // Pricing
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  deliveryCharges: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  
  // Customer details
  customerInfo: {
    name: String,
    email: String,
    phone: String
  },
  
  // Delivery address
  deliveryAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' },
    landmark: String
  },
  
  // Order status
  status: {
    type: String,
    enum: ['received', 'confirmed', 'in-progress', 'ready', 'out-for-delivery', 'delivered', 'cancelled'],
    default: 'received'
  },
  
  // Payment details
  paymentMethod: {
    type: String,
    enum: ['cod', 'qr', 'upi', 'card'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentId: String,
  
  // Delivery details
  estimatedDelivery: {
    type: Date,
    required: true
  },
  actualDelivery: Date,
  deliveryNotes: String,
  
  // Tracking
  trackingUpdates: [{
    status: String,
    message: String,
    timestamp: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  
  // Communication
  whatsappSent: {
    confirmation: { type: Boolean, default: false },
    statusUpdates: [{ status: String, sent: Boolean, timestamp: Date }]
  },
  
  // Admin notes
  adminNotes: String,
  cancellationReason: String,
  
  // Invoice
  invoiceGenerated: {
    type: Boolean,
    default: false
  },
  invoiceUrl: String,
  
  // Analytics
  source: {
    type: String,
    enum: ['website', 'whatsapp', 'phone', 'referral'],
    default: 'website'
  }
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `SS${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Calculate estimated delivery based on product categories
orderSchema.methods.calculateEstimatedDelivery = function() {
  const hasCrochet = this.items.some(item => item.product.category === 'crochet');
  const hasFood = this.items.some(item => item.product.category === 'food');
  
  let deliveryDays = 2; // Default for food
  
  if (hasCrochet && !hasFood) {
    deliveryDays = 14; // 2 weeks for crochet only
  } else if (hasCrochet && hasFood) {
    deliveryDays = 14; // Longest delivery time when mixed
  }
  
  // Add extra days for bulk orders
  const totalQuantity = this.items.reduce((sum, item) => sum + item.quantity, 0);
  if (totalQuantity > 5) {
    deliveryDays += 2;
  }
  
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + deliveryDays);
  this.estimatedDelivery = estimatedDate;
};

// Add tracking update
orderSchema.methods.addTrackingUpdate = function(status, message, updatedBy) {
  this.trackingUpdates.push({
    status,
    message,
    updatedBy
  });
  this.status = status;
};

module.exports = mongoose.model('Order', orderSchema);