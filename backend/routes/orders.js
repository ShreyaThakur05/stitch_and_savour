const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { auth } = require('../middleware/auth');

// Optional auth middleware - doesn't fail if no token
const optionalAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (token) {
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (error) {
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