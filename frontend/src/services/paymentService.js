// Payment Service with Auto-detection and Gateway Integration
class PaymentService {
  constructor() {
    this.upiId = 'shreyathakurindia@okhdfcbank'; // Your HDFC Bank UPI ID
    this.merchantName = 'Stitch & Savour';
    this.merchantPhone = '9970944685'; // Your phone number
    this.supportedGateways = ['razorpay', 'phonepe', 'paytm', 'gpay'];
  }

  // Generate dynamic UPI payment URL with amount
  generateUPIUrl(amount, orderId, customerName) {
    const params = new URLSearchParams({
      pa: this.upiId,
      pn: this.merchantName,
      tr: orderId,
      tn: `Payment for Order ${orderId} - ${customerName}`,
      am: amount.toString(),
      cu: 'INR',
      mc: '5411' // Merchant category code for grocery stores
    });
    
    return `upi://pay?${params.toString()}`;
  }

  // Generate QR code data URL
  async generateQRCode(amount, orderId, customerName) {
    const upiUrl = this.generateUPIUrl(amount, orderId, customerName);
    
    try {
      // Using QR Server API for dynamic QR generation
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUrl)}`;
      return qrApiUrl;
    } catch (error) {
      console.error('QR generation error:', error);
      return null;
    }
  }

  // Auto-detect available payment apps
  detectPaymentApps() {
    const apps = [];
    
    // Check for installed UPI apps (basic detection)
    const appChecks = [
      { name: 'PhonePe', package: 'phonepe', url: 'phonepe://' },
      { name: 'Google Pay', package: 'gpay', url: 'tez://' },
      { name: 'Paytm', package: 'paytm', url: 'paytmmp://' },
      { name: 'BHIM', package: 'bhim', url: 'bhim://' },
      { name: 'Amazon Pay', package: 'amazonpay', url: 'amazonpay://' }
    ];

    appChecks.forEach(app => {
      apps.push({
        ...app,
        available: true, // In real implementation, check if app is installed
        icon: `/images/payment-icons/${app.package}.png`
      });
    });

    return apps;
  }

  // Launch specific payment app
  launchPaymentApp(appUrl, amount, orderId, customerName) {
    const upiUrl = this.generateUPIUrl(amount, orderId, customerName);
    
    // Try to open the specific app
    const appSpecificUrl = appUrl.replace('://', `://upi/pay?${new URL(upiUrl).search.substring(1)}`);
    
    try {
      window.location.href = appSpecificUrl;
      
      // Fallback to generic UPI URL after 2 seconds
      setTimeout(() => {
        window.location.href = upiUrl;
      }, 2000);
    } catch (error) {
      // Fallback to generic UPI URL
      window.location.href = upiUrl;
    }
  }

  // Initialize Razorpay (if you want to integrate)
  async initializeRazorpay(amount, orderId, customerInfo) {
    if (!window.Razorpay) {
      // Load Razorpay script dynamically
      await this.loadScript('https://checkout.razorpay.com/v1/checkout.js');
    }

    const options = {
      key: 'YOUR_RAZORPAY_KEY', // Replace with your Razorpay key
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      name: this.merchantName,
      description: `Order ${orderId}`,
      order_id: orderId,
      handler: (response) => {
        this.handlePaymentSuccess(response);
      },
      prefill: {
        name: customerInfo.name,
        email: customerInfo.email,
        contact: customerInfo.phone
      },
      theme: {
        color: '#8B5CF6'
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  // Load external script
  loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Handle payment success
  handlePaymentSuccess(response) {
    console.log('Payment successful:', response);
    // Trigger success callback
    if (this.onPaymentSuccess) {
      this.onPaymentSuccess(response);
    }
  }

  // Verify payment status (mock implementation)
  async verifyPayment(transactionId) {
    // In real implementation, call your backend to verify payment
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId,
          status: 'completed'
        });
      }, 2000);
    });
  }

  // Real payment verification (to be implemented with backend)
  async verifyPaymentWithBackend(orderId, transactionId) {
    // This would call your backend API to verify payment
    // For now, return success when user confirms
    return {
      success: true,
      orderId,
      transactionId,
      timestamp: new Date().toISOString()
    };
  }
}

const paymentService = new PaymentService();
export default paymentService;