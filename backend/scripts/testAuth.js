const mongoose = require('mongoose');
const User = require('../models/User');
const Order = require('../models/Order');
const Contact = require('../models/Contact');

// Test authentication and data synchronization
async function testAuthAndData() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stitch_savour');
    console.log('✅ Connected to database');

    // Test user creation and authentication
    console.log('\n🔐 Testing Authentication...');
    
    // Check if test user exists
    let testUser = await User.findOne({ email: 'test@example.com' });
    if (!testUser) {
      testUser = new User({
        name: 'Test User',
        email: 'test@example.com',
        phone: '+919999999999',
        address: 'Test Address',
        password: 'test123',
        role: 'customer'
      });
      await testUser.save();
      console.log('✅ Test user created');
    } else {
      console.log('✅ Test user exists');
    }

    // Test password comparison
    const isPasswordValid = await testUser.comparePassword('test123');
    console.log('✅ Password validation:', isPasswordValid ? 'PASS' : 'FAIL');

    // Test data synchronization
    console.log('\n📊 Testing Data Synchronization...');
    
    // Count orders
    const orderCount = await Order.countDocuments();
    console.log(`📦 Total orders in database: ${orderCount}`);
    
    // Count contacts
    const contactCount = await Contact.countDocuments();
    console.log(`📧 Total contacts in database: ${contactCount}`);
    
    // Count reviews (try both models)
    let reviewCount = 0;
    try {
      const SimpleReview = mongoose.model('SimpleReview');
      const simpleReviewCount = await SimpleReview.countDocuments();
      reviewCount += simpleReviewCount;
      console.log(`⭐ SimpleReviews in database: ${simpleReviewCount}`);
    } catch (error) {
      console.log('⭐ SimpleReview model not found');
    }
    
    try {
      const Review = require('../models/Review');
      const originalReviewCount = await Review.countDocuments();
      reviewCount += originalReviewCount;
      console.log(`⭐ Original Reviews in database: ${originalReviewCount}`);
    } catch (error) {
      console.log('⭐ Review model not found');
    }
    
    console.log(`⭐ Total reviews: ${reviewCount}`);

    console.log('\n✅ Authentication and data synchronization test completed');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
  }
}

// Run the test
if (require.main === module) {
  testAuthAndData();
}

module.exports = testAuthAndData;