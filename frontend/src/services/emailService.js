import emailjs from '@emailjs/browser';

// EmailJS configuration - UPDATE WITH YOUR ACTUAL TEMPLATE ID
const EMAILJS_CONFIG = {
  serviceId: 'service_stitch_savour',
  templateId: 'template_order_confirmat',
  publicKey: 'keGAumAlGmoQXtY1v'
};

const emailService = {
  // Send order confirmation email
  sendOrderConfirmation: async (orderData, customerData) => {
    try {
      const templateParams = {
        to_email: customerData.email,
        from_name: 'Stitch & Savour',
        from_email: 'shreyathakurinda@gmail.com',
        customer_name: customerData.name,
        order_id: orderData.orderId,
        total_amount: orderData.total,
        payment_method: orderData.paymentMethod === 'qr' ? 'Online Payment' : 'Cash on Delivery',
        delivery_option: orderData.deliveryOption === 'home' ? 'Home Delivery' : 'Self Pickup',
        delivery_address: orderData.deliveryOption === 'home' 
          ? `${orderData.deliveryAddress?.street}, ${orderData.deliveryAddress?.city}, ${orderData.deliveryAddress?.state} - ${orderData.deliveryAddress?.pincode}`
          : 'Alkasa Society, Mohammadwadi, Pune - 411060',
        items_list: orderData.items.map(item => {
          const quantityAlert = ((item.category === 'food' && item.quantity > 5) || (item.category === 'crochet' && item.quantity > 3)) 
            ? ' ⚠️ Large quantity - delivery time may vary, owner will inform soon' 
            : '';
          return `${item.name} (${item.selectedWeight ? `${item.selectedWeight}` : `Qty: ${item.quantity}`}) - ₹${item.finalPrice || (item.price * item.quantity)}${quantityAlert}`;
        }).join('\n'),
        estimated_delivery: new Date(orderData.estimatedDelivery).toLocaleDateString('en-IN'),
        contact_phone: '+91 9970944685',
        contact_email: 'shreyathakurinda@gmail.com'
      };

      console.log('📧 Sending email to:', customerData.email);
      console.log('📧 Template params:', templateParams);

      const result = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams,
        EMAILJS_CONFIG.publicKey
      );

      console.log('✅ Order confirmation email sent:', result);
      return { success: true, messageId: result.text };
    } catch (error) {
      console.error('❌ EmailJS error:', error);
      return { success: false, error: error.message };
    }
  }
};

export default emailService;