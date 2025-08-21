const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendWhatsApp = async (phoneNumber, message) => {
  try {
    console.log(`📱 Attempting WhatsApp to ${phoneNumber}`);
    
    // Clean and format phone number
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    const formattedPhone = cleanPhone.startsWith('91') ? `+${cleanPhone}` : `+91${cleanPhone}`;
    
    // Try WhatsApp first
    try {
      const result = await client.messages.create({
        from: 'whatsapp:+14155238886',
        to: `whatsapp:${formattedPhone}`,
        body: message
      });
      
      console.log(`✅ WhatsApp sent successfully. SID: ${result.sid}`);
      return { success: true, sid: result.sid, method: 'WhatsApp' };
    } catch (whatsappError) {
      console.log(`⚠️ WhatsApp failed: ${whatsappError.message}. Trying SMS...`);
      
      // Fallback to SMS
      const smsResult = await client.messages.create({
        from: process.env.TWILIO_PHONE_NUMBER,
        to: formattedPhone,
        body: message
      });
      
      console.log(`✅ SMS sent successfully. SID: ${smsResult.sid}`);
      return { success: true, sid: smsResult.sid, method: 'SMS' };
    }
  } catch (error) {
    console.error('❌ Both WhatsApp and SMS failed:', error);
    return { success: false, error: error.message };
  }
};

const whatsappService = {
  sendMessage: async (phone, message) => {
    return await sendWhatsApp(phone, message);
  },

  sendAdminAlert: async (order, user) => {
    const itemsList = order.items?.map(item => 
      `• ${item.name} (Qty: ${item.quantity})`
    ).join('\n') || '';

    const message = `🔔 New Order Alert - Stitch & Savour\n\nNew order received!\n\n📋 Order Details:\nOrder ID: ${order.orderNumber || order.orderId}\nCustomer: ${user.name}\nPhone: ${user.phone}\n\nItems:\n${itemsList}\n\n💰 Total: Rs.${order.total}\n💳 Payment: ${order.paymentMethod?.toUpperCase() || 'COD'}\n🚚 Delivery: ${order.deliveryOption === 'pickup' ? 'Self Pickup' : 'Home Delivery'}\n\nLogin to admin panel to manage orders.`;
    
    const adminPhone = process.env.WHATSAPP_NUMBER;
    return await sendWhatsApp(adminPhone, message);
  },

  sendOrderConfirmation: async (order, user) => {
    const itemsList = order.items?.map(item => 
      `• ${item.name} (Qty: ${item.quantity}) - Rs.${item.subtotal || (item.price * item.quantity)}`
    ).join('\n') || '';

    const message = `🎉 Order Confirmed - Stitch & Savour\n\nHello ${user.name}! 👋\n\nYour order has been successfully placed:\n\n📋 Order Details:\nOrder ID: ${order.orderNumber || order.orderId}\n${itemsList}\n\n💰 Total Amount: Rs.${order.total}\n💳 Payment: ${order.paymentMethod?.toUpperCase() || 'COD'}\n🚚 Delivery: ${order.deliveryOption === 'pickup' ? 'Self Pickup' : 'Home Delivery'}\n\nThank you for choosing Stitch & Savour! ❤️\nMade with love by Sangita Thakur\n\nFor any queries, call +91 9970944685`;
    
    return await sendWhatsApp(user.phone, message);
  }
};

module.exports = whatsappService;