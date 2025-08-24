import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Truck, Shield, Award, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { config } from '../config/config';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [customizations, setCustomizations] = useState({});
  const [selectedWeight, setSelectedWeight] = useState('');
  const [currentPrice, setCurrentPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [heartAnimation, setHeartAnimation] = useState(false);
  const [buttonAnimation, setButtonAnimation] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [floatingCarts, setFloatingCarts] = useState([]);

  // Sample product data (in real app, this would come from API)
  const sampleProducts = {
    1: {
      _id: 1,
      name: 'Boho Chic Granny Square Crochet Top',
      category: 'crochet',
      price: 1299,
      images: ['/images/crochet-boho-top.jpg'],
      shortDescription: 'A vibrant and stylish handmade top featuring a classic granny square pattern.',
      description: 'Made with soft, breathable yarn in a beautiful medley of pink, blue, yellow, and cream, it\'s the perfect statement piece for summer outings, music festivals, or a casual day out. Each top is handmade with care and attention to detail.',
      rating: 4.8,
      reviewCount: 12,
      stockStatus: 'made-to-order',
      deliveryTime: 14,
      yarnType: 'High-quality, skin-friendly cotton yarn',
      careInstructions: 'Gentle hand wash in cold water with mild detergent. Lay flat to dry. Do not bleach or iron.',
      customization: [
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
      ]
    },
    2: {
      _id: 2,
      name: 'Classic Striped V-Neck Crochet Vest',
      category: 'crochet',
      price: 1199,
      images: ['/images/crochet-striped-vest.jpg'],
      shortDescription: 'A timeless and elegant V-neck vest with chic teal green and cream stripes.',
      description: 'This classic striped vest features a flattering V-neck design with beautiful teal and cream stripes. Perfect for layering or wearing as a statement piece. Handcrafted with premium yarn for comfort and durability.',
      rating: 4.9,
      reviewCount: 8,
      stockStatus: 'made-to-order',
      deliveryTime: 14,
      yarnType: 'Premium cotton blend yarn',
      careInstructions: 'Hand wash in cold water. Lay flat to dry.',
      customization: [
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
          options: ['Small (S)', 'Medium (M)', 'Large (L)'],
          priceModifier: 0
        }
      ]
    },
    3: {
      _id: 3,
      name: 'Minimalist Pink Tank Top',
      category: 'crochet',
      price: 999,
      images: ['/images/crochet-pink-tank.jpg'],
      shortDescription: 'Simple, sweet, and essential. This solid pink crochet tank top is a versatile wardrobe staple.',
      description: 'This minimalist pink crochet tank top is perfect for layering or wearing on its own. Made with soft cotton yarn in a beautiful bubblegum pink shade, it features a classic fit that flatters all body types. The simple design makes it versatile enough to dress up or down.',
      rating: 4.7,
      reviewCount: 15,
      stockStatus: 'made-to-order',
      deliveryTime: 10,
      yarnType: 'Premium cotton yarn',
      careInstructions: 'Hand wash in cold water. Lay flat to dry. Do not bleach.',
      customization: [
        {
          type: 'thread-type',
          label: 'Thread Type',
          options: ['Cotton Thread', 'Wool Thread'],
          priceModifier: { 'Wool Thread': 200 }
        },
        {
          type: 'color',
          label: 'Color',
          options: ['As Pictured'],
          priceModifier: 0
        },
        {
          type: 'size',
          label: 'Size',
          options: ['Small (S)', 'Medium (M)', 'Large (L)', 'Extra Large (XL)'],
          priceModifier: 0
        }
      ]
    },
    4: {
      _id: 4,
      name: 'Serene Blue & Pink Pooja Mat',
      category: 'crochet',
      price: 449,
      images: ['/images/crochet-pooja-mat-blue.jpg'],
      shortDescription: 'A beautiful circular mat, lovingly crocheted in calming shades of blue and pink.',
      description: 'This serene pooja mat features beautiful blue and pink colors in a circular design. Perfect for meditation, prayer, or as a decorative piece. Handcrafted with care and attention to detail.',
      rating: 4.9,
      reviewCount: 6,
      stockStatus: 'available',
      deliveryTime: 7,
      yarnType: 'Cotton yarn',
      careInstructions: 'Hand wash gently. Air dry.',
      customization: [
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
        }
      ]
    },
    5: {
      _id: 5,
      name: 'Festive Multicolor Pooja Mat',
      category: 'crochet',
      price: 499,
      images: ['/images/crochet-pooja-mat-multicolor.jpg'],
      shortDescription: 'Brighten up your sacred space with this festive, multi-colored crocheted mat.',
      description: 'This vibrant multicolor pooja mat brings joy and festivity to your sacred space. Features multiple bright colors in a beautiful circular pattern. Perfect for special occasions and daily prayers.',
      rating: 4.8,
      reviewCount: 4,
      stockStatus: 'available',
      deliveryTime: 7,
      yarnType: 'Cotton yarn',
      careInstructions: 'Hand wash gently. Air dry.',
      customization: []
    },
    6: {
      _id: 6,
      name: 'Homestyle Poha Chivda',
      category: 'food',
      price: 25,
      pricePerKg: 480,
      images: ['/images/food-poha-chivda.jpg'],
      shortDescription: 'A light, crispy, and savory Maharashtrian snack made with thin flattened rice.',
      description: 'Our homemade Poha Chivda is made with thin flattened rice, roasted peanuts, curry leaves, and a secret blend of mild spices. The perfect guilt-free snack to enjoy with your evening tea. Freshly made every day to ensure maximum crispiness and flavor.',
      rating: 4.6,
      reviewCount: 23,
      stockStatus: 'available',
      deliveryTime: 2,
      ingredients: ['Thin Flattened Rice (Poha)', 'Peanuts', 'Edible Vegetable Oil', 'Curry Leaves', 'Turmeric Powder', 'Mustard Seeds', 'Salt', 'Powdered Sugar', 'Asafoetida'],
      allergens: ['Peanuts', 'Prepared in a kitchen that also handles tree nuts, gluten, and dairy'],
      weightOptions: ['100g Packet', '250g', '500g', '1kg']
    },
    7: {
      _id: 7,
      name: 'Sweet & Flaky Shakarpara',
      category: 'food',
      price: 25,
      pricePerKg: 480,
      images: ['/images/food-shakarpara.jpg'],
      shortDescription: 'Traditional Indian sweet snack that melts in your mouth.',
      description: 'Our traditional Shakarpara is made with premium ingredients and traditional methods. These sweet, flaky treats are perfect for festivals, tea time, or whenever you crave something sweet and crunchy.',
      rating: 4.7,
      reviewCount: 18,
      stockStatus: 'available',
      deliveryTime: 2,
      ingredients: ['Maida', 'Ghee', 'Sugar', 'Cardamom'],
      allergens: ['Gluten', 'Dairy'],
      weightOptions: ['100g Packet', '250g', '500g', '1kg']
    },
    8: {
      _id: 8,
      name: 'Crispy & Savory Namak Pare',
      category: 'food',
      price: 25,
      pricePerKg: 480,
      images: ['/images/food-namak-pare.jpg'],
      shortDescription: 'The perfect savory companion for your tea.',
      description: 'These crispy and savory Namak Pare are made with traditional spices and techniques. Perfect for tea time or as a light snack. Made fresh daily with quality ingredients.',
      rating: 4.5,
      reviewCount: 21,
      stockStatus: 'available',
      deliveryTime: 2,
      ingredients: ['Maida', 'Ajwain', 'Salt'],
      allergens: ['Gluten'],
      weightOptions: ['100g Packet', '250g', '500g', '1kg']
    },
    9: {
      _id: 9,
      name: 'Spicy Mixture Namkeen',
      category: 'food',
      price: 25,
      pricePerKg: 500,
      images: ['/images/food-mixture.jpg'],
      shortDescription: 'A flavor-packed medley of crispy sev, fried peanuts, and lentils.',
      description: 'Our spicy mixture is a perfect blend of crispy sev, roasted peanuts, and various lentils with aromatic spices. A popular tea-time snack that offers a burst of flavors in every bite.',
      rating: 4.8,
      reviewCount: 16,
      stockStatus: 'available',
      deliveryTime: 2,
      ingredients: ['Besan', 'Peanuts', 'Lentils', 'Spices'],
      allergens: ['Peanuts', 'Gluten'],
      weightOptions: ['100g Packet', '250g', '500g', '1kg']
    },
    10: {
      _id: 10,
      name: 'Classic Salty Mathri',
      category: 'food',
      price: 25,
      pricePerKg: 480,
      images: ['/images/food-mathri.jpg'],
      shortDescription: 'Traditional North Indian flaky biscuit seasoned with ajwain.',
      description: 'Our classic Mathri is made with traditional recipes passed down through generations. These flaky, salty biscuits are seasoned with ajwain (carom seeds) and are perfect with tea or as a light snack.',
      rating: 4.6,
      reviewCount: 14,
      stockStatus: 'available',
      deliveryTime: 2,
      ingredients: ['Maida', 'Ghee', 'Ajwain', 'Salt'],
      allergens: ['Gluten', 'Dairy'],
      weightOptions: ['100g Packet', '250g', '500g', '1kg']
    },
    11: {
      _id: 11,
      name: 'Baked Jeera Biscuits',
      category: 'food',
      price: 25,
      pricePerKg: 480,
      images: ['/images/food-jeera-biscuits.webp'],
      shortDescription: 'Light, savory, and crumbly biscuits flavored with roasted cumin.',
      description: 'These baked jeera biscuits are light, crumbly, and full of roasted cumin flavor. Perfect for tea time or as a healthy snack option. Baked to perfection with minimal oil.',
      rating: 4.4,
      reviewCount: 11,
      stockStatus: 'available',
      deliveryTime: 2,
      ingredients: ['Maida', 'Butter', 'Jeera', 'Salt'],
      allergens: ['Gluten', 'Dairy'],
      weightOptions: ['100g Packet', '250g', '500g', '1kg']
    },
    12: {
      _id: 12,
      name: 'Homemade Gujiya',
      category: 'food',
      price: 150,
      images: ['/images/food-gujiya.jpg'],
      shortDescription: 'Classic festive delicacy filled with khoya, nuts, and coconut.',
      description: 'Our homemade Gujiya is a traditional festive sweet filled with rich khoya, nuts, and coconut. Made with love using traditional methods, these are perfect for celebrations and special occasions.',
      rating: 4.9,
      reviewCount: 7,
      stockStatus: 'made-to-order',
      deliveryTime: 3,
      ingredients: ['Maida', 'Khoya', 'Coconut', 'Nuts'],
      allergens: ['Gluten', 'Dairy', 'Nuts'],
      weightOptions: ['6 pieces', '12 pieces', '24 pieces']
    }
  };



  useEffect(() => {
    const loadProduct = async () => {
      let productData = sampleProducts[id];
      
      // If not found in sample products, check database products
      if (!productData) {
        try {
          const response = await fetch(`${config.API_URL}/admin-products`);
          const data = await response.json();
          if (data.success) {
            productData = data.products.find(p => p._id.toString() === id);
            console.log('🛍️ Found admin product:', productData?.name);
          }
        } catch (error) {
          console.error('Database unavailable:', error);
          productData = null;
        }
      }
      
      if (productData) {
        setProduct(productData);
        // Initialize with base price for food items (100g) or regular price for crochet
        let initialPrice;
        if (productData.name === 'Homemade Gujiya') {
          initialPrice = 150; // 6 pieces price
        } else if (productData.category === 'food' && productData.pricePerKg) {
          initialPrice = Math.round((productData.pricePerKg * 0.1)); // 100g price
        } else {
          initialPrice = productData.price;
        }
        setCurrentPrice(initialPrice);
        
        // Load reviews from database using product name
        try {
          const response = await fetch(`${config.API_URL}/reviews/all`);
          const data = await response.json();
          if (data.success) {
            // Filter reviews for this specific product
            const productReviews = data.reviews.filter(review => 
              review.productName === productData.name || 
              review.productId === productData.name
            );
            setReviews(productReviews);
            console.log('⭐ Loaded reviews for product:', productData.name, productReviews.length);
          } else {
            setReviews([]);
          }
        } catch (error) {
          console.error('Failed to load reviews from database:', error);
          setReviews([]);
        }
      }
      setLoading(false);
    };
    
    loadProduct();
  }, [id]);

  const calculatePrice = (customizations, weight) => {
    let newPrice = product.price;
    
    // For food items, calculate price based on weight
    if (product.category === 'food' && weight) {
      if (product.name === 'Homemade Gujiya') {
        // Special pricing for Gujiya
        if (weight === '6 pieces') newPrice = 150;
        else if (weight === '12 pieces') newPrice = 300;
        else if (weight === '24 pieces') newPrice = 600;
        else newPrice = 150; // default to 6 pieces price
      } else if (product.pricePerKg) {
        // Handle weight-based pricing for other food items
        let weightValue;
        if (weight.includes('kg')) {
          weightValue = parseFloat(weight.replace(/[^0-9.]/g, ''));
        } else {
          weightValue = parseFloat(weight.replace(/[^0-9.]/g, '')) / 1000; // Convert g to kg
        }
        newPrice = product.pricePerKg * weightValue;
      }
    }
    
    // Add customization modifiers
    product.customization?.forEach(option => {
      const selectedValue = customizations[option.type];
      if (selectedValue && option.priceModifier && typeof option.priceModifier === 'object') {
        newPrice += option.priceModifier[selectedValue] || 0;
      }
    });
    
    return Math.round(newPrice);
  };

  const handleCustomizationChange = (type, value) => {
    const newCustomizations = { ...customizations, [type]: value };
    setCustomizations(newCustomizations);
    setCurrentPrice(calculatePrice(newCustomizations, selectedWeight));
  };

  const handleWeightChange = (weight) => {
    setSelectedWeight(weight);
    let newPrice;
    if (product.name === 'Homemade Gujiya') {
      if (weight === '6 pieces') newPrice = 150;
      else if (weight === '12 pieces') newPrice = 300;
      else if (weight === '24 pieces') newPrice = 600;
    } else {
      newPrice = calculatePrice(customizations, weight);
    }
    setCurrentPrice(newPrice);
  };

  const getDeliveryInfo = () => {
    let deliveryDays = product.deliveryTime;
    let note = '';
    
    if (product.category === 'food' && quantity > 5) {
      deliveryDays = 2;
      note = 'May vary due to large quantity';
    } else if (product.category === 'crochet' && quantity > 3) {
      note = 'May vary due to large quantity';
    }
    
    return { days: deliveryDays, note };
  };

  const isSelectionComplete = () => {
    // For food items, weight must be selected
    if (product.category === 'food' && product.weightOptions && !selectedWeight) {
      return false;
    }
    
    // For crochet items, all customization options must be selected
    if (product.category === 'crochet' && product.customization) {
      return product.customization.every(option => customizations[option.type]);
    }
    
    return true;
  };

  const getSelectionMessage = () => {
    if (product.category === 'food' && product.weightOptions && !selectedWeight) {
      return product.name === 'Homemade Gujiya' ? 'Please select a quantity option first' : 'Please select a weight option first';
    }
    
    if (product.category === 'crochet' && product.customization) {
      const missingOptions = product.customization.filter(option => !customizations[option.type]);
      if (missingOptions.length > 0) {
        return `Please select: ${missingOptions.map(opt => opt.label).join(', ')}`;
      }
    }
    
    return '';
  };

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!isSelectionComplete()) {
      showToast(getSelectionMessage(), 'error');
      return;
    }
    
    if (product) {
      setButtonAnimation(true);
      setTimeout(() => setButtonAnimation(false), 200);
      
      // Create floating cart animation
      const newCarts = Array.from({ length: 2 }, (_, i) => ({
        id: Date.now() + i,
        left: Math.random() * 30 - 15,
        delay: i * 150
      }));
      setFloatingCarts(newCarts);
      setTimeout(() => setFloatingCarts([]), 1000);
      
      addToCart(product, quantity, customizations, selectedWeight);
      showToast('Added to cart successfully!', 'success');
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!isSelectionComplete()) {
      showToast(getSelectionMessage(), 'error');
      return;
    }
    
    if (product) {
      addToCart(product, quantity, customizations, selectedWeight);
      navigate('/checkout');
    }
  };

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

  if (!product) {
    return (
      <div style={{ 
        minHeight: '60vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <h2>Product not found</h2>
        <button onClick={() => navigate('/products')} className="btn btn-primary">
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 0', minHeight: '100vh' }}>
      <div className="container">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'none',
            border: 'none',
            color: 'var(--primary-color)',
            fontSize: '0.9rem',
            cursor: 'pointer',
            marginBottom: '2rem'
          }}
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="animate-fade-in" style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '3rem',
          marginBottom: '3rem'
        }}>
          {/* Product Images */}
          <div className="animate-slide-in">
            <div style={{ 
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              overflow: 'hidden',
              marginBottom: '1rem'
            }}>
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '400px',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  e.target.src = '/images/placeholder.jpg';
                }}
              />
            </div>
            
            {product.images.length > 1 && (
              <div style={{ 
                display: 'flex', 
                gap: '0.5rem',
                overflowX: 'auto'
              }}>
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      border: selectedImage === index ? '2px solid var(--primary-color)' : '1px solid var(--border-color)'
                    }}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div style={{ marginBottom: '1rem' }}>
              <span style={{
                background: product.category === 'crochet' ? 'var(--primary-color)' : 'var(--success)',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: '600',
                textTransform: 'capitalize'
              }}>
                {product.category}
              </span>
            </div>

            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: '800',
              marginBottom: '1rem',
              lineHeight: '1.2'
            }}>
              {product.name}
            </h1>



            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: '800',
                color: 'var(--primary-color)',
                marginBottom: '0.5rem'
              }}>
                ₹{currentPrice}
                {product.pricePerKg && (
                  <span style={{ 
                    fontSize: '1rem', 
                    color: 'var(--text-secondary)',
                    fontWeight: '400',
                    marginLeft: '0.5rem'
                  }}>
                    (₹{product.pricePerKg}/kg)
                  </span>
                )}
              </div>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem',
                fontSize: '0.9rem',
                color: 'var(--text-secondary)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Truck size={16} />
                  Delivery in {getDeliveryInfo().days} days
                  {getDeliveryInfo().note && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--warning)', marginLeft: '0.5rem' }}>
                      ({getDeliveryInfo().note})
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Shield size={16} />
                  {product.stockStatus === 'made-to-order' ? 'Made to Order' : 'In Stock'}
                </div>
              </div>
            </div>

            <p style={{ 
              color: 'var(--text-secondary)', 
              lineHeight: '1.6',
              marginBottom: '2rem'
            }}>
              {product.description}
            </p>

            {/* Customization Options */}
            {product.customization && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Customization Options</h3>
                {product.customization.map((option) => (
                  <div key={option.type} style={{ marginBottom: '1rem' }}>
                    <label style={{ 
                      display: 'block', 
                      fontWeight: '600',
                      marginBottom: '0.5rem'
                    }}>
                      {option.label}
                    </label>
                    <select
                      value={customizations[option.type] || ''}
                      onChange={(e) => handleCustomizationChange(option.type, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: `1px solid ${!customizations[option.type] ? 'var(--warning)' : 'var(--border-color)'}`,
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        background: !customizations[option.type] ? 'var(--warning-light)' : 'var(--bg-primary)'
                      }}
                    >
                      <option value="">Select {option.label} *</option>
                      {option.options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}

            {/* Weight Options for Food */}
            {product.weightOptions && product.weightOptions.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>
                  {product.name === 'Homemade Gujiya' ? 'Quantity Options *' : 'Weight Options *'}
                </h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: product.name === 'Homemade Gujiya' ? 'repeat(3, 1fr)' : 'repeat(auto-fit, minmax(120px, 1fr))',
                  gap: '0.75rem'
                }}>
                  {product.weightOptions.map((weight) => {
                    let weightPrice, displayText;
                    
                    if (product.name === 'Homemade Gujiya') {
                      if (weight === '6 pieces') {
                        weightPrice = 150;
                        displayText = '6 Pieces';
                      } else if (weight === '12 pieces') {
                        weightPrice = 300;
                        displayText = '12 Pieces';
                      } else if (weight === '24 pieces') {
                        weightPrice = 600;
                        displayText = '24 Pieces';
                      }
                      console.log('Gujiya pricing:', weight, weightPrice);
                    } else {
                      weightPrice = calculatePrice(customizations, weight);
                      displayText = weight;
                    }
                    
                    return (
                      <button
                        key={weight}
                        onClick={() => handleWeightChange(weight)}
                        style={{
                          padding: '1rem 0.75rem',
                          border: selectedWeight === weight ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                          borderRadius: '12px',
                          background: selectedWeight === weight ? 'var(--primary-color)' : 'var(--bg-primary)',
                          color: selectedWeight === weight ? 'white' : 'var(--text-primary)',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: selectedWeight === weight ? '600' : '400',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '0.5rem',
                          boxShadow: selectedWeight === weight ? '0 4px 12px rgba(217, 70, 239, 0.3)' : '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      >
                        <span style={{ fontWeight: '600' }}>{displayText}</span>
                        <span style={{ 
                          fontSize: '1rem', 
                          fontWeight: '700',
                          color: selectedWeight === weight ? 'white' : 'var(--primary-color)'
                        }}>₹{weightPrice}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <label style={{ fontWeight: '600' }}>Quantity:</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="quantity-btn"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  -
                </button>
                <span style={{ 
                  minWidth: '40px', 
                  textAlign: 'center',
                  fontWeight: '600'
                }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="quantity-btn"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  +
                </button>
              </div>
              {((product.category === 'food' && quantity > 5) || (product.category === 'crochet' && quantity > 3)) && (
                <div style={{
                  background: 'var(--warning-light)',
                  color: 'var(--warning-dark)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  border: '1px solid var(--warning)'
                }}>
                  ⚠️ Large quantity - delivery time may vary, owner will inform soon
                </div>
              )}
            </div>

            {/* Selection Warning */}
            {!isSelectionComplete() && (
              <div style={{
                background: 'var(--warning-light)',
                border: '1px solid var(--warning)',
                borderRadius: '8px',
                padding: '0.75rem',
                marginBottom: '1rem',
                color: 'var(--warning-dark)',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>
                ⚠️ {getSelectionMessage()}
              </div>
            )}

            {/* Action Buttons */}
            <div className="animate-scale-in" style={{ 
              display: 'flex', 
              gap: '1rem',
              marginBottom: '2rem',
              animationDelay: '0.3s'
            }}>
              <button
                onClick={handleAddToCart}
                disabled={!isSelectionComplete()}
                className={`hover-scale ${buttonAnimation ? 'animate-button-pop' : ''}`}
                style={{
                  flex: 1,
                  padding: '1rem',
                  background: isSelectionComplete() ? 'var(--bg-secondary)' : 'var(--bg-tertiary)',
                  border: `2px solid ${isSelectionComplete() ? 'var(--primary-color)' : 'var(--border-color)'}`,
                  color: isSelectionComplete() ? 'var(--primary-color)' : 'var(--text-muted)',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: isSelectionComplete() ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  position: 'relative',
                  opacity: isSelectionComplete() ? 1 : 0.6
                }}
              >
                <ShoppingCart size={20} />
                Add to Cart
                {floatingCarts.map(cart => (
                  <div
                    key={cart.id}
                    className="animate-floating-cart"
                    style={{
                      position: 'absolute',
                      left: `${cart.left}px`,
                      animationDelay: `${cart.delay}ms`,
                      fontSize: '1.5rem'
                    }}
                  >
                    🛒
                  </div>
                ))}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!isSelectionComplete()}
                className="hover-scale"
                style={{
                  flex: 1,
                  padding: '1rem',
                  background: isSelectionComplete() ? 'var(--primary-color)' : 'var(--bg-tertiary)',
                  border: 'none',
                  color: isSelectionComplete() ? 'white' : 'var(--text-muted)',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: isSelectionComplete() ? 'pointer' : 'not-allowed',
                  opacity: isSelectionComplete() ? 1 : 0.6
                }}
              >
                Buy Now
              </button>
              <button
                onClick={() => {
                  setHeartAnimation(true);
                  setTimeout(() => setHeartAnimation(false), 300);
                  
                  // Create floating hearts
                  const newHearts = Array.from({ length: 3 }, (_, i) => ({
                    id: Date.now() + i,
                    left: Math.random() * 20 - 10,
                    delay: i * 100
                  }));
                  setFloatingHearts(newHearts);
                  setTimeout(() => setFloatingHearts([]), 1000);
                  
                  if (isInWishlist(product._id)) {
                    removeFromWishlist(product._id);
                    showToast('Removed from wishlist', 'success');
                  } else {
                    addToWishlist(product);
                    showToast('Added to wishlist!', 'success');
                  }
                }}
                className={heartAnimation ? 'animate-heart-pop' : ''}
                style={{
                  padding: '1rem',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  color: isInWishlist(product._id) ? '#ef4444' : 'var(--text-secondary)',
                  position: 'relative'
                }}
              >
                <Heart size={20} fill={isInWishlist(product._id) ? 'currentColor' : 'none'} />
                {floatingHearts.map(heart => (
                  <div
                    key={heart.id}
                    className="floating-heart animate-floating-heart"
                    style={{
                      left: `${heart.left}px`,
                      animationDelay: `${heart.delay}ms`
                    }}
                  >
                    ❤️
                  </div>
                ))}
              </button>
            </div>

            {/* Product Details */}
            <div style={{ 
              background: 'var(--bg-secondary)',
              padding: '1.5rem',
              borderRadius: '12px',
              border: '1px solid var(--border-color)'
            }}>
              <h3 style={{ marginBottom: '1rem' }}>Product Details</h3>
              
              {product.yarnType && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong>Yarn Type:</strong> {product.yarnType}
                </div>
              )}
              
              {product.careInstructions && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong>Care Instructions:</strong> {product.careInstructions}
                </div>
              )}
              
              {product.ingredients && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong>Ingredients:</strong> {product.ingredients.join(', ')}
                </div>
              )}
              
              {product.allergens && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong>Allergen Info:</strong> {product.allergens.join(', ')}
                </div>
              )}
              
              <div>
                <strong>Delivery Area:</strong> Pan-India delivery available
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="animate-fade-in" style={{ 
          background: 'var(--bg-secondary)',
          padding: '2rem',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          animationDelay: '0.4s'
        }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Customer Reviews</h3>
          
          {reviews.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No reviews yet. Be the first to review!</p>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {reviews.map((review) => (
                <div
                  key={review._id}
                  style={{
                    padding: '1rem',
                    background: 'var(--bg-primary)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: '0.5rem'
                  }}>
                    <div>
                      <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                        {review.user?.name || 'Anonymous'}
                        {review.verified && (
                          <span style={{ 
                            color: 'var(--success)',
                            fontSize: '0.8rem',
                            marginLeft: '0.5rem'
                          }}>
                            ✓ Verified Purchase
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            fill={i < review.rating ? '#fbbf24' : 'none'}
                            color={i < review.rating ? '#fbbf24' : '#d1d5db'}
                          />
                        ))}
                      </div>
                    </div>
                    <span style={{ 
                      color: 'var(--text-secondary)',
                      fontSize: '0.8rem'
                    }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ 
                    color: 'var(--text-secondary)',
                    lineHeight: '1.5',
                    margin: 0
                  }}>
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;