const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

// Update RAG service product array
const updateRAGProducts = async () => {
  try {
    const products = await Product.find({}, 'name');
    const productNames = products.map(p => p.name);
    
    const ragServicePath = path.join(__dirname, '../utils/ragService.js');
    let ragContent = fs.readFileSync(ragServicePath, 'utf8');
    
    // Update the PRODUCTS array
    const newProductsArray = `const PRODUCTS = [\n  ${productNames.map(name => `"${name}"`).join(',\n  ')}\n];`;
    ragContent = ragContent.replace(/const PRODUCTS = \[[\s\S]*?\];/, newProductsArray);
    
    fs.writeFileSync(ragServicePath, ragContent);
    console.log('✅ RAG service updated with new products');
  } catch (error) {
    console.error('❌ Error updating RAG service:', error);
  }
};

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create product (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    await updateRAGProducts();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    res.status(400).json({ message: 'Error creating product', error: error.message });
  }
});

// Update product (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await updateRAGProducts();
    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error: error.message });
  }
});

// Delete product (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await updateRAGProducts();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting product', error: error.message });
  }
});

module.exports = router;