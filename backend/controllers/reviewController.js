const mongoose = require('mongoose');
const Review = require('../models/Review');
const Product = require('../models/Product');

// Add review
const addReview = async (req, res) => {
  try {
    // Create a simplified review without requiring Product ObjectId
    const reviewData = {
      user: req.user?.id || null,
      productName: req.body.productName || req.body.productId,
      rating: parseInt(req.body.rating) || 5,
      comment: req.body.comment || req.body.review,
      customerName: req.body.customerName || req.user?.name || 'Anonymous',
      customerEmail: req.body.customerEmail || req.user?.email || '',
      orderNumber: req.body.orderNumber,
      verified: true // Mark as verified since it's from order
    };

    // For now, create a simple review document without the Product reference
    const SimpleReview = mongoose.model('SimpleReview', new mongoose.Schema({
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      productName: { type: String, required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String, required: true },
      customerName: { type: String, required: true },
      customerEmail: String,
      orderNumber: String,
      verified: { type: Boolean, default: true }
    }, { timestamps: true }));

    const review = new SimpleReview(reviewData);
    await review.save();

    console.log('✅ Review saved successfully:', review._id);

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add review',
      error: error.message
    });
  }
};

// Get product reviews
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Try SimpleReview first, then fallback to Review
    let reviews = [];
    
    try {
      const SimpleReview = mongoose.model('SimpleReview');
      reviews = await SimpleReview.find({ 
        $or: [
          { productName: productId },
          { productId: productId }
        ]
      })
        .populate('user', 'name')
        .sort({ createdAt: -1 });
      console.log('⭐ Found SimpleReviews for product:', productId, reviews.length);
    } catch (simpleError) {
      // Fallback to original Review model
      reviews = await Review.find({ 
        $or: [
          { product: productId },
          { productId: productId }
        ]
      })
        .populate('user', 'name')
        .sort({ createdAt: -1 });
      console.log('⭐ Found Reviews for product:', productId, reviews.length);
    }

    res.json({ success: true, reviews });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
  }
};

// Update product rating helper
const updateProductRating = async (productId) => {
  try {
    const reviews = await Review.find({ product: productId });
    
    if (reviews.length === 0) {
      await Product.findByIdAndUpdate(productId, {
        rating: 0,
        reviewCount: 0
      });
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(averageRating * 10) / 10,
      reviewCount: reviews.length
    });
  } catch (error) {
    console.error('Update product rating error:', error);
  }
};

// Get all reviews (admin)
const getAllReviews = async (req, res) => {
  try {
    // Try to get SimpleReview first, fallback to Review
    let reviews = [];
    
    try {
      const SimpleReview = mongoose.model('SimpleReview');
      reviews = await SimpleReview.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 });
      console.log('⭐ Found SimpleReviews:', reviews.length);
    } catch (simpleError) {
      // Fallback to original Review model
      reviews = await Review.find()
        .populate('user', 'name email')
        .populate('product', 'name')
        .sort({ createdAt: -1 });
      console.log('⭐ Found Reviews:', reviews.length);
    }

    res.json({ success: true, reviews });
  } catch (error) {
    console.error('Get all reviews error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
  }
};

// Delete review (admin)
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    
    const review = await Review.findByIdAndDelete(id);
    
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Update product rating
    await updateProductRating(review.product);

    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete review' });
  }
};

module.exports = {
  addReview,
  getProductReviews,
  getAllReviews,
  deleteReview,
  createReview: addReview // Alias for compatibility
};