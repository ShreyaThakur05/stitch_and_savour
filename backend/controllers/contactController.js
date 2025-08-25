const Contact = require('../models/Contact');

// Submit contact form
const submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, customSubject, message } = req.body;

    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      customSubject: subject === 'others' ? customSubject : undefined,
      message,
      status: 'pending'
    });

    await contact.save();
    
    console.log(`📬 New contact message from ${email}: ${subject}`);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully! We\'ll get back to you soon.',
      contactId: contact._id
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again.',
      error: error.message
    });
  }
};

// Get all contacts (admin)
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    
    console.log(`📬 Admin fetching ${contacts.length} contact messages`);
    
    res.json({ 
      success: true, 
      contacts,
      total: contacts.length
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch contacts',
      error: error.message
    });
  }
};

// Reply to contact (admin)
const replyToContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      id,
      {
        adminReply: reply,
        status: 'replied',
        repliedAt: new Date(),
        repliedBy: req.user.id
      },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    res.json({ success: true, contact });
  } catch (error) {
    console.error('Reply to contact error:', error);
    res.status(500).json({ success: false, message: 'Failed to send reply' });
  }
};

// Get user inbox (user's contact messages with replies)
const getUserInbox = async (req, res) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) {
      return res.status(400).json({ 
        success: false, 
        message: 'User email not found' 
      });
    }
    
    const contacts = await Contact.find({ email: userEmail })
      .sort({ createdAt: -1 });
    
    console.log(`📬 User ${userEmail} fetching ${contacts.length} messages`);
    
    res.json({ 
      success: true, 
      contacts,
      total: contacts.length
    });
  } catch (error) {
    console.error('Get user inbox error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch inbox',
      error: error.message
    });
  }
};

module.exports = {
  submitContact,
  getAllContacts,
  replyToContact,
  getUserInbox
};