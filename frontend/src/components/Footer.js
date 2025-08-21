import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      padding: '3rem 0 2rem 0',
      marginTop: '4rem'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          <div>
            <h3 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>
              Company Info
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link to="/about" style={{ textDecoration: 'none', color: 'var(--text-secondary)' }} onClick={() => window.scrollTo(0, 0)}>
                About Us
              </Link>
              <Link to="/products" style={{ textDecoration: 'none', color: 'var(--text-secondary)' }} onClick={() => window.scrollTo(0, 0)}>
                Our Products
              </Link>
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>
              Customer Support
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link to="/contact" style={{ textDecoration: 'none', color: 'var(--text-secondary)' }} onClick={() => window.scrollTo(0, 0)}>
                Contact Form
              </Link>
              <a
                href="https://wa.me/919970944685"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', color: 'var(--text-secondary)' }}
              >
                WhatsApp Support
              </a>
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>
              Legal & Policy
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link to="/terms" style={{ textDecoration: 'none', color: 'var(--text-secondary)' }} onClick={() => window.scrollTo(0, 0)}>
                Terms & Conditions
              </Link>
              <Link to="/refund-policy" style={{ textDecoration: 'none', color: 'var(--text-secondary)' }} onClick={() => window.scrollTo(0, 0)}>
                Refund & Cancellation
              </Link>
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>
              Get in Touch
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} color="var(--primary-color)" />
                <a
                  href="mailto:Sangita.shreyas@gmail.com"
                  style={{ textDecoration: 'none', color: 'var(--text-secondary)' }}
                >
                  Sangita.shreyas@gmail.com
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="var(--primary-color)" />
                <a
                  href="tel:+919970944685"
                  style={{ textDecoration: 'none', color: 'var(--text-secondary)' }}
                >
                  +91 9970944685
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="var(--primary-color)" />
                <a
                  href="tel:+918668806190"
                  style={{ textDecoration: 'none', color: 'var(--text-secondary)' }}
                >
                  +91 8668806190 (Alt)
                </a>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '800',
              color: 'var(--primary-color)',
              marginBottom: '0.5rem'
            }}>
              Stitch & Savour
            </div>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              margin: 0
            }}>
              Homemade food and handcrafted crochet products by Sangita Thakur
            </p>
          </div>
          <div style={{
            color: 'var(--text-secondary)',
            fontSize: '0.9rem'
          }}>
            © {new Date().getFullYear()} Stitch & Savour. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;