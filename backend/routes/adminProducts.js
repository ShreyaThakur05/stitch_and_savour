const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts, updateProduct, deleteProduct } = require('../controllers/adminProductController');
const { auth } = require('../middleware/auth');

router.post('/', auth, createProduct);
router.get('/', getAllProducts);
router.put('/:productId', auth, updateProduct);
router.delete('/:productId', auth, deleteProduct);

module.exports = router;