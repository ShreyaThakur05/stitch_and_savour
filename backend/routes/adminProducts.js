const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts, updateProduct, deleteProduct } = require('../controllers/adminProductController');
const { auth } = require('../middleware/auth');
const AdminProduct = require('../models/AdminProduct');

router.post('/', auth, createProduct);
router.get('/', getAllProducts);
router.get('/:productId', async (req, res) => {
  try {
    const product = await AdminProduct.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
router.put('/:productId', auth, updateProduct);
router.delete('/:productId', auth, deleteProduct);

module.exports = router;