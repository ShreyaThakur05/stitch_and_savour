const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const { auth } = require('../middleware/auth');

// Get user wishlist
router.get('/', auth, async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ userId: req.user.userId });
    res.json({ success: true, wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add to wishlist
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, productName, productPrice, productImage } = req.body;
    
    const existingItem = await Wishlist.findOne({ 
      userId: req.user.userId, 
      productId 
    });
    
    if (existingItem) {
      return res.status(400).json({ success: false, message: 'Item already in wishlist' });
    }
    
    const wishlistItem = new Wishlist({
      userId: req.user.userId,
      productId,
      productName,
      productPrice,
      productImage
    });
    
    await wishlistItem.save();
    res.json({ success: true, item: wishlistItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Remove from wishlist
router.delete('/remove/:productId', auth, async (req, res) => {
  try {
    await Wishlist.findOneAndDelete({ 
      userId: req.user.userId, 
      productId: req.params.productId 
    });
    res.json({ success: true, message: 'Item removed from wishlist' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;