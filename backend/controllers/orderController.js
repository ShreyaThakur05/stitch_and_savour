const Order = require('../models/Order');
const User = require('../models/User');
const smsService = require('../utils/smsService');
const emailService = require('../utils/emailService');

const createOrder = async (req, res) => {
  try {
    console.log('Order received:', req.body);
    
    // Create order in database
    const orderData = {
      orderNumber: 'SS' + Date.now(),
      subtotal: req.body.subtotal || req.body.total || 0,
      total: req.body.total || 0,
      deliveryCharges: req.body.deliveryCharges || 0,
      items: (req.body.items || []).map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        customization: item.customization || {},
        subtotal: item.price * item.quantity
      })),
      paymentMethod: req.body.paymentMethod || 'cod',
      deliveryAddress: {
        street: req.body.deliveryAddress?.street || req.body.address || '',
        city: req.body.deliveryAddress?.city || 'Pune',
        state: req.body.deliveryAddress?.state || 'Maharashtra',
        pincode: req.body.deliveryAddress?.pincode || '411060',
        landmark: req.body.deliveryAddress?.landmark || ''
      },
      customerInfo: {
        name: req.body.customerName || req.body.name || 'Customer',
        phone: req.body.customerPhone || req.body.phone || '+919970944685',
        email: req.body.customerEmail || req.body.email || ''
      },
      status: 'received',
      paymentStatus: req.body.paymentMethod === 'qr' ? 'paid' : 'pending'
    };

    // Calculate estimated delivery
    const hasCrochet = orderData.items.some(item => 
      item.name.toLowerCase().includes('crochet') || 
      item.name.toLowerCase().includes('top') || 
      item.name.toLowerCase().includes('vest')
    );
    const deliveryDays = hasCrochet ? 14 : 2;
    orderData.estimatedDelivery = new Date(Date.now() + deliveryDays * 24 * 60 * 60 * 1000);

    // Save to database
    const order = new Order(orderData);
    await order.save();
    
    console.log('📦 Order saved to database:', order.orderNumber);

    const userData = {
      name: orderData.customerInfo.name,
      phone: orderData.customerInfo.phone,
      email: orderData.customerInfo.email
    };

    // Send notifications
    if (userData.email) {
      try {
        const emailResult = await emailService.sendOrderConfirmation(order, userData);
        console.log('📧 Customer email result:', emailResult);
      } catch (emailError) {
        console.error('❌ Customer email failed:', emailError);
        try {
          const smsResult = await smsService.sendOrderConfirmation(order, userData);
          console.log('📱 SMS fallback result:', smsResult);
        } catch (smsError) {
          console.error('❌ SMS fallback failed:', smsError);
        }
      }
    } else {
      try {
        const smsResult = await smsService.sendOrderConfirmation(order, userData);
        console.log('📱 SMS notification result:', smsResult);
      } catch (smsError) {
        console.error('❌ SMS notification failed:', smsError);
      }
    }

    // Send admin notifications
    try {
      const adminEmailResult = await emailService.sendAdminNotification(order, userData);
      console.log('📧 Admin email result:', adminEmailResult);
    } catch (adminEmailError) {
      console.error('❌ Admin email failed:', adminEmailError);
    }
    
    try {
      const adminSmsResult = await smsService.sendAdminAlert(order, userData);
      console.log('📱 Admin SMS result:', adminSmsResult);
    } catch (adminSmsError) {
      console.error('❌ Admin SMS failed:', adminSmsError);
    }
    
    res.json({
      success: true,
      message: 'Order placed successfully! Confirmation message sent.',
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
        estimatedDelivery: order.estimatedDelivery
      }
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
    const userId = req.user?.id;
    let orders = [];
    
    if (userId) {
      // Get orders for authenticated user
      orders = await Order.find({ user: userId })
        .populate('items.product', 'name images')
        .sort({ createdAt: -1 });
    } else {
      // For guest users, try to find by email/phone from request
      const { email, phone } = req.query;
      if (email || phone) {
        const query = {};
        if (email) query['customerInfo.email'] = email;
        if (phone) query['customerInfo.phone'] = phone;
        
        orders = await Order.find(query).sort({ createdAt: -1 });
      }
    }
    
    res.json({
      success: true,
      orders: orders
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email phone')
      .populate('items.product', 'name images category')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      orders: orders
    });
  } catch (error) {
    console.error('Get all orders error:', error);
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
    
    // Find order in database
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Update order status
    order.status = status;
    order.addTrackingUpdate(status, `Order status updated to ${status}`, req.user?.id);
    
    if (status === 'delivered') {
      order.actualDelivery = new Date();
    }
    
    await order.save();
    
    // Get user data
    const userData = {
      name: order.customerInfo.name,
      phone: order.customerInfo.phone,
      email: order.customerInfo.email
    };
    
    // Send status update notification
    if (userData.email) {
      try {
        const emailResult = await emailService.sendStatusUpdate(order, userData, status);
        console.log('📧 Status update email result:', emailResult);
      } catch (emailError) {
        console.error('❌ Status update email failed:', emailError);
        try {
          const smsResult = await smsService.sendStatusUpdate(order, userData, status);
          console.log('📱 SMS fallback result:', smsResult);
        } catch (smsError) {
          console.error('❌ SMS fallback failed:', smsError);
        }
      }
    } else {
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