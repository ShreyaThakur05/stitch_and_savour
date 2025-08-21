import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock users for demo (in real app, this would be API calls)
  const mockUsers = [
    {
      id: 1,
      name: 'Admin',
      email: 'admin@stitchandsavour.com',
      phone: '9970944685',
      address: 'Sirul, Maharashtra, India',
      role: 'admin',
      password: 'admin123'
    }
  ];

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('stitch_savour_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        localStorage.removeItem('stitch_savour_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Check hardcoded admin
      const adminUser = mockUsers.find(u => u.email === email && u.password === password);
      if (adminUser) {
        const { password: _, ...userWithoutPassword } = adminUser;
        setUser(userWithoutPassword);
        localStorage.setItem('stitch_savour_user', JSON.stringify(userWithoutPassword));
        return true;
      }

      // Check localStorage users (registered users)
      const registeredUsers = JSON.parse(localStorage.getItem('stitch_savour_registered_users') || '[]');
      const foundUser = registeredUsers.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('stitch_savour_user', JSON.stringify(userWithoutPassword));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (userData) => {
    try {
      // Prevent admin signup
      if (userData.email === 'admin@stitchandsavour.com') {
        return false;
      }

      // Check if user already exists
      const registeredUsers = JSON.parse(localStorage.getItem('stitch_savour_registered_users') || '[]');
      const existingUser = registeredUsers.find(u => u.email === userData.email);
      
      if (existingUser) {
        return false;
      }

      // Create new user
      const newUser = {
        id: Date.now(),
        ...userData,
        role: 'user',
        createdAt: new Date().toISOString()
      };

      // Save to registered users
      registeredUsers.push(newUser);
      localStorage.setItem('stitch_savour_registered_users', JSON.stringify(registeredUsers));

      // Log in the user
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('stitch_savour_user', JSON.stringify(userWithoutPassword));

      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('stitch_savour_user');
    localStorage.removeItem('stitch_savour_cart');
  };

  const updateProfile = async (updatedData) => {
    try {
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);
      localStorage.setItem('stitch_savour_user', JSON.stringify(updatedUser));

      // Update in registered users if not admin
      if (user.role !== 'admin') {
        const registeredUsers = JSON.parse(localStorage.getItem('stitch_savour_registered_users') || '[]');
        const userIndex = registeredUsers.findIndex(u => u.id === user.id);
        if (userIndex > -1) {
          registeredUsers[userIndex] = { ...registeredUsers[userIndex], ...updatedData };
          localStorage.setItem('stitch_savour_registered_users', JSON.stringify(registeredUsers));
        }
      }

      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};