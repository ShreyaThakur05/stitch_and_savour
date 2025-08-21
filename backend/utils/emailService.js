const nodemailer = require('nodemailer');
const puppeteer = require('puppeteer');
const path = require('path');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Generate invoice PDF
const generateInvoicePDF = async (order, user) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  const invoiceHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice - ${order.orderNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e91e63; padding-bottom: 20px; }
        .logo { font-size: 28px; font-weight: bold; color: #e91e63; margin-bottom: 5px; }
        .tagline { color: #666; font-size: 14px; }
        .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .invoice-info, .customer-info { width: 48%; }
        .invoice-info h3, .customer-info h3 { color: #e91e63; margin-bottom: 10px; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .items-table th, .items-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        .items-table th { background-color: #f8f9fa; font-weight: bold; color: #e91e63; }
        .total-section { text-align: right; margin-top: 20px; }
        .total-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
        .total-final { font-size: 18px; font-weight: bold; color: #e91e63; border-top: 2px solid #e91e63; padding-top: 10px; }
        .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
        .delivery-info { background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">🧶 Stitch & Savour</div>
        <div class="tagline">Handcrafted with Love by Sangita Thakur</div>
      </div>
      
      <div class="invoice-details">
        <div class="invoice-info">
          <h3>Invoice Details</h3>
          <p><strong>Invoice #:</strong> ${order.orderNumber}</p>
          <p><strong>Date:</strong> ${new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN')}</p>
          <p><strong>Payment:</strong> ${order.paymentMethod === 'qr' ? 'Online Payment' : 'Cash on Delivery'}</p>
          <p><strong>Status:</strong> ${order.status || 'Confirmed'}</p>
        </div>
        
        <div class="customer-info">
          <h3>Customer Details</h3>
          <p><strong>Name:</strong> ${user.name}</p>
          <p><strong>Phone:</strong> ${user.phone}</p>
          <p><strong>Email:</strong> ${user.email || 'N/A'}</p>
        </div>
      </div>
      
      <div class="delivery-info">
        <h3 style="color: #e91e63; margin-bottom: 10px;">Delivery Information</h3>
        ${order.deliveryOption === 'pickup' ? `
          <p><strong>🏪 Self Pickup</strong></p>
          <p>📍 Alkasa Society, Mohammadwadi, Pune, Maharashtra - 411060</p>
          <p>📞 Contact: +91 9970944685</p>
          <p>🕕 Pickup Hours: 6:00 PM - 8:00 PM</p>
        ` : `
          <p><strong>🚚 Home Delivery</strong></p>
          <p>📍 ${order.deliveryAddress?.street || 'Address not provided'}</p>
          <p>${order.deliveryAddress?.city || ''}, ${order.deliveryAddress?.state || ''} - ${order.deliveryAddress?.pincode || ''}</p>
          <p>💰 Delivery Charge: ₹25</p>
        `}
        <p><strong>Expected ${order.deliveryOption === 'pickup' ? 'Ready' : 'Delivery'} Date:</strong> ${new Date(order.estimatedDelivery || Date.now() + 3*24*60*60*1000).toLocaleDateString('en-IN')}</p>
      </div>
      
      <table class="items-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map(item => `
            <tr>
              <td>${item.name}</td>
              <td>${item.quantity}</td>
              <td>₹${item.price}</td>
              <td>₹${item.price * item.quantity}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="total-section">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>₹${order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)}</span>
        </div>
        ${order.deliveryOption === 'home' ? `
          <div class="total-row">
            <span>Delivery Charge:</span>
            <span>₹25</span>
          </div>
        ` : ''}
        <div class="total-row total-final">
          <span>Total Amount:</span>
          <span>₹${order.total}</span>
        </div>
      </div>
      
      <div class="footer">
        <p>Thank you for choosing Stitch & Savour!</p>
        <p>📧 shreyathakurinda@gmail.com | 📞 +91 9970944685 | 📱 WhatsApp: +91 9970944685</p>
        <p>Made with ❤️ by Sangita Thakur</p>
      </div>
    </body>
    </html>
  `;
  
  await page.setContent(invoiceHTML);
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
  });
  
  await browser.close();
  return pdfBuffer;
};

// Email templates
const emailTemplates = {
  orderConfirmation: (order, user) => ({
    subject: `🎉 Order Confirmed - ${order.orderNumber} | Stitch & Savour`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
        <div style="background: linear-gradient(135deg, #e91e63, #ad1457); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 20px;">
          <h1 style="margin: 0; font-size: 28px;">🧶 Stitch & Savour</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Handcrafted with Love by Sangita Thakur</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #e91e63; margin-bottom: 20px;">🎉 Order Confirmed!</h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Hello <strong>${user.name}</strong>! 👋
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Thank you for your order! We're excited to prepare your handcrafted items with love and care.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #e91e63;">
            <h3 style="color: #e91e63; margin-top: 0;">📋 Order Details</h3>
            <p><strong>Order ID:</strong> ${order.orderNumber}</p>
            <p><strong>Total Amount:</strong> ₹${order.total}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod === 'qr' ? '💳 Online Payment' : '💰 Cash on Delivery'}</p>
            <p><strong>Expected ${order.deliveryOption === 'pickup' ? 'Ready' : 'Delivery'} Date:</strong> ${new Date(order.estimatedDelivery || Date.now() + 3*24*60*60*1000).toLocaleDateString('en-IN')}</p>
          </div>
          
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1976d2; margin-top: 0;">
              ${order.deliveryOption === 'pickup' ? '🏪 Self Pickup Details' : '🚚 Delivery Details'}
            </h3>
            ${order.deliveryOption === 'pickup' ? `
              <p><strong>📍 Pickup Location:</strong><br>
              Alkasa Society, Mohammadwadi, Pune, Maharashtra - 411060</p>
              <p><strong>📞 Contact:</strong> +91 9970944685</p>
              <p><strong>🕕 Pickup Hours:</strong> 6:00 PM - 8:00 PM</p>
              <p style="color: #4caf50; font-weight: bold;">✅ FREE Pickup - Save ₹25!</p>
            ` : `
              <p><strong>📍 Delivery Address:</strong><br>
              ${order.deliveryAddress?.street || 'Address provided'}<br>
              ${order.deliveryAddress?.city || ''}, ${order.deliveryAddress?.state || ''} - ${order.deliveryAddress?.pincode || ''}</p>
              <p><strong>💰 Delivery Charge:</strong> ₹25 (Within 1km radius)</p>
            `}
          </div>
          
          <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #f57c00; margin-top: 0;">📦 Items Ordered</h3>
            ${order.items.map(item => `
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                <span>${item.name} (Qty: ${item.quantity})</span>
                <span style="font-weight: bold;">₹${item.price * item.quantity}</span>
              </div>
            `).join('')}
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="font-size: 16px; color: #666;">
              📄 <strong>Invoice attached</strong> - Please keep it for your records
            </p>
          </div>
          
          <div style="background: linear-gradient(135deg, #4caf50, #388e3c); color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0;">🙏 Thank You!</h3>
            <p style="margin: 0; opacity: 0.9;">Your support means the world to us. We can't wait for you to enjoy your handcrafted items!</p>
          </div>
          
          <div style="text-align: center; padding: 20px 0; border-top: 1px solid #eee; margin-top: 30px;">
            <p style="color: #666; margin: 5px 0;">📧 shreyathakurinda@gmail.com</p>
            <p style="color: #666; margin: 5px 0;">📞 +91 9970944685 | 📱 WhatsApp: +91 9970944685</p>
            <p style="color: #e91e63; font-weight: bold; margin: 10px 0;">Made with ❤️ by Sangita Thakur</p>
          </div>
        </div>
      </div>
    `
  }),

  statusUpdate: (order, user, newStatus) => ({
    subject: `📦 Order Update - ${order.orderNumber} | Stitch & Savour`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
        <div style="background: linear-gradient(135deg, #e91e63, #ad1457); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 20px;">
          <h1 style="margin: 0; font-size: 28px;">🧶 Stitch & Savour</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Order Status Update</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #e91e63; margin-bottom: 20px;">📦 Order Update</h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Hello <strong>${user.name}</strong>! 👋
          </p>
          
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
            <h3 style="color: #4caf50; margin-top: 0;">Status Update</h3>
            <p><strong>Order ID:</strong> ${order.orderNumber}</p>
            <p><strong>New Status:</strong> <span style="color: #4caf50; font-weight: bold; text-transform: uppercase;">${newStatus}</span></p>
          </div>
          
          <div style="text-align: center; padding: 20px 0; border-top: 1px solid #eee; margin-top: 30px;">
            <p style="color: #666; margin: 5px 0;">📧 shreyathakurinda@gmail.com</p>
            <p style="color: #666; margin: 5px 0;">📞 +91 9970944685</p>
            <p style="color: #e91e63; font-weight: bold; margin: 10px 0;">Made with ❤️ by Sangita Thakur</p>
          </div>
        </div>
      </div>
    `
  })
};

const emailService = {
  // Send order confirmation with invoice
  sendOrderConfirmation: async (order, user) => {
    try {
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('📧 Email service not configured, skipping email');
        return { success: false, message: 'Email service not configured' };
      }

      const transporter = createTransporter();
      const template = emailTemplates.orderConfirmation(order, user);
      const invoicePDF = await generateInvoicePDF(order, user);
      
      const mailOptions = {
        from: `"Stitch & Savour" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: template.subject,
        html: template.html,
        attachments: [
          {
            filename: `Invoice-${order.orderNumber}.pdf`,
            content: invoicePDF,
            contentType: 'application/pdf'
          }
        ]
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('✅ Order confirmation email sent:', result.messageId);
      
      return {
        success: true,
        messageId: result.messageId,
        message: 'Order confirmation email sent with invoice'
      };
    } catch (error) {
      console.error('❌ Email service error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to send email'
      };
    }
  },

  // Send status update
  sendStatusUpdate: async (order, user, newStatus) => {
    try {
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !user.email) {
        console.log('📧 Email service not configured or no email provided');
        return { success: false, message: 'Email service not configured' };
      }

      const transporter = createTransporter();
      const template = emailTemplates.statusUpdate(order, user, newStatus);
      
      const mailOptions = {
        from: `"Stitch & Savour" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: template.subject,
        html: template.html
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('✅ Status update email sent:', result.messageId);
      
      return {
        success: true,
        messageId: result.messageId,
        message: 'Status update email sent'
      };
    } catch (error) {
      console.error('❌ Email service error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to send email'
      };
    }
  },

  // Send admin notification
  sendAdminNotification: async (order, user) => {
    try {
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('📧 Email service not configured for admin notifications');
        return { success: false, message: 'Email service not configured' };
      }

      const transporter = createTransporter();
      
      const mailOptions = {
        from: `"Stitch & Savour" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: `🔔 New Order Alert - ${order.orderNumber}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #e91e63;">🔔 New Order Received!</h2>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
              <p><strong>Order ID:</strong> ${order.orderNumber}</p>
              <p><strong>Customer:</strong> ${user.name}</p>
              <p><strong>Phone:</strong> ${user.phone}</p>
              <p><strong>Email:</strong> ${user.email || 'N/A'}</p>
              <p><strong>Total:</strong> ₹${order.total}</p>
              <p><strong>Payment:</strong> ${order.paymentMethod === 'qr' ? 'Online Payment' : 'Cash on Delivery'}</p>
              <p><strong>Delivery:</strong> ${order.deliveryOption === 'pickup' ? 'Self Pickup' : 'Home Delivery'}</p>
            </div>
            <p>Login to admin panel to manage this order.</p>
          </div>
        `
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('✅ Admin notification email sent:', result.messageId);
      
      return {
        success: true,
        messageId: result.messageId,
        message: 'Admin notification email sent'
      };
    } catch (error) {
      console.error('❌ Admin email error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to send admin email'
      };
    }
  }
};

module.exports = emailService;