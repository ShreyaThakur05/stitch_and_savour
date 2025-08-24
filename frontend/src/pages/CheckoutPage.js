import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CreditCard, Smartphone, Truck, MapPin, Phone, Mail, User, CheckCircle, Clock } from 'lucide-react';
import emailService from '../services/emailService';
import paymentService from '../services/paymentService';
import orderService from '../services/orderService';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('qr');
  const [showQR, setShowQR] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [availableApps, setAvailableApps] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [statusCheckInterval, setStatusCheckInterval] = useState(null);
  const [currentOrderId, setCurrentOrderId] = useState('');
  
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
    pincode: '',
    city: '',
    state: ''
  });
  
  // Load profile data from localStorage
  useEffect(() => {
    if (user?.email) {
      const profileKey = `userProfile_${user.email}`;
      const savedProfile = JSON.parse(localStorage.getItem(profileKey) || '{}');
      
      setDeliveryInfo(prev => ({
        ...prev,
        name: savedProfile.name || user.name || '',
        phone: savedProfile.phone || user.phone || '',
        email: savedProfile.email || user.email || '',
        address: savedProfile.address || user.address || ''
      }));
    }
  }, [user]);
  
  const [deliveryOption, setDeliveryOption] = useState('home');

  const calculateDeliveryTime = () => {
    if (cartItems.length === 0) return 0;
    return Math.max(...cartItems.map(item => item.deliveryTime || 2));
  };

  const generateOrderId = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `SS${year}${month}${day}${random}`;
  };

  const handleInputChange = (field, value) => {
    setDeliveryInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const required = ['name', 'phone'];
    if (deliveryOption === 'home') {
      required.push('address', 'pincode', 'city', 'state');
    }
    const isValid = required.every(field => deliveryInfo[field] && deliveryInfo[field].trim() !== '');
    console.log('🔍 Form validation:', { required, deliveryInfo, isValid });
    return isValid;
  };

  const sendOrderConfirmation = async (orderData) => {
    const message = `Order Confirmation - Stitch & Savour\n\nHello ${orderData.customerName}!\n\nYour order has been confirmed successfully!\n\nOrder Details:\nOrder ID: ${orderData.orderId}\nTotal Amount: Rs.${orderData.total}\nPayment Method: ${orderData.paymentMethod === 'qr' ? 'Online Payment' : 'Cash on Delivery'}\n\nItems Ordered:\n${orderData.items.map(item => `${item.name} (Qty: ${item.quantity}) - Rs.${item.price * item.quantity}`).join('\n')}\n\nExpected Delivery: ${orderData.expectedDelivery}\nDelivery Address: ${orderData.address}\n\nThank you for choosing Stitch & Savour!\n\nWith love,\nSangita Thakur`;

    // Extract phone number from deliveryInfo and format it
    const customerPhone = deliveryInfo.phone.replace(/[^0-9]/g, '');
    const formattedPhone = customerPhone.startsWith('91') ? customerPhone : `91${customerPhone}`;
    
    try {
      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: formattedPhone,
          message: message
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('Order confirmation sent to customer WhatsApp');
      }
    } catch (error) {
      console.error('WhatsApp service error:', error);
    }
  };

  const sendOrderNotification = (orderData) => {
    // Simulate sending automatic notification
    const notificationMessage = `Order Confirmed! Order ID: ${orderData.orderId}. Total: ₹${orderData.total}. Expected delivery: ${orderData.expectedDelivery}. Thank you for choosing Stitch & Savour!`;
    
    // In a real app, this would be an API call to SMS service
    console.log('Order notification sent:', notificationMessage);
    
    // Show browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Order Confirmed - Stitch & Savour', {
        body: `Order ${orderData.orderId} confirmed! Total: ₹${orderData.total}`,
        icon: '/favicon.ico'
      });
    }
  };

  const handlePlaceOrder = async () => {
    console.log('🔥 Button clicked! Validation:', validateForm(), 'Loading:', loading);
    console.log('📋 Form data:', deliveryInfo);
    console.log('💳 Payment method:', paymentMethod);
    
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      alert('Please fill in all required fields');
      return;
    }

    console.log('✅ Form validation passed, proceeding...');
    
    if (paymentMethod === 'qr') {
      console.log('💳 Processing QR payment...');
      const orderId = generateOrderId();
      setCurrentOrderId(orderId);
      
      // Generate dynamic QR code with amount
      const totalAmount = getCartTotal() + (deliveryOption === 'home' ? 25 : 0);
      const qrUrl = await paymentService.generateQRCode(totalAmount, orderId, deliveryInfo.name);
      setQrCodeUrl(qrUrl);
      
      // Detect available payment apps
      const apps = paymentService.detectPaymentApps();
      setAvailableApps(apps);
      
      setShowQR(true);
      
      // Remove auto payment checking - let user confirm manually
      
      return;
    }

    console.log('💰 Processing COD payment...');
    // Place order for COD
    await processOrder();
  };

  const processOrder = async () => {
    setLoading(true);
    
    try {
      const orderId = generateOrderId();
      const expectedDelivery = new Date();
      expectedDelivery.setDate(expectedDelivery.getDate() + calculateDeliveryTime());
      
      const orderData = {
        orderId,
        customerName: deliveryInfo.name,
        customerPhone: deliveryInfo.phone,
        customerEmail: deliveryInfo.email,
        total: getCartTotal() + (deliveryOption === 'home' ? 25 : 0),
        paymentMethod,
        items: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.finalPrice || item.price,
          finalPrice: item.finalPrice || item.price,
          selectedWeight: item.selectedWeight,
          subtotal: (item.finalPrice || item.price) * item.quantity
        })),
        deliveryAddress: {
          street: deliveryInfo.address,
          city: deliveryInfo.city,
          state: deliveryInfo.state,
          pincode: deliveryInfo.pincode
        },
        deliveryOption,
        estimatedDelivery: expectedDelivery
      };

      // Send order to backend API with localStorage fallback
      try {
        const result = await orderService.createOrder(orderData);
        console.log('✅ Order placed successfully:', result.order);
      } catch (apiError) {
        console.error('❌ Order service error:', apiError);
      }

      // Send email confirmation using EmailJS
      if (deliveryInfo.email) {
        try {
          const emailResult = await emailService.sendOrderConfirmation(orderData, {
            name: deliveryInfo.name,
            email: deliveryInfo.email,
            phone: deliveryInfo.phone
          });
          
          if (emailResult.success) {
            console.log('✅ Email confirmation sent');
          } else {
            console.error('❌ Email failed:', emailResult.error);
          }
        } catch (emailError) {
          console.error('❌ Email service error:', emailError);
        }
      }

      // Order is already stored by orderService
      
      // Clear cart and show success
      clearCart();
      setOrderPlaced(true);
      
    } catch (error) {
      console.error('Order processing error:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    if (statusCheckInterval) {
      clearInterval(statusCheckInterval);
    }
    setShowQR(false);
    processOrder();
  };

  const handleAppPayment = (app) => {
    const totalAmount = getCartTotal() + (deliveryOption === 'home' ? 25 : 0);
    paymentService.launchPaymentApp(app.url, totalAmount, currentOrderId, deliveryInfo.name);
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
    };
  }, [statusCheckInterval]);

  if (cartItems.length === 0 && !orderPlaced) {
    navigate('/cart');
    return null;
  }

  if (orderPlaced) {
    return (
      <div style={{ padding: '2rem 0', minHeight: '60vh' }}>
        <div className="container">
          <div className="order-success-container" style={{ 
            textAlign: 'center',
            padding: '2rem',
            background: 'var(--bg-secondary)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
            <h2 style={{ 
              color: 'var(--success)',
              marginBottom: '1rem',
              fontSize: '1.8rem'
            }}>
              Order Placed Successfully!
            </h2>
            <p style={{ 
              color: 'var(--text-secondary)',
              marginBottom: '2rem',
              fontSize: '1rem',
              lineHeight: '1.6'
            }}>
              Thank you for your order! We've sent a confirmation message to your WhatsApp/SMS. 
              You'll receive updates about your order status.
            </p>
            <div className="order-success-actions" style={{ 
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '1.5rem'
            }}>
              <button
                onClick={() => {
                  try {
                    const userEmail = user?.email;
                    const userOrdersKey = userEmail ? `userOrders_${userEmail}` : 'userOrders';
                    const userOrders = JSON.parse(localStorage.getItem(userOrdersKey) || '[]');
                    const lastOrder = userOrders.slice(-1)[0];
                    
                    if (lastOrder) {
                      const { generateInvoicePDF } = require('../utils/pdfGenerator');
                      generateInvoicePDF(lastOrder);
                    } else {
                      alert('No order found to generate invoice');
                    }
                  } catch (error) {
                    console.error('Error generating invoice:', error);
                    alert('Error generating invoice. Please try again.');
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  minHeight: '44px',
                  flex: '1'
                }}
              >
                📄 Download Invoice
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: 'var(--primary-color)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  minHeight: '44px',
                  flex: '1'
                }}
              >
                View Orders
              </button>
              <button
                onClick={() => navigate('/products')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: 'transparent',
                  color: 'var(--primary-color)',
                  border: '2px solid var(--primary-color)',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  minHeight: '44px',
                  flex: '1'
                }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showQR) {
    return (
      <div style={{ padding: '2rem 0', minHeight: '60vh' }}>
        <div className="container">
          <div style={{ 
            maxWidth: '500px',
            margin: '0 auto',
            textAlign: 'center',
            background: 'var(--bg-secondary)',
            padding: '3rem 2rem',
            borderRadius: '16px',
            border: '1px solid var(--border-color)'
          }}>
            <h2 style={{ marginBottom: '1rem' }}>Complete Payment</h2>
            <p style={{ 
              color: 'var(--text-secondary)',
              marginBottom: '2rem'
            }}>
              Scan the QR code below to pay ₹{getCartTotal() + (deliveryOption === 'home' ? 25 : 0)}
            </p>
            
            {/* Payment Status */}
            {paymentStatus === 'completed' && (
              <div style={{
                background: 'var(--success-light)',
                border: '2px solid var(--success)',
                borderRadius: '12px',
                padding: '1rem',
                margin: '0 auto 2rem auto',
                textAlign: 'center',
                color: 'var(--success)'
              }}>
                <CheckCircle size={48} style={{ marginBottom: '0.5rem' }} />
                <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>Payment Successful!</div>
                <div style={{ fontSize: '0.9rem' }}>Processing your order...</div>
              </div>
            )}

            {/* QR Code */}
            {paymentStatus !== 'completed' && (
              <div style={{
                width: '280px',
                background: 'white',
                border: '2px solid var(--border-color)',
                borderRadius: '12px',
                margin: '0 auto 2rem auto',
                padding: '15px',
                textAlign: 'center'
              }}>
                {qrCodeUrl ? (
                  <img
                    src={qrCodeUrl}
                    alt={`QR Code for ₹${getCartTotal() + (deliveryOption === 'home' ? 25 : 0)}`}
                    style={{
                      width: '250px',
                      height: '250px',
                      objectFit: 'contain'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '250px',
                    height: '250px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-secondary)'
                  }}>
                    <div className="spinner"></div>
                  </div>
                )}
                <div style={{
                  marginTop: '10px',
                  fontSize: '0.9rem',
                  color: 'var(--text-secondary)',
                  fontWeight: '600'
                }}>
                  ₹{getCartTotal() + (deliveryOption === 'home' ? 25 : 0)} • Order #{currentOrderId}
                </div>
              </div>
            )}

            {/* Payment Instructions */}
            {paymentStatus !== 'completed' && (
              <div style={{
                background: 'var(--info-light)',
                border: '1px solid var(--info)',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '2rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--info-dark)', fontWeight: '600' }}>
                  Complete your payment using the QR code or UPI apps
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  Click "Payment Done" after completing the payment
                </div>
              </div>
            )}

            {/* UPI Apps */}
            {paymentStatus !== 'completed' && (
              <div style={{ marginBottom: '2rem' }}>
                <p style={{ 
                  fontSize: '0.9rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '1rem',
                  textAlign: 'center'
                }}>
                  Pay directly using your preferred app:
                </p>
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.75rem',
                  maxWidth: '300px',
                  margin: '0 auto'
                }}>
                  {availableApps.slice(0, 4).map(app => (
                    <button
                      key={app.name}
                      onClick={() => handleAppPayment(app)}
                      style={{
                        padding: '0.75rem',
                        border: '2px solid var(--primary-color)',
                        borderRadius: '12px',
                        background: 'var(--bg-primary)',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        color: 'var(--primary-color)',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = 'var(--primary-color)';
                        e.target.style.color = 'white';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'var(--bg-primary)';
                        e.target.style.color = 'var(--primary-color)';
                      }}
                    >
                      📱 {app.name}
                    </button>
                  ))}
                </div>
                <div style={{
                  textAlign: 'center',
                  marginTop: '1rem',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)'
                }}>
                  Amount: ₹{getCartTotal() + (deliveryOption === 'home' ? 25 : 0)}
                </div>
              </div>
            )}

            <div style={{ 
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => {
                  if (statusCheckInterval) {
                    clearInterval(statusCheckInterval);
                  }
                  setShowQR(false);
                  setPaymentStatus('pending');
                }}
                className="btn btn-outline"
                disabled={paymentStatus === 'completed'}
              >
                Back
              </button>
              {paymentStatus !== 'completed' && (
                <button
                  onClick={handlePaymentSuccess}
                  className="btn btn-primary"
                >
                  Payment Done
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 0', minHeight: '100vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem',
            fontWeight: '800',
            color: 'var(--primary-color)',
            marginBottom: '0.5rem'
          }}>
            Checkout
          </h1>
          <p style={{ 
            color: 'var(--text-secondary)',
            fontSize: '1.1rem'
          }}>
            Complete your order
          </p>
        </div>

        <div className="checkout-grid" style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr 400px',
          gap: '2rem'
        }}>
          {/* Checkout Form */}
          <div>
            {/* Delivery Information */}
            <div style={{
              background: 'var(--bg-secondary)',
              padding: '2rem',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              marginBottom: '2rem'
            }}>
              <h3 style={{ 
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Truck size={20} />
                Delivery Information
              </h3>

              {/* Delivery Options */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block',
                  marginBottom: '1rem',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}>
                  Choose Delivery Option *
                </label>
                
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {/* Home Delivery Option */}
                  <label style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    padding: '1.25rem',
                    border: deliveryOption === 'home' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    background: deliveryOption === 'home' ? 'coral' : 'var(--bg-primary)',
                    transition: 'all 0.2s ease'
                  }}>
                    <input
                      type="radio"
                      name="delivery"
                      value="home"
                      checked={deliveryOption === 'home'}
                      onChange={(e) => setDeliveryOption(e.target.value)}
                      style={{ marginTop: '2px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.5rem'
                      }}>
                        <Truck size={20} style={{ color: 'var(--primary-color)' }} />
                        <span style={{ fontWeight: '600', fontSize: '1rem' }}>Home Delivery</span>
                        <span style={{
                          background: 'var(--success)',
                          color: 'white',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '12px',
                          fontSize: '0.7rem',
                          fontWeight: '600'
                        }}>₹25</span>
                      </div>
                      <div style={{ 
                        fontSize: '0.85rem',
                        color: 'var(--text-primary)',
                        lineHeight: '1.4',
                        marginBottom: '0.5rem'
                      }}>
                        Get your order delivered to your doorstep within 1km radius of Alkasa Society, Mohammadwadi, Pune
                      </div>
                      <div style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        fontSize: '0.8rem'
                      }}>
                        <span style={{ color: 'var(--success)' }}>🕒 2-3 days delivery</span>
                        <span style={{ color: 'var(--primary-color)' }}>📍 Within 1km radius</span>
                      </div>
                    </div>
                  </label>

                  {/* Self Pickup Option */}
                  <label style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    padding: '1.25rem',
                    border: deliveryOption === 'pickup' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    background: deliveryOption === 'pickup' ? 'coral' : 'var(--bg-primary)',
                    transition: 'all 0.2s ease'
                  }}>
                    <input
                      type="radio"
                      name="delivery"
                      value="pickup"
                      checked={deliveryOption === 'pickup'}
                      onChange={(e) => setDeliveryOption(e.target.value)}
                      style={{ marginTop: '2px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.5rem'
                      }}>
                        <MapPin size={20} style={{ color: 'var(--primary-color)' }} />
                        <span style={{ fontWeight: '600', fontSize: '1rem' }}>Self Pickup</span>
                        <span style={{
                          background: 'var(--success)',
                          color: 'white',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '12px',
                          fontSize: '0.7rem',
                          fontWeight: '600'
                        }}>FREE</span>
                      </div>
                      <div style={{ 
                        fontSize: '0.85rem',
                        color: 'var(--text-primary)',
                        lineHeight: '1.4',
                        marginBottom: '0.5rem'
                      }}>
                        Collect your order from Alkasa Society, Mohammadwadi, Pune. Perfect for faster delivery!
                      </div>
                      <div style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        fontSize: '0.8rem'
                      }}>
                        <span style={{ color: 'var(--success)' }}>🕒 Ready in 1-2 days</span>
                        <span style={{ color: 'var(--primary-color)' }}>💰 Save delivery cost</span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div style={{ 
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div>
                  <label style={{ 
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600'
                  }}>
                    Full Name *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ 
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-secondary)'
                    }} />
                    <input
                      type="text"
                      value={deliveryInfo.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px'
                      }}
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ 
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600'
                  }}>
                    Phone Number *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{ 
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-secondary)'
                    }} />
                    <input
                      type="tel"
                      value={deliveryInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px'
                      }}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ 
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600'
                }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ 
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-secondary)'
                  }} />
                  <input
                    type="email"
                    value={deliveryInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px'
                    }}
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              {deliveryOption === 'home' && (
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ 
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600'
                  }}>
                    Complete Address *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={16} style={{ 
                      position: 'absolute',
                      left: '12px',
                      top: '12px',
                      color: 'var(--text-secondary)'
                    }} />
                    <textarea
                      value={deliveryInfo.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        resize: 'vertical'
                      }}
                      placeholder="Enter complete delivery address (within 1km of Alkasa Society, Mohammadwadi)"
                    />
                  </div>
                </div>
              )}

              {deliveryOption === 'home' && (
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '1rem'
                }}>
                  <div>
                    <label style={{ 
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '600'
                    }}>
                      Pincode *
                    </label>
                    <input
                      type="text"
                      value={deliveryInfo.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px'
                      }}
                      placeholder="Pincode"
                    />
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '600'
                    }}>
                      City *
                    </label>
                    <input
                      type="text"
                      value={deliveryInfo.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px'
                      }}
                      placeholder="City"
                    />
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '600'
                    }}>
                      State *
                    </label>
                    <input
                      type="text"
                      value={deliveryInfo.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px'
                      }}
                      placeholder="State"
                    />
                  </div>
                </div>
              )}
              
              {deliveryOption === 'pickup' && (
                <div style={{
                  background: 'linear-gradient(135deg, var(--primary-light), var(--bg-tertiary))',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: '1px solid var(--primary-color)',
                  fontSize: '0.9rem',
                  marginTop: '1rem'
                }}>
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: '700',
                    marginBottom: '1rem',
                    color: 'var(--primary-color)',
                    fontSize: '1rem'
                  }}>
                    <MapPin size={20} />
                    Pickup Location Details
                  </div>
                  
                  <div style={{ 
                    background: 'white',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    border: '1px solid var(--border-light)'
                  }}>
                    <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                      📍 Address:
                    </div>
                    <div style={{ color: 'black', lineHeight: '1.5' }}>
                      Alkasa Society, Mohammadwadi,<br/>
                      Pune, Maharashtra - 411060
                    </div>
                  </div>
                  
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      background: 'white',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border-light)',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '0.8rem', color: 'black' }}>Contact</div>
                      <div style={{ fontWeight: '600', color: 'black' }}>+91 9970944685</div>
                    </div>
                    <div style={{
                      background: 'white',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border-light)',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '0.8rem', color: 'black' }}>Pickup Hours</div>
                      <div style={{ fontWeight: '600', color: 'black' }}>6:00 PM - 8:00 PM</div>
                    </div>
                  </div>
                  
                  <div style={{ 
                    background: 'var(--success-light)',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--success)',
                    textAlign: 'center'
                  }}>
                    <div style={{ 
                      fontSize: '0.85rem',
                      color: 'var(--success)',
                      fontWeight: '600'
                    }}>
                      ✅ Ready for pickup by: {(() => {
                        const pickupDate = new Date();
                        pickupDate.setDate(pickupDate.getDate() + calculateDeliveryTime());
                        return pickupDate.toLocaleDateString('en-IN', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        });
                      })()}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div style={{
              background: 'var(--bg-secondary)',
              padding: '2rem',
              borderRadius: '16px',
              border: '1px solid var(--border-color)'
            }}>
              <h3 style={{ 
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <CreditCard size={20} />
                Payment Method
              </h3>

              <div style={{ display: 'grid', gap: '1rem' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  border: paymentMethod === 'qr' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: paymentMethod === 'qr' ? 'coral' : 'var(--bg-primary)'
                }}>
                  <input
                    type="radio"
                    name="payment"
                    value="qr"
                    checked={paymentMethod === 'qr'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <Smartphone size={20} />
                  <div>
                    <div style={{ fontWeight: '600' }}>QR Code / UPI Payment</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Pay instantly using PhonePe, GPay, Paytm, or any UPI app
                    </div>
                  </div>
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  border: paymentMethod === 'cod' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: paymentMethod === 'cod' ? 'coral' : 'var(--bg-primary)'
                }}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <Truck size={20} />
                  <div>
                    <div style={{ fontWeight: '600' }}>Cash on Delivery (COD)</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Pay when your order is delivered
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div style={{ position: 'sticky', top: '2rem', height: 'fit-content' }}>
            <div style={{
              background: 'var(--bg-secondary)',
              padding: '2rem',
              borderRadius: '16px',
              border: '1px solid var(--border-color)'
            }}>
              <h3 style={{ 
                marginBottom: '1.5rem',
                fontSize: '1.3rem',
                fontWeight: '700'
              }}>
                Order Summary
              </h3>

              {/* Items */}
              <div style={{ marginBottom: '1.5rem' }}>
                {cartItems.map(item => {
                  const itemPrice = item.finalPrice || item.price;
                  return (
                    <div 
                      key={`${item.id}-${JSON.stringify(item.customizations)}`}
                      style={{ 
                        marginBottom: '1rem',
                        paddingBottom: '1rem',
                        borderBottom: '1px solid var(--border-light)'
                      }}
                    >
                      <div style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '0.25rem'
                      }}>
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                            {item.name}
                            {item.selectedWeight && (
                              <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                {' '}({item.selectedWeight})
                              </span>
                            )}
                          </div>
                          <div style={{ 
                            fontSize: '0.8rem', 
                            color: 'var(--text-secondary)' 
                          }}>
                            Qty: {item.quantity}
                            {((item.category === 'food' && item.quantity > 5) || (item.category === 'crochet' && item.quantity > 3)) && (
                              <span style={{
                                marginLeft: '0.5rem',
                                color: 'var(--warning)',
                                fontWeight: '600'
                              }}>
                                ⚠️ Large qty - delivery may vary
                              </span>
                            )}
                          </div>
                        </div>
                        <div style={{ fontWeight: '600' }}>
                          ₹{itemPrice * item.quantity}
                        </div>
                      </div>
                      {item.customizations?.['thread-type'] === 'Wool Thread' && (
                        <div style={{ 
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '0.8rem',
                          color: 'var(--text-secondary)',
                          marginLeft: '1rem'
                        }}>
                          <span>Wool Thread surcharge</span>
                          <span>₹200</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div style={{ 
                borderTop: '1px solid var(--border-color)',
                paddingTop: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem'
                }}>
                  <span>Subtotal:</span>
                  <span>₹{getCartTotal()}</span>
                </div>
                
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem',
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {deliveryOption === 'home' ? <Truck size={14} /> : <MapPin size={14} />}
                    {deliveryOption === 'home' ? 'Home Delivery:' : 'Self Pickup:'}
                  </span>
                  <span style={{ 
                    fontWeight: '600',
                    color: deliveryOption === 'home' ? 'var(--text-primary)' : 'var(--success)'
                  }}>
                    {deliveryOption === 'home' ? '₹25' : 'FREE'}
                  </span>
                </div>
                
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  color: 'var(--primary-color)',
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '0.5rem'
                }}>
                  <span>Total:</span>
                  <span>₹{getCartTotal() + (deliveryOption === 'home' ? 25 : 0)}</span>
                </div>
              </div>

              {/* Delivery Info */}
              <div style={{ 
                background: 'linear-gradient(135deg, var(--primary-light), var(--bg-tertiary))',
                padding: '1rem',
                borderRadius: '12px',
                marginBottom: '1.5rem',
                fontSize: '0.9rem',
                border: '1px solid var(--primary-color)'
              }}>
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem'
                }}>
                  {deliveryOption === 'home' ? <Truck size={18} /> : <MapPin size={18} />}
                  <strong style={{ color: 'var(--primary-color)' }}>
                    {deliveryOption === 'home' ? 'Expected Delivery:' : 'Ready for Pickup:'}
                  </strong>
                </div>
                <p style={{ 
                  margin: 0,
                  color: 'var(--text-secondary)',
                  fontWeight: '600'
                }}>
                  {deliveryOption === 'home' 
                    ? `${calculateDeliveryTime()} days from order confirmation`
                    : `${calculateDeliveryTime()} days from order confirmation (6-8 PM)`
                  }
                </p>
              </div>

              {/* Place Order Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('🖱️ Button click event triggered');
                  handlePlaceOrder();
                }}
                disabled={loading || !validateForm()}
                style={{
                  width: '100%',
                  background: (validateForm() && !loading) ? 'var(--primary-color)' : 'var(--text-secondary)',
                  color: 'white',
                  border: 'none',
                  padding: '1rem',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: (validateForm() && !loading) ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease',
                  opacity: (validateForm() && !loading) ? 1 : 0.6,
                  pointerEvents: (validateForm() && !loading) ? 'auto' : 'none',
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'rgba(0,0,0,0.1)'
                }}
              >
                {loading ? (
                  <>
                    <div className="spinner" style={{ width: '20px', height: '20px', border: '2px solid #ffffff40', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    Processing...
                  </>
                ) : (
                  <>
                    {paymentMethod === 'qr' ? '💳 Proceed to Payment' : '🛒 Place Order'}
                  </>
                )}
              </button>

              {/* Security Note */}
              <div style={{ 
                textAlign: 'center',
                marginTop: '1rem',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)'
              }}>
                🔒 Your information is secure and encrypted
              </div>
              
              <style jsx>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;