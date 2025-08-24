const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    console.log('Testing MongoDB connection...');
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stitch-savour', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB connected successfully!');
    
    // Test creating a sample order
    const Order = require('../models/Order');
    
    const testOrder = new Order({
      orderNumber: 'TEST' + Date.now(),
      subtotal: 500,
      total: 525,
      deliveryCharges: 25,
      items: [{
        name: 'Test Product',
        price: 500,
        quantity: 1,
        subtotal: 500
      }],
      paymentMethod: 'cod',
      deliveryAddress: {
        street: 'Test Address',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411060'
      },
      customerInfo: {
        name: 'Test Customer',
        phone: '+919999999999',
        email: 'test@example.com'
      },
      status: 'received',
      paymentStatus: 'pending',
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    });
    
    await testOrder.save();
    console.log('✅ Test order created:', testOrder.orderNumber);
    
    // Clean up test order
    await Order.deleteOne({ _id: testOrder._id });
    console.log('✅ Test order cleaned up');
    
    await mongoose.disconnect();
    console.log('✅ Database test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    process.exit(1);
  }
};

testConnection();