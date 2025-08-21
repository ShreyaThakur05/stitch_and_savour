const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

const getAdminDashboard = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        stats: {
          totalSales: 0,
          todaysSales: 0,
          totalOrders: 0,
          pendingOrders: 0,
          totalCustomers: 0,
          netProfit: 0
        },
        orders: []
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getUserDashboard = async (req, res) => {
  try {
    const mockOrders = [{
      _id: '1',
      orderNumber: 'SS' + Date.now(),
      total: 299,
      status: 'pending',
      paymentMethod: 'cod',
      createdAt: new Date(),
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      items: [{ name: 'Test Product', quantity: 1, price: 299 }]
    }];
    
    res.json({
      success: true,
      data: {
        orders: mockOrders,
        stats: {
          totalOrders: 1,
          deliveredOrders: 0,
          paymentDue: 299
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getAdminDashboard,
  getUserDashboard
};