const AdminProduct = require('../models/AdminProduct');

const createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      ingredients: req.body.ingredients ? req.body.ingredients.split(',').map(i => i.trim()) : [],
      allergens: req.body.allergens ? req.body.allergens.split(',').map(a => a.trim()) : [],
      weightOptions: req.body.weightOptions ? req.body.weightOptions.split(',').map(w => w.trim()) : []
    };

    // Set customization for crochet items
    if (productData.category === 'crochet') {
      productData.customization = [
        {
          type: 'thread-type',
          label: 'Thread Type',
          options: ['Cotton Thread', 'Wool Thread'],
          priceModifier: { 'Wool Thread': 200 }
        },
        {
          type: 'color',
          label: 'Colors',
          options: ['As Pictured'],
          priceModifier: 0
        },
        {
          type: 'size',
          label: 'Size',
          options: ['Small (S)', 'Medium (M)', 'Large (L)', 'Custom Sizing (+₹200)'],
          priceModifier: { 'Custom Sizing (+₹200)': 200 }
        }
      ];
    }

    const product = new AdminProduct(productData);
    await product.save();

    res.json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await AdminProduct.find({ isActive: true }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      products
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const updateData = {
      ...req.body,
      ingredients: req.body.ingredients ? req.body.ingredients.split(',').map(i => i.trim()) : [],
      allergens: req.body.allergens ? req.body.allergens.split(',').map(a => a.trim()) : [],
      weightOptions: req.body.weightOptions ? req.body.weightOptions.split(',').map(w => w.trim()) : []
    };

    const product = await AdminProduct.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const product = await AdminProduct.findByIdAndUpdate(
      productId,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct
};