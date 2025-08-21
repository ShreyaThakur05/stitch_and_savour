import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(itemId);
      showToast('Item removed from cart', 'success');
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    navigate('/checkout');
  };

  const calculateDeliveryTime = () => {
    if (cartItems.length === 0) return 0;
    return Math.max(...cartItems.map(item => item.deliveryTime || 2));
  };

  const CartItem = ({ item }) => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '120px 1fr auto',
      gap: '1rem',
      padding: '1.5rem',
      background: 'var(--bg-secondary)',
      borderRadius: '12px',
      border: '1px solid var(--border-color)'
    }}>
      {/* Product Image */}
      <div>
        <img
          src={item.images ? item.images[0] : item.image || '/images/placeholder.jpg'}
          alt={item.name}
          style={{
            width: '100%',
            height: '100px',
            objectFit: 'cover',
            borderRadius: '8px',
            display: 'block'
          }}
          onError={(e) => {
            e.target.src = '/images/placeholder.jpg';
          }}
        />
      </div>

      {/* Product Details */}
      <div>
        <h4 style={{ 
          margin: '0 0 0.5rem 0',
          fontSize: '1.1rem',
          fontWeight: '600'
        }}>
          {item.name}
        </h4>
        
        <p style={{ 
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          margin: '0 0 0.75rem 0',
          lineHeight: '1.4'
        }}>
          {item.shortDescription}
        </p>

        {/* Customizations and Weight */}
        <div style={{ marginBottom: '0.75rem' }}>
          {item.selectedWeight && (
            <div style={{ 
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              marginBottom: '0.25rem'
            }}>
              <strong>WEIGHT:</strong> {item.selectedWeight}
            </div>
          )}
          {item.customizations && Object.keys(item.customizations).length > 0 && (
            Object.entries(item.customizations).map(([key, value]) => (
              <div key={key} style={{ 
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                marginBottom: '0.25rem'
              }}>
                <strong>{key.replace('-', ' ').toUpperCase()}:</strong> {value}
              </div>
            ))
          )}
        </div>

        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          {/* Quantity Controls */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            background: 'var(--bg-primary)',
            padding: '0.25rem',
            borderRadius: '8px',
            border: '1px solid var(--border-color)'
          }}>
            <button
              onClick={() => handleQuantityChange(item.cartId, item.quantity - 1)}
              className="cart-quantity-btn"
              style={{
                width: '32px',
                height: '32px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px'
              }}
            >
              <Minus size={16} />
            </button>
            
            <span style={{ 
              minWidth: '32px',
              textAlign: 'center',
              fontWeight: '600'
            }}>
              {item.quantity}
            </span>
            
            <button
              onClick={() => handleQuantityChange(item.cartId, item.quantity + 1)}
              className="cart-quantity-btn"
              style={{
                width: '32px',
                height: '32px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px'
              }}
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Remove Button */}
          <button
            onClick={() => {
              removeFromCart(item.cartId);
              showToast('Item removed from cart', 'success');
            }}
            style={{
              padding: '0.5rem',
              background: 'transparent',
              border: '1px solid var(--error)',
              color: 'var(--error)',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.8rem'
            }}
          >
            <Trash2 size={14} />
            Remove
          </button>
          
          {/* Large Quantity Alert */}
          {((item.category === 'food' && item.quantity > 5) || (item.category === 'crochet' && item.quantity > 3)) && (
            <div style={{
              background: 'var(--warning-light)',
              color: 'var(--warning-dark)',
              padding: '0.4rem 0.6rem',
              borderRadius: '6px',
              fontSize: '0.7rem',
              fontWeight: '600',
              border: '1px solid var(--warning)',
              width: '100%',
              marginTop: '0.5rem'
            }}>
              ⚠️ Large quantity - delivery time may vary, owner will inform soon
            </div>
          )}
        </div>
      </div>

      {/* Price */}
      <div style={{ textAlign: 'right' }}>
        <div style={{ 
          fontSize: '1.2rem',
          fontWeight: '700',
          color: 'var(--primary-color)',
          marginBottom: '0.25rem'
        }}>
          ₹{(item.finalPrice || item.price) * item.quantity}
        </div>
        <div style={{ 
          fontSize: '0.8rem',
          color: 'var(--text-secondary)'
        }}>
          ₹{item.finalPrice || item.price} each
        </div>
      </div>
    </div>
  );

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: '2rem 0', minHeight: '60vh' }}>
        <div className="container">
          <div style={{ 
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'var(--bg-secondary)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
            <h2 style={{ marginBottom: '1rem' }}>Your cart is empty</h2>
            <p style={{ 
              color: 'var(--text-secondary)',
              marginBottom: '2rem',
              fontSize: '1.1rem'
            }}>
              Looks like you haven't added any items to your cart yet.
            </p>
            <button
              onClick={() => navigate('/products')}
              className="btn btn-primary"
              style={{
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <ShoppingBag size={20} />
              Start Shopping
            </button>
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
            Shopping Cart
          </h1>
          <p style={{ 
            color: 'var(--text-secondary)',
            fontSize: '1.1rem'
          }}>
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr 400px',
          gap: '2rem'
        }}>
          {/* Cart Items */}
          <div>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {cartItems.map(item => (
                <CartItem key={item.cartId} item={item} />
              ))}
            </div>

            {/* Continue Shopping */}
            <div style={{ marginTop: '2rem' }}>
              <button
                onClick={() => navigate('/products')}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--primary-color)',
                  color: 'var(--primary-color)',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                ← Continue Shopping
              </button>
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

              {/* Items Breakdown */}
              <div style={{ marginBottom: '1.5rem' }}>
                {cartItems.map(item => {
                  const itemPrice = item.finalPrice || item.price;
                  
                  return (
                    <div key={item.cartId} style={{ marginBottom: '1rem' }}>
                      <div style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '0.25rem',
                        fontSize: '0.9rem'
                      }}>
                        <span>
                          {item.name} × {item.quantity}
                          {item.selectedWeight && (
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                              {' '}({item.selectedWeight})
                            </span>
                          )}
                        </span>
                        <span>₹{itemPrice * item.quantity}</span>
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
                  marginBottom: '0.5rem',
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem'
                }}>
                  <span>Delivery:</span>
                  <span>Free</span>
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
                  <span>₹{getCartTotal()}</span>
                </div>
              </div>

              {/* Delivery Info */}
              <div style={{ 
                background: 'var(--bg-tertiary)',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                fontSize: '0.9rem'
              }}>
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem'
                }}>
                  <span>🚚</span>
                  <strong>Expected Delivery:</strong>
                </div>
                <p style={{ 
                  margin: 0,
                  color: 'var(--text-secondary)'
                }}>
                  {calculateDeliveryTime()} days from order confirmation
                </p>
              </div>

              {/* Payment Methods */}
              <div style={{ 
                marginBottom: '1.5rem',
                fontSize: '0.9rem'
              }}>
                <div style={{ marginBottom: '0.5rem', fontWeight: '600' }}>
                  Payment Options:
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>
                  • QR Code Payment<br/>
                  • Cash on Delivery (COD)
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={loading}
                style={{
                  width: '100%',
                  background: 'var(--primary-color)',
                  color: 'white',
                  border: 'none',
                  padding: '1rem',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {loading ? (
                  <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                ) : (
                  <>
                    Proceed to Checkout
                    <ArrowRight size={20} />
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
                🔒 Secure checkout with SSL encryption
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;