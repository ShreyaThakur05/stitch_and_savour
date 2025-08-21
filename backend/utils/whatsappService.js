const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// WhatsApp message templates
const whatsappTemplates = {
  orderConfirmation: (order, user) => {
    const itemsList = order.items.map(item => 
      `• ${item.name} (Qty: ${item.quantity}) - ${formatCurrency(item.subtotal)}`
    ).join('\n');

    return `🎉 *Order Confirmed - Stitch & Savour*

Hello ${user.name}! 👋

Your order has been successfully placed:

📋 *Order Details:*
Order ID: ${order.orderNumber}
${itemsList}

💰 *Total Amount:* ${formatCurrency(order.total)}
💳 *Payment:* ${order.paymentMethod.toUpperCase()}
📅 *Expected Delivery:* ${formatDate(order.estimatedDelivery)}

📍 *Delivery Address:*
${order.deliveryAddress.street}
${order.deliveryAddress.city}, ${order.deliveryAddress.state}
${order.deliveryAddress.pincode}

Thank you for choosing Stitch & Savour! ❤️
Made with love by Sangita Thakur

For any queries, reply to this message.`;
  },

  statusUpdate: (order, user, newStatus) => {
    const statusMessages = {
      'confirmed': '✅ Your order has been confirmed and is being prepared',
      'in-progress': '👩‍🍳 Your order is currently being prepared with love',
      'ready': '📦 Your order is ready for dispatch',
      'out-for-delivery': '🚚 Your order is out for delivery',
      'delivered': '🎉 Your order has been delivered successfully'
    };

    return `📦 *Order Update - Stitch & Savour*

Hello ${user.name}! 👋

Order ID: ${order.orderNumber}
Status: *${newStatus.toUpperCase()}*

${statusMessages[newStatus]}

Expected Delivery: ${formatDate(order.estimatedDelivery)}

Track your order: ${process.env.FRONTEND_URL}/dashboard

Thank you for your patience! ❤️
Sangita Thakur`;
  },

  orderCancelled: (order, user, reason) => {
    return `❌ *Order Cancelled - Stitch & Savour*

Hello ${user.name},

We regret to inform you that your order has been cancelled.

📋 *Order Details:*
Order ID: ${order.orderNumber}
Total Amount: ${formatCurrency(order.total)}

📝 *Reason:* ${reason}

If you paid online, your refund will be processed within 24-48 hours.

For any queries, please contact us:
📞 +91 9970944685
📧 sangita.shreyas@gmail.com

We apologize for the inconvenience.
Sangita Thakur - Stitch & Savour`;
  },

  paymentReceived: (order, user) => {
    return `💳 *Payment Received - Stitch & Savour*

Hello ${user.name}! 👋

Payment confirmed for Order ID: ${order.orderNumber}
Amount: ${formatCurrency(order.total)}

Your order will be processed shortly.
Expected Delivery: ${formatDate(order.estimatedDelivery)}

Thank you for your payment! ❤️
Sangita Thakur`;
  },

  adminNewOrder: (order, user) => {
    const itemsList = order.items.map(item => 
      `• ${item.name} (Qty: ${item.quantity})`
    ).join('\n');

    return `🔔 *New Order Alert - Stitch & Savour*

New order received!

📋 *Order Details:*
Order ID: ${order.orderNumber}
Customer: ${user.name}
Phone: ${user.phone}

*Items:*
${itemsList}

💰 Total: ${formatCurrency(order.total)}
💳 Payment: ${order.paymentMethod.toUpperCase()}

📍 *Delivery:*
${order.deliveryAddress.street}
${order.deliveryAddress.city}, ${order.deliveryAddress.state}

Login to admin panel to manage: ${process.env.FRONTEND_URL}/admin`;
  }
};

// SMS service
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const smsService = require('./smsService');

const sendWhatsAppMessage = async (phoneNumber, message) => {
  try {
    console.log(`📱 WhatsApp link generated for ${phoneNumber}`);
    
    // Generate WhatsApp web link for automatic sending
    const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
    
    // In production, you would redirect user or auto-open this link
    console.log(`WhatsApp URL: ${whatsappUrl}`);
    
    return { success: true, message: 'WhatsApp link generated', url: whatsappUrl };
  } catch (error) {
    console.error('❌ WhatsApp error:', error.message);
    return { success: false, error: error.message };
  }
};

const whatsappService = {
  // Send order confirmation to customer
  sendOrderConfirmation: async (order, user) => {
    const message = whatsappTemplates.orderConfirmation(order, user);
    
    // Try WhatsApp first, fallback to SMS
    try {
      const whatsappResult = await smsService.sendMessage(user.phone, message);
      if (whatsappResult.success) {
        return {
          success: true,
          method: 'WhatsApp',
          message: 'Order confirmation sent via WhatsApp'
        };
      }
    } catch (error) {
      console.error('WhatsApp failed, trying SMS:', error);
    }
    
    // Fallback to SMS
    const smsResult = await smsService.sendOrderConfirmation(order, user);
    return {
      ...smsResult,
      method: 'SMS',
      message: 'Order confirmation sent via SMS'
    };
  },

  // Send status update to customer
  sendStatusUpdate: async (order, user, newStatus) => {
    const message = whatsappTemplates.statusUpdate(order, user, newStatus);
    
    // Try WhatsApp first, fallback to SMS
    try {
      const whatsappResult = await smsService.sendMessage(user.phone, message);
      if (whatsappResult.success) {
        return {
          success: true,
          method: 'WhatsApp',
          message: 'Status update sent via WhatsApp'
        };
      }
    } catch (error) {
      console.error('WhatsApp failed, trying SMS:', error);
    }
    
    // Fallback to SMS
    const smsResult = await smsService.sendStatusUpdate(order, user, newStatus);
    return {
      ...smsResult,
      method: 'SMS',
      message: 'Status update sent via SMS'
    };
  },

  // Send cancellation notice to customer
  sendCancellationNotice: async (order, user, reason) => {
    const message = whatsappTemplates.orderCancelled(order, user, reason);
    return await sendWhatsAppMessage(user.phone, message);
  },

  // Send payment confirmation to customer
  sendPaymentConfirmation: async (order, user) => {
    const message = whatsappTemplates.paymentReceived(order, user);
    return await sendWhatsAppMessage(user.phone, message);
  },

  // Send new order alert to admin
  sendAdminOrderAlert: async (order, user) => {
    const message = whatsappTemplates.adminNewOrder(order, user);
    const adminPhone = process.env.WHATSAPP_NUMBER;
    
    try {
      const result = await smsService.sendMessage(adminPhone, message);
      return {
        ...result,
        method: 'WhatsApp/SMS',
        message: 'Admin notification sent'
      };
    } catch (error) {
      console.error('Admin notification failed:', error);
      return {
        success: false,
        error: error.message,
        message: 'Admin notification failed'
      };
    }
  }
};

module.exports = whatsappService;