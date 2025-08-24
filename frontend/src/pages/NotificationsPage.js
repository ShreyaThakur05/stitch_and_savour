import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, MessageSquare, User, Clock } from 'lucide-react';

const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInboxMessages = () => {
      if (user) {
        // Get inbox messages from localStorage (contact form replies)
        const inboxMessages = JSON.parse(localStorage.getItem('inboxMessages') || '[]');
        const userMessages = inboxMessages.filter(msg => msg.userEmail === user.email);
        
        const formattedNotifications = userMessages.map(msg => ({
          id: msg.id,
          type: 'message',
          title: 'Reply from Admin',
          message: msg.reply,
          timestamp: new Date(msg.repliedAt),
          read: msg.read || false,
          subject: msg.subject
        }));
        
        setNotifications(formattedNotifications);
      }
      setLoading(false);
    };
    
    loadInboxMessages();
  }, [user]);

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'order':
        return <Bell size={20} style={{ color: 'var(--primary-color)' }} />;
      case 'message':
        return <MessageSquare size={20} style={{ color: 'var(--success)' }} />;
      case 'promotion':
        return <Bell size={20} style={{ color: 'var(--warning)' }} />;
      default:
        return <Bell size={20} style={{ color: 'var(--text-secondary)' }} />;
    }
  };

  if (!user) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <User size={64} style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }} />
        <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
          Login Required
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Please login first to see your notifications and messages.
        </p>
        <a href="/login" className="btn btn-primary">
          Login Now
        </a>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem 1rem',
      minHeight: '60vh'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <Bell size={28} style={{ color: 'var(--primary-color)' }} />
        <h1 style={{ margin: 0, color: 'var(--text-primary)' }}>
          Notifications
        </h1>
      </div>

      {loading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '200px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid var(--border-color)',
            borderTop: '3px solid var(--primary-color)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
      ) : notifications.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem 1rem',
          color: 'var(--text-secondary)'
        }}>
          <Bell size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <h3>No notifications yet</h3>
          <p>You'll see your notifications and messages here when you have them.</p>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '1.5rem',
                position: 'relative',
                borderLeft: notification.read ? 'none' : '4px solid var(--primary-color)'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem'
              }}>
                <div style={{
                  flexShrink: 0,
                  padding: '0.5rem',
                  background: 'var(--bg-primary)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)'
                }}>
                  {getIcon(notification.type)}
                </div>
                
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    margin: '0 0 0.5rem 0',
                    fontSize: '1.1rem',
                    color: 'var(--text-primary)',
                    fontWeight: notification.read ? '500' : '600'
                  }}>
                    {notification.title}
                  </h3>
                  
                  <p style={{
                    margin: '0 0 1rem 0',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.5'
                  }}>
                    {notification.message}
                  </p>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)'
                  }}>
                    <Clock size={14} />
                    {formatTime(notification.timestamp)}
                  </div>
                </div>
                
                {!notification.read && (
                  <div style={{
                    width: '8px',
                    height: '8px',
                    background: 'var(--primary-color)',
                    borderRadius: '50%',
                    flexShrink: 0,
                    marginTop: '0.5rem'
                  }}></div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;