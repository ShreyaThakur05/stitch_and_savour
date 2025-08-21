import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, ShoppingCart, User, Menu, X, Settings } from 'lucide-react';
import ProfileSettings from './ProfileSettings';
import InboxNotification from './InboxNotification';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  return (
    <nav style={{
      background: 'var(--bg-primary)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '1rem 0'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/" style={{
          fontSize: '1.8rem',
          fontWeight: '800',
          color: 'var(--primary-color)',
          textDecoration: 'none'
        }} onClick={() => window.scrollTo(0, 0)}>
          Stitch & Savour
        </Link>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '2rem'
        }}>
          {user?.role === 'admin' ? (
            <Link to="/admin" style={{ textDecoration: 'none', color: 'var(--nav-text)' }} onClick={() => window.scrollTo(0, 0)}>
              Dashboard
            </Link>
          ) : user ? (
            <Link to="/dashboard" style={{ textDecoration: 'none', color: 'var(--nav-text)' }} onClick={() => window.scrollTo(0, 0)}>
              Dashboard
            </Link>
          ) : null}
          {user?.role !== 'admin' && (
            <Link to="/products" style={{ textDecoration: 'none', color: 'var(--nav-text)' }} onClick={() => window.scrollTo(0, 0)}>
              Products
            </Link>
          )}
          <Link to="/about" style={{ textDecoration: 'none', color: 'var(--nav-text)' }} onClick={() => window.scrollTo(0, 0)}>
            About
          </Link>
          <Link to="/contact" style={{ textDecoration: 'none', color: 'var(--nav-text)' }} onClick={() => window.scrollTo(0, 0)}>
            Contact
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={toggleTheme}
            style={{
              background: 'none',
              border: 'none',
              padding: '0.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {theme === 'dark' ? <Sun size={20} style={{ color: 'var(--nav-text)' }} /> : <Moon size={20} style={{ color: 'var(--nav-text)' }} />}
          </button>

          {user && user.role !== 'admin' && (
            <Link
              to="/cart"
              style={{
                position: 'relative',
                padding: '0.5rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'var(--nav-text)'
              }}
              onClick={() => window.scrollTo(0, 0)}
            >
              <ShoppingCart size={20} />
              {getTotalItems() > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  background: 'var(--primary-color)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '0.7rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {getTotalItems()}
                </span>
              )}
            </Link>
          )}

          <InboxNotification />



          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <User size={20} style={{ color: 'var(--nav-text)' }} />
                  <span style={{ color: 'var(--nav-text)' }}>{user.name}</span>
                </button>
                
                {isProfileOpen && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: '100%',
                    marginTop: '0.5rem',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '0.5rem 0',
                    minWidth: '150px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}>

                    <button
                      onClick={() => {
                        setShowProfileSettings(true);
                        setIsProfileOpen(false);
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        background: 'none',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        cursor: 'pointer',
                        color: 'var(--text-primary)'
                      }}
                    >
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        background: 'none',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        cursor: 'pointer',
                        color: 'var(--text-primary)'
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
              

            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm" onClick={() => window.scrollTo(0, 0)}>
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm" onClick={() => window.scrollTo(0, 0)}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Profile Settings Modal */}
      {showProfileSettings && (
        <ProfileSettings onClose={() => setShowProfileSettings(false)} />
      )}
    </nav>
  );
};

export default Navbar;