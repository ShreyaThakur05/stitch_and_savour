import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../styles/mobile-navbar-hero.css';
import { 
  Heart, 
  Star,
  ChevronDown,
  ShoppingBag,
  Users,
  Award,
  Truck,
  Shield,
  Sparkles
} from 'lucide-react';

const Home = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const featuredProducts = [
    {
      id: 1,
      name: 'Boho Chic Granny Square Top',
      price: 1299,
      image: '/images/crochet-boho-top.jpg',
      category: 'crochet',
      rating: 4.8
    },
    {
      id: 6,
      name: 'Homestyle Poha Chivda',
      price: 25,
      image: '/images/food-poha-chivda.jpg',
      category: 'food',
      rating: 4.6
    },
    {
      id: 3,
      name: 'Minimalist Pink Tank Top',
      price: 999,
      image: '/images/crochet-pink-tank.jpg',
      category: 'crochet',
      rating: 4.7
    }
  ];

  const handleAddToCart = (product) => {
    if (!user) {
      navigate('/login');
    } else {
      addToCart(product, 1, {}, user);
    }
  };

  const handleBuyNow = (product) => {
    if (!user) {
      navigate('/login');
    } else {
      addToCart(product, 1, {}, user);
      navigate('/cart');
    }
  };

  const faqs = [
    {
      question: "What products do you offer?",
      answer: "We offer a variety of homemade food items and handcrafted crochet products. Each item is made with care, fresh ingredients, and quality materials."
    },
    {
      question: "How can I place an order?",
      answer: "Browse through our product categories, add your desired items to the cart, and proceed to checkout. You can then confirm your order and make payment via our secure QR code option or choose Cash on Delivery (COD)."
    },
    {
      question: "What is the expected delivery time?",
      answer: "Food Items: Delivered within 2 days of order confirmation to ensure freshness. Crochet Items: Delivered within 2 weeks, as they are custom-made to your preferred design, colors, and thread type."
    },
    {
      question: "Can I customize crochet products?",
      answer: "Yes! You can choose from available designs, colors, and thread types. Customization options are shown on each crochet product page."
    },
    {
      question: "How do I make a payment?",
      answer: "We accept payments via QR code or Cash on Delivery. Simply scan the QR code during checkout or select COD to pay at delivery."
    },
    {
      question: "Can I cancel my order?",
      answer: "Food items: Cancellation possible within 6 hours of placing the order. Crochet items: Cancellation possible within 24 hours of placing the order, as they are made-to-order."
    },
    {
      question: "Do you offer returns or refunds?",
      answer: "Due to the perishable nature of food items and the custom nature of crochet products, returns are not possible. However, if your order arrives damaged or incorrect, contact us within 24 hours for assistance."
    },
    {
      question: "How can I track my order?",
      answer: "Log in to your account and visit the 'My Orders' section to see the current status of your orders."
    },
    {
      question: "Do you offer bulk orders or special requests?",
      answer: "Yes! We accept bulk orders for both food and crochet items. If the quantity of food items is more than 2 kg, or if your order contains more than one crochet product, the delivery timeline may be longer."
    },
    {
      question: "How can I contact customer support?",
      answer: "You can reach us via the contact form on our website or through WhatsApp/phone for quick queries."
    }
  ];

  const features = [
    {
      icon: <Heart className="w-8 h-8 feature-icon" />,
      title: "Made with Love",
      description: "Every product is crafted with care and passion",
      gradient: "from-pink-500 to-rose-500"
    },
    {
      icon: <Shield className="w-8 h-8 feature-icon" />,
      title: "Quality Assured",
      description: "Fresh ingredients and premium materials",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <Award className="w-8 h-8 feature-icon" />,
      title: "Custom Made",
      description: "Personalized crochet items to your preference",
      gradient: "from-yellow-500 to-orange-500"
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section" style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        background: 'var(--bg-gradient)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Background Elements */}
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: '200px',
          height: '200px',
          background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
          borderRadius: '50%',
          opacity: '0.1',
          animation: 'bounce 3s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '20%',
          left: '5%',
          width: '150px',
          height: '150px',
          background: 'linear-gradient(135deg, var(--accent-color), var(--secondary-color))',
          borderRadius: '50%',
          opacity: '0.1',
          animation: 'bounce 4s ease-in-out infinite reverse'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="animate-fade-in" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              <Sparkles size={24} style={{ color: 'var(--primary-color)' }} />
              <span style={{ 
                color: 'var(--primary-color)', 
                fontWeight: '600',
                fontSize: '1.1rem'
              }}>
                Welcome to
              </span>
              <Sparkles size={24} style={{ color: 'var(--primary-color)' }} />
            </div>
            
            <h1 className="animate-slide-up title-glow" style={{ 
              fontSize: '4rem', 
              fontWeight: '800', 
              marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: '1.1',
              textShadow: '0 4px 8px rgba(0,0,0,0.1)',
              animationDelay: '0.2s',
              animation: 'titlePulse 3s ease-in-out infinite'
            }}>
              Stitch & Savour
            </h1>
            
            <p className="tagline" style={{ 
              fontSize: '1.4rem', 
              color: 'var(--text-secondary)', 
              marginBottom: '2.5rem',
              lineHeight: '1.6',
              fontWeight: '400'
            }}>
              Where homemade food and handcrafted crochet come together, 
              <br />straight from our home to your heart ❤️
            </p>
            
            <div className="hero-buttons" style={{ 
              display: 'flex', 
              gap: '1.5rem', 
              justifyContent: 'center', 
              flexWrap: 'wrap',
              marginBottom: '3rem'
            }}>
              <button 
                onClick={() => {
                  if (!user) {
                    localStorage.setItem('redirectAfterLogin', '/products');
                    navigate('/login');
                  } else {
                    navigate('/products');
                  }
                }}
                className="btn btn-primary btn-lg animate-pulse"
              >
                <ShoppingBag size={20} />
                Shop Now
              </button>
              <Link to="/about" className="btn btn-outline btn-lg">
                <Users size={20} />
                Our Story
              </Link>
            </div>
          </div>
        </div>
        
        <div style={{ 
          position: 'absolute', 
          bottom: '2rem', 
          left: '50%', 
          transform: 'translateX(-50%)',
          animation: 'bounce 2s infinite'
        }}>
          <ChevronDown size={32} style={{ color: 'var(--text-secondary)' }} />
        </div>
      </section>

      {/* About Sangita Section */}
      <section style={{ padding: '6rem 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="founder-section" style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '4rem', 
            alignItems: 'center',
            maxWidth: '1100px',
            margin: '0 auto'
          }}>
            <div className="founder-image animate-slide-in">
              <div className="card hover-lift" style={{ padding: '1rem', background: 'var(--bg-primary)' }}>
                <img
                  src="/images/sangita-photo.jpg"
                  alt="Sangita Thakur"
                  style={{
                    width: '100%',
                    borderRadius: '12px',
                    aspectRatio: '4/5',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.src = '/images/placeholder.jpg';
                  }}
                />
              </div>
            </div>
            <div className="founder-content animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'var(--primary-light)',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                marginBottom: '1.5rem'
              }}>
                <Heart size={16} style={{ color: 'var(--primary-color)' }} />
                <span style={{ color: 'var(--primary-color)', fontWeight: '600', fontSize: '0.9rem' }}>
                  Meet Our Founder
                </span>
              </div>
              
              <h2 style={{ 
                fontSize: '3rem', 
                fontWeight: '800', 
                marginBottom: '1.5rem',
                background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Sangita Thakur
              </h2>
              
              <p style={{ 
                fontSize: '1.2rem', 
                lineHeight: '1.8', 
                color: 'var(--text-secondary)', 
                marginBottom: '1.5rem' 
              }}>
                Welcome to Stitch & Savour! I'm Sangita, and every product here tells a story of warmth, 
                care, and creativity. What started as a hobby in the kitchen and a passion for crocheting 
                has grown into something beautiful that I'm excited to share with you.
              </p>
              
              <p style={{ 
                fontSize: '1.1rem', 
                lineHeight: '1.8', 
                color: 'var(--text-secondary)', 
                marginBottom: '2rem' 
              }}>
                From homemade delicacies crafted with traditional methods to handmade crochet items 
                woven with patience and love, everything here is made from our home to yours.
              </p>
              
              <Link to="/about" className="btn btn-primary">
                <Users size={18} />
                Read Our Complete Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '6rem 0', background: 'var(--bg-primary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ 
              fontSize: '3rem', 
              fontWeight: '800', 
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Why Choose Stitch & Savour?
            </h2>
            <p style={{ 
              fontSize: '1.3rem', 
              color: 'var(--text-secondary)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Experience the difference of handmade quality ✨
            </p>
          </div>
          
          <div className="animate-fade-in" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '2rem',
            animationDelay: '0.3s'
          }}>
            {features.map((feature, index) => (
              <div
                key={index}
                className={`card product-card hover-lift animate-stagger-${index + 1}`}
                style={{
                  textAlign: 'center',
                  padding: '3rem 2rem',
                  background: 'var(--bg-secondary)',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '-50%',
                  right: '-50%',
                  width: '200%',
                  height: '200%',
                  background: `linear-gradient(135deg, ${feature.gradient.split(' ')[1]}, ${feature.gradient.split(' ')[3]})`,
                  opacity: '0.05',
                  borderRadius: '50%'
                }} />
                
                <div style={{ 
                  position: 'relative',
                  zIndex: 2
                }}>
                  <div style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '80px',
                    height: '80px',
                    background: `linear-gradient(135deg, ${feature.gradient.split(' ')[1]}, ${feature.gradient.split(' ')[3]})`,
                    borderRadius: '20px',
                    marginBottom: '1.5rem',
                    color: 'white',
                    boxShadow: 'var(--shadow-lg)'
                  }}>
                    {feature.icon}
                  </div>
                  
                  <h3 style={{ 
                    fontSize: '1.4rem', 
                    fontWeight: '700', 
                    marginBottom: '1rem',
                    color: 'var(--text-primary)'
                  }}>
                    {feature.title}
                  </h3>
                  
                  <p style={{ 
                    color: 'var(--text-secondary)',
                    lineHeight: '1.6',
                    fontSize: '1rem'
                  }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section style={{ padding: '6rem 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ 
              fontSize: '3rem', 
              fontWeight: '800', 
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Our Product Categories
            </h2>
            <p style={{ 
              fontSize: '1.3rem', 
              color: 'var(--text-secondary)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Discover our range of homemade food and handcrafted items
            </p>
          </div>
          
          <div className="animate-fade-in product-categories-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '2rem',
            maxWidth: '900px',
            margin: '0 auto',
            animationDelay: '0.2s'
          }}>
            <div
              className="product-category-card food-category-card card product-card hover-scale animate-stagger-1"
              onClick={() => {
                if (!user) {
                  localStorage.setItem('redirectAfterLogin', '/products?category=food');
                  navigate('/login');
                } else {
                  navigate('/products?category=food');
                  window.scrollTo(0, 0);
                }
              }}
              style={{
                position: 'relative',
                overflow: 'hidden',
                textDecoration: 'none',
                color: 'white',
                minHeight: '350px',
                display: 'flex',
                alignItems: 'end',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                padding: 0,
                cursor: 'pointer'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                fontSize: '4rem',
                opacity: '0.3'
              }}>🍲</div>
              
              <div style={{ padding: '2.5rem', width: '100%', position: 'relative', zIndex: 2 }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍽️</div>
                <h3 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                  Homemade Food
                </h3>
                <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '1rem' }}>
                  Fresh, traditional recipes made with love
                </p>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(255,255,255,0.2)',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.9rem'
                }}>
                  <ShoppingBag size={16} />
                  Explore Food Items
                </div>
              </div>
            </div>
            
            <div
              className="product-category-card crochet-category-card card product-card hover-scale animate-stagger-2"
              onClick={() => {
                if (!user) {
                  localStorage.setItem('redirectAfterLogin', '/products?category=crochet');
                  navigate('/login');
                } else {
                  navigate('/products?category=crochet');
                  window.scrollTo(0, 0);
                }
              }}
              style={{
                position: 'relative',
                overflow: 'hidden',
                textDecoration: 'none',
                color: 'white',
                minHeight: '350px',
                display: 'flex',
                alignItems: 'end',
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                padding: 0,
                cursor: 'pointer'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                fontSize: '4rem',
                opacity: '0.3'
              }}>🧶</div>
              
              <div style={{ padding: '2.5rem', width: '100%', position: 'relative', zIndex: 2 }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
                <h3 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                  Handcrafted Crochet
                </h3>
                <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '1rem' }}>
                  Custom designs made just for you
                </p>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(255,255,255,0.2)',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.9rem'
                }}>
                  <Heart size={16} />
                  Explore Crochet Items
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ 
              fontSize: '3rem', 
              fontWeight: '800', 
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Frequently Asked Questions
            </h2>
            <p style={{ 
              fontSize: '1.3rem', 
              color: 'var(--text-secondary)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Find answers to common questions about our products and services
            </p>
          </div>
          
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="card"
                style={{
                  marginBottom: '1rem',
                  overflow: 'hidden',
                  background: 'var(--bg-secondary)'
                }}
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  style={{
                    width: '100%',
                    padding: '1.5rem',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {faq.question}
                  <ChevronDown
                    size={20}
                    style={{
                      transform: openFAQ === index ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                      color: 'var(--primary-color)'
                    }}
                  />
                </button>
                {openFAQ === index && (
                  <div style={{ 
                    padding: '0 1.5rem 1.5rem 1.5rem',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.7',
                    fontSize: '1rem',
                    borderTop: '1px solid var(--border-color)'
                  }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: '6rem 0', background: 'var(--bg-primary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ 
              fontSize: '3rem', 
              fontWeight: '800', 
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Featured Products
            </h2>
            <p style={{ 
              fontSize: '1.3rem', 
              color: 'var(--text-secondary)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Discover our most popular handmade items
            </p>
          </div>
          
          <div className="animate-fade-in" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem',
            animationDelay: '0.3s'
          }}>
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className={`card product-card hover-lift animate-stagger-${product.id}`}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  if (!user) {
                    localStorage.setItem('redirectAfterLogin', `/product/${product.id}`);
                    navigate('/login');
                  } else {
                    navigate(`/product/${product.id}`);
                  }
                }}
              >
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
                <div style={{ padding: '1.5rem' }}>
                  <h4 style={{ 
                    margin: '0 0 0.5rem 0', 
                    fontSize: '1.1rem',
                    fontWeight: '600'
                  }}>
                    {product.name}
                  </h4>
                  
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    marginBottom: '1rem'
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
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      {product.rating}
                    </span>
                  </div>
                  
                  <div style={{ 
                    fontSize: '1.2rem', 
                    fontWeight: '700',
                    color: 'var(--primary-color)',
                    marginBottom: '1rem'
                  }}>
                    ₹{product.price}
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
            ))}
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <button 
              onClick={() => {
                if (!user) {
                  localStorage.setItem('redirectAfterLogin', '/products');
                  navigate('/login');
                } else {
                  navigate('/products');
                }
              }}
              className="btn btn-primary btn-lg"
            >
              <ShoppingBag size={20} />
              View All Products
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        padding: '6rem 0', 
        background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '40%',
          height: '200%',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%'
        }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{ 
              fontSize: '3rem', 
              fontWeight: '800', 
              marginBottom: '1rem'
            }}>
              Ready to Experience Handmade Quality?
            </h2>
            <p style={{ 
              fontSize: '1.3rem', 
              marginBottom: '2.5rem',
              opacity: 0.9,
              lineHeight: '1.6'
            }}>
              Browse our collection of homemade food and handcrafted crochet items. 
              Each product is made with love, just for you! 💝
            </p>
            <button
              onClick={() => {
                if (!user) {
                  localStorage.setItem('redirectAfterLogin', '/products');
                  navigate('/login');
                } else {
                  navigate('/products');
                }
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                background: 'white',
                color: 'var(--primary-color)',
                padding: '1.25rem 2.5rem',
                borderRadius: '50px',
                border: 'none',
                fontWeight: '700',
                fontSize: '1.2rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
              }}
            >
              <ShoppingBag size={24} />
              Start Shopping Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;