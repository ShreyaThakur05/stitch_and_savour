import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, ShoppingCart, User, Menu, X, Settings, MessageSquare, Heart, Bell } from 'lucide-react';
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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileOpen(false);
    setIsMenuOpen(false);
    document.body.classList.remove('mobile-menu-open');
  };

  const handleMenuClick = () => {
    setIsMenuOpen(false);
    document.body.classList.remove('mobile-menu-open');
    window.scrollTo(0, 0);
  };

  return (
    <nav className="navbar" style={{
      background: 'var(--bg-primary)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: isMobile ? '0.75rem 0' : '1rem 0'
    }}>
      {/* Mobile Layout */}
      {isMobile && (
        <>
          {/* Top Row: Brand centered, Theme toggle right */}
          <div className="navbar-top-row">
            <div></div>
            <Link to="/" className="navbar-brand-center" onClick={() => window.scrollTo(0, 0)}>
              Stitch & Savour
            </Link>
            <button
              onClick={toggleTheme}
              className="navbar-theme-toggle"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
          
          {/* Empty bottom row for mobile */}
          <div className="navbar-bottom-row"></div>
        </>
      )}
      
      {/* Desktop Layout - Unchanged */}
      {!isMobile && (
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>

        
        {/* Logo */}
        <Link to="/" className="navbar-brand" style={{
          fontSize: isMobile ? '1.4rem' : '1.8rem',
          fontWeight: '800',
          color: 'var(--primary-color)',
          textDecoration: 'none'
        }} onClick={() => window.scrollTo(0, 0)}>
          Stitch & Savour
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '2rem'
          }}>
            {user?.role === 'admin' ? (
              <Link to="/admin" style={{ textDecoration: 'none', color: 'var(--nav-text)', fontWeight: '500' }} onClick={() => window.scrollTo(0, 0)}>
                Dashboard
              </Link>
            ) : user ? (
              <Link to="/dashboard" style={{ textDecoration: 'none', color: 'var(--nav-text)', fontWeight: '500' }} onClick={() => window.scrollTo(0, 0)}>
                Dashboard
              </Link>
            ) : null}
            {user?.role !== 'admin' && (
              <Link to="/products" style={{ textDecoration: 'none', color: 'var(--nav-text)', fontWeight: '500' }} onClick={() => window.scrollTo(0, 0)}>
                Products
              </Link>
            )}
            <Link to="/about" style={{ textDecoration: 'none', color: 'var(--nav-text)', fontWeight: '500' }} onClick={() => window.scrollTo(0, 0)}>
              About
            </Link>
            <Link to="/contact" style={{ textDecoration: 'none', color: 'var(--nav-text)', fontWeight: '500' }} onClick={() => window.scrollTo(0, 0)}>
              Contact
            </Link>
          </div>
        )}

        {/* Right side controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.5rem' : '1rem' }}>
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            style={{
              background: 'none',
              border: 'none',
              padding: isMobile ? '0.75rem' : '0.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '44px',
              minHeight: '44px'
            }}
          >
            {theme === 'dark' ? <Sun size={20} style={{ color: 'var(--nav-text)' }} /> : <Moon size={20} style={{ color: 'var(--nav-text)' }} />}
          </button>

          {/* Cart icon */}
          {user && user.role !== 'admin' && (
            <Link
              to="/cart"
              style={{
                position: 'relative',
                padding: isMobile ? '0.75rem' : '0.5rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'var(--nav-text)',
                minWidth: '44px',
                minHeight: '44px',
                justifyContent: 'center'
              }}
              onClick={() => window.scrollTo(0, 0)}
            >
              <ShoppingCart size={20} />
              {getTotalItems() > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  background: 'var(--primary-color)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '0.7rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600'
                }}>
                  {getTotalItems()}
                </span>
              )}
            </Link>
          )}

          {/* Inbox notification */}
          <InboxNotification />
          
          {/* Mobile Toggle Button - Only on Mobile */}
          {isMobile && (
            <button
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
                document.body.classList.toggle('mobile-menu-open', !isMenuOpen);
              }}
              className="navbar-toggler"
              style={{
                background: 'none',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '44px',
                minHeight: '44px',
                WebkitTapHighlightColor: 'rgba(0,0,0,0)'
              }}
            >
              {isMenuOpen ? <X size={24} style={{ color: 'var(--nav-text)' }} /> : <Menu size={24} style={{ color: 'var(--nav-text)' }} />}
            </button>
          )}



          {/* Desktop user menu */}
          {!isMobile && user ? (
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
                <span style={{ color: 'var(--nav-text)', fontWeight: '500' }}>{user.name}</span>
              </button>
              
              {isProfileOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  marginTop: '0.5rem',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '0.5rem 0',
                  minWidth: '150px',
                  boxShadow: 'var(--shadow-lg)'
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
                      padding: '0.75rem 1rem',
                      cursor: 'pointer',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem'
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
                      padding: '0.75rem 1rem',
                      cursor: 'pointer',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem'
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : !isMobile && !user ? (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm" onClick={() => window.scrollTo(0, 0)}>
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm" onClick={() => window.scrollTo(0, 0)}>
                Sign Up
              </Link>
            </div>
          ) : null}
        </div>
        </div>
      )}
      
      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="mobile-bottom-nav">
          {user ? (
            <button
              onClick={() => setShowProfileSettings(true)}
            >
              <User size={20} />
              <span>Profile</span>
            </button>
          ) : (
            <Link to="/login" onClick={() => window.scrollTo(0, 0)}>
              <User size={20} />
              <span>Login</span>
            </Link>
          )}
          
          {user?.role !== 'admin' && (
            <Link to="/products" onClick={() => window.scrollTo(0, 0)}>
              <ShoppingCart size={18} />
              <span>Products</span>
            </Link>
          )}
          
          <Link to="/about" onClick={() => window.scrollTo(0, 0)}>
            <User size={18} />
            <span>About</span>
          </Link>
          
          <Link to="/contact" onClick={() => window.scrollTo(0, 0)}>
            <MessageSquare size={18} />
            <span>Contact</span>
          </Link>
          

          
          {user?.role === 'admin' ? (
            <Link to="/admin" onClick={() => window.scrollTo(0, 0)}>
              <Settings size={18} />
              <span>Dashboard</span>
            </Link>
          ) : user ? (
            <Link to="/dashboard" onClick={() => window.scrollTo(0, 0)}>
              <User size={18} />
              <span>Dashboard</span>
            </Link>
          ) : null}
        </div>
      )}
      
      {/* Mobile User Section */}
      {isMobile && user && (
        <div className="mobile-user-section">
          <div className="user-info">
            <User size={16} style={{ color: 'var(--primary-color)' }} />
            <span className="user-name">{user.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="logout-btn"
          >
            Logout
          </button>
        </div>
      )}
      
      {/* Mobile Auth Buttons */}
      {isMobile && !user && (
        <div className="mobile-auth-buttons">
          <Link to="/login" className="btn-outline" onClick={() => window.scrollTo(0, 0)}>
            Login
          </Link>
          <Link to="/signup" className="btn-primary" onClick={() => window.scrollTo(0, 0)}>
            Sign Up
          </Link>
        </div>
      )}
      
      {/* Mobile Menu Overlay */}
      {isMobile && isMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999
        }} onClick={() => setIsMenuOpen(false)} />
      )}

      {/* Mobile Menu */}
      {isMobile && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: isMenuOpen ? 0 : '-100%',
          width: '280px',
          height: '100vh',
          background: 'var(--bg-primary)',
          borderLeft: '1px solid var(--border-color)',
          zIndex: 1000,
          transition: 'right 0.3s ease',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxShadow: 'var(--shadow-xl)'
        }}>
          {/* Mobile menu header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--border-color)'
          }}>
            <span style={{
              fontSize: '1.2rem',
              fontWeight: '700',
              color: 'var(--primary-color)'
            }}>
              Menu
            </span>
            <button
              onClick={() => setIsMenuOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.5rem',
                cursor: 'pointer',
                borderRadius: '8px'
              }}
            >
              <X size={24} style={{ color: 'var(--text-primary)' }} />
            </button>
          </div>

          {/* Navigation links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {user?.role === 'admin' ? (
              <Link 
                to="/admin" 
                onClick={handleMenuClick}
                style={{
                  padding: '1rem',
                  textDecoration: 'none',
                  color: 'var(--text-primary)',
                  borderRadius: '12px',
                  background: 'var(--bg-secondary)',
                  fontWeight: '500',
                  fontSize: '1rem',
                  minHeight: '44px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                Dashboard
              </Link>
            ) : user ? (
              <Link 
                to="/dashboard" 
                onClick={handleMenuClick}
                style={{
                  padding: '1rem',
                  textDecoration: 'none',
                  color: 'var(--text-primary)',
                  borderRadius: '12px',
                  background: 'var(--bg-secondary)',
                  fontWeight: '500',
                  fontSize: '1rem',
                  minHeight: '44px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                Dashboard
              </Link>
            ) : null}
            
            {user?.role !== 'admin' && (
              <Link 
                to="/products" 
                onClick={handleMenuClick}
                style={{
                  padding: '1rem',
                  textDecoration: 'none',
                  color: 'var(--text-primary)',
                  borderRadius: '12px',
                  background: 'var(--bg-secondary)',
                  fontWeight: '500',
                  fontSize: '1rem',
                  minHeight: '44px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                Products
              </Link>
            )}
            
            <Link 
              to="/about" 
              onClick={handleMenuClick}
              style={{
                padding: '1rem',
                textDecoration: 'none',
                color: 'var(--text-primary)',
                borderRadius: '12px',
                background: 'var(--bg-secondary)',
                fontWeight: '500',
                fontSize: '1rem',
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              About
            </Link>
            
            <Link 
              to="/contact" 
              onClick={handleMenuClick}
              style={{
                padding: '1rem',
                textDecoration: 'none',
                color: 'var(--text-primary)',
                borderRadius: '12px',
                background: 'var(--bg-secondary)',
                fontWeight: '500',
                fontSize: '1rem',
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              Contact
            </Link>
          </div>

          {/* User section */}
          {user ? (
            <div style={{
              marginTop: 'auto',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-color)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem',
                background: 'var(--bg-secondary)',
                borderRadius: '12px',
                marginBottom: '1rem'
              }}>
                <User size={20} style={{ color: 'var(--primary-color)' }} />
                <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{user.name}</span>
              </div>
              
              <button
                onClick={() => {
                  setShowProfileSettings(true);
                  setIsMenuOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'var(--bg-secondary)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem',
                  minHeight: '44px'
                }}
              >
                Profile Settings
              </button>
              
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'var(--error)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  minHeight: '44px'
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div style={{
              marginTop: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <Link 
                to="/login" 
                onClick={handleMenuClick}
                style={{
                  padding: '0.75rem',
                  textAlign: 'center',
                  background: 'transparent',
                  border: '2px solid var(--primary-color)',
                  borderRadius: '12px',
                  color: 'var(--primary-color)',
                  textDecoration: 'none',
                  fontWeight: '600',
                  minHeight: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                onClick={handleMenuClick}
                style={{
                  padding: '0.75rem',
                  textAlign: 'center',
                  background: 'var(--primary-color)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: '600',
                  minHeight: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
      
      {/* Profile Settings Modal */}
      {showProfileSettings && (
        <ProfileSettings onClose={() => setShowProfileSettings(false)} />
      )}
    </nav>
  );
};

export default Navbar;