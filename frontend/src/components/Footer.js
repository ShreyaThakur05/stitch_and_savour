import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MessageCircle } from 'lucide-react';

const Footer = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      padding: isMobile ? '2rem 0 1.5rem 0' : '3rem 0 2rem 0',
      marginTop: isMobile ? '2rem' : '4rem'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: isMobile ? '1.5rem' : '2rem',
          marginBottom: isMobile ? '1.5rem' : '2rem'
        }}>
          <div style={{ 
            padding: isMobile ? '1rem' : '0',
            background: isMobile ? 'var(--bg-primary)' : 'transparent',
            borderRadius: isMobile ? '12px' : '0',
            border: isMobile ? '1px solid var(--border-color)' : 'none'
          }}>
            <h3 style={{ 
              marginBottom: '1rem', 
              color: 'var(--primary-color)',
              fontSize: isMobile ? '1.1rem' : '1.2rem',
              fontWeight: '700'
            }}>
              Company Info
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link 
                to="/about" 
                style={{ 
                  textDecoration: 'none', 
                  color: 'var(--text-secondary)',
                  padding: isMobile ? '0.5rem 0' : '0',
                  fontSize: isMobile ? '0.95rem' : '1rem',
                  fontWeight: '500'
                }} 
                onClick={() => window.scrollTo(0, 0)}
              >
                About Us
              </Link>
              <Link 
                to="/products" 
                style={{ 
                  textDecoration: 'none', 
                  color: 'var(--text-secondary)',
                  padding: isMobile ? '0.5rem 0' : '0',
                  fontSize: isMobile ? '0.95rem' : '1rem',
                  fontWeight: '500'
                }} 
                onClick={() => window.scrollTo(0, 0)}
              >
                Our Products
              </Link>
            </div>
          </div>

          <div style={{ 
            padding: isMobile ? '1rem' : '0',
            background: isMobile ? 'var(--bg-primary)' : 'transparent',
            borderRadius: isMobile ? '12px' : '0',
            border: isMobile ? '1px solid var(--border-color)' : 'none'
          }}>
            <h3 style={{ 
              marginBottom: '1rem', 
              color: 'var(--primary-color)',
              fontSize: isMobile ? '1.1rem' : '1.2rem',
              fontWeight: '700'
            }}>
              Customer Support
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link 
                to="/contact" 
                style={{ 
                  textDecoration: 'none', 
                  color: 'var(--text-secondary)',
                  padding: isMobile ? '0.5rem 0' : '0',
                  fontSize: isMobile ? '0.95rem' : '1rem',
                  fontWeight: '500'
                }} 
                onClick={() => window.scrollTo(0, 0)}
              >
                Contact Form
              </Link>
              <a
                href="https://wa.me/919970944685"
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  textDecoration: 'none', 
                  color: 'var(--text-secondary)',
                  padding: isMobile ? '0.5rem 0' : '0',
                  fontSize: isMobile ? '0.95rem' : '1rem',
                  fontWeight: '500'
                }}
              >
                WhatsApp Support
              </a>
            </div>
          </div>

          <div style={{ 
            padding: isMobile ? '1rem' : '0',
            background: isMobile ? 'var(--bg-primary)' : 'transparent',
            borderRadius: isMobile ? '12px' : '0',
            border: isMobile ? '1px solid var(--border-color)' : 'none'
          }}>
            <h3 style={{ 
              marginBottom: '1rem', 
              color: 'var(--primary-color)',
              fontSize: isMobile ? '1.1rem' : '1.2rem',
              fontWeight: '700'
            }}>
              Legal & Policy
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link 
                to="/terms" 
                style={{ 
                  textDecoration: 'none', 
                  color: 'var(--text-secondary)',
                  padding: isMobile ? '0.5rem 0' : '0',
                  fontSize: isMobile ? '0.95rem' : '1rem',
                  fontWeight: '500'
                }} 
                onClick={() => window.scrollTo(0, 0)}
              >
                Terms & Conditions
              </Link>
              <Link 
                to="/refund-policy" 
                style={{ 
                  textDecoration: 'none', 
                  color: 'var(--text-secondary)',
                  padding: isMobile ? '0.5rem 0' : '0',
                  fontSize: isMobile ? '0.95rem' : '1rem',
                  fontWeight: '500'
                }} 
                onClick={() => window.scrollTo(0, 0)}
              >
                Refund & Cancellation
              </Link>
            </div>
          </div>

          <div style={{ 
            padding: isMobile ? '1rem' : '0',
            background: isMobile ? 'var(--bg-primary)' : 'transparent',
            borderRadius: isMobile ? '12px' : '0',
            border: isMobile ? '1px solid var(--border-color)' : 'none'
          }}>
            <h3 style={{ 
              marginBottom: '1rem', 
              color: 'var(--primary-color)',
              fontSize: isMobile ? '1.1rem' : '1.2rem',
              fontWeight: '700'
            }}>
              Get in Touch
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                padding: isMobile ? '0.5rem 0' : '0'
              }}>
                <Mail size={18} color="var(--primary-color)" />
                <a
                  href="mailto:Sangita.shreyas@gmail.com"
                  style={{ 
                    textDecoration: 'none', 
                    color: 'var(--text-secondary)',
                    fontSize: isMobile ? '0.9rem' : '1rem',
                    fontWeight: '500',
                    wordBreak: 'break-all'
                  }}
                >
                  Sangita.shreyas@gmail.com
                </a>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                padding: isMobile ? '0.5rem 0' : '0'
              }}>
                <Phone size={18} color="var(--primary-color)" />
                <a
                  href="tel:+919970944685"
                  style={{ 
                    textDecoration: 'none', 
                    color: 'var(--text-secondary)',
                    fontSize: isMobile ? '0.9rem' : '1rem',
                    fontWeight: '500'
                  }}
                >
                  +91 9970944685
                </a>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                padding: isMobile ? '0.5rem 0' : '0'
              }}>
                <Phone size={18} color="var(--primary-color)" />
                <a
                  href="tel:+918668806190"
                  style={{ 
                    textDecoration: 'none', 
                    color: 'var(--text-secondary)',
                    fontSize: isMobile ? '0.9rem' : '1rem',
                    fontWeight: '500'
                  }}
                >
                  +91 8668806190 (Alt)
                </a>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: isMobile ? '1.5rem' : '2rem',
          display: 'flex',
          justifyContent: isMobile ? 'center' : 'space-between',
          alignItems: 'center',
          flexDirection: isMobile ? 'column' : 'row',
          textAlign: isMobile ? 'center' : 'left',
          gap: isMobile ? '1rem' : '1rem'
        }}>
          <div style={{ order: isMobile ? 2 : 1 }}>
            <div style={{
              fontSize: isMobile ? '1.3rem' : '1.5rem',
              fontWeight: '800',
              color: 'var(--primary-color)',
              marginBottom: '0.5rem'
            }}>
              Stitch & Savour
            </div>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: isMobile ? '0.85rem' : '0.9rem',
              margin: 0,
              lineHeight: '1.4'
            }}>
              Homemade food and handcrafted crochet products by Sangita Thakur
            </p>
          </div>
          <div style={{
            color: 'var(--text-secondary)',
            fontSize: isMobile ? '0.8rem' : '0.9rem',
            order: isMobile ? 1 : 2,
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: '0.5rem' }}>
              © {new Date().getFullYear()} Stitch & Savour. All rights reserved.
            </div>
            <div style={{
              fontSize: isMobile ? '0.7rem' : '0.75rem',
              color: '#888',
              cursor: 'pointer',
              transition: 'color 0.2s ease',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
            onMouseLeave={(e) => e.target.style.color = '#888'}
            >
              Created by Shreya Thakur
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;