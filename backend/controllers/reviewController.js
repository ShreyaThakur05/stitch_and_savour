const Review = require('../models/Review');
const Product = require('../models/Product');

// Add review
const addReview = async (req, res) => {
  try {
    const reviewData = {
      user: req.user?.id,
      product: req.body.productId || req.body.product,
      rating: parseInt(req.body.rating) || 5,
      comment: req.body.comment || req.body.review,
      customerName: req.body.customerName || req.user?.name || 'Anonymous',
      customerEmail: req.body.customerEmail || req.user?.email || '',
      productName: req.body.productName,
      orderNumber: req.body.orderNumber
    };

    // Check if user already reviewed this product (only if user is authenticated)
    if (req.user?.id) {
      const existingReview = await Review.findOne({
        user: req.user.id,
        product: reviewData.product
      });

      if (existingReview) {
        return res.status(400).json({
          success: false,
          message: 'You have already reviewed this product'
        });
      }
    }

    const review = new Review(reviewData);
    await review.save();

    // Update product rating
    await updateProductRating(reviewData.product);

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add review'
    });
  }
};

// Get product reviews
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const reviews = await Review.find({ 
      $or: [
        { product: productId },
        { productId: productId }
      ]
    })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

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
    const reviews = await Review.find()
      .populate('user', 'name email')
      .populate('product', 'name')
      .sort({ createdAt: -1 });

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