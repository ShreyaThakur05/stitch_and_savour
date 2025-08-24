import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Search, Filter, ShoppingCart, Star } from 'lucide-react';
import { config } from '../config/config';

const ProductsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { addToCart } = useCart();


  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      localStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
      navigate('/login');
    }
  }, [user, navigate]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [priceRange, setPriceRange] = useState([0, 1500]);
  const [loading, setLoading] = useState(true);

  // Sample products data
  const sampleProducts = [
    {
      id: 1,
      name: 'Boho Chic Granny Square Crochet Top',
      category: 'crochet',
      price: 1299,
      image: '/images/crochet-boho-top.jpg',
      shortDescription: 'A vibrant and stylish handmade top featuring a classic granny square pattern.',
      rating: 0,
      reviewCount: 0,
      stockStatus: 'made-to-order',
      deliveryTime: 14,
      customization: [
        { type: 'thread-type', options: ['100% Cotton', 'Acrylic Blend'] },
        { type: 'color', options: ['As Pictured', 'Custom Colors'] },
        { type: 'size', options: ['S', 'M', 'L', 'Custom'] }
      ]
    },
    {
      id: 2,
      name: 'Classic Striped V-Neck Crochet Vest',
      category: 'crochet',
      price: 1199,
      image: '/images/crochet-striped-vest.jpg',
      shortDescription: 'A timeless and elegant V-neck vest with chic teal green and cream stripes.',
      rating: 0,
      reviewCount: 0,
      stockStatus: 'made-to-order',
      deliveryTime: 14,
      customization: [
        { type: 'thread-type', options: ['100% Cotton', 'Acrylic Blend'] },
        { type: 'color', options: ['As Pictured', 'Custom Colors'] },
        { type: 'size', options: ['S', 'M', 'L'] }
      ]
    },
    {
      id: 3,
      name: 'Minimalist Pink Crochet Tank Top',
      category: 'crochet',
      price: 999,
      image: '/images/crochet-pink-tank.jpg',
      shortDescription: 'Simple, sweet, and essential. This solid pink crochet tank top is a versatile wardrobe staple.',
      rating: 0,
      reviewCount: 0,
      stockStatus: 'made-to-order',
      deliveryTime: 10,
      customization: [
        { type: 'color', options: ['Bubblegum Pink', '30+ Colors Available'] },
        { type: 'size', options: ['S', 'M', 'L', 'XL'] }
      ]
    },
    {
      id: 4,
      name: 'Serene Blue & Pink Pooja Mat',
      category: 'crochet',
      price: 449,
      image: '/images/crochet-pooja-mat-blue.jpg',
      shortDescription: 'A beautiful circular mat, lovingly crocheted in calming shades of blue and pink.',
      rating: 0,
      reviewCount: 0,
      stockStatus: 'available',
      deliveryTime: 7,
      customization: [
        { type: 'color', options: ['As Pictured', 'Custom Colors'] }
      ]
    },
    {
      id: 5,
      name: 'Festive Multicolor Pooja Mat',
      category: 'crochet',
      price: 499,
      image: '/images/crochet-pooja-mat-multicolor.jpg',
      shortDescription: 'Brighten up your sacred space with this festive, multi-colored crocheted mat.',
      rating: 0,
      reviewCount: 0,
      stockStatus: 'available',
      deliveryTime: 7,
      customization: []
    },
    {
      id: 6,
      name: 'Homestyle Poha Chivda',
      category: 'food',
      price: 25,
      pricePerKg: 480,
      image: '/images/food-poha-chivda.jpg',
      shortDescription: 'A light, crispy, and savory Maharashtrian snack made with thin flattened rice.',
      rating: 0,
      reviewCount: 0,
      stockStatus: 'available',
      deliveryTime: 2,
      ingredients: ['Poha', 'Peanuts', 'Curry Leaves', 'Spices'],
      allergens: ['Peanuts']
    },
    {
      id: 7,
      name: 'Sweet & Flaky Shakarpara',
      category: 'food',
      price: 25,
      pricePerKg: 480,
      image: '/images/food-shakarpara.jpg',
      shortDescription: 'Traditional Indian sweet snack that melts in your mouth.',
      rating: 0,
      reviewCount: 0,
      stockStatus: 'available',
      deliveryTime: 2,
      ingredients: ['Maida', 'Ghee', 'Sugar', 'Cardamom'],
      allergens: ['Gluten', 'Dairy']
    },
    {
      id: 8,
      name: 'Crispy & Savory Namak Pare',
      category: 'food',
      price: 25,
      pricePerKg: 480,
      image: '/images/food-namak-pare.jpg',
      shortDescription: 'The perfect savory companion for your tea.',
      rating: 0,
      reviewCount: 0,
      stockStatus: 'available',
      deliveryTime: 2,
      ingredients: ['Maida', 'Ajwain', 'Salt'],
      allergens: ['Gluten']
    },
    {
      id: 9,
      name: 'Spicy Mixture Namkeen',
      category: 'food',
      price: 25,
      pricePerKg: 500,
      image: '/images/food-mixture.jpg',
      shortDescription: 'A flavor-packed medley of crispy sev, fried peanuts, and lentils.',
      rating: 0,
      reviewCount: 0,
      stockStatus: 'available',
      deliveryTime: 2,
      ingredients: ['Besan', 'Peanuts', 'Lentils', 'Spices'],
      allergens: ['Peanuts', 'Gluten']
    },
    {
      id: 10,
      name: 'Classic Salty Mathri',
      category: 'food',
      price: 25,
      pricePerKg: 480,
      image: '/images/food-mathri.jpg',
      shortDescription: 'Traditional North Indian flaky biscuit seasoned with ajwain.',
      rating: 0,
      reviewCount: 0,
      stockStatus: 'available',
      deliveryTime: 2,
      ingredients: ['Maida', 'Ghee', 'Ajwain', 'Salt'],
      allergens: ['Gluten', 'Dairy']
    },
    {
      id: 11,
      name: 'Baked Jeera Biscuits',
      category: 'food',
      price: 25,
      pricePerKg: 480,
      image: '/images/food-jeera-biscuits.webp',
      shortDescription: 'Light, savory, and crumbly biscuits flavored with roasted cumin.',
      rating: 0,
      reviewCount: 0,
      stockStatus: 'available',
      deliveryTime: 2,
      ingredients: ['Maida', 'Butter', 'Jeera', 'Salt'],
      allergens: ['Gluten', 'Dairy']
    },
    {
      id: 12,
      name: 'Homemade Gujiya',
      category: 'food',
      price: 150,
      image: '/images/food-gujiya.jpg',
      shortDescription: 'Classic festive delicacy filled with khoya, nuts, and coconut.',
      rating: 0,
      reviewCount: 0,
      stockStatus: 'made-to-order',
      deliveryTime: 3,
      ingredients: ['Maida', 'Khoya', 'Coconut', 'Nuts'],
      allergens: ['Gluten', 'Dairy', 'Nuts'],
      weightOptions: ['6 pieces', '12 pieces', '24 pieces']
    }
  ];

  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Load admin products from database
        const response = await fetch(`${config.API_URL}/admin-products`);
        const data = await response.json();
        
        let adminProducts = [];
        if (data.success) {
          adminProducts = data.products;
          console.log('🛍️ Loaded admin products from database:', adminProducts.length);
        }
        
        // Merge sample products with admin products
        const allProducts = [...sampleProducts, ...adminProducts];
        console.log('🛍️ Total products available:', allProducts.length);
        
        setProducts(allProducts);
        setFilteredProducts(allProducts);
        setLoading(false);
      } catch (error) {
        console.error('Database unavailable, using sample products only:', error);
        // Fallback to sample products only
        setProducts(sampleProducts);
        setFilteredProducts(sampleProducts);
        setLoading(false);
      }
    };
    
    loadProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.ingredients && product.ingredients.some(ing => 
          ing.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
    }

    // Filter by price range
    filtered = filtered.filter(product => {
      const price = parseFloat(product.price || 0);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm, priceRange]);

  const ProductCard = ({ product }) => (
    <div 
      className="product-card"
      style={{
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        overflow: 'hidden',
        background: 'var(--bg-secondary)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative'
      }}
      onClick={() => navigate(`/product/${product._id || product.id}`)}
    >
      <div style={{ position: 'relative' }}>
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover'
          }}
          onError={(e) => {
            e.target.src = '/images/placeholder.jpg';
          }}
        />

        {product.stockStatus === 'made-to-order' && (
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            background: 'var(--warning)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '0.7rem',
            fontWeight: '600'
          }}>
            Made on Demand
          </div>
        )}
      </div>
      
      <div style={{ padding: '1rem' }}>
        <h4 style={{ 
          margin: '0 0 0.5rem 0', 
          fontSize: '1rem',
          fontWeight: '600',
          lineHeight: '1.3'
        }}>
          {product.name}
        </h4>
        
        <p style={{ 
          color: 'var(--text-secondary)', 
          fontSize: '0.85rem',
          margin: '0 0 0.75rem 0',
          lineHeight: '1.4'
        }}>
          {product.shortDescription}
        </p>
        
        {product.rating > 0 && product.reviewCount > 0 && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            marginBottom: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  fill={i < Math.floor(product.rating) ? '#fbbf24' : 'none'}
                  color={i < Math.floor(product.rating) ? '#fbbf24' : '#d1d5db'}
                />
              ))}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {product.rating} ({product.reviewCount})
            </span>
          </div>
        )}
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '0.75rem'
        }}>
          <div>
            <span style={{ 
              fontSize: '1.1rem', 
              fontWeight: '700',
              color: 'var(--primary-color)'
            }}>
              {product.pricePerKg ? `₹${product.pricePerKg}/kg` : `₹${product.price}`}
            </span>
            {product.pricePerKg && (
              <span style={{ 
                fontSize: '0.8rem', 
                color: 'var(--text-secondary)',
                marginLeft: '0.5rem'
              }}>
                (Min: ₹{Math.round(product.pricePerKg * 0.1)} per 100g)
              </span>
            )}
          </div>
          <span style={{ 
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            background: 'var(--bg-tertiary)',
            padding: '2px 6px',
            borderRadius: '8px'
          }}>
            {product.deliveryTime} days
          </span>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          padding: '0.75rem',
          background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
          color: 'white',
          fontSize: '0.85rem',
          fontWeight: '600',
          borderRadius: '0 0 15px 15px',
          margin: '-1rem -1rem 0 -1rem',
          marginTop: '0.75rem'
        }}>
          <span>View Details</span>
          <span style={{ fontSize: '1rem' }}>→</span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={{ 
        minHeight: '60vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div className="spinner"></div>
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
            Our Products
          </h1>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '1.1rem' 
          }}>
            Discover our collection of handmade crochet items and homemade food
          </p>
        </div>

        {/* Search and Filters */}
        <div style={{ 
          background: 'var(--bg-secondary)',
          padding: '1rem',
          borderRadius: '12px',
          border: '1px solid var(--primary-color)',
          marginBottom: '1.5rem'
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            alignItems: 'end'
          }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search 
                size={16} 
                style={{ 
                  position: 'absolute', 
                  left: '10px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: 'var(--primary-color)'
                }} 
              />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.7rem 0.7rem 2.2rem',
                  border: '1px solid var(--primary-color)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  outline: 'none',
                  background: 'var(--bg-primary)'
                }}
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '0.7rem',
                border: '1px solid var(--primary-color)',
                borderRadius: '8px',
                fontSize: '0.9rem',
                outline: 'none',
                background: 'var(--bg-primary)',
                cursor: 'pointer',
                color: 'var(--text-primary)'
              }}
            >
              <option value="all">All Categories</option>
              <option value="crochet">Crochet Items</option>
              <option value="food">Food Items</option>
            </select>

            {/* Price Range */}
            <div>
              <div style={{ 
                fontSize: '1.1rem',
                fontWeight: '700',
                marginBottom: '0.4rem',
                color: 'var(--primary-color)',
                textAlign: 'center'
              }}>
                ₹{priceRange[0]} - ₹{priceRange[1]}
              </div>
              <input
                type="range"
                min="0"
                max="1500"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                style={{
                  width: '100%',
                  height: '6px',
                  borderRadius: '3px',
                  background: `linear-gradient(to right, var(--primary-color) 0%, var(--primary-color) ${(priceRange[1]/1500)*100}%, var(--border-color) ${(priceRange[1]/1500)*100}%, var(--border-color) 100%)`,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div style={{ 
          marginBottom: '1.5rem',
          fontSize: '0.9rem',
          color: 'var(--primary-color)',
          fontWeight: '600'
        }}>
          {filteredProducts.length} products found
          {selectedCategory !== 'all' && ` in ${selectedCategory}`}
          {searchTerm && ` for "${searchTerm}"`}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem 2rem',
            background: 'var(--bg-secondary)',
            borderRadius: '16px'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ marginBottom: '0.5rem' }}>No products found</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;