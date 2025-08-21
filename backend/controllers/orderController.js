const smsService = require('../utils/smsService');
const emailService = require('../utils/emailService');

const createOrder = async (req, res) => {
  try {
    console.log('Order received:', req.body);
    
    const orderData = {
      orderNumber: 'SS' + Date.now(),
      orderId: 'SS' + Date.now(),
      total: req.body.total || 0,
      items: req.body.items || [],
      paymentMethod: req.body.paymentMethod || 'cod',
      deliveryAddress: req.body.deliveryAddress || {},
      deliveryOption: req.body.deliveryOption || 'home',
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    };

    const userData = {
      name: req.body.customerName || 'Customer',
      phone: req.body.customerPhone || req.body.phone || '+919970944685',
      email: req.body.customerEmail || req.body.email
    };

    console.log('📦 Processing order for:', userData.name, 'Phone:', userData.phone);

    // Send email confirmation to customer (with invoice)
    if (userData.email) {
      try {
        const emailResult = await emailService.sendOrderConfirmation(orderData, userData);
        console.log('📧 Customer email result:', emailResult);
      } catch (emailError) {
        console.error('❌ Customer email failed:', emailError);
        // Fallback to SMS/WhatsApp
        try {
          const smsResult = await smsService.sendOrderConfirmation(orderData, userData);
          console.log('📱 SMS fallback result:', smsResult);
        } catch (smsError) {
          console.error('❌ SMS fallback failed:', smsError);
        }
      }
    } else {
      // No email provided, use SMS/WhatsApp
      try {
        const smsResult = await smsService.sendOrderConfirmation(orderData, userData);
        console.log('📱 SMS notification result:', smsResult);
      } catch (smsError) {
        console.error('❌ SMS notification failed:', smsError);
      }
    }

    // Send admin notification (email + SMS)
    try {
      const adminEmailResult = await emailService.sendAdminNotification(orderData, userData);
      console.log('📧 Admin email result:', adminEmailResult);
    } catch (adminEmailError) {
      console.error('❌ Admin email failed:', adminEmailError);
    }
    
    try {
      const adminSmsResult = await smsService.sendAdminAlert(orderData, userData);
      console.log('📱 Admin SMS result:', adminSmsResult);
    } catch (adminSmsError) {
      console.error('❌ Admin SMS failed:', adminSmsError);
    }
    
    res.json({
      success: true,
      message: 'Order placed successfully! Confirmation message sent.',
      order: orderData
    });
  } catch (error) {
    console.error('Order error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getUserOrders = async (req, res) => {
  try {
    // Return mock order for testing
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
      orders: mockOrders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    res.json({
      success: true,
      orders: []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    // Get order from localStorage (in production, this would be from database)
    const allOrders = JSON.parse(localStorage?.getItem?.('userOrders') || '[]');
    const order = allOrders.find(o => o.orderNumber === orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Update order status
    order.status = status;
    
    // Get user data
    const userData = {
      name: order.customerName,
      phone: order.customerPhone || order.phone,
      email: order.customerEmail || order.email
    };
    
    // Send status update notification
    if (userData.email) {
      try {
        const emailResult = await emailService.sendStatusUpdate(order, userData, status);
        console.log('📧 Status update email result:', emailResult);
      } catch (emailError) {
        console.error('❌ Status update email failed:', emailError);
        // Fallback to SMS
        try {
          const smsResult = await smsService.sendStatusUpdate(order, userData, status);
          console.log('📱 SMS fallback result:', smsResult);
        } catch (smsError) {
          console.error('❌ SMS fallback failed:', smsError);
        }
      }
    } else {
      // No email, use SMS
      try {
        const smsResult = await smsService.sendStatusUpdate(order, userData, status);
        console.log('📱 SMS status update result:', smsResult);
      } catch (smsError) {
        console.error('❌ SMS status update failed:', smsError);
      }
    }
    
    res.json({
      success: true,
      message: 'Order status updated and notification sent',
      order
    });
  } catch (error) {
    console.error('Order status update error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = { 
  createOrder, 
  getUserOrders, 
  getAllOrders, 
  updateOrderStatus 
};