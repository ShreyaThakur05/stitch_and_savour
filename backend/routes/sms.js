const express = require('express');
const router = express.Router();
const whatsappService = require('../utils/smsService');

router.post('/send-sms', async (req, res) => {
  try {
    const { phone, message } = req.body;
    
    if (!phone || !message) {
      return res.status(400).json({
        success: false,
        error: 'Phone number and message are required'
      });
    }

    const result = await whatsappService.sendMessage(phone, message);
    
    res.json(result);
  } catch (error) {
    console.error('WhatsApp API error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;