const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['raw-materials', 'packaging', 'utilities', 'transport', 'marketing', 'equipment', 'other']
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paidBy: {
    type: String,
    required: true,
    enum: ['sangita', 'shivani', 'business']
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi', 'bank-transfer', 'cheque'],
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  invoice: {
    number: String,
    url: String,
    vendor: String
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringPeriod: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly']
  },
  tags: [String],
  notes: String,
  
  // For reconciliation
  reimbursed: {
    type: Boolean,
    default: false
  },
  reimbursementDate: Date,
  reimbursementAmount: Number,
  
  // Approval workflow
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Link to inventory if applicable
  inventoryItems: [{
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' },
    quantity: Number,
    unitCost: Number
  }]
}, {
  timestamps: true
});

// Index for efficient querying
expenseSchema.index({ date: -1, category: 1, paidBy: 1 });

module.exports = mongoose.model('Expense', expenseSchema);