import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { exportOrdersToExcel } from '../utils/excelExport';
import { 
  Package, Users, TrendingUp, DollarSign, Download, Search, 
  Filter, Plus, Edit, Trash2, Calendar, BarChart3,
  PieChart, Activity, ShoppingCart, Star, Minus,
  FileText, Settings, AlertTriangle, CheckCircle, Clock,
  Truck, MapPin, Phone, Mail, ExternalLink, Save, Send
} from 'lucide-react';

const AdminDashboard = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('analytics');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ 
    name: '', 
    price: '', 
    category: 'food', 
    description: '', 
    image: '', 
    shortDescription: '',
    ingredients: '',
    allergens: '',
    yarnType: '',
    careInstructions: '',
    deliveryTime: '',
    stockStatus: 'available',
    weightOptions: '',
    customization: []
  });
  const [expenses, setExpenses] = useState({});
  const [loading, setLoading] = useState(false);
  const [showAddInventory, setShowAddInventory] = useState(false);
  const [newInventoryItem, setNewInventoryItem] = useState({ name: '', quantity: '', unit: '', minStock: '', cost: '' });
  const [inventory, setInventory] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, type: '', id: '', name: '' });
  const [editProduct, setEditProduct] = useState(null);
  
  const [dashboardData, setDashboardData] = useState({
    orders: [],
    products: [],
    reviews: [],
    customers: [],
    inventory: [],
    contacts: []
  });
  const [replyText, setReplyText] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    loadDashboardData();
    // Load inventory
    const savedInventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    setInventory(savedInventory);
  }, []);

  const loadDashboardData = async () => {
    // Load all orders from localStorage
    const allOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    const allReviews = JSON.parse(localStorage.getItem('productReviews') || '[]');
    const adminProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]');
    const deletedProducts = JSON.parse(localStorage.getItem('deletedProducts') || '[]');
    const savedExpenses = JSON.parse(localStorage.getItem('productExpenses') || '{}');
    
    // Sample products from ProductsPage
    const sampleProducts = [
      { id: 1, name: 'Boho Chic Granny Square Crochet Top', category: 'crochet', price: 1299 },
      { id: 2, name: 'Classic Striped V-Neck Crochet Vest', category: 'crochet', price: 1199 },
      { id: 3, name: 'Minimalist Pink Crochet Tank Top', category: 'crochet', price: 999 },
      { id: 4, name: 'Serene Blue & Pink Pooja Mat', category: 'crochet', price: 449 },
      { id: 5, name: 'Festive Multicolor Pooja Mat', category: 'crochet', price: 499 },
      { id: 6, name: 'Homestyle Poha Chivda', category: 'food', price: 25, pricePerKg: 480 },
      { id: 7, name: 'Sweet & Flaky Shakarpara', category: 'food', price: 25, pricePerKg: 480 },
      { id: 8, name: 'Crispy & Savory Namak Pare', category: 'food', price: 25, pricePerKg: 480 },
      { id: 9, name: 'Spicy Mixture Namkeen', category: 'food', price: 25, pricePerKg: 500 },
      { id: 10, name: 'Classic Salty Mathri', category: 'food', price: 25, pricePerKg: 480 },
      { id: 11, name: 'Baked Jeera Biscuits', category: 'food', price: 25, pricePerKg: 480 },
      { id: 12, name: 'Homemade Gujiya', category: 'food', price: 150, weightOptions: ['6 pieces', '12 pieces', '24 pieces'] }
    ];
    
    // Filter out deleted existing products and combine with admin products
    const availableSampleProducts = sampleProducts.filter(product => !deletedProducts.includes(product.id));
    const allProducts = [...availableSampleProducts, ...adminProducts];
    
    // Get unique customers
    const customers = [...new Map(allOrders.map(order => 
      [order.customerName, { 
        name: order.customerName, 
        phone: order.phone, 
        email: order.email || order.customerEmail || 'N/A',
        orders: allOrders.filter(o => o.customerName === order.customerName).length 
      }]
    )).values()];
    
    // Load contacts from API or localStorage fallback
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/contact/all`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      const contacts = data.success ? data.contacts : [];
      
      setDashboardData({ orders: allOrders, products: allProducts, reviews: allReviews, customers, contacts });
    } catch (error) {
      console.error('Error loading contacts:', error);
      // Fallback to localStorage
      const localContacts = JSON.parse(localStorage.getItem('contactMessages') || '[]');
      setDashboardData({ orders: allOrders, products: allProducts, reviews: allReviews, customers, contacts: localContacts });
    }
    
    setExpenses(savedExpenses);
  };



  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'orders', label: 'Orders', icon: <Package className="w-4 h-4" /> },
    { id: 'products', label: 'Products', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'inventory', label: 'Inventory', icon: <Activity className="w-4 h-4" /> },
    { id: 'customers', label: 'Customers', icon: <Users className="w-4 h-4" /> },
    { id: 'reviews', label: 'Reviews', icon: <Star className="w-4 h-4" /> },
    { id: 'contacts', label: 'Messages', icon: <Mail className="w-4 h-4" /> }
  ];

  const updateOrderStatus = (orderNumber, newStatus) => {
    const allOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    const updatedOrders = allOrders.map(order => 
      order.orderNumber === orderNumber ? { ...order, status: newStatus } : order
    );
    localStorage.setItem('userOrders', JSON.stringify(updatedOrders));
    loadDashboardData();
    showToast(`Order ${orderNumber} updated to ${newStatus}`, 'success');
  };

  const deleteOrder = (orderNumber) => {
    const allOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    const filteredOrders = allOrders.filter(order => order.orderNumber !== orderNumber);
    localStorage.setItem('userOrders', JSON.stringify(filteredOrders));
    loadDashboardData();
    showToast('Order deleted successfully', 'success');
    setDeleteConfirm({ show: false, type: '', id: '', name: '' });
  };

  const addProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.shortDescription) {
      showToast('Please fill all required fields (Name, Price, Short Description)', 'error');
      return;
    }
    
    const allProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]');
    
    // Calculate base price for minimum quantity
    let basePrice = parseFloat(newProduct.price);
    let pricePerKg = null;
    let weightOptions = null;
    
    if (newProduct.category === 'food') {
      const weights = newProduct.weightOptions ? newProduct.weightOptions.split(',').map(w => w.trim()) : ['100g Packet', '250g', '500g', '1kg'];
      weightOptions = weights;
      
      // Check if it's Gujiya (piece-based pricing)
      if (newProduct.name.toLowerCase().includes('gujiya')) {
        // For Gujiya, price is for 6 pieces (minimum quantity)
        basePrice = parseFloat(newProduct.price); // This should be for 6 pieces
        weightOptions = ['6 pieces', '12 pieces', '24 pieces'];
      } else {
        // For other food items, calculate pricePerKg based on minimum weight
        const minWeight = weights[0];
        let minWeightInKg;
        
        if (minWeight.includes('kg')) {
          minWeightInKg = parseFloat(minWeight.replace(/[^0-9.]/g, ''));
        } else {
          minWeightInKg = parseFloat(minWeight.replace(/[^0-9.]/g, '')) / 1000;
        }
        
        pricePerKg = basePrice / minWeightInKg;
        basePrice = Math.round(pricePerKg * 0.1); // 100g base price
      }
    }
    
    const product = {
      _id: Date.now().toString(),
      id: Date.now(),
      ...newProduct,
      price: basePrice,
      pricePerKg: pricePerKg,
      deliveryTime: parseInt(newProduct.deliveryTime) || (newProduct.category === 'crochet' ? 14 : 2),
      ingredients: newProduct.ingredients ? newProduct.ingredients.split(',').map(i => i.trim()) : undefined,
      allergens: newProduct.allergens ? newProduct.allergens.split(',').map(a => a.trim()) : undefined,
      weightOptions: weightOptions,
      images: [newProduct.image || `/images/products/${newProduct.category}-${newProduct.name.toLowerCase().replace(/\s+/g, '-')}-1.jpg`],
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      customization: newProduct.category === 'crochet' ? [
        {
          type: 'thread-type',
          label: 'Thread Type',
          options: ['Cotton Thread', 'Wool Thread'],
          priceModifier: { 'Wool Thread': 200 }
        },
        {
          type: 'color',
          label: 'Colors',
          options: ['As Pictured'],
          priceModifier: 0
        },
        {
          type: 'size',
          label: 'Size',
          options: ['Small (S)', 'Medium (M)', 'Large (L)', 'Custom Sizing (+₹200)'],
          priceModifier: { 'Custom Sizing (+₹200)': 200 }
        }
      ] : undefined
    };
    
    // Calculate raw material usage
    if (newProduct.category === 'food' && newProduct.ingredients) {
      const currentInventory = JSON.parse(localStorage.getItem('inventory') || '[]');
      const updatedInventory = currentInventory.map(item => {
        const ingredientMatch = product.ingredients?.find(ing => 
          ing.toLowerCase().includes(item.name.toLowerCase()) || 
          item.name.toLowerCase().includes(ing.toLowerCase())
        );
        if (ingredientMatch) {
          return { ...item, quantity: Math.max(0, item.quantity - 0.1) }; // Reduce by 100g per product
        }
        return item;
      });
      localStorage.setItem('inventory', JSON.stringify(updatedInventory));
      setInventory(updatedInventory);
    }
    
    allProducts.push(product);
    localStorage.setItem('adminProducts', JSON.stringify(allProducts));
    
    // Also add to main products list for user dashboard
    const mainProducts = JSON.parse(localStorage.getItem('products') || '[]');
    mainProducts.push(product);
    localStorage.setItem('products', JSON.stringify(mainProducts));
    
    setNewProduct({ 
      name: '', price: '', category: 'food', description: '', image: '', 
      shortDescription: '', ingredients: '', allergens: '', yarnType: '', 
      careInstructions: '', deliveryTime: '', stockStatus: 'available', 
      weightOptions: '', customization: [] 
    });
    setShowAddProduct(false);
    loadDashboardData();
    showToast('Product added successfully and is now available to customers!', 'success');
  };

  const addInventoryItem = () => {
    if (!newInventoryItem.name || !newInventoryItem.quantity) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    
    const newItem = {
      id: Date.now(),
      ...newInventoryItem,
      quantity: parseFloat(newInventoryItem.quantity),
      minStock: parseFloat(newInventoryItem.minStock) || 0,
      cost: parseFloat(newInventoryItem.cost) || 0,
      createdAt: new Date().toISOString()
    };
    
    const updatedInventory = [...inventory, newItem];
    setInventory(updatedInventory);
    localStorage.setItem('inventory', JSON.stringify(updatedInventory));
    
    setNewInventoryItem({ name: '', quantity: '', unit: '', minStock: '', cost: '' });
    setShowAddInventory(false);
    showToast('Inventory item added successfully', 'success');
  };

  const updateInventoryQuantity = (itemId, change) => {
    const updatedInventory = inventory.map(item => {
      if (item.id === itemId) {
        const newQuantity = Math.max(0, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setInventory(updatedInventory);
    localStorage.setItem('inventory', JSON.stringify(updatedInventory));
    showToast(`Inventory updated`, 'success');
  };

  const deleteProduct = (productId) => {
    // Check if it's an admin-added product or existing product
    const adminProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]');
    const isAdminProduct = adminProducts.some(p => p.id === productId);
    
    if (isAdminProduct) {
      // Remove admin-added product
      const filteredProducts = adminProducts.filter(product => product.id !== productId);
      localStorage.setItem('adminProducts', JSON.stringify(filteredProducts));
      
      // Also remove from main products list
      const mainProducts = JSON.parse(localStorage.getItem('products') || '[]');
      const filteredMainProducts = mainProducts.filter(product => product.id !== productId);
      localStorage.setItem('products', JSON.stringify(filteredMainProducts));
    } else {
      // For existing products, add to deleted list
      const deletedProducts = JSON.parse(localStorage.getItem('deletedProducts') || '[]');
      deletedProducts.push(productId);
      localStorage.setItem('deletedProducts', JSON.stringify(deletedProducts));
    }
    
    loadDashboardData();
    showToast('Product deleted successfully', 'success');
    setDeleteConfirm({ show: false, type: '', id: '', name: '' });
  };

  const deleteInventoryItem = (itemId) => {
    const updatedInventory = inventory.filter(item => item.id !== itemId);
    setInventory(updatedInventory);
    localStorage.setItem('inventory', JSON.stringify(updatedInventory));
    showToast('Inventory item deleted successfully', 'success');
    setDeleteConfirm({ show: false, type: '', id: '', name: '' });
  };

  const updateExpense = (productName, cost) => {
    const updatedExpenses = { ...expenses, [productName]: parseFloat(cost) || 0 };
    setExpenses(updatedExpenses);
    localStorage.setItem('productExpenses', JSON.stringify(updatedExpenses));
  };

  const updateProduct = () => {
    if (!editProduct.name || !editProduct.price || !editProduct.shortDescription) {
      showToast('Please fill all required fields (Name, Price, Short Description)', 'error');
      return;
    }
    
    const adminProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]');
    const updatedAdminProducts = adminProducts.map(p => 
      p.id === editProduct.id ? {
        ...editProduct,
        price: parseFloat(editProduct.price),
        deliveryTime: parseInt(editProduct.deliveryTime) || (editProduct.category === 'crochet' ? 14 : 2),
        ingredients: editProduct.ingredients ? editProduct.ingredients.split(',').map(i => i.trim()) : undefined,
        allergens: editProduct.allergens ? editProduct.allergens.split(',').map(a => a.trim()) : undefined,
        weightOptions: editProduct.category === 'food' ? 
          (editProduct.weightOptions ? editProduct.weightOptions.split(',').map(w => w.trim()) : ['100g Packet', '250g', '500g', '1kg']) : 
          undefined
      } : p
    );
    
    localStorage.setItem('adminProducts', JSON.stringify(updatedAdminProducts));
    
    // Also update main products list
    const mainProducts = JSON.parse(localStorage.getItem('products') || '[]');
    const updatedMainProducts = mainProducts.map(p => 
      p.id === editProduct.id ? updatedAdminProducts.find(ap => ap.id === editProduct.id) : p
    );
    localStorage.setItem('products', JSON.stringify(updatedMainProducts));
    
    setEditProduct(null);
    loadDashboardData();
    showToast('Product updated successfully!', 'success');
  };

  const getDeliveryDeadline = (orderDate, category) => {
    const date = new Date(orderDate);
    const days = category === 'crochet' ? 14 : 2;
    date.setDate(date.getDate() + days);
    return date;
  };

  const getStats = () => {
    const orders = dashboardData.orders;
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const todaysSales = orders.filter(order => 
      new Date(order.createdAt).toDateString() === new Date().toDateString()
    ).reduce((sum, order) => sum + order.total, 0);
    
    const totalInventoryInvestment = inventory.reduce((sum, item) => sum + (item.quantity * item.cost), 0);
    const netProfit = totalSales - totalInventoryInvestment;
    const lowStockItems = inventory.filter(item => item.minStock > 0 && item.quantity <= item.minStock).length;
    
    return {
      totalSales,
      todaysSales,
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status !== 'delivered').length,
      totalCustomers: dashboardData.customers?.length || 0,
      netProfit,
      lowStockItems
    };
  };

  const filteredOrders = dashboardData.orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || order.items?.[0]?.category === categoryFilter;
    const matchesPayment = paymentFilter === 'all' || 
                          (paymentFilter === 'paid' && order.paymentMethod === 'qr') ||
                          (paymentFilter === 'pending' && order.paymentMethod === 'cod');
    return matchesSearch && matchesStatus && matchesCategory && matchesPayment;
  });

  const stats = getStats();





  return (
    <div style={{ padding: '2rem 0', minHeight: '100vh' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', borderRadius: '20px', padding: '2rem', color: 'white' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
              Admin Dashboard
            </h1>
            <p style={{ fontSize: '1.1rem', opacity: '0.9', color: 'white' }}>
              Manage your Stitch & Savour business - Welcome back, Sangita! 👋
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
              <div style={{ 
                background: 'rgba(255,255,255,0.25)', 
                padding: '1.5rem', 
                borderRadius: '16px', 
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255,255,255,0.3)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'white', marginBottom: '0.5rem' }}>₹{stats.todaysSales}</div>
                <div style={{ fontSize: '1rem', color: 'white', fontWeight: '600', opacity: '0.9' }}>Today's Sales</div>
              </div>
              <div style={{ 
                background: 'rgba(255,255,255,0.25)', 
                padding: '1.5rem', 
                borderRadius: '16px', 
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255,255,255,0.3)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'white', marginBottom: '0.5rem' }}>{stats.pendingOrders}</div>
                <div style={{ fontSize: '1rem', color: 'white', fontWeight: '600', opacity: '0.9' }}>Pending Orders</div>
              </div>
              <div style={{ 
                background: 'rgba(255,255,255,0.25)', 
                padding: '1.5rem', 
                borderRadius: '16px', 
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255,255,255,0.3)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {stats.lowStockItems > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '-50%',
                    right: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
                    animation: 'shimmer 2s infinite'
                  }} />
                )}
                <div style={{ 
                  fontSize: '2rem', 
                  fontWeight: '800', 
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.5rem',
                  position: 'relative',
                  zIndex: 2
                }}>
                  {stats.lowStockItems > 0 && <AlertTriangle size={24} style={{ color: '#ef4444' }} />}
                  {stats.lowStockItems}
                </div>
                <div style={{ 
                  fontSize: '1rem', 
                  color: 'white', 
                  fontWeight: '700',
                  position: 'relative',
                  zIndex: 2
                }}>Low Stock Items</div>
                {stats.lowStockItems > 0 && (
                  <div style={{ 
                    fontSize: '0.8rem', 
                    marginTop: '0.5rem', 
                    color: '#ef4444', 
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    position: 'relative',
                    zIndex: 2
                  }}>
                    ⚠️ Needs Attention!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.75rem', background: 'var(--primary-color)', borderRadius: '12px' }}>
                <DollarSign size={24} color="white" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '2rem', fontWeight: '800' }}>₹{stats.totalSales}</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Total Sales</p>
              </div>
            </div>
            <div style={{ color: 'var(--success)', fontSize: '0.9rem' }}>
              +12% from last month
            </div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.75rem', background: 'var(--success)', borderRadius: '12px' }}>
                <Package size={24} color="white" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '2rem', fontWeight: '800' }}>{stats.totalOrders}</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Total Orders</p>
              </div>
            </div>
            <div style={{ color: 'var(--success)', fontSize: '0.9rem' }}>
              +8% from last month
            </div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.75rem', background: 'var(--warning)', borderRadius: '12px' }}>
                <Users size={24} color="white" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '2rem', fontWeight: '800' }}>{stats.totalCustomers}</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Customers</p>
              </div>
            </div>
            <div style={{ color: 'var(--success)', fontSize: '0.9rem' }}>
              +15% from last month
            </div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.75rem', background: stats.netProfit >= 0 ? 'var(--success)' : 'var(--error)', borderRadius: '12px' }}>
                <TrendingUp size={24} color="white" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '2rem', fontWeight: '800', color: stats.netProfit >= 0 ? 'var(--success)' : 'var(--error)' }}>₹{Math.round(stats.netProfit)}</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Net Profit</p>
              </div>
            </div>
            <div style={{ color: stats.netProfit >= 0 ? 'var(--success)' : 'var(--error)', fontSize: '0.9rem' }}>
              {stats.netProfit >= 0 ? 'Profitable' : 'Loss - Reduce inventory costs'}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
          <div style={{ borderBottom: '1px solid var(--border-color)' }}>
            <nav style={{ display: 'flex', padding: '0 1.5rem', overflowX: 'auto' }}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '1rem 1.5rem',
                    background: 'none',
                    border: 'none',
                    borderBottom: activeTab === tab.id ? '2px solid var(--primary-color)' : '2px solid transparent',
                    color: activeTab === tab.id ? 'var(--primary-color)' : 'var(--text-secondary)',
                    fontWeight: activeTab === tab.id ? '600' : '400',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div style={{ padding: '2rem' }}>
            {activeTab === 'analytics' && (
              <div>
                <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BarChart3 className="w-5 h-5" />
                  Business Analytics
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                  <div style={{ background: 'var(--bg-tertiary)', padding: '2rem', borderRadius: '16px' }}>
                    <h4 style={{ marginBottom: '1rem' }}>Sales Growth</h4>
                    <div style={{ height: '200px', background: 'var(--bg-primary)', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <TrendingUp className="w-12 h-12" style={{ color: 'var(--success)' }} />
                      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--success)' }}>₹{stats.totalSales}</div>
                        <div style={{ color: 'var(--text-secondary)' }}>Total Revenue</div>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ background: 'var(--bg-tertiary)', padding: '2rem', borderRadius: '16px' }}>
                    <h4 style={{ marginBottom: '1rem' }}>Investment vs Output</h4>
                    <div style={{ height: '200px', background: 'var(--bg-primary)', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <PieChart className="w-12 h-12" style={{ color: 'var(--primary-color)' }} />
                      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                        <div>Investment: ₹{inventory.reduce((sum, item) => sum + (item.quantity * item.cost), 0).toFixed(2)}</div>
                        <div>Output: ₹{stats.totalSales}</div>
                        <div style={{ color: 'var(--success)', fontWeight: '600', fontSize: '1.2rem' }}>
                          Profit Margin: {(() => {
                            const totalInvestment = inventory.reduce((sum, item) => sum + (item.quantity * item.cost), 0);
                            return stats.totalSales > 0 
                              ? Math.round(((stats.totalSales - totalInvestment) / stats.totalSales) * 100)
                              : 0;
                          })()}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div style={{ background: 'var(--bg-tertiary)', padding: '2rem', borderRadius: '16px', marginBottom: '2rem' }}>
                  <h4 style={{ marginBottom: '1rem' }}>Order Heat Map (Last 28 Days)</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
                    {Array.from({ length: 28 }, (_, i) => {
                      const date = new Date();
                      date.setDate(date.getDate() - (27 - i));
                      const dayOrders = dashboardData.orders.filter(order => 
                        new Date(order.createdAt).toDateString() === date.toDateString()
                      ).length;
                      const intensity = Math.min(dayOrders / 3, 1); // Max 3 orders for full intensity
                      
                      return (
                        <div key={i} style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '4px',
                          background: dayOrders > 0 ? 'var(--primary-color)' : 'var(--bg-primary)',
                          opacity: dayOrders > 0 ? Math.max(intensity, 0.3) : 0.1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8rem',
                          color: dayOrders > 0 ? 'white' : 'var(--text-secondary)',
                          border: '1px solid var(--border-color)',
                          title: `${date.toLocaleDateString()}: ${dayOrders} orders`
                        }}>
                          {dayOrders}
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                    Hover over squares to see date and order count
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'recent' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <h3>Recent Orders</h3>
                  <button onClick={() => exportOrdersToExcel(dashboardData.orders)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Download size={16} />
                    Export to Excel
                  </button>
                </div>
                
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>Order ID</th>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>Customer</th>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>Amount</th>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.orders.map((order) => (
                        <tr key={order._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                          <td style={{ padding: '1rem' }}>{order.orderNumber}</td>
                          <td style={{ padding: '1rem' }}>{order.user?.name}</td>
                          <td style={{ padding: '1rem' }}>₹{order.total}</td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{
                              padding: '0.25rem 0.75rem',
                              borderRadius: '12px',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              background: order.status === 'delivered' ? 'var(--success-light)' : 
                                         order.status === 'in-progress' ? 'var(--warning-light)' : 'var(--info-light)',
                              color: order.status === 'delivered' ? 'var(--success)' : 
                                     order.status === 'in-progress' ? 'var(--warning)' : 'var(--info)'
                            }}>
                              {order.status.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ padding: '1rem' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td style={{ padding: '1rem' }}>
                            <button className="btn btn-sm btn-outline">View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Package className="w-5 h-5" />
                    Order Management ({filteredOrders.length} of {dashboardData.orders.length})
                  </h3>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative' }}>
                      <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                      <input
                        type="text"
                        placeholder="Search by customer or order ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                          padding: '0.5rem 0.5rem 0.5rem 2.5rem',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          width: '250px'
                        }}
                      />
                    </div>
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      style={{ padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="received">Order Received</option>
                      <option value="in-progress">In Progress</option>
                      <option value="out-for-delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                    </select>
                    <select 
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      style={{ padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                    >
                      <option value="all">All Categories</option>
                      <option value="food">Food</option>
                      <option value="crochet">Crochet</option>
                    </select>
                    <select 
                      value={paymentFilter}
                      onChange={(e) => setPaymentFilter(e.target.value)}
                      style={{ padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                    >
                      <option value="all">All Payments</option>
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                    </select>
                    <button onClick={() => exportOrdersToExcel(dashboardData.orders)} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Download size={16} />
                      Export
                    </button>
                  </div>
                </div>
                
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--bg-primary)', borderRadius: '12px', overflow: 'hidden' }}>
                    <thead style={{ background: 'var(--bg-tertiary)' }}>
                      <tr>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>Order ID</th>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>Customer</th>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>Amount</th>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>Payment</th>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>Delivery</th>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>Deadline</th>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr key={order._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                          <td style={{ padding: '1rem', fontWeight: '600' }}>{order.orderNumber}</td>
                          <td style={{ padding: '1rem' }}>{order.customerName}</td>
                          <td style={{ padding: '1rem', fontWeight: '600' }}>₹{order.total}</td>
                          <td style={{ padding: '1rem' }}>
                            <select 
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.orderNumber, e.target.value)}
                              style={{
                                padding: '0.25rem 0.5rem',
                                borderRadius: '6px',
                                border: '1px solid var(--border-color)',
                                fontSize: '0.8rem',
                                background: order.status === 'delivered' ? 'var(--success-light)' : 
                                           order.status === 'in-progress' ? 'var(--warning-light)' : 'var(--info-light)'
                              }}
                            >
                              <option value="pending">Pending</option>
                              <option value="received">Order Received</option>
                              <option value="in-progress">In Progress</option>
                              <option value="out-for-delivery">Out for Delivery</option>
                              <option value="delivered">Delivered</option>
                            </select>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{
                              padding: '0.25rem 0.5rem',
                              borderRadius: '12px',
                              fontSize: '0.7rem',
                              fontWeight: '600',
                              background: order.paymentMethod === 'qr' ? 'var(--success-light)' : 'var(--warning-light)',
                              color: order.paymentMethod === 'qr' ? 'var(--success)' : 'var(--warning)'
                            }}>
                              {order.paymentMethod === 'qr' ? 'PAID' : 'COD'}
                            </span>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {order.deliveryOption === 'pickup' ? (
                                  <>
                                    <MapPin className="w-4 h-4" style={{ color: 'var(--primary-color)' }} />
                                    <span style={{
                                      padding: '0.3rem 0.6rem',
                                      borderRadius: '12px',
                                      fontSize: '0.7rem',
                                      fontWeight: '700',
                                      background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
                                      color: 'white',
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.5px',
                                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}>
                                      🏪 PICKUP
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <Truck className="w-4 h-4" style={{ color: 'var(--accent-color)' }} />
                                    <span style={{
                                      padding: '0.3rem 0.6rem',
                                      borderRadius: '12px',
                                      fontSize: '0.7rem',
                                      fontWeight: '700',
                                      background: 'linear-gradient(135deg, var(--accent-color), var(--accent-dark))',
                                      color: 'white',
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.5px',
                                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}>
                                      🚚 DELIVERY
                                    </span>
                                  </>
                                )}
                              </div>
                              {order.deliveryOption === 'pickup' ? (
                                <div style={{ 
                                  fontSize: '0.65rem', 
                                  color: 'var(--primary-color)',
                                  fontWeight: '600',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem'
                                }}>
                                  💰 FREE • ⚡ Faster
                                </div>
                              ) : (
                                <div style={{ 
                                  fontSize: '0.65rem', 
                                  color: 'var(--accent-color)',
                                  fontWeight: '600',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem'
                                }}>
                                  💰 ₹25 • 📍 1km radius
                                </div>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <Calendar className="w-4 h-4" />
                              {getDeliveryDeadline(order.createdAt, order.items?.[0]?.category || 'food').toLocaleDateString()}
                            </div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button 
                                onClick={() => setDeleteConfirm({ show: true, type: 'order', id: order.orderNumber, name: order.orderNumber })}
                                className="btn btn-sm"
                                style={{ padding: '0.25rem 0.5rem', background: 'var(--error)', color: 'white' }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShoppingCart className="w-5 h-5" />
                    Product Management ({dashboardData.products.length})
                  </h3>
                  <button 
                    onClick={() => setShowAddProduct(true)}
                    className="btn btn-primary" 
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <Plus size={16} />
                    Add New Product
                  </button>
                </div>
                
                {editProduct && (
                  <div style={{ background: 'var(--bg-tertiary)', padding: '2rem', borderRadius: '16px', marginBottom: '2rem' }}>
                    <h4 style={{ marginBottom: '1.5rem' }}>Edit Product</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Product Name *</label>
                        <input
                          type="text"
                          value={editProduct.name}
                          onChange={(e) => setEditProduct({...editProduct, name: e.target.value})}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                          placeholder="Enter product name"
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Price *</label>
                        <input
                          type="number"
                          value={editProduct.price}
                          onChange={(e) => setEditProduct({...editProduct, price: e.target.value})}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                          placeholder="Enter price"
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Category *</label>
                        <select
                          value={editProduct.category}
                          onChange={(e) => setEditProduct({...editProduct, category: e.target.value})}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                        >
                          <option value="food">Food</option>
                          <option value="crochet">Crochet</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Stock Status</label>
                        <select
                          value={editProduct.stockStatus}
                          onChange={(e) => setEditProduct({...editProduct, stockStatus: e.target.value})}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                        >
                          <option value="available">Available</option>
                          <option value="made-to-order">Made to Order</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Delivery Time (days)</label>
                        <input
                          type="number"
                          value={editProduct.deliveryTime}
                          onChange={(e) => setEditProduct({...editProduct, deliveryTime: e.target.value})}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                          placeholder={editProduct.category === 'crochet' ? '14' : '2'}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Product Image</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                setEditProduct({...editProduct, image: event.target.result});
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                        />
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Short Description *</label>
                      <textarea
                        value={editProduct.shortDescription || ''}
                        onChange={(e) => setEditProduct({...editProduct, shortDescription: e.target.value})}
                        rows={2}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                        placeholder="Brief description for product cards"
                      />
                    </div>
                    
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Detailed Description</label>
                      <textarea
                        value={editProduct.description || ''}
                        onChange={(e) => setEditProduct({...editProduct, description: e.target.value})}
                        rows={3}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                        placeholder="Detailed product description for product page"
                      />
                    </div>
                    
                    {editProduct.category === 'food' && (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                          <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Ingredients (comma separated)</label>
                            <textarea
                              value={Array.isArray(editProduct.ingredients) ? editProduct.ingredients.join(', ') : (editProduct.ingredients || '')}
                              onChange={(e) => setEditProduct({...editProduct, ingredients: e.target.value})}
                              rows={2}
                              style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                              placeholder="Maida, Ghee, Sugar, Cardamom"
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Allergens (comma separated)</label>
                            <textarea
                              value={Array.isArray(editProduct.allergens) ? editProduct.allergens.join(', ') : (editProduct.allergens || '')}
                              onChange={(e) => setEditProduct({...editProduct, allergens: e.target.value})}
                              rows={2}
                              style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                              placeholder="Gluten, Dairy, Nuts"
                            />
                          </div>
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Weight Options (comma separated)</label>
                          <input
                            type="text"
                            value={Array.isArray(editProduct.weightOptions) ? editProduct.weightOptions.join(', ') : (editProduct.weightOptions || '')}
                            onChange={(e) => setEditProduct({...editProduct, weightOptions: e.target.value})}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                            placeholder="100g Packet, 250g, 500g, 1kg"
                          />
                        </div>
                      </>
                    )}
                    
                    {editProduct.category === 'crochet' && (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                          <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Yarn Type</label>
                            <input
                              type="text"
                              value={editProduct.yarnType || ''}
                              onChange={(e) => setEditProduct({...editProduct, yarnType: e.target.value})}
                              style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                              placeholder="100% Cotton, Acrylic Blend"
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Care Instructions</label>
                            <input
                              type="text"
                              value={editProduct.careInstructions || ''}
                              onChange={(e) => setEditProduct({...editProduct, careInstructions: e.target.value})}
                              style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                              placeholder="Hand wash in cold water"
                            />
                          </div>
                        </div>
                      </>
                    )}
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button onClick={updateProduct} className="btn btn-primary">
                        <Save size={16} style={{ marginRight: '0.5rem' }} />
                        Update Product
                      </button>
                      <button 
                        onClick={() => setEditProduct(null)}
                        className="btn btn-outline"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                
                {showAddProduct && (
                  <div style={{ background: 'var(--bg-tertiary)', padding: '2rem', borderRadius: '16px', marginBottom: '2rem' }}>
                    <h4 style={{ marginBottom: '1.5rem' }}>Add New Product</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Product Name *</label>
                        <input
                          type="text"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                          placeholder="Enter product name"
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Price *</label>
                        <input
                          type="number"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                          placeholder="Enter price"
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Category *</label>
                        <select
                          value={newProduct.category}
                          onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                        >
                          <option value="food">Food</option>
                          <option value="crochet">Crochet</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Stock Status</label>
                        <select
                          value={newProduct.stockStatus}
                          onChange={(e) => setNewProduct({...newProduct, stockStatus: e.target.value})}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                        >
                          <option value="available">Available</option>
                          <option value="made-to-order">Made to Order</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Delivery Time (days)</label>
                        <input
                          type="number"
                          value={newProduct.deliveryTime}
                          onChange={(e) => setNewProduct({...newProduct, deliveryTime: e.target.value})}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                          placeholder={newProduct.category === 'crochet' ? '14' : '2'}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Product Image</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                setNewProduct({...newProduct, image: event.target.result});
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                        />
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Short Description *</label>
                      <textarea
                        value={newProduct.shortDescription}
                        onChange={(e) => setNewProduct({...newProduct, shortDescription: e.target.value})}
                        rows={2}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                        placeholder="Brief description for product cards"
                      />
                    </div>
                    
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Detailed Description</label>
                      <textarea
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                        rows={3}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                        placeholder="Detailed product description for product page"
                      />
                    </div>
                    
                    {newProduct.category === 'food' && (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                          <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Ingredients (comma separated)</label>
                            <textarea
                              value={newProduct.ingredients}
                              onChange={(e) => setNewProduct({...newProduct, ingredients: e.target.value})}
                              rows={2}
                              style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                              placeholder="Maida, Ghee, Sugar, Cardamom"
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Allergens (comma separated)</label>
                            <textarea
                              value={newProduct.allergens}
                              onChange={(e) => setNewProduct({...newProduct, allergens: e.target.value})}
                              rows={2}
                              style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                              placeholder="Gluten, Dairy, Nuts"
                            />
                          </div>
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Weight Options (comma separated)</label>
                          <input
                            type="text"
                            value={newProduct.weightOptions}
                            onChange={(e) => setNewProduct({...newProduct, weightOptions: e.target.value})}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                            placeholder="100g Packet, 250g, 500g, 1kg"
                          />
                        </div>
                      </>
                    )}
                    
                    {newProduct.category === 'crochet' && (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                          <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Yarn Type</label>
                            <input
                              type="text"
                              value={newProduct.yarnType}
                              onChange={(e) => setNewProduct({...newProduct, yarnType: e.target.value})}
                              style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                              placeholder="100% Cotton, Acrylic Blend"
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Care Instructions</label>
                            <input
                              type="text"
                              value={newProduct.careInstructions}
                              onChange={(e) => setNewProduct({...newProduct, careInstructions: e.target.value})}
                              style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                              placeholder="Hand wash in cold water"
                            />
                          </div>
                        </div>
                      </>
                    )}
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button onClick={addProduct} className="btn btn-primary">
                        <Save size={16} style={{ marginRight: '0.5rem' }} />
                        Save Product
                      </button>
                      <button 
                        onClick={() => setShowAddProduct(false)}
                        className="btn btn-outline"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                  <div style={{ background: 'var(--bg-tertiary)', padding: '2rem', borderRadius: '16px' }}>
                    <h4 style={{ marginBottom: '1rem' }}>Food Products</h4>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent-color)' }}>
                      {dashboardData.products.filter(p => p.category === 'food').length}
                    </div>
                    <p style={{ color: 'var(--text-secondary)' }}>Active food items</p>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                      Admin: {dashboardData.products.filter(p => p.category === 'food' && JSON.parse(localStorage.getItem('adminProducts') || '[]').some(ap => ap.id === p.id)).length} | 
                      Existing: {dashboardData.products.filter(p => p.category === 'food' && !JSON.parse(localStorage.getItem('adminProducts') || '[]').some(ap => ap.id === p.id)).length}
                    </div>
                  </div>
                  
                  <div style={{ background: 'var(--bg-tertiary)', padding: '2rem', borderRadius: '16px' }}>
                    <h4 style={{ marginBottom: '1rem' }}>Crochet Products</h4>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary-color)' }}>
                      {dashboardData.products.filter(p => p.category === 'crochet').length}
                    </div>
                    <p style={{ color: 'var(--text-secondary)' }}>Active crochet items</p>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                      Admin: {dashboardData.products.filter(p => p.category === 'crochet' && JSON.parse(localStorage.getItem('adminProducts') || '[]').some(ap => ap.id === p.id)).length} | 
                      Existing: {dashboardData.products.filter(p => p.category === 'crochet' && !JSON.parse(localStorage.getItem('adminProducts') || '[]').some(ap => ap.id === p.id)).length}
                    </div>
                  </div>
                </div>
                
                {dashboardData.products.length > 0 && (
                  <div style={{ marginTop: '2rem' }}>
                    <h4 style={{ marginBottom: '1rem' }}>All Products ({dashboardData.products.length})</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                      {dashboardData.products.map(product => {
                        const adminProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]');
                        const isAdminProduct = adminProducts.some(p => p.id === product.id);
                        
                        return (
                          <div key={product.id} style={{ 
                            background: 'var(--bg-primary)', 
                            padding: '1rem', 
                            borderRadius: '8px', 
                            border: '1px solid var(--border-color)',
                            position: 'relative'
                          }}>
                            {!isAdminProduct && (
                              <div style={{
                                position: 'absolute',
                                top: '0.5rem',
                                left: '0.5rem',
                                background: 'var(--primary-color)',
                                color: 'white',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '12px',
                                fontSize: '0.7rem',
                                fontWeight: '600'
                              }}>
                                EXISTING
                              </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem', marginTop: !isAdminProduct ? '1.5rem' : '0' }}>
                              <div style={{ flex: 1 }}>
                                <h5 style={{ margin: '0 0 0.5rem 0' }}>{product.name}</h5>
                                <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'capitalize' }}>{product.category}</p>
                                <p style={{ margin: '0', fontWeight: '600', color: 'var(--primary-color)' }}>₹{product.price}</p>
                              </div>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setDeleteConfirm({ show: true, type: 'product', id: product.id, name: product.name });
                                  }}
                                  className="btn btn-sm"
                                  style={{ padding: '0.25rem 0.5rem', background: 'var(--error)', color: 'white', cursor: 'pointer' }}
                                  title={isAdminProduct ? 'Delete admin product' : 'Remove existing product from catalog'}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                            {product.description && (
                              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{product.description}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'inventory' && (
              <div>
                <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Activity className="w-5 h-5" />
                  Inventory Management
                </h3>
                
                <div style={{ background: 'var(--bg-tertiary)', padding: '2rem', borderRadius: '16px', marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ margin: 0 }}>Inventory Management</h4>
                    <button 
                      onClick={() => setShowAddInventory(true)}
                      className="btn btn-primary" 
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      <Plus size={16} />
                      Add Inventory Item
                    </button>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Track your raw materials and stock levels here. Add inventory items as needed.</p>
                  
                  {showAddInventory && (
                    <div style={{ background: 'var(--bg-primary)', padding: '1.5rem', borderRadius: '12px', marginBottom: '1rem' }}>
                      <h5 style={{ marginBottom: '1rem' }}>Add New Inventory Item</h5>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Item Name *</label>
                          <input
                            type="text"
                            value={newInventoryItem.name}
                            onChange={(e) => setNewInventoryItem({...newInventoryItem, name: e.target.value})}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                            placeholder="e.g., Maida, Crochet Thread"
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Quantity *</label>
                          <input
                            type="number"
                            value={newInventoryItem.quantity}
                            onChange={(e) => setNewInventoryItem({...newInventoryItem, quantity: e.target.value})}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                            placeholder="Enter quantity"
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Unit</label>
                          <input
                            type="text"
                            value={newInventoryItem.unit}
                            onChange={(e) => setNewInventoryItem({...newInventoryItem, unit: e.target.value})}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                            placeholder="kg, pieces, meters"
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Min Stock Alert</label>
                          <input
                            type="number"
                            value={newInventoryItem.minStock}
                            onChange={(e) => setNewInventoryItem({...newInventoryItem, minStock: e.target.value})}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                            placeholder="Minimum stock level"
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Cost per Unit (₹)</label>
                          <input
                            type="number"
                            value={newInventoryItem.cost}
                            onChange={(e) => setNewInventoryItem({...newInventoryItem, cost: e.target.value})}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                            placeholder="Cost per unit"
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={addInventoryItem} className="btn btn-primary btn-sm">
                          <Save size={16} style={{ marginRight: '0.5rem' }} />
                          Add Item
                        </button>
                        <button 
                          onClick={() => setShowAddInventory(false)}
                          className="btn btn-outline btn-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {inventory.length > 0 && (
                    <div>
                      <h5 style={{ marginBottom: '1rem' }}>Current Inventory</h5>
                      <div style={{ display: 'grid', gap: '1rem' }}>
                        {inventory.map(item => (
                          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                            <div>
                              <strong>{item.name}</strong>
                              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                Stock: {item.quantity} {item.unit}
                                {item.cost > 0 && (
                                  <div>Cost: ₹{item.cost}/{item.unit} | Total: ₹{(item.quantity * item.cost).toFixed(2)}</div>
                                )}
                                {item.minStock > 0 && (
                                  <span style={{ marginLeft: '1rem', color: item.quantity <= item.minStock ? 'var(--error)' : 'var(--text-secondary)' }}>
                                    Min: {item.minStock} {item.unit}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <button
                                  onClick={() => updateInventoryQuantity(item.id, -1)}
                                  style={{
                                    width: '32px',
                                    height: '32px',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '6px',
                                    background: 'var(--bg-secondary)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  -
                                </button>
                                <span style={{ minWidth: '40px', textAlign: 'center', fontWeight: '600' }}>
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateInventoryQuantity(item.id, 1)}
                                  style={{
                                    width: '32px',
                                    height: '32px',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '6px',
                                    background: 'var(--bg-secondary)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  +
                                </button>
                              </div>
                              <button
                                onClick={() => setDeleteConfirm({ show: true, type: 'inventory', id: item.id, name: item.name })}
                                style={{
                                  padding: '0.25rem 0.5rem',
                                  background: 'var(--error)',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  fontSize: '0.8rem'
                                }}
                              >
                                <Trash2 size={14} />
                              </button>
                              {item.quantity <= item.minStock && item.minStock > 0 && (
                                <div style={{ color: 'var(--error)', fontSize: '0.8rem', fontWeight: '600' }}>
                                  <AlertTriangle size={16} style={{ marginRight: '0.25rem' }} />
                                  Low Stock
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                

                
                <div style={{ background: 'var(--bg-tertiary)', padding: '2rem', borderRadius: '16px' }}>
                  <h4 style={{ marginBottom: '1rem' }}>Investment Summary</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--success)' }}>₹{stats.totalSales}</div>
                      <div style={{ color: 'var(--text-secondary)' }}>Total Revenue</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--error)' }}>₹{inventory.reduce((sum, item) => sum + (item.quantity * item.cost), 0).toFixed(2)}</div>
                      <div style={{ color: 'var(--text-secondary)' }}>Inventory Investment</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary-color)' }}>₹{(stats.totalSales - inventory.reduce((sum, item) => sum + (item.quantity * item.cost), 0)).toFixed(2)}</div>
                      <div style={{ color: 'var(--text-secondary)' }}>Net Profit</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'customers' && (
              <div>
                <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users className="w-5 h-5" />
                  Customer Insights ({dashboardData.customers.length})
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                  <div style={{ background: 'var(--bg-tertiary)', padding: '2rem', borderRadius: '16px' }}>
                    <h4 style={{ marginBottom: '1rem' }}>Repeat Customers</h4>
                    <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--primary-color)' }}>
                      {dashboardData.customers.filter(c => c.orders > 1).length}
                    </div>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      {dashboardData.customers.length > 0 
                        ? Math.round((dashboardData.customers.filter(c => c.orders > 1).length / dashboardData.customers.length) * 100)
                        : 0
                      }% of total customers
                    </p>
                  </div>
                  
                  <div style={{ background: 'var(--bg-tertiary)', padding: '2rem', borderRadius: '16px' }}>
                    <h4 style={{ marginBottom: '1rem' }}>Most Popular Product</h4>
                    {(() => {
                      const productCounts = {};
                      dashboardData.orders.forEach(order => {
                        order.items?.forEach(item => {
                          productCounts[item.name] = (productCounts[item.name] || 0) + item.quantity;
                        });
                      });
                      const mostPopular = Object.entries(productCounts).sort((a, b) => b[1] - a[1])[0];
                      return mostPopular ? (
                        <>
                          <div style={{ fontWeight: '700', fontSize: '1.2rem', marginBottom: '0.5rem' }}>{mostPopular[0]}</div>
                          <p style={{ color: 'var(--text-secondary)' }}>{mostPopular[1]} orders</p>
                        </>
                      ) : (
                        <p style={{ color: 'var(--text-secondary)' }}>No orders yet</p>
                      );
                    })()}
                  </div>
                  
                  <div style={{ background: 'var(--bg-tertiary)', padding: '2rem', borderRadius: '16px' }}>
                    <h4 style={{ marginBottom: '1rem' }}>Product Type Preference</h4>
                    {(() => {
                      const crochetOrders = dashboardData.orders.filter(o => o.items?.[0]?.category === 'crochet').length;
                      const foodOrders = dashboardData.orders.filter(o => o.items?.[0]?.category === 'food').length;
                      const total = crochetOrders + foodOrders;
                      const crochetPercentage = total > 0 ? Math.round((crochetOrders / total) * 100) : 0;
                      const foodPercentage = total > 0 ? Math.round((foodOrders / total) * 100) : 0;
                      
                      return (
                        <>
                          <div style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                              <span>Crochet Items</span>
                              <span>{crochetPercentage}%</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: 'var(--bg-primary)', borderRadius: '4px' }}>
                              <div style={{ width: `${crochetPercentage}%`, height: '100%', background: 'var(--primary-color)', borderRadius: '4px' }}></div>
                            </div>
                          </div>
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                              <span>Food Items</span>
                              <span>{foodPercentage}%</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: 'var(--bg-primary)', borderRadius: '4px' }}>
                              <div style={{ width: `${foodPercentage}%`, height: '100%', background: 'var(--accent-color)', borderRadius: '4px' }}></div>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
                
                {dashboardData.customers.length > 0 && (
                  <div style={{ background: 'var(--bg-tertiary)', padding: '2rem', borderRadius: '16px' }}>
                    <h4 style={{ marginBottom: '1.5rem' }}>Customer List</h4>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                      {dashboardData.customers.map((customer, index) => (
                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                          <div>
                            <strong>{customer.name}</strong>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{customer.phone}</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: '600', color: 'var(--primary-color)' }}>{customer.orders} orders</div>
                            <div style={{ fontSize: '0.8rem', color: customer.orders > 1 ? 'var(--success)' : 'var(--text-secondary)' }}>
                              {customer.orders > 1 ? 'Repeat Customer' : 'New Customer'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Star className="w-5 h-5" />
                  Reviews & Ratings ({dashboardData.reviews.length})
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                  <div style={{ background: 'var(--bg-tertiary)', padding: '2rem', borderRadius: '16px' }}>
                    <h4>Average Rating</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1rem 0' }}>
                      <div style={{ fontSize: '3rem', fontWeight: '800' }}>
                        {dashboardData.reviews.length > 0 
                          ? (dashboardData.reviews.reduce((sum, r) => sum + r.rating, 0) / dashboardData.reviews.length).toFixed(1)
                          : '0.0'
                        }
                      </div>
                      <div>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          {[1,2,3,4,5].map(i => {
                            const avgRating = dashboardData.reviews.length > 0 
                              ? dashboardData.reviews.reduce((sum, r) => sum + r.rating, 0) / dashboardData.reviews.length
                              : 0;
                            return <Star key={i} className="w-5 h-5" style={{ fill: i <= avgRating ? 'gold' : 'none', color: 'gold' }} />;
                          })}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Based on {dashboardData.reviews.length} reviews</div>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ background: 'var(--bg-tertiary)', padding: '2rem', borderRadius: '16px' }}>
                    <h4>Review Distribution</h4>
                    <div style={{ marginTop: '1rem' }}>
                      {[5,4,3,2,1].map(rating => {
                        const count = dashboardData.reviews.filter(r => r.rating === rating).length;
                        const percentage = dashboardData.reviews.length > 0 ? (count / dashboardData.reviews.length) * 100 : 0;
                        return (
                          <div key={rating} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                            <span style={{ minWidth: '20px' }}>{rating}★</span>
                            <div style={{ flex: 1, height: '8px', background: 'var(--bg-primary)', borderRadius: '4px' }}>
                              <div style={{ width: `${percentage}%`, height: '100%', background: 'gold', borderRadius: '4px' }}></div>
                            </div>
                            <span style={{ minWidth: '30px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                {dashboardData.reviews.length > 0 && (
                  <div style={{ background: 'var(--bg-tertiary)', padding: '2rem', borderRadius: '16px' }}>
                    <h4 style={{ marginBottom: '1.5rem' }}>All Reviews</h4>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                      {dashboardData.reviews.map(review => (
                        <div key={review.id} style={{ padding: '1rem', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                            <div>
                              <strong>{review.customerName}</strong>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{review.productName}</div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Order #{review.orderNumber}</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <div style={{ display: 'flex' }}>
                                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4" style={{ fill: i <= review.rating ? 'gold' : 'none', color: 'gold' }} />)}
                              </div>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                {new Date(review.date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', margin: 0 }}>"{review.review}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'contacts' && (
              <div>
                <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail className="w-5 h-5" />
                  Customer Messages ({dashboardData.contacts.length})
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                  <div style={{ background: 'var(--bg-tertiary)', padding: '2rem', borderRadius: '16px' }}>
                    <h4>Pending Messages</h4>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--warning)' }}>
                      {dashboardData.contacts.filter(c => c.status === 'pending').length}
                    </div>
                    <p style={{ color: 'var(--text-secondary)' }}>Need response</p>
                  </div>
                  
                  <div style={{ background: 'var(--bg-tertiary)', padding: '2rem', borderRadius: '16px' }}>
                    <h4>Replied Messages</h4>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--success)' }}>
                      {dashboardData.contacts.filter(c => c.status === 'replied').length}
                    </div>
                    <p style={{ color: 'var(--text-secondary)' }}>Completed</p>
                  </div>
                </div>
                
                {dashboardData.contacts.length > 0 && (
                  <div style={{ background: 'var(--bg-tertiary)', padding: '2rem', borderRadius: '16px' }}>
                    <h4 style={{ marginBottom: '1.5rem' }}>All Messages</h4>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                      {dashboardData.contacts.map(contact => (
                        <div key={contact._id} style={{ 
                          padding: '1.5rem', 
                          background: 'var(--bg-primary)', 
                          borderRadius: '12px', 
                          border: `1px solid ${contact.status === 'pending' ? 'var(--warning)' : 'var(--border-color)'}`,
                          borderLeft: `4px solid ${contact.status === 'pending' ? 'var(--warning)' : 'var(--success)'}`
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                <strong>{contact.name}</strong>
                                <span style={{
                                  padding: '0.25rem 0.75rem',
                                  borderRadius: '12px',
                                  fontSize: '0.7rem',
                                  fontWeight: '600',
                                  background: contact.status === 'pending' ? 'var(--warning-light)' : 'var(--success-light)',
                                  color: contact.status === 'pending' ? 'var(--warning)' : 'var(--success)'
                                }}>
                                  {contact.status.toUpperCase()}
                                </span>
                              </div>
                              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                                {contact.email} • {contact.phone}
                              </div>
                              <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--primary-color)' }}>
                                Subject: {contact.subject === 'others' ? contact.customSubject : contact.subject.replace('-', ' ')}
                              </div>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              {new Date(contact.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          
                          <div style={{ marginBottom: '1rem' }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>Message:</div>
                            <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.5' }}>{contact.message}</p>
                          </div>
                          
                          {contact.adminReply && (
                            <div style={{
                              background: 'var(--success-light)',
                              padding: '1rem',
                              borderRadius: '8px',
                              marginBottom: '1rem',
                              borderLeft: '3px solid var(--success)'
                            }}>
                              <div style={{ fontSize: '0.8rem', color: 'var(--success)', marginBottom: '0.5rem' }}>Your Reply:</div>
                              <p style={{ margin: 0, fontSize: '0.9rem' }}>{contact.adminReply}</p>
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                Replied on {new Date(contact.repliedAt).toLocaleDateString()}
                              </div>
                            </div>
                          )}
                          
                          {contact.status === 'pending' && (
                            <div>
                              <textarea
                                value={selectedContact === contact._id ? replyText : ''}
                                onChange={(e) => {
                                  setSelectedContact(contact._id);
                                  setReplyText(e.target.value);
                                }}
                                placeholder="Type your reply here..."
                                rows={3}
                                style={{
                                  width: '100%',
                                  padding: '0.75rem',
                                  border: '1px solid var(--border-color)',
                                  borderRadius: '8px',
                                  marginBottom: '0.5rem',
                                  resize: 'vertical'
                                }}
                              />
                              <button
                                onClick={async () => {
                                  if (!replyText.trim()) {
                                    showToast('Please enter a reply', 'error');
                                    return;
                                  }
                                  
                                  try {
                                    const response = await fetch(`${process.env.REACT_APP_API_URL}/contact/reply/${contact._id}`, {
                                      method: 'PUT',
                                      headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                                      },
                                      body: JSON.stringify({ reply: replyText })
                                    });
                                    
                                    const data = await response.json();
                                    if (data.success) {
                                      showToast('Reply sent successfully!', 'success');
                                      setReplyText('');
                                      setSelectedContact(null);
                                      loadDashboardData();
                                    } else {
                                      showToast('Failed to send reply', 'error');
                                    }
                                  } catch (error) {
                                    console.error('Reply error:', error);
                                    // Fallback: Update localStorage
                                    try {
                                      const localContacts = JSON.parse(localStorage.getItem('contactMessages') || '[]');
                                      const updatedContacts = localContacts.map(msg => 
                                        msg.id === contact._id || msg.id === contact.id ? 
                                        { ...msg, adminReply: replyText, status: 'replied', repliedAt: new Date().toISOString() } : 
                                        msg
                                      );
                                      localStorage.setItem('contactMessages', JSON.stringify(updatedContacts));
                                      showToast('Reply saved successfully!', 'success');
                                      setReplyText('');
                                      setSelectedContact(null);
                                      loadDashboardData();
                                    } catch (fallbackError) {
                                      showToast('Failed to send reply', 'error');
                                    }
                                  }
                                }}
                                className="btn btn-primary btn-sm"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                              >
                                <Send size={14} />
                                Send Reply
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Delete Confirmation Modal */}
        {deleteConfirm.show && (
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
            zIndex: 1000
          }}>
            <div style={{
              background: 'var(--bg-primary)',
              padding: '2rem',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--error)' }}>Are you sure?</h3>
              <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                Do you want to delete {deleteConfirm.type} "{deleteConfirm.name}"? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button 
                  onClick={() => setDeleteConfirm({ show: false, type: '', id: '', name: '' })}
                  className="btn btn-outline"
                  style={{ minWidth: '100px' }}
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    if (deleteConfirm.type === 'order') {
                      deleteOrder(deleteConfirm.id);
                    } else if (deleteConfirm.type === 'product') {
                      deleteProduct(deleteConfirm.id);
                    } else if (deleteConfirm.type === 'inventory') {
                      deleteInventoryItem(deleteConfirm.id);
                    }
                  }}
                  className="btn"
                  style={{ background: 'var(--error)', color: 'white', minWidth: '100px' }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;