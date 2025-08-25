const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No valid token provided', code: 'NO_TOKEN' });
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    if (!token || token === 'null' || token === 'undefined') {
      return res.status(401).json({ message: 'Invalid token format', code: 'INVALID_TOKEN' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired', code: 'TOKEN_EXPIRED' });
      }
      return res.status(401).json({ message: 'Invalid token', code: 'INVALID_TOKEN' });
    }
    
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found', code: 'USER_NOT_FOUND' });
    }

    req.userId = user._id;
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Authentication failed', code: 'AUTH_ERROR' });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    // First run auth middleware
    await new Promise((resolve, reject) => {
      auth(req, res, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });
    
    // Check if user has admin role
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Admin access required',
        code: 'ADMIN_REQUIRED'
      });
    }
    
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(401).json({ 
      message: 'Authentication failed',
      code: 'AUTH_FAILED'
    });
  }
};

module.exports = { auth, adminAuth };