import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { generateInvoicePDF } from '../utils/pdfGenerator';
import orderService from '../services/orderService';
import reviewService from '../services/reviewService';
import { config } from '../config/config';
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
  Download,
  Settings,
  MapPin,
  Phone,
  Mail,
  Edit3,
  Plus,
  Inbox,
  RotateCw,
  CheckSquare
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
  const [profileData, setProfileData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    gender: '',
    dateOfBirth: '',
    city: ''
  });
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: 'home',
    address: '',
    city: '',
    pincode: '',
    landmark: ''
  });

  useEffect(() => {
    fetchUserData();
    loadProfileData();
    
    // Add scroll listener for dashboard tabs
    const tabsContainer = document.querySelector('.dashboard-tabs');
    if (tabsContainer) {
      const handleScroll = () => {
        const container = document.querySelector('.dashboard-tabs-container');
        if (container) {
          container.classList.add('scrolled');
        }
      };
      tabsContainer.addEventListener('scroll', handleScroll, { once: true });
      
      return () => {
        tabsContainer.removeEventListener('scroll', handleScroll);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProfileData = () => {
    const savedProfile = localStorage.getItem(`userProfile_${user?.email}`);
    const savedAddresses = localStorage.getItem(`userAddresses_${user?.email}`);
    
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setProfileData({
        ...profile,
        phone: profile.phone || user?.phone || '',
        email: profile.email || user?.email || '',
        fullName: profile.fullName || user?.name || ''
      });
    } else {
      setProfileData({
        fullName: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        gender: '',
        dateOfBirth: '',
        city: ''
      });
    }
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    }
  };

  const saveProfileData = () => {
    localStorage.setItem(`userProfile_${user?.email}`, JSON.stringify(profileData));
    showToast('Profile updated successfully!', 'success');
  };

  const addAddress = () => {
    if (newAddress.address && newAddress.city && newAddress.pincode) {
      const updatedAddresses = [...addresses, { ...newAddress, id: Date.now() }];
      setAddresses(updatedAddresses);
      localStorage.setItem(`userAddresses_${user?.email}`, JSON.stringify(updatedAddresses));
      setNewAddress({ type: 'home', address: '', city: '', pincode: '', landmark: '' });
      setShowAddressForm(false);
      showToast('Address added successfully!', 'success');
    } else {
      showToast('Please fill all required fields', 'error');
    }
  };

  const removeAddress = (id) => {
    const updatedAddresses = addresses.filter(addr => addr.id !== id);
    setAddresses(updatedAddresses);
    localStorage.setItem(`userAddresses_${user?.email}`, JSON.stringify(updatedAddresses));
    showToast('Address removed successfully!', 'success');
  };

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
      // Database-first approach: Try API first, fallback to localStorage only if API fails
      let userOrders = [];
      
      try {
        // Database-only approach
        const response = await fetch(`${config.API_URL}/orders`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        
        if (data.success) {
          userOrders = data.orders;
          console.log('👤 User orders from database:', userOrders.length);
        } else {
          console.error('Failed to load orders from database');
          userOrders = [];
        }
      } catch (apiError) {
        console.error('Database connection failed:', apiError);
        userOrders = [];
      }
      
      const formattedOrders = userOrders.map(order => ({
        _id: order.orderId || order._id || order.orderNumber,
        orderNumber: order.orderNumber || order.orderId,
        total: order.total || order.totalAmount,
        status: order.status || 'pending',
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt,
        estimatedDelivery: order.estimatedDelivery,
        items: order.items || [],
        customerPhone: order.customerPhone || user?.phone
      }));
      
      setOrders(formattedOrders);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#6b7280';
      case 'received': return '#3b82f6';
      case 'in-progress': return '#f59e0b';
      case 'out-for-delivery': return '#f97316';
      case 'delivered': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusProgress = (status) => {
    switch (status) {
      case 'pending': return 0;
      case 'received': return 25;
      case 'in-progress': return 50;
      case 'out-for-delivery': return 75;
      case 'delivered': return 100;
      case 'cancelled': return 0;
      default: return 0;
    }
  };

  const getStatusSteps = () => [
    { key: 'pending', label: 'Pending', icon: Clock },
    { key: 'received', label: 'Received', icon: Inbox },
    { key: 'in-progress', label: 'In Progress', icon: RotateCw },
    { key: 'out-for-delivery', label: 'Out for Delivery', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckSquare }
  ];

  const isStepCompleted = (currentStatus, stepKey) => {
    const statusOrder = ['pending', 'received', 'in-progress', 'out-for-delivery', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepKey);
    return currentIndex >= stepIndex;
  };

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
        <div className="animate-scale-in dashboard-tabs-container" style={{
          background: 'var(--bg-secondary)',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          marginBottom: '2rem',
          overflow: 'hidden',
          animationDelay: '0.4s'
        }}>
          <nav className="dashboard-tabs" style={{
            display: 'flex',
            background: 'var(--bg-tertiary)',
            padding: '0.5rem',
            gap: '0.25rem',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="dashboard-tab"
                style={{
                  flex: window.innerWidth > 768 ? 1 : 'none',
                  minWidth: window.innerWidth <= 768 ? '120px' : 'auto',
                  padding: window.innerWidth <= 768 ? '0.6rem 0.8rem' : '0.75rem 1rem',
                  borderRadius: '12px',
                  background: activeTab === tab.id ? 'var(--bg-secondary)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontSize: window.innerWidth <= 768 ? '0.75rem' : '0.85rem',
                  fontWeight: '600',
                  color: activeTab === tab.id ? 'var(--primary-color)' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease',
                  boxShadow: activeTab === tab.id ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.icon}
                <span style={{ display: window.innerWidth > 480 ? 'block' : 'none' }}>{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Tab Content */}
          <div style={{ padding: '1.5rem' }}>
            {activeTab === 'overview' && (
              <div style={{ maxWidth: '1000px' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '2rem' }}>Recent Orders</h3>
                
                {orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'var(--bg-tertiary)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛍️</div>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '1rem' }}>No orders yet!</h4>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.5' }}>
                      Start shopping to see your orders here.
                    </p>
                    <button 
                      onClick={() => navigate('/products')}
                      style={{
                        background: 'var(--primary-color)',
                        color: 'white',
                        padding: '1rem 2rem',
                        borderRadius: '12px',
                        border: 'none',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {orders.slice(0, 3).map((order) => (
                      <div key={order._id || order.orderNumber} style={{
                        border: '1px solid var(--border-color)',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        background: 'var(--bg-secondary)'
                      }}>
                        <div style={{ 
                          background: 'linear-gradient(135deg, var(--primary-color)10, var(--secondary-color)10)',
                          padding: '1.25rem',
                          borderRadius: '12px',
                          border: '1px solid var(--border-color)',
                          marginBottom: '1.5rem'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                <div style={{
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  background: getStatusColor(order.status)
                                }} />
                                <h4 style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '1.2rem', margin: 0 }}>Order #{order.orderNumber}</h4>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Clock size={14} style={{ color: 'var(--text-secondary)' }} />
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
                                  {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                                    weekday: 'long', 
                                    day: 'numeric',
                                    month: 'long', 
                                    year: 'numeric'
                                  })} at {new Date(order.createdAt).toLocaleTimeString('en-IN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true
                                  })}
                                </p>
                              </div>
                            </div>
                            <span style={{
                              padding: '0.6rem 1.2rem',
                              borderRadius: '25px',
                              fontSize: '0.8rem',
                              fontWeight: '700',
                              background: getStatusColor(order.status),
                              color: 'white',
                              textTransform: 'capitalize',
                              whiteSpace: 'nowrap',
                              boxShadow: `0 2px 8px ${getStatusColor(order.status)}40`
                            }}>
                              {order.status.replace('-', ' ')}
                            </span>
                          </div>
                        </div>
                        
                        {/* Order Items */}
                        <div style={{ marginBottom: '1.5rem' }}>
                          <div style={{ 
                            background: 'var(--bg-tertiary)', 
                            padding: '1rem', 
                            borderRadius: '12px',
                            border: '1px solid var(--border-color)'
                          }}>
                            {order.items?.slice(0, 2).map((item, idx) => (
                              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: idx < Math.min(order.items.length, 2) - 1 ? '0.75rem' : '0' }}>
                                <img
                                  src={(() => {
                                    const name = item.name.toLowerCase();
                                    if (name.includes('boho')) return '/images/crochet-boho-top.jpg';
                                    if (name.includes('pink') && name.includes('tank')) return '/images/crochet-pink-tank.jpg';
                                    if (name.includes('striped') && name.includes('vest')) return '/images/crochet-striped-vest.jpg';
                                    if (name.includes('pooja') && name.includes('blue')) return '/images/crochet-pooja-mat-blue.jpg';
                                    if (name.includes('pooja') && name.includes('multicolor')) return '/images/crochet-pooja-mat-multicolor.jpg';
                                    if (name.includes('gujiya')) return '/images/food-gujiya.jpg';
                                    if (name.includes('jeera')) return '/images/food-jeera-biscuits.webp';
                                    if (name.includes('mathri')) return '/images/food-mathri.jpg';
                                    if (name.includes('mixture')) return '/images/food-mixture.jpg';
                                    if (name.includes('namak')) return '/images/food-namak-pare.jpg';
                                    if (name.includes('poha')) return '/images/food-poha-chivda.jpg';
                                    if (name.includes('shakarpara')) return '/images/food-shakarpara.jpg';
                                    return '/images/placeholder.jpg';
                                  })()} 
                                  alt={item.name}
                                  style={{
                                    width: '48px',
                                    height: '48px',
                                    objectFit: 'cover',
                                    borderRadius: '10px',
                                    border: '2px solid var(--primary-color)',
                                    boxShadow: '0 3px 8px rgba(0,0,0,0.15)',
                                    flexShrink: 0
                                  }}
                                />
                                <div style={{
                                  width: '48px',
                                  height: '48px',
                                  borderRadius: '10px',
                                  background: 'var(--bg-tertiary)',
                                  border: '2px solid var(--border-color)',
                                  display: 'none',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.7rem',
                                  color: 'var(--text-secondary)',
                                  flexShrink: 0
                                }}>
                                  No Image
                                </div>
                                <div style={{ flex: 1 }}>
                                  <h5 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)', margin: '0 0 0.25rem 0' }}>
                                    {item.name}
                                  </h5>
                                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                                    Quantity: {item.quantity} | ₹{item.finalPrice || item.price}
                                  </p>
                                </div>
                              </div>
                            ))}
                            {order.items?.length > 2 && (
                              <div style={{ 
                                marginTop: '0.75rem', 
                                paddingTop: '0.75rem', 
                                borderTop: '1px solid var(--border-color)',
                                textAlign: 'center'
                              }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                  +{order.items.length - 2} more item{order.items.length - 2 > 1 ? 's' : ''}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Professional Progress Tracker */}
                        <div style={{ 
                          background: 'var(--bg-primary)', 
                          padding: '1rem', 
                          borderRadius: '12px', 
                          border: '1px solid var(--border-color)',
                          marginBottom: '1rem'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                            {/* Progress Line */}
                            <div style={{
                              position: 'absolute',
                              top: '16px',
                              left: '16px',
                              right: '16px',
                              height: '2px',
                              background: 'var(--border-color)',
                              borderRadius: '1px',
                              zIndex: 1
                            }}>
                              <div style={{
                                width: `${getStatusProgress(order.status)}%`,
                                height: '100%',
                                background: 'var(--primary-color)',
                                borderRadius: '1px',
                                transition: 'width 0.8s ease'
                              }} />
                            </div>
                            
                            {getStatusSteps().map((step, index) => {
                              const isCompleted = isStepCompleted(order.status, step.key);
                              const isCurrent = order.status === step.key;
                              const IconComponent = step.icon;
                              
                              return (
                                <div key={step.key} style={{ 
                                  display: 'flex', 
                                  flexDirection: 'column', 
                                  alignItems: 'center', 
                                  flex: 1, 
                                  position: 'relative', 
                                  zIndex: 2 
                                }}>
                                  <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: isCompleted ? 'var(--primary-color)' : 'var(--bg-secondary)',
                                    border: `2px solid ${isCompleted ? 'var(--primary-color)' : 'var(--border-color)'}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: isCompleted ? 'white' : 'var(--text-secondary)',
                                    marginBottom: '0.5rem',
                                    transform: isCurrent ? 'scale(1.1)' : 'scale(1)',
                                    transition: 'all 0.3s ease',
                                    boxShadow: isCurrent ? '0 0 0 4px rgba(217, 70, 239, 0.2)' : 'none'
                                  }}>
                                    {isCompleted ? <CheckCircle size={16} /> : <IconComponent size={16} />}
                                  </div>
                                  <span style={{
                                    fontSize: '0.7rem',
                                    color: isCompleted ? 'var(--primary-color)' : 'var(--text-secondary)',
                                    fontWeight: isCompleted ? '600' : '500',
                                    textAlign: 'center',
                                    lineHeight: '1.2',
                                    maxWidth: '60px'
                                  }}>
                                    {step.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary-color)' }}>
                            Total: ₹{order.total}
                          </span>
                          <button
                            onClick={() => setActiveTab('orders')}
                            style={{
                              padding: '0.5rem 1rem',
                              background: 'var(--primary-color)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {orders.length > 3 && (
                      <button
                        onClick={() => setActiveTab('orders')}
                        style={{
                          padding: '1rem',
                          background: 'var(--bg-tertiary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '12px',
                          color: 'var(--primary-color)',
                          fontWeight: '600',
                          cursor: 'pointer',
                          textAlign: 'center'
                        }}
                      >
                        View All {orders.length} Orders →
                      </button>
                    )}
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
                
                {filteredOrders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                    <Package size={64} style={{ color: 'var(--text-secondary)', margin: '0 auto 1rem auto' }} />
                    <h4 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No orders found</h4>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                      {searchTerm || statusFilter !== 'all' ? 'No orders match your filters.' : 'You haven\'t placed any orders yet.'}
                    </p>
                    <button
                      onClick={() => navigate('/products')}
                      style={{
                        background: 'var(--primary-color)',
                        color: 'white',
                        padding: '0.75rem 2rem',
                        borderRadius: '12px',
                        border: 'none',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Browse Products
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {filteredOrders.map((order) => (
                      <div key={order._id || order.orderNumber} style={{
                        border: '1px solid var(--border-color)',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        background: 'var(--bg-secondary)'
                      }}>
                        <div style={{ 
                          background: 'linear-gradient(135deg, var(--primary-color)10, var(--secondary-color)10)',
                          padding: '1.25rem',
                          borderRadius: '12px',
                          border: '1px solid var(--border-color)',
                          marginBottom: '1.5rem'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                <div style={{
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  background: getStatusColor(order.status)
                                }} />
                                <h4 style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '1.2rem', margin: 0 }}>Order #{order.orderNumber}</h4>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Clock size={14} style={{ color: 'var(--text-secondary)' }} />
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
                                  {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                                    weekday: 'long', 
                                    day: 'numeric',
                                    month: 'long', 
                                    year: 'numeric'
                                  })} at {new Date(order.createdAt).toLocaleTimeString('en-IN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true
                                  })}
                                </p>
                              </div>
                            </div>
                            <span style={{
                              padding: '0.6rem 1.2rem',
                              borderRadius: '25px',
                              fontSize: '0.8rem',
                              fontWeight: '700',
                              background: getStatusColor(order.status),
                              color: 'white',
                              textTransform: 'capitalize',
                              whiteSpace: 'nowrap',
                              boxShadow: `0 2px 8px ${getStatusColor(order.status)}40`
                            }}>
                              {order.status.replace('-', ' ')}
                            </span>
                          </div>
                        </div>
                        
                        {/* Order Items with Product Images */}
                        <div style={{ marginBottom: '1.5rem' }}>
                          {order.items?.map((item, idx) => (
                            <div key={idx} style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '1rem', 
                              marginBottom: '1rem', 
                              padding: '1rem', 
                              background: 'var(--bg-tertiary)', 
                              borderRadius: '12px',
                              border: '1px solid var(--border-color)'
                            }}>
                              <img
                                src={(() => {
                                  const name = item.name.toLowerCase();
                                  if (name.includes('boho')) return '/images/crochet-boho-top.jpg';
                                  if (name.includes('pink') && name.includes('tank')) return '/images/crochet-pink-tank.jpg';
                                  if (name.includes('striped') && name.includes('vest')) return '/images/crochet-striped-vest.jpg';
                                  if (name.includes('pooja') && name.includes('blue')) return '/images/crochet-pooja-mat-blue.jpg';
                                  if (name.includes('pooja') && name.includes('multicolor')) return '/images/crochet-pooja-mat-multicolor.jpg';
                                  if (name.includes('gujiya')) return '/images/food-gujiya.jpg';
                                  if (name.includes('jeera')) return '/images/food-jeera-biscuits.webp';
                                  if (name.includes('mathri')) return '/images/food-mathri.jpg';
                                  if (name.includes('mixture')) return '/images/food-mixture.jpg';
                                  if (name.includes('namak')) return '/images/food-namak-pare.jpg';
                                  if (name.includes('poha')) return '/images/food-poha-chivda.jpg';
                                  if (name.includes('shakarpara')) return '/images/food-shakarpara.jpg';
                                  return '/images/placeholder.jpg';
                                })()} 
                                alt={item.name}
                                style={{
                                  width: '60px',
                                  height: '60px',
                                  objectFit: 'cover',
                                  borderRadius: '12px',
                                  border: '2px solid var(--primary-color)',
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                  flexShrink: 0
                                }}
                              />
                              <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '12px',
                                background: 'var(--bg-tertiary)',
                                border: '2px solid var(--border-color)',
                                display: 'none',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.8rem',
                                color: 'var(--text-secondary)',
                                flexShrink: 0
                              }}>
                                No Image
                              </div>
                              <div style={{ flex: 1 }}>
                                <h5 style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem', fontSize: '1rem' }}>{item.name}</h5>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                                  Quantity: {item.quantity} | Price: ₹{item.finalPrice || item.price}
                                </p>
                                <p style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--primary-color)' }}>
                                  Subtotal: ₹{(item.finalPrice || item.price) * item.quantity}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Professional Order Tracking */}
                        <div style={{ 
                          marginBottom: '1.5rem', 
                          background: 'var(--bg-primary)', 
                          padding: '1.5rem', 
                          borderRadius: '16px', 
                          border: '1px solid var(--border-color)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                        }}>
                          <h4 style={{ 
                            fontSize: '1rem', 
                            fontWeight: '600', 
                            color: 'var(--text-primary)', 
                            marginBottom: '1.5rem',
                            textAlign: 'center'
                          }}>
                            Order Tracking
                          </h4>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                            {/* Progress Line */}
                            <div style={{
                              position: 'absolute',
                              top: '20px',
                              left: '20px',
                              right: '20px',
                              height: '2px',
                              background: 'var(--border-color)',
                              borderRadius: '1px',
                              zIndex: 1
                            }}>
                              <div style={{
                                width: `${getStatusProgress(order.status)}%`,
                                height: '100%',
                                background: 'linear-gradient(90deg, var(--primary-color), #ec4899)',
                                borderRadius: '1px',
                                transition: 'width 1s ease',
                                boxShadow: '0 0 8px rgba(217, 70, 239, 0.3)'
                              }} />
                            </div>
                            
                            {getStatusSteps().map((step, index) => {
                              const isCompleted = isStepCompleted(order.status, step.key);
                              const isCurrent = order.status === step.key;
                              const IconComponent = step.icon;
                              
                              return (
                                <div key={step.key} style={{ 
                                  display: 'flex', 
                                  flexDirection: 'column', 
                                  alignItems: 'center', 
                                  flex: 1, 
                                  position: 'relative', 
                                  zIndex: 2 
                                }}>
                                  <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: isCompleted ? 'var(--primary-color)' : 'var(--bg-secondary)',
                                    border: `3px solid ${isCompleted ? 'var(--primary-color)' : 'var(--border-color)'}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: isCompleted ? 'white' : 'var(--text-secondary)',
                                    marginBottom: '0.75rem',
                                    transform: isCurrent ? 'scale(1.1)' : 'scale(1)',
                                    transition: 'all 0.3s ease',
                                    boxShadow: isCurrent ? '0 0 0 6px rgba(217, 70, 239, 0.15)' : isCompleted ? '0 4px 12px rgba(217, 70, 239, 0.2)' : 'none'
                                  }}>
                                    {isCompleted ? <CheckCircle size={18} /> : <IconComponent size={18} />}
                                  </div>
                                  <span style={{
                                    fontSize: '0.75rem',
                                    color: isCompleted ? 'var(--primary-color)' : 'var(--text-secondary)',
                                    fontWeight: isCompleted ? '600' : '500',
                                    textAlign: 'center',
                                    lineHeight: '1.2',
                                    maxWidth: '70px'
                                  }}>
                                    {step.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                          <span style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary-color)' }}>
                            Total: ₹{order.total}
                          </span>
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
                              borderRadius: '12px',
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <Download size={16} />
                            Download Invoice
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile-removed' && (
              <div style={{ maxWidth: '600px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '2rem',
                  padding: '1rem',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)'
                }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>Profile Settings</h3>
                  <Settings size={24} style={{ color: 'var(--primary-color)' }} />
                </div>

                {/* Personal Information */}
                <div style={{
                  background: 'var(--bg-secondary)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  marginBottom: '2rem',
                  border: '1px solid var(--border-color)'
                }}>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <User size={20} style={{ color: 'var(--primary-color)' }} />
                    Personal Information
                  </h4>
                  
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Full Name</label>
                      <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          background: 'var(--bg-primary)',
                          color: 'var(--text-primary)',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Email Address</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          background: 'var(--bg-primary)',
                          color: 'var(--text-primary)',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Phone Number</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          background: 'var(--bg-primary)',
                          color: 'var(--text-primary)',
                          fontSize: '0.9rem'
                        }}
                        placeholder={user?.phone || 'Enter phone number'}
                      />
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Gender</label>
                        <select
                          value={profileData.gender}
                          onChange={(e) => setProfileData({...profileData, gender: e.target.value})}
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
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      <div>
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Date of Birth</label>
                        <input
                          type="date"
                          value={profileData.dateOfBirth}
                          onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            background: 'var(--bg-primary)',
                            color: 'var(--text-primary)',
                            fontSize: '0.9rem'
                          }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>City</label>
                      <input
                        type="text"
                        value={profileData.city}
                        onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                        placeholder="Enter your city"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          background: 'var(--bg-primary)',
                          color: 'var(--text-primary)',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Saved Addresses */}
                <div style={{
                  background: 'var(--bg-secondary)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  marginBottom: '2rem',
                  border: '1px solid var(--border-color)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapPin size={20} style={{ color: 'var(--primary-color)' }} />
                      Saved Addresses
                    </h4>
                    <button
                      onClick={() => setShowAddressForm(!showAddressForm)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        background: 'var(--primary-color)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      <Plus size={16} />
                      Add new address
                    </button>
                  </div>
                  
                  {showAddressForm && (
                    <div style={{
                      background: 'var(--bg-tertiary)',
                      padding: '1rem',
                      borderRadius: '8px',
                      marginBottom: '1rem',
                      border: '1px solid var(--border-color)'
                    }}>
                      <div style={{ display: 'grid', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Address Type</label>
                          <select
                            value={newAddress.type}
                            onChange={(e) => setNewAddress({...newAddress, type: e.target.value})}
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
                            <option value="home">Home</option>
                            <option value="work">Work</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        
                        <div>
                          <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Full Address</label>
                          <textarea
                            value={newAddress.address}
                            onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                            rows={3}
                            style={{
                              width: '100%',
                              padding: '0.75rem',
                              border: '1px solid var(--border-color)',
                              borderRadius: '8px',
                              background: 'var(--bg-primary)',
                              color: 'var(--text-primary)',
                              fontSize: '0.9rem',
                              resize: 'vertical'
                            }}
                          />
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div>
                            <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>City</label>
                            <input
                              type="text"
                              value={newAddress.city}
                              onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                              style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                background: 'var(--bg-primary)',
                                color: 'var(--text-primary)',
                                fontSize: '0.9rem'
                              }}
                            />
                          </div>
                          
                          <div>
                            <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Pincode</label>
                            <input
                              type="text"
                              value={newAddress.pincode}
                              onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
                              style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                background: 'var(--bg-primary)',
                                color: 'var(--text-primary)',
                                fontSize: '0.9rem'
                              }}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Landmark (Optional)</label>
                          <input
                            type="text"
                            value={newAddress.landmark}
                            onChange={(e) => setNewAddress({...newAddress, landmark: e.target.value})}
                            style={{
                              width: '100%',
                              padding: '0.75rem',
                              border: '1px solid var(--border-color)',
                              borderRadius: '8px',
                              background: 'var(--bg-primary)',
                              color: 'var(--text-primary)',
                              fontSize: '0.9rem'
                            }}
                          />
                        </div>
                        
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => setShowAddressForm(false)}
                            style={{
                              padding: '0.75rem 1.5rem',
                              background: 'var(--text-secondary)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '0.9rem',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={addAddress}
                            style={{
                              padding: '0.75rem 1.5rem',
                              background: 'var(--primary-color)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '0.9rem',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            Save Address
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {addresses.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                      <MapPin size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
                      <p>No saved addresses yet</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {addresses.map((address) => (
                        <div key={address.id} style={{
                          padding: '1rem',
                          background: 'var(--bg-tertiary)',
                          borderRadius: '8px',
                          border: '1px solid var(--border-color)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start'
                        }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                              <span style={{
                                padding: '0.25rem 0.75rem',
                                background: 'var(--primary-color)',
                                color: 'white',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                textTransform: 'uppercase'
                              }}>
                                {address.type}
                              </span>
                            </div>
                            <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', lineHeight: '1.4' }}>{address.address}</p>
                            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                              {address.city} - {address.pincode}
                              {address.landmark && ` • ${address.landmark}`}
                            </p>
                          </div>
                          <button
                            onClick={() => removeAddress(address.id)}
                            style={{
                              padding: '0.5rem',
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                              marginLeft: '1rem'
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Save Button */}
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button
                    onClick={saveProfileData}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '1rem 2rem',
                      background: 'var(--primary-color)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Edit3 size={18} />
                    Save Changes
                  </button>
                </div>
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
                          {item.name} - Order #{order.orderNumber} ({new Date(order.createdAt).toLocaleDateString('en-IN')})
                        </option>
                      )) || []
                    )}
                  </select>
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
                          productId: productName, // Backend expects productId/product field
                          productName,
                          orderNumber,
                          rating,
                          review: reviewText.trim(),
                          comment: reviewText.trim(), // Backend expects comment field
                          customerName: user?.name || 'Anonymous',
                          customerEmail: user?.email || ''
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
      </div>
      
      <style jsx>{`
        .dashboard-tabs::-webkit-scrollbar {
          display: none;
        }
        .dashboard-tabs {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        @media (max-width: 768px) {
          .dashboard-tabs-container {
            margin: 0 -1rem 2rem -1rem !important;
            border-radius: 0 !important;
            border-left: none !important;
            border-right: none !important;
          }
          
          .dashboard-tabs {
            padding: 0.5rem 1rem !important;
          }
          
          .dashboard-tab {
            font-size: 0.7rem !important;
            padding: 0.5rem 0.6rem !important;
            min-width: 100px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;