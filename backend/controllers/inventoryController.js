const Inventory = require('../models/Inventory');

const createInventoryItem = async (req, res) => {
  try {
    const inventoryItem = new Inventory(req.body);
    await inventoryItem.save();

    res.json({
      success: true,
      message: 'Inventory item created successfully',
      item: inventoryItem
    });
  } catch (error) {
    console.error('Create inventory error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getAllInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      inventory
    });
  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const updateInventoryQuantity = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const item = await Inventory.findByIdAndUpdate(
      itemId,
      { quantity: Math.max(0, quantity) },
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    res.json({
      success: true,
      message: 'Inventory updated successfully',
      item
    });
  } catch (error) {
    console.error('Update inventory error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const deleteInventoryItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    const item = await Inventory.findByIdAndDelete(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    res.json({
      success: true,
      message: 'Inventory item deleted successfully'
    });
  } catch (error) {
    console.error('Delete inventory error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getLowStockItems = async (req, res) => {
  try {
    const lowStockItems = await Inventory.find({
      $expr: { $lte: ['$quantity', '$minStock'] },
      minStock: { $gt: 0 }
    });

    res.json({
      success: true,
      lowStockItems
    });
  } catch (error) {
    console.error('Get low stock error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  createInventoryItem,
  getAllInventory,
  updateInventoryQuantity,
  deleteInventoryItem,
  getLowStockItems
};