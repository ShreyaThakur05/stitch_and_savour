const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

const getAdminDashboard = async (req, res) => {
  try {
    // Get all orders
    const orders = await Order.find({})
      .populate('user', 'name email phone')
      .populate('items.product', 'name images category')
      .sort({ createdAt: -1 });
    
    // Calculate stats
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaysSales = orders
      .filter(order => new Date(order.createdAt) >= today)
      .reduce((sum, order) => sum + order.total, 0);
    
    const pendingOrders = orders.filter(order => 
      !['delivered', 'cancelled'].includes(order.status)
    ).length;
    
    // Get unique customers
    const uniqueCustomers = new Set();
    orders.forEach(order => {
      if (order.customerInfo?.email) uniqueCustomers.add(order.customerInfo.email);
      else if (order.customerInfo?.phone) uniqueCustomers.add(order.customerInfo.phone);
    });
    
    res.json({
      success: true,
      data: {
        stats: {
          totalSales,
          todaysSales,
          totalOrders: orders.length,
          pendingOrders,
          totalCustomers: uniqueCustomers.size,
          netProfit: totalSales * 0.3 // Assuming 30% profit margin
        },
        orders
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user?.id;
    let orders = [];
    
    if (userId) {
      orders = await Order.find({ user: userId })
        .populate('items.product', 'name images')
        .sort({ createdAt: -1 });
    }
    
    const deliveredOrders = orders.filter(order => order.status === 'delivered').length;
    const paymentDue = orders
      .filter(order => order.paymentStatus === 'pending')
      .reduce((sum, order) => sum + order.total, 0);
    
    res.json({
      success: true,
      data: {
        orders,
        stats: {
          totalOrders: orders.length,
          deliveredOrders,
          paymentDue
        }
      }
    });
  } catch (error) {
    console.error('User dashboard error:', error);
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