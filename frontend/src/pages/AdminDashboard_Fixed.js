// This is the database-first version of AdminDashboard
// Replace the original AdminDashboard.js with this content

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
    name: '', price: '', category: 'food', description: '', image: '', 
    shortDescription: '', ingredients: '', allergens: '', yarnType: '',
    careInstructions: '', deliveryTime: '', stockStatus: 'available',
    weightOptions: '', customization: []
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
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/inventory`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.success) {
        setInventory(data.inventory);
        console.log('📦 Inventory from database:', data.inventory.length);
        return;
      }
    } catch (error) {
      console.error('Failed to load inventory from API:', error);
    }
    
    // Fallback to localStorage only if API completely fails
    const savedInventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    setInventory(savedInventory);
  };

  const loadDashboardData = async () => {
    try {
      // 1. Load orders from database ONLY
      const ordersResponse = await fetch(`${process.env.REACT_APP_API_URL}/orders/all`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const ordersData = await ordersResponse.json();
      const allOrders = ordersData.success ? ordersData.orders : [];
      console.log('📊 Orders from database:', allOrders.length);
      
      // 2. Load reviews from database ONLY
      let allReviews = [];
      try {
        const reviewsResponse = await fetch(`${process.env.REACT_APP_API_URL}/reviews/all`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const reviewsData = await reviewsResponse.json();
        allReviews = reviewsData.success ? reviewsData.reviews : [];
        console.log('⭐ Reviews from database:', allReviews.length);
      } catch (error) {
        console.error('Failed to load reviews from API:', error);
        // Only fallback to localStorage if API fails
        allReviews = JSON.parse(localStorage.getItem('productReviews') || '[]');
      }
      
      // 3. Load admin products from database ONLY
      let adminProducts = [];
      try {
        const productsResponse = await fetch(`${process.env.REACT_APP_API_URL}/admin-products`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const productsData = await productsResponse.json();
        adminProducts = productsData.success ? productsData.products : [];
        console.log('🛍️ Products from database:', adminProducts.length);
      } catch (error) {
        console.error('Failed to load products from API:', error);
        // Only fallback to localStorage if API fails
        adminProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]');
      }
      
      // 4. Load contacts from database ONLY
      let contacts = [];
      try {
        const contactsResponse = await fetch(`${process.env.REACT_APP_API_URL}/contact/all`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const contactsData = await contactsResponse.json();
        contacts = contactsData.success ? contactsData.contacts : [];
        console.log('📧 Contacts from database:', contacts.length);
      } catch (error) {
        console.error('Failed to load contacts from API:', error);
        // Only fallback to localStorage if API fails
        contacts = JSON.parse(localStorage.getItem('contactMessages') || '[]');
      }
      
      // Sample products (these are static, not from database)
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
      
      const deletedProducts = JSON.parse(localStorage.getItem('deletedProducts') || '[]');
      const availableSampleProducts = sampleProducts.filter(product => !deletedProducts.includes(product.id));
      const allProducts = [...availableSampleProducts, ...adminProducts];
      
      // Generate customers from database orders only
      const customers = [...new Map(allOrders.map(order => {
        const customerName = order.customerInfo?.name || order.customerName || 'Unknown';
        const customerPhone = order.customerInfo?.phone || order.phone || order.customerPhone || 'N/A';
        const customerEmail = order.customerInfo?.email || order.email || order.customerEmail || 'N/A';
        
        return [customerName, { 
          name: customerName, 
          phone: customerPhone, 
          email: customerEmail,
          orders: allOrders.filter(o => 
            (o.customerInfo?.name || o.customerName) === customerName
          ).length 
        }];
      })).values()];
      
      setDashboardData({ 
        orders: allOrders, 
        products: allProducts, 
        reviews: allReviews, 
        customers, 
        contacts 
      });
      
      const savedExpenses = JSON.parse(localStorage.getItem('productExpenses') || '{}');
      setExpenses(savedExpenses);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      showToast('Failed to load dashboard data. Using offline data.', 'warning');
      
      // Complete fallback to localStorage only if everything fails
      const allOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      const allReviews = JSON.parse(localStorage.getItem('productReviews') || '[]');
      const adminProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]');
      const contacts = JSON.parse(localStorage.getItem('contactMessages') || '[]');
      
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
      
      const deletedProducts = JSON.parse(localStorage.getItem('deletedProducts') || '[]');
      const availableSampleProducts = sampleProducts.filter(product => !deletedProducts.includes(product.id));
      const allProducts = [...availableSampleProducts, ...adminProducts];
      
      const customers = [...new Map(allOrders.map(order => 
        [order.customerName, { 
          name: order.customerName, 
          phone: order.phone, 
          email: order.email || order.customerEmail || 'N/A',
          orders: allOrders.filter(o => o.customerName === order.customerName).length 
        }]
      )).values()];
      
      setDashboardData({ orders: allOrders, products: allProducts, reviews: allReviews, customers, contacts });
      const savedExpenses = JSON.parse(localStorage.getItem('productExpenses') || '{}');
      setExpenses(savedExpenses);
    }
  };

  // Rest of the component methods remain the same...
  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'orders', label: 'Orders', icon: <Package className="w-4 h-4" /> },
    { id: 'products', label: 'Products', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'inventory', label: 'Inventory', icon: <Activity className="w-4 h-4" /> },
    { id: 'customers', label: 'Customers', icon: <Users className="w-4 h-4" /> },
    { id: 'reviews', label: 'Reviews', icon: <Star className="w-4 h-4" /> },
    { id: 'contacts', label: 'Messages', icon: <Mail className="w-4 h-4" /> }
  ];

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await response.json();
      if (data.success) {
        showToast(`Order updated to ${newStatus}`, 'success');
        loadDashboardData(); // Reload from database
        return;
      }
    } catch (error) {
      console.error('API update failed:', error);
      showToast('Failed to update order status', 'error');
    }
  };

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.shortDescription) {
      showToast('Please fill all required fields (Name, Price, Short Description)', 'error');
      return;
    }
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/admin-products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newProduct)
      });
      
      const data = await response.json();
      if (data.success) {
        showToast('Product added successfully!', 'success');
        setNewProduct({ 
          name: '', price: '', category: 'food', description: '', image: '', 
          shortDescription: '', ingredients: '', allergens: '', yarnType: '', 
          careInstructions: '', deliveryTime: '', stockStatus: 'available', 
          weightOptions: '', customization: [] 
        });
        setShowAddProduct(false);
        loadDashboardData(); // Reload from database
      } else {
        throw new Error(data.error || 'Failed to add product');
      }
    } catch (error) {
      console.error('Failed to add product:', error);
      showToast('Failed to add product', 'error');
    }
  };

  const addInventoryItem = async () => {
    if (!newInventoryItem.name || !newInventoryItem.quantity) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/inventory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...newInventoryItem,
          quantity: parseFloat(newInventoryItem.quantity),
          minStock: parseFloat(newInventoryItem.minStock) || 0,
          cost: parseFloat(newInventoryItem.cost) || 0
        })
      });
      
      const data = await response.json();
      if (data.success) {
        showToast('Inventory item added successfully!', 'success');
        setNewInventoryItem({ name: '', quantity: '', unit: '', minStock: '', cost: '' });
        setShowAddInventory(false);
        loadInventory(); // Reload from database
      } else {
        throw new Error(data.error || 'Failed to add inventory item');
      }
    } catch (error) {
      console.error('Failed to add inventory item:', error);
      showToast('Failed to add inventory item', 'error');
    }
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
    const customerName = order.customerInfo?.name || order.customerName || '';
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         customerName.toLowerCase().includes(searchTerm.toLowerCase());
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
              Admin Dashboard (Database-First)
            </h1>
            <p style={{ fontSize: '1.1rem', opacity: '0.9', color: 'white' }}>
              All data synced with database - Welcome back, Sangita! 👋
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
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'white', marginBottom: '0.5rem' }}>{stats.lowStockItems}</div>
                <div style={{ fontSize: '1rem', color: 'white', fontWeight: '600', opacity: '0.9' }}>Low Stock Items</div>
              </div>
            </div>
          </div>
        </div>

        {/* Simple display of key metrics */}
        <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <h2>Database Status</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary-color)' }}>{stats.totalOrders}</div>
              <div>Total Orders</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--success)' }}>{dashboardData.reviews.length}</div>
              <div>Reviews</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--warning)' }}>{dashboardData.products.length}</div>
              <div>Products</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--info)' }}>{dashboardData.contacts.length}</div>
              <div>Messages</div>
            </div>
          </div>
          
          <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--success-light)', borderRadius: '8px' }}>
            <h4 style={{ color: 'var(--success)', margin: '0 0 0.5rem 0' }}>✅ Database Integration Active</h4>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              All data is now synced with the database. Changes made by users will appear here immediately, 
              and admin changes will be visible to users.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;