import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, Smartphone, CreditCard } from 'lucide-react';
import paymentService from '../services/paymentService';

const PaymentGateway = ({ amount, orderId, customerInfo, onSuccess, onCancel }) => {
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [availableApps, setAvailableApps] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializePayment();
  }, [amount, orderId]);

  const initializePayment = async () => {
    setLoading(true);
    
    // Generate dynamic QR code
    const qrUrl = await paymentService.generateQRCode(amount, orderId, customerInfo.name);
    setQrCodeUrl(qrUrl);
    
    // Detect available payment apps
    const apps = paymentService.detectPaymentApps();
    setAvailableApps(apps);
    
    // Start payment monitoring
    paymentService.startPaymentStatusCheck(orderId, (success) => {
      if (success) {
        setPaymentStatus('completed');
        setTimeout(() => onSuccess(), 1500);
      }
    });
    
    setLoading(false);
  };

  const handleAppPayment = (app) => {
    paymentService.launchPaymentApp(app.url, amount, orderId, customerInfo.name);
  };

  const handleRazorpayPayment = () => {
    paymentService.initializeRazorpay(amount, orderId, customerInfo);
  };

  if (paymentStatus === 'completed') {
    return (
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        background: 'var(--success-light)',
        borderRadius: '16px',
        border: '2px solid var(--success)'
      }}>
        <CheckCircle size={64} style={{ color: 'var(--success)', marginBottom: '1rem' }} />
        <h3 style={{ color: 'var(--success)', marginBottom: '0.5rem' }}>Payment Successful!</h3>
        <p style={{ color: 'var(--success-dark)' }}>Processing your order...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      {/* Payment Method Selection */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Choose Payment Method</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem',
            border: paymentMethod === 'upi' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
            borderRadius: '12px',
            cursor: 'pointer',
            background: paymentMethod === 'upi' ? 'var(--primary-light)' : 'var(--bg-primary)'
          }}>
            <input
              type="radio"
              name="payment"
              value="upi"
              checked={paymentMethod === 'upi'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <Smartphone size={24} />
            <div>
              <div style={{ fontWeight: '600' }}>UPI Payment</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Instant payment via UPI apps
              </div>
            </div>
          </label>

          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem',
            border: paymentMethod === 'gateway' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
            borderRadius: '12px',
            cursor: 'pointer',
            background: paymentMethod === 'gateway' ? 'var(--primary-light)' : 'var(--bg-primary)'
          }}>
            <input
              type="radio"
              name="payment"
              value="gateway"
              checked={paymentMethod === 'gateway'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <CreditCard size={24} />
            <div>
              <div style={{ fontWeight: '600' }}>Card/Net Banking</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Credit/Debit cards, Net Banking
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* UPI Payment */}
      {paymentMethod === 'upi' && (
        <div>
          {/* QR Code */}
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '16px',
            border: '2px solid var(--border-color)',
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            {loading ? (
              <div style={{ padding: '2rem' }}>
                <div className="spinner" style={{ margin: '0 auto' }}></div>
                <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
                  Generating payment QR...
                </p>
              </div>
            ) : (
              <>
                <img
                  src={qrCodeUrl}
                  alt={`Payment QR for ₹${amount}`}
                  style={{
                    width: '250px',
                    height: '250px',
                    objectFit: 'contain'
                  }}
                />
                <div style={{
                  marginTop: '1rem',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: 'var(--primary-color)'
                }}>
                  ₹{amount}
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  color: 'var(--text-secondary)'
                }}>
                  Order #{orderId}
                </div>
              </>
            )}
          </div>

          {/* Payment Status */}
          <div style={{
            background: 'var(--warning-light)',
            border: '1px solid var(--warning)',
            borderRadius: '12px',
            padding: '1rem',
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            <Clock size={24} style={{ color: 'var(--warning)', marginBottom: '0.5rem' }} />
            <div style={{ fontWeight: '600', color: 'var(--warning-dark)' }}>
              Waiting for payment...
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Payment will be auto-detected
            </div>
          </div>

          {/* UPI Apps */}
          <div>
            <h4 style={{ textAlign: 'center', marginBottom: '1rem' }}>
              Pay with your favorite app
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              {availableApps.slice(0, 4).map(app => (
                <button
                  key={app.name}
                  onClick={() => handleAppPayment(app)}
                  style={{
                    padding: '1rem',
                    border: '2px solid var(--primary-color)',
                    borderRadius: '12px',
                    background: 'var(--bg-primary)',
                    cursor: 'pointer',
                    fontWeight: '600',
                    color: 'var(--primary-color)',
                    transition: 'all 0.2s ease'
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
              fontSize: '0.8rem',
              color: 'var(--text-secondary)'
            }}>
              Amount ₹{amount} will be auto-filled
            </div>
          </div>
        </div>
      )}

      {/* Gateway Payment */}
      {paymentMethod === 'gateway' && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <button
            onClick={handleRazorpayPayment}
            style={{
              padding: '1rem 2rem',
              background: 'var(--primary-color)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            Pay ₹{amount} with Card/Net Banking
          </button>
          <div style={{
            marginTop: '1rem',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)'
          }}>
            Secure payment powered by Razorpay
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        marginTop: '2rem'
      }}>
        <button
          onClick={onCancel}
          className="btn btn-outline"
        >
          Cancel
        </button>
        {paymentMethod === 'upi' && (
          <button
            onClick={onSuccess}
            className="btn btn-primary"
          >
            Payment Done
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentGateway;