import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { generateInvoicePDF } from '../utils/pdfGenerator';
import orderService from '../services/orderService';
import reviewService from '../services/reviewService';
import { 
  Package, 
  ShoppingBag, 
  Heart, 
  User, 
  Clock,
  CheckCircle,
  Truck,
  Star,
  MessageCircle,
  CreditCard,
  Calendar,
  Search,
  Download
} from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();
  const { cartItems, addToCart } = useCart();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentDue, setPaymentDue] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  const getGreetingMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = (order.orderNumber || order.id || '').toString().includes(searchTerm) || 
                         (order.customerName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const fetchUserData = async () => {
    try {
      // Get orders from backend with localStorage fallback
      const userOrders = await orderService.getUserOrders();
      
      // Filter orders to show only current user's orders
      const currentUserOrders = userOrders.filter(order => 
        (order.customerName === user?.name || 
         order.customerEmail === user?.email ||
         order.userId === user?.id) &&
        order.items && order.items.length > 0
      );
      
      const formattedOrders = currentUserOrders.map(order => ({
        _id: order.orderId || order._id,
        orderNumber: order.orderNumber || order.orderId,
        total: order.total,
        status: order.status || 'pending',
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt,
        estimatedDelivery: order.estimatedDelivery,
        items: order.items,
        customerPhone: order.customerPhone || user?.phone,
        productImage: order.items?.[0]?.productImage || order.items?.[0]?.images?.[0] || '/images/placeholder.jpg',
        productName: order.items?.[0]?.name || 'Order Items'
      }));
      
      setOrders(formattedOrders);
      // Calculate payment due for current user's COD orders only
      const userPaymentDue = formattedOrders
        .filter(o => o.paymentMethod === 'cod' && o.status !== 'delivered')
        .reduce((sum, o) => sum + o.total, 0);
      setPaymentDue(userPaymentDue);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'received':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'in-progress':
        return <Package className="w-4 h-4 text-yellow-500" />;
      case 'out-for-delivery':
        return <Truck className="w-4 h-4 text-orange-500" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };



  const tabs = [
    { id: 'overview', label: 'Overview', icon: <User className="w-4 h-4" /> },
    { id: 'orders', label: 'My Orders', icon: <Package className="w-4 h-4" /> },
    { id: 'reviews', label: 'Write Review', icon: <Star className="w-4 h-4" /> },
    { id: 'categories', label: 'Shop Categories', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart className="w-4 h-4" /> }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '2rem 0' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Welcome Header */}
        <div className="animate-fade-in" style={{ marginBottom: '2rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
            borderRadius: '16px',
            padding: '2rem',
            color: 'white',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
              {getGreetingMessage()}, {user?.name}! 👋
            </h1>
            <p style={{ opacity: '0.9', fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-strong)' }}>
              We're happy to see you again. Here's what's happening with your orders.
            </p>
            {paymentDue > 0 && (
              <div style={{
                marginTop: '1.5rem',
                background: 'var(--bg-secondary)',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    padding: '0.75rem',
                    background: 'rgba(249, 115, 22, 0.1)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <CreditCard size={24} style={{ color: '#f97316' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Payment Pending</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>₹{paymentDue}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>COD orders awaiting payment</div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowPaymentModal(true)}
                  style={{
                  background: 'var(--primary-color)',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  border: 'none',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                }}>
                  Pay Now
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="animate-slide-up" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
          animationDelay: '0.2s'
        }}>
          <div style={{
            background: 'var(--bg-secondary)',
            borderRadius: '12px',
            padding: '1rem',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                padding: '0.5rem',
                background: 'var(--primary-light)',
                borderRadius: '8px'
              }}>
                <Package size={20} style={{ color: 'var(--primary-color)' }} />
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Total Orders</p>
                <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-strong)', margin: 0 }}>{orders.length}</p>
              </div>
            </div>
          </div>

          <div style={{
            background: 'var(--bg-secondary)',
            borderRadius: '12px',
            padding: '1rem',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                padding: '0.5rem',
                background: 'rgba(34, 197, 94, 0.1)',
                borderRadius: '8px'
              }}>
                <CheckCircle size={20} style={{ color: '#22c55e' }} />
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Delivered</p>
                <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-strong)', margin: 0 }}>
                  {orders.filter(order => order.status === 'delivered').length}
                </p>
              </div>
            </div>
          </div>

          <div style={{
            background: 'var(--bg-secondary)',
            borderRadius: '12px',
            padding: '1rem',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                padding: '0.5rem',
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '8px'
              }}>
                <ShoppingBag size={20} style={{ color: '#3b82f6' }} />
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Cart Items</p>
                <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-strong)', margin: 0 }}>{cartItems.length}</p>
              </div>
            </div>
          </div>

          <div style={{
            background: 'var(--bg-secondary)',
            borderRadius: '12px',
            padding: '1rem',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                padding: '0.5rem',
                background: 'rgba(249, 115, 22, 0.1)',
                borderRadius: '8px'
              }}>
                <CreditCard size={20} style={{ color: '#f97316' }} />
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Payment Due</p>
                <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-strong)', margin: 0 }}>₹{paymentDue}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="animate-scale-in" style={{
          background: 'var(--bg-secondary)',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          marginBottom: '2rem',
          overflow: 'hidden',
          animationDelay: '0.4s'
        }}>
          <nav style={{
            display: 'flex',
            background: 'var(--bg-tertiary)',
            padding: '0.5rem',
            gap: '0.25rem'
          }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  background: activeTab === tab.id ? 'var(--bg-secondary)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: activeTab === tab.id ? 'var(--primary-color)' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease',
                  boxShadow: activeTab === tab.id ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                {tab.icon}
                <span style={{ display: window.innerWidth > 640 ? 'block' : 'none' }}>{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Tab Content */}
          <div style={{ padding: '1.5rem' }}>
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h3>
                {orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'var(--bg-tertiary)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛍️</div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1rem' }}>No orders yet</h3>
                    <p style={{ color: 'var(--text-strong)', marginBottom: '2rem', lineHeight: '1.5' }}>
                      Your order history will appear here once you place your first order.
                    </p>
                    <button 
                      onClick={() => navigate('/products')}
                      style={{
                        background: 'var(--primary-color)',
                        color: 'white',
                        padding: '1rem 2rem',
                        borderRadius: '12px',
                        border: 'none',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order._id || order.orderNumber} style={{
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        padding: '1rem',
                        background: 'var(--bg-secondary)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                              {getStatusIcon(order.status)}
                              <p style={{ fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>Order #{order.orderNumber}</p>
                            </div>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                              {order.items?.length || 0} item(s)
                            </p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{
                              padding: '0.25rem 0.5rem',
                              borderRadius: '12px',
                              fontSize: '0.7rem',
                              fontWeight: '600',
                              background: order.status === 'delivered' ? 'var(--success-light)' : 'var(--warning-light)',
                              color: order.status === 'delivered' ? 'var(--success)' : 'var(--warning)'
                            }}>
                              {order.status.replace('-', ' ').toUpperCase()}
                            </span>
                            <p style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', margin: '0.25rem 0 0 0' }}>
                              ₹{order.total}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">All Orders</h3>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-64"
                      />
                    </div>
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="all">All Status</option>
                      <option value="received">Order Received</option>
                      <option value="in-progress">In Progress</option>
                      <option value="out-for-delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No orders found</h4>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      You haven't placed any orders yet. Start shopping to see your orders here.
                    </p>
                    <a
                      href="/products"
                      className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 inline-block"
                    >
                      Browse Products
                    </a>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredOrders.map((order) => (
                      <div key={order._id || order.orderNumber} style={{
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        background: 'var(--bg-secondary)',
                        marginBottom: '1rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                          <div style={{ flex: 1 }}>
                            <h4 style={{ fontWeight: '600', color: 'var(--text-primary)', margin: '0 0 0.25rem 0' }}>Order #{order.orderNumber}</h4>
                            <p style={{ fontSize: '1rem', color: 'var(--text-primary)', margin: '0 0 0.25rem 0' }}>
                              {order.items?.length || 0} item(s) - {order.items?.map(item => item.name).join(', ') || 'Order Items'}
                            </p>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                              Placed on {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{
                              padding: '0.5rem 1rem',
                              borderRadius: '12px',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              background: order.status === 'delivered' ? 'var(--success-light)' : 'var(--warning-light)',
                              color: order.status === 'delivered' ? 'var(--success)' : 'var(--warning)'
                            }}>
                              {order.status.replace('-', ' ').toUpperCase()}
                            </span>
                          </div>
                        </div>
                        
                        {/* Order Tracking Bar */}
                        <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                          <h5 style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Package size={16} />
                            Order Progress
                          </h5>
                          <div style={{ position: 'relative', marginBottom: '1rem' }}>
                            {/* Progress Line */}
                            <div style={{ position: 'absolute', top: '20px', left: '20px', right: '20px', height: '3px', background: 'var(--border-color)', borderRadius: '2px' }}>
                              <div 
                                style={{
                                  height: '100%',
                                  borderRadius: '2px',
                                  transition: 'all 0.5s ease',
                                  background: 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))',
                                  width: order.status === 'pending' ? '0%' :
                                         order.status === 'received' ? '25%' :
                                         order.status === 'in-progress' ? '50%' :
                                         order.status === 'out-for-delivery' ? '75%' :
                                         order.status === 'delivered' ? '100%' : '0%'
                                }}
                              />
                            </div>
                            {/* Status Steps */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                              {[
                                { key: 'received', label: 'Order Received', icon: <CheckCircle size={14} /> },
                                { key: 'in-progress', label: 'In Progress', icon: <Clock size={14} /> },
                                { key: 'out-for-delivery', label: 'Out for Delivery', icon: <Truck size={14} /> },
                                { key: 'delivered', label: 'Delivered', icon: <Package size={14} /> }
                              ].map((step, index) => {
                                // Define step order
                                const stepOrder = { 'pending': 0, 'received': 1, 'in-progress': 2, 'out-for-delivery': 3, 'delivered': 4 };
                                const currentStepIndex = stepOrder[order.status] || 0;
                                const thisStepIndex = index + 1;
                                
                                // Step is completed if current status is beyond this step
                                const isCompleted = currentStepIndex > thisStepIndex;
                                // Step is current if this is the current status
                                const isCurrent = currentStepIndex === thisStepIndex;
                                // Step is active if it's completed or current
                                const isActive = isCompleted || isCurrent;
                                
                                return (
                                  <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                                    <div style={{
                                      width: '40px',
                                      height: '40px',
                                      borderRadius: '50%',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      marginBottom: '0.5rem',
                                      background: isActive ? 'var(--primary-color)' : 'var(--bg-secondary)',
                                      border: `2px solid ${isActive ? 'var(--primary-color)' : 'var(--border-color)'}`,
                                      color: isActive ? 'white' : 'var(--text-secondary)',
                                      transition: 'all 0.3s ease',
                                      boxShadow: isCurrent ? '0 0 0 4px rgba(217, 70, 239, 0.2)' : 'none'
                                    }}>
                                      {step.icon}
                                    </div>
                                    <div style={{
                                      fontSize: '0.75rem',
                                      fontWeight: isActive ? '600' : '400',
                                      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                                      textAlign: 'center',
                                      lineHeight: '1.2'
                                    }}>
                                      {step.label}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                        
                        <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '1rem', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'var(--info-light)', borderRadius: '8px' }}>
                              <Calendar size={16} style={{ color: 'var(--info)' }} />
                              <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--info)', fontWeight: '500' }}>Expected Delivery</div>
                                <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                                  {order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Processing'}
                                </div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: order.paymentMethod === 'qr' ? 'var(--success-light)' : 'var(--warning-light)', borderRadius: '8px' }}>
                              <CreditCard size={16} style={{ color: order.paymentMethod === 'qr' ? 'var(--success)' : 'var(--warning)' }} />
                              <div>
                                <div style={{ fontSize: '0.75rem', color: order.paymentMethod === 'qr' ? 'var(--success)' : 'var(--warning)', fontWeight: '500' }}>Payment</div>
                                <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                                  {order.paymentMethod === 'qr' ? 'PAID' : 'Cash on Delivery'}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                generateInvoicePDF(order);
                                showToast('Invoice downloaded successfully!', 'success');
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem 1.25rem',
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.3)';
                              }}
                            >
                              <Download size={16} />
                              Download Invoice
                            </button>
                          </div>
                          <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary-color)' }}>
                            Total: ₹{order.total}
                          </div>
                        </div>
                        
                        {order.status === 'delivered' && !order.reviewed && (
                          <div style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            background: 'var(--warning-light)',
                            borderRadius: '8px'
                          }}>
                            <p style={{ fontSize: '0.9rem', color: 'var(--warning)', margin: '0 0 0.5rem 0' }}>
                              How was your experience? Leave a review!
                            </p>
                            <button
                              onClick={() => setActiveTab('reviews')}
                              style={{
                                background: 'var(--warning)',
                                color: 'white',
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                border: 'none',
                                fontSize: '0.8rem',
                                cursor: 'pointer'
                              }}
                            >
                              Write Review
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div style={{ maxWidth: '600px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Write a Review</h3>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Select Product to Review</label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem'
                    }}
                  >
                    <option value="">Choose a delivered product to review...</option>
                    {orders.filter(order => order.status === 'delivered').flatMap(order => 
                      order.items?.map(item => (
                        <option key={`${order.orderNumber}-${item.name}`} value={`${item.name}|${order.orderNumber}`}>
                          {item.name} - Order #{order.orderNumber}
                        </option>
                      )) || []
                    )}
                  </select>
                  {orders.filter(order => order.status === 'delivered').length === 0 && (
                    <div style={{ 
                      fontSize: '0.8rem', 
                      color: 'var(--text-secondary)', 
                      marginTop: '0.5rem',
                      padding: '0.75rem',
                      background: 'var(--bg-tertiary)',
                      borderRadius: '6px'
                    }}>
                      📦 No delivered orders yet. Reviews can only be written for delivered products.
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Rating</label>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0.25rem'
                        }}
                      >
                        <Star
                          size={24}
                          fill={star <= rating ? '#fbbf24' : 'none'}
                          color={star <= rating ? '#fbbf24' : '#d1d5db'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Review (max 50 words)</label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => {
                      const words = e.target.value.split(' ').filter(word => word.length > 0);
                      if (words.length <= 50) {
                        setReviewText(e.target.value);
                      }
                    }}
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      resize: 'vertical'
                    }}
                    placeholder="Share your experience with this product..."
                  />
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    {reviewText.split(' ').filter(word => word.length > 0).length}/50 words
                  </div>
                </div>

                <button
                  onClick={async () => {
                    if (selectedProduct && rating > 0 && reviewText.trim()) {
                      const [productName, orderNumber] = selectedProduct.split('|');
                      
                      try {
                        await reviewService.createReview({
                          productName,
                          orderNumber,
                          rating,
                          review: reviewText.trim(),
                          customerName: user?.name || 'Anonymous'
                        });
                        
                        showToast('Review submitted successfully! Thank you for your feedback.', 'success');
                        setSelectedProduct('');
                        setRating(0);
                        setReviewText('');
                      } catch (error) {
                        showToast('Failed to submit review. Please try again.', 'error');
                      }
                    } else {
                      showToast('Please select a product, rating, and write a review', 'error');
                    }
                  }}
                  disabled={!selectedProduct || rating === 0 || !reviewText.trim()}
                  style={{
                    background: selectedProduct && rating > 0 && reviewText.trim() ? 'var(--primary-color)' : 'var(--text-secondary)',
                    color: 'white',
                    padding: '0.75rem 2rem',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: '600',
                    cursor: selectedProduct && rating > 0 && reviewText.trim() ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Submit Review
                </button>
              </div>
            )}

            {activeTab === 'categories' && (
              <div style={{ maxWidth: '800px' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '2rem' }}>Shop by Categories</h3>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '1.5rem',
                  marginBottom: '2rem'
                }}>
                  <Link
                    to="/products?category=food"
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      padding: '2rem',
                      color: 'white',
                      textDecoration: 'none',
                      display: 'block',
                      transition: 'transform 0.3s ease',
                      minHeight: '200px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      fontSize: '4rem',
                      opacity: '0.3'
                    }}>🍽️</div>
                    <div style={{ position: 'relative', zIndex: 2 }}>
                      <h4 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Homemade Food</h4>
                      <p style={{ opacity: '0.9', marginBottom: '1rem', lineHeight: '1.5' }}>Fresh, traditional recipes made with love</p>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '20px',
                        padding: '0.5rem 1rem',
                        fontSize: '0.9rem'
                      }}>
                        <Clock size={16} />
                        <span>2 days delivery</span>
                      </div>
                    </div>
                  </Link>
                  
                  <Link
                    to="/products?category=crochet"
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                      padding: '2rem',
                      color: 'white',
                      textDecoration: 'none',
                      display: 'block',
                      transition: 'transform 0.3s ease',
                      minHeight: '200px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      fontSize: '4rem',
                      opacity: '0.3'
                    }}>🧶</div>
                    <div style={{ position: 'relative', zIndex: 2 }}>
                      <h4 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Handcrafted Crochet</h4>
                      <p style={{ opacity: '0.9', marginBottom: '1rem', lineHeight: '1.5' }}>Custom designs made just for you</p>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '20px',
                        padding: '0.5rem 1rem',
                        fontSize: '0.9rem'
                      }}>
                        <Clock size={16} />
                        <span>2 weeks delivery</span>
                      </div>
                    </div>
                  </Link>
                </div>
                
                <div style={{
                  background: 'var(--bg-tertiary)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  border: '1px solid var(--border-color)'
                }}>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '1rem' }}>Quick Actions</h4>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: '1rem'
                  }}>
                    <Link to="/cart" style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '1rem',
                      background: 'var(--bg-secondary)',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      color: 'var(--text-primary)',
                      transition: 'all 0.3s ease',
                      border: '1px solid var(--border-color)'
                    }}>
                      <ShoppingBag size={24} style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }} />
                      <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>View Cart</span>
                      {cartItems.length > 0 && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--primary-color)' }}>({cartItems.length} items)</span>
                      )}
                    </Link>
                    
                    <button 
                      onClick={() => setActiveTab('wishlist')}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '1rem',
                        background: 'var(--bg-secondary)',
                        borderRadius: '12px',
                        border: '1px solid var(--border-color)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}>
                      <Heart size={24} style={{ color: '#ef4444', marginBottom: '0.5rem' }} />
                      <span style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-primary)' }}>Wishlist</span>
                      {wishlistItems.length > 0 && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--primary-color)' }}>({wishlistItems.length} items)</span>
                      )}
                    </button>
                    
                    <Link to="/products" style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '1rem',
                      background: 'var(--bg-secondary)',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      color: 'var(--text-primary)',
                      transition: 'all 0.3s ease',
                      border: '1px solid var(--border-color)'
                    }}>
                      <Search size={24} style={{ color: '#10b981', marginBottom: '0.5rem' }} />
                      <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Search</span>
                    </Link>
                    
                    <Link to="/contact" style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '1rem',
                      background: 'var(--bg-secondary)',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      color: 'var(--text-primary)',
                      transition: 'all 0.3s ease',
                      border: '1px solid var(--border-color)'
                    }}>
                      <MessageCircle size={24} style={{ color: '#8b5cf6', marginBottom: '0.5rem' }} />
                      <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Contact</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div style={{ maxWidth: '1000px' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '2rem' }}>My Wishlist ({wishlistItems.length})</h3>
                {wishlistItems.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                    <Heart size={64} style={{ color: 'var(--text-secondary)', margin: '0 auto 1rem auto' }} />
                    <h4 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Your wishlist is empty</h4>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.5' }}>
                      Save items you love to your wishlist and shop them later.
                    </p>
                    <Link
                      to="/products"
                      style={{
                        background: 'var(--primary-color)',
                        color: 'white',
                        padding: '0.75rem 2rem',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        display: 'inline-block'
                      }}
                    >
                      Discover Products
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {wishlistItems.map((product, index) => (
                      <div key={product._id} className={`hover-lift animate-stagger-${(index % 4) + 1}`} style={{
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        padding: '1rem',
                        background: 'var(--bg-secondary)',
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'center'
                      }}>
                        <img
                          src={product.images?.[0] || '/images/placeholder.jpg'}
                          alt={product.name}
                          style={{
                            width: '100px',
                            height: '100px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            flexShrink: 0
                          }}
                          onError={(e) => {
                            e.target.src = '/images/placeholder.jpg';
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1rem' }}>{product.name}</h4>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', lineHeight: '1.4' }}>{product.shortDescription}</p>
                          <span style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary-color)' }}>₹{product.price}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                          <button
                            onClick={() => {
                              removeFromWishlist(product._id);
                              showToast('Removed from wishlist', 'success');
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '0.5rem',
                              borderRadius: '8px',
                              color: '#ef4444'
                            }}
                          >
                            <Heart size={20} fill="currentColor" />
                          </button>
                          <button 
                            onClick={() => {
                              addToCart(product, 1);
                              removeFromWishlist(product._id);
                              showToast('Added to cart!', 'success');
                            }}
                            style={{
                              background: 'var(--primary-color)',
                              color: 'white',
                              padding: '0.5rem 1rem',
                              borderRadius: '8px',
                              border: 'none',
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}


          </div>
        </div>


        
        {/* Payment Modal */}
        {showPaymentModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}>
            <div style={{
              background: 'var(--bg-primary)',
              borderRadius: '16px',
              padding: '2rem',
              maxWidth: '400px',
              width: '90%',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Payment Options</h3>
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-secondary)' }}
                >
                  ×
                </button>
              </div>
              
              <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Amount to Pay</div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary-color)' }}>₹{paymentDue}</div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button
                  onClick={() => {
                    const qrCodeUrl = `upi://pay?pa=sangita.shreyas@paytm&pn=Sangita%20Thakur&am=${paymentDue}&cu=INR&tn=Payment%20for%20Stitch%20and%20Savour%20Orders`;
                    window.open(qrCodeUrl, '_blank');
                    showToast('Opening UPI payment...', 'success');
                    setShowPaymentModal(false);
                  }}
                  style={{
                    background: 'var(--primary-color)',
                    color: 'white',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: 'none',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  📱 Pay with UPI Apps
                </button>
                
                <button
                  onClick={() => {
                    const newWindow = window.open('', '_blank');
                    newWindow.document.write(`
                      <html>
                        <head><title>QR Code Payment</title></head>
                        <body style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:Arial;background:#f5f5f5">
                          <h2>Scan QR Code to Pay</h2>
                          <img src="/images/payment-qr-code.jpg" alt="Payment QR Code" style="border:1px solid #ddd;padding:20px;background:white;border-radius:10px;max-width:300px">
                          <p style="margin-top:20px;text-align:center;color:#666">Amount: ₹${paymentDue}<br>Scan with any UPI app</p>
                          <p style="text-align:center;color:#999;font-size:0.9rem">Pay to: Sangita Thakur</p>
                        </body>
                      </html>
                    `);
                    showToast('QR Code opened in new tab', 'success');
                    setShowPaymentModal(false);
                  }}
                  style={{
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  📷 Show QR Code
                </button>
              </div>
              
              <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                Secure payment via UPI • No additional charges
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default UserDashboard;