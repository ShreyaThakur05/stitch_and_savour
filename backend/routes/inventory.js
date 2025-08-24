const express = require('express');
const router = express.Router();
const { createInventoryItem, getAllInventory, updateInventoryQuantity, deleteInventoryItem, getLowStockItems } = require('../controllers/inventoryController');
const { auth } = require('../middleware/auth');

router.post('/', auth, createInventoryItem);
router.get('/', auth, getAllInventory);
router.get('/low-stock', auth, getLowStockItems);
router.put('/:itemId', auth, updateInventoryQuantity);
router.delete('/:itemId', auth, deleteInventoryItem);

module.exports = router;