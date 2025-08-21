import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import wishlistService from '../services/wishlistService';

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

  const addToWishlist = async (product) => {
    if (user && !wishlistItems.find(item => item._id === product._id)) {
      try {
        await wishlistService.addToWishlist(product, user.email);
        const newItems = [...wishlistItems, product];
        setWishlistItems(newItems);
      } catch (error) {
        console.error('Failed to add to wishlist:', error);
      }
    }
  };

  const removeFromWishlist = async (productId) => {
    if (user) {
      try {
        await wishlistService.removeFromWishlist(productId, user.email);
        const newItems = wishlistItems.filter(item => item._id !== productId);
        setWishlistItems(newItems);
      } catch (error) {
        console.error('Failed to remove from wishlist:', error);
      }
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