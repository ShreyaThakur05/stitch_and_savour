const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const {
  addReview,
  getProductReviews,
  getAllReviews,
  deleteReview
} = require('../controllers/reviewController');

// Public routes
router.get('/product/:productId', getProductReviews);

// User routes
router.post('/add', auth, addReview);

// Admin routes
router.get('/all', auth, adminAuth, getAllReviews);
router.delete('/:id', auth, adminAuth, deleteReview);

module.exports = router;