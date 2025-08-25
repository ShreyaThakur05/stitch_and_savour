const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { auth } = require('../middleware/auth');

// Optional auth middleware - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (token && token !== 'null' && token !== 'undefined') {
    try {
      const jwt = require('jsonwebtoken');
      const User = require('../models/User');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      const user = await User.findById(decoded.userId).select('-password');
      if (user) {
        req.user = user;
        req.userId = user._id;
      }
    } catch (error) {
      console.log('Optional auth failed, continuing as guest:', error.message);
      // Continue without user if token is invalid
    }
  }
  next();
};

router.get('/', auth, getUserOrders);
router.post('/', optionalAuth, createOrder);
router.get('/all', auth, getAllOrders);
router.put('/:orderId/status', auth, updateOrderStatus);

module.exports = router;