import React, { useState, useEffect } from 'react';
import { Bell, X, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const InboxNotification = () => {
  const { user } = useAuth();
  const [showInbox, setShowInbox] = useState(false);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchInbox = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/contact/inbox`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setMessages(data.contacts);
        const unread = data.contacts.filter(msg => msg.status === 'replied' && !msg.read).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Error fetching inbox:', error);
      // Fallback to localStorage
      const localMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
      const userMessages = localMessages.filter(msg => msg.email === user.email);
      setMessages(userMessages);
      const unread = userMessages.filter(msg => msg.status === 'replied' && !msg.read).length;
      setUnreadCount(unread);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchInbox();
      // Poll for new messages every 30 seconds
      const interval = setInterval(fetchInbox, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  if (!user || user.role === 'admin') return null;

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowInbox(!showInbox)}
        style={{
          position: 'relative',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-primary)',
          padding: '0.5rem'
        }}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '0',
              right: '0',
              background: '#ef4444',
              color: 'white',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              fontSize: '0.7rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {showInbox && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: '0',
            width: '350px',
            maxHeight: '400px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 1000,
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              padding: '1rem',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <h3 style={{ margin: 0, fontSize: '1rem' }}>Inbox</h3>
            <button
              onClick={() => setShowInbox(false)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-secondary)'
              }}
            >
              <X size={16} />
            </button>
          </div>

          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
              </div>
            ) : messages.length === 0 ? (
              <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                <MessageCircle size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                <div style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  No messages yet
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Your conversations will appear here
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message._id || message.id}
                  style={{
                    padding: '1.25rem',
                    borderBottom: '1px solid var(--border-light)',
                    background: message.status === 'replied' ? 'var(--success-light)' : 'var(--bg-primary)',
                    borderRadius: '8px',
                    marginBottom: '0.5rem',
                    border: message.status === 'replied' ? '1px solid var(--success)' : '1px solid var(--border-light)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        padding: '0.5rem',
                        borderRadius: '50%',
                        background: message.status === 'replied' ? 'var(--success)' : 'var(--primary-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <MessageCircle size={12} color="white" />
                      </div>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                          {message.subject === 'others' ? message.customSubject : (message.subject || 'General Inquiry').replace('-', ' ')}
                        </div>
                        {message.status === 'replied' && (
                          <span style={{ 
                            background: 'var(--success)', 
                            color: 'white', 
                            fontSize: '0.7rem', 
                            padding: '0.25rem 0.5rem', 
                            borderRadius: '12px',
                            fontWeight: '600'
                          }}>✓ Replied</span>
                        )}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                      <div>{new Date(message.createdAt || message.date).toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric' 
                      })}</div>
                      <div style={{ marginTop: '0.125rem' }}>
                        {new Date(message.createdAt || message.date).toLocaleTimeString('en-IN', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          hour12: true 
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{
                    background: 'var(--bg-secondary)',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    marginBottom: '0.75rem',
                    borderLeft: '3px solid var(--primary-color)'
                  }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--primary-color)', fontWeight: '600', marginBottom: '0.5rem' }}>
                      Your Message:
                    </div>
                    <p style={{ 
                      margin: 0, 
                      fontSize: '0.85rem', 
                      color: 'var(--text-primary)',
                      lineHeight: '1.4'
                    }}>
                      {message.message}
                    </p>
                  </div>

                  {message.adminReply && (
                    <div
                      style={{
                        background: 'var(--success-light)',
                        padding: '0.75rem',
                        borderRadius: '6px',
                        borderLeft: '3px solid var(--success)'
                      }}
                    >
                      <div style={{ 
                        fontSize: '0.7rem', 
                        color: 'var(--success)', 
                        fontWeight: '600', 
                        marginBottom: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        👩‍💼 Admin Reply:
                        {message.repliedAt && (
                          <span style={{ fontSize: '0.65rem', fontWeight: '400', marginLeft: '0.5rem' }}>
                            {new Date(message.repliedAt).toLocaleDateString('en-IN')} at {new Date(message.repliedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                          </span>
                        )}
                      </div>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                        {message.adminReply}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InboxNotification;