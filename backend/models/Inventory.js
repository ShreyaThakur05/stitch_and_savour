const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['raw-material', 'packaging', 'finished-product']
  },
  type: {
    type: String,
    required: true // e.g., 'Maida', 'Rava', 'Cotton Yarn', 'Acrylic Yarn'
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'g', 'liter', 'ml', 'piece', 'meter', 'yard']
  },
  currentStock: {
    type: Number,
    required: true,
    min: 0
  },
  minStockLevel: {
    type: Number,
    required: true,
    min: 0
  },
  maxStockLevel: {
    type: Number,
    required: true
  },
  costPerUnit: {
    type: Number,
    required: true,
    min: 0
  },
  supplier: {
    name: String,
    contact: String,
    address: String
  },
  lastPurchased: {
    date: Date,
    quantity: Number,
    cost: Number,
    invoice: String
  },
  expiryDate: Date,
  location: String, // Storage location
  notes: String,
  
  // Stock movements
  movements: [{
    type: { type: String, enum: ['in', 'out'], required: true },
    quantity: { type: Number, required: true },
    reason: String,
    reference: String, // Order ID, Purchase ID, etc.
    date: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual for stock status
inventorySchema.virtual('stockStatus').get(function() {
  if (this.currentStock <= 0) return 'out-of-stock';
  if (this.currentStock <= this.minStockLevel) return 'low-stock';
  if (this.currentStock >= this.maxStockLevel) return 'overstock';
  return 'in-stock';
});

// Method to add stock movement
inventorySchema.methods.addMovement = function(type, quantity, reason, reference, updatedBy) {
  this.movements.push({
    type,
    quantity,
    reason,
    reference,
    updatedBy
  });
  
  if (type === 'in') {
    this.currentStock += quantity;
  } else {
    this.currentStock -= quantity;
  }
  
  if (this.currentStock < 0) {
    this.currentStock = 0;
  }
};

module.exports = mongoose.model('Inventory', inventorySchema);