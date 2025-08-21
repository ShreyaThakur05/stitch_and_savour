import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`wishlist_${user.email}`);
      if (saved) {
        setWishlistItems(JSON.parse(saved));
      }
    } else {
      setWishlistItems([]);
    }
  }, [user]);

  const addToWishlist = (product) => {
    if (user && !wishlistItems.find(item => item._id === product._id)) {
      const newItems = [...wishlistItems, product];
      setWishlistItems(newItems);
      localStorage.setItem(`wishlist_${user.email}`, JSON.stringify(newItems));
    }
  };

  const removeFromWishlist = (productId) => {
    if (user) {
      const newItems = wishlistItems.filter(item => item._id !== productId);
      setWishlistItems(newItems);
      localStorage.setItem(`wishlist_${user.email}`, JSON.stringify(newItems));
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item._id === productId);
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      wishlistCount: wishlistItems.length
    }}>
      {children}
    </WishlistContext.Provider>
  );
};