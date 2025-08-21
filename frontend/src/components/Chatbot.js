import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { config } from '../config/config';

const Chatbot = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm Savi, your Stitch & Savour assistant! 🌟\n\nI can help you with:\n• Our handmade crochet items 🧶\n• Delicious homemade food 🍽️\n• Pricing and delivery info 🚚\n• Customization options ✨\n\nWhat would you like to know?",
      isBot: true,
      timestamp: new Date(),
      suggestions: [
        { text: "🧶 View Crochet Items", link: "/products?category=crochet" },
        { text: "🍽️ View Food Items", link: "/products?category=food" },
        { text: "📞 Contact Us", link: "/contact" }
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateResponse = async (userMessage) => {
    try {
      const response = await fetch(`${config.API_URL}/chatbot/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await response.json();
      
      if (data.success) {
        return {
          text: data.response,
          suggestions: data.suggestions || [],
          confidence: data.confidence || 'medium',
          sources: data.sources || []
        };
      } else {
        return {
          text: 'Sorry, I encountered an error. Please try again or contact support.',
          suggestions: [{ text: 'Contact Support', link: '/contact' }],
          confidence: 'low'
        };
      }
    } catch (error) {
      console.error('Chatbot API error:', error);
      return {
        text: 'Sorry, I\'m having trouble connecting. Please contact us directly. 📞',
        suggestions: [{ text: 'Contact Support', link: '/contact' }],
        confidence: 'low'
      };
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    setTimeout(async () => {
      const response = await generateResponse(inputText);
      const botResponse = {
        id: messages.length + 2,
        text: response.text,
        isBot: true,
        timestamp: new Date(),
        suggestions: response.suggestions,
        confidence: response.confidence,
        sources: response.sources
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '100px',
          right: '20px',
          width: '60px',
          height: '60px',
          backgroundColor: 'var(--primary-color)',
          borderRadius: '50%',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(217, 70, 239, 0.4)',
          cursor: 'pointer',
          zIndex: 1000,
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
      >
        <MessageCircle size={24} color="white" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '350px',
          height: '500px',
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          zIndex: 1001,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
            color: 'white',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bot size={20} />
              <span style={{ fontWeight: '600' }}>Stitch & Savour Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            padding: '1rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  justifyContent: message.isBot ? 'flex-start' : 'flex-end'
                }}
              >
                <div>
                  <div style={{
                    maxWidth: '80%',
                    padding: '0.75rem 1rem',
                    borderRadius: message.isBot ? '12px 12px 12px 4px' : '12px 12px 4px 12px',
                    backgroundColor: message.isBot ? 'var(--bg-secondary)' : 'var(--primary-color)',
                    color: message.isBot ? 'var(--text-primary)' : 'white',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-line',
                    boxShadow: message.isBot ? '0 2px 8px rgba(0,0,0,0.1)' : '0 2px 12px rgba(217, 70, 239, 0.3)',
                    border: message.isBot ? '1px solid var(--border-color)' : 'none'
                  }}>
                    {message.text}
                  </div>
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            console.log('Navigating to:', suggestion.link);
                            navigate(suggestion.link);
                            setIsOpen(false);
                          }}
                          style={{
                            padding: '0.5rem 0.75rem',
                            fontSize: '0.8rem',
                            background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                            color: 'white',
                            border: 'none',
                            borderRadius: '16px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 2px 8px rgba(217, 70, 239, 0.3)',
                            fontWeight: '500'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 4px 12px rgba(217, 70, 239, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 2px 8px rgba(217, 70, 239, 0.3)';
                          }}
                        >
                          {suggestion.text}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {message.confidence && message.confidence === 'high' && message.sources && message.sources.length > 0 && (
                    <div style={{ 
                      marginTop: '0.5rem', 
                      fontSize: '0.7rem', 
                      color: 'var(--text-secondary)',
                      opacity: 0.7
                    }}>
                      ✨ High confidence response
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '0.75rem',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)'
                }}>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', animation: 'bounce 1.4s infinite' }}></div>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', animation: 'bounce 1.4s infinite 0.2s' }}></div>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', animation: 'bounce 1.4s infinite 0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Auto-scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '1rem',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            gap: '0.5rem'
          }}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about our products..."
              style={{
                flex: 1,
                padding: '0.75rem',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}
            />
            <button
              onClick={handleSend}
              style={{
                padding: '0.75rem',
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;