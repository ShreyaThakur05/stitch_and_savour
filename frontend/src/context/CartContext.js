import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import cartService from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('stitch_savour_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage and sync to backend whenever it changes
  useEffect(() => {
    localStorage.setItem('stitch_savour_cart', JSON.stringify(cartItems));
    if (user && cartItems.length > 0) {
      cartService.syncCart(cartItems);
    }
  }, [cartItems, user]);

  const addToCart = (product, quantity = 1, customizations = {}, selectedWeight = '') => {
    // Calculate final price including customizations and weight
    let finalPrice = product.price;
    
    // For food items, calculate price based on weight
    if (product.category === 'food' && selectedWeight) {
      if (product.name === 'Homemade Gujiya') {
        // Special pricing for Gujiya
        if (selectedWeight === '6 pieces') finalPrice = 150;
        else if (selectedWeight === '12 pieces') finalPrice = 300;
        else if (selectedWeight === '24 pieces') finalPrice = 600;
      } else if (product.pricePerKg) {
        // Handle weight-based pricing for other food items
        let weightValue;
        if (selectedWeight.includes('kg')) {
          weightValue = parseFloat(selectedWeight.replace(/[^0-9.]/g, ''));
        } else {
          weightValue = parseFloat(selectedWeight.replace(/[^0-9.]/g, '')) / 1000; // Convert g to kg
        }
        finalPrice = Math.round(product.pricePerKg * weightValue);
      }
    }
    
    // Add customization modifiers
    if (product.customization) {
      product.customization.forEach(option => {
        const selectedValue = customizations[option.type];
        if (selectedValue && option.priceModifier && typeof option.priceModifier === 'object') {
          finalPrice += option.priceModifier[selectedValue] || 0;
        }
      });
    }

    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item => (item.id === product.id || item._id === product._id) && 
        JSON.stringify(item.customizations) === JSON.stringify(customizations) &&
        item.selectedWeight === selectedWeight
      );

      if (existingItemIndex > -1) {
        // Update existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, {
          ...product,
          id: product.id || product._id,
          quantity,
          customizations,
          selectedWeight,
          finalPrice,
          cartId: `${product.id || product._id}_${Date.now()}_${Math.random()}`
        }];
      }
    });
    return true;
  };

  const removeFromCart = (cartId) => {
    setCartItems(prevItems => prevItems.filter(item => item.cartId !== cartId));
  };

  const updateQuantity = (cartId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.cartId === cartId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = async () => {
    setCartItems([]);
    localStorage.removeItem('stitch_savour_cart');
    if (user) {
      await cartService.clearCart();
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = item.finalPrice || item.price;
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getDeliveryTime = () => {
    if (cartItems.length === 0) return 0;
    return Math.max(...cartItems.map(item => item.deliveryTime || 2));
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getTotalItems,
    getDeliveryTime
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};