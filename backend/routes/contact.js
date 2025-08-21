const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const {
  submitContact,
  getAllContacts,
  replyToContact,
  getUserInbox
} = require('../controllers/contactController');

// Public routes
router.post('/submit', submitContact);

// User routes
router.get('/inbox', auth, getUserInbox);

// Admin routes
router.get('/all', auth, adminAuth, getAllContacts);
router.put('/reply/:id', auth, adminAuth, replyToContact);

module.exports = router;