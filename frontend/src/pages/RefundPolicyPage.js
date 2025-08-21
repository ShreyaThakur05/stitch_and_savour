import React from 'react';

const RefundPolicyPage = () => {
  return (
    <div style={{ padding: '2rem 0', minHeight: '100vh' }}>
      <div className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary-color)', marginBottom: '1rem' }}>
            Refund & Cancellation Policy
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem' }}>
            At Stitch & Savour, we value our customers and want to ensure a smooth shopping experience. Please read our policy carefully before placing an order.
          </p>
          
          <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            
            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🛑 Order Cancellations
              </h2>
              <ul style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem' }}>
                <li>Orders can only be canceled within 2 hours of placing the order.</li>
                <li>After 2 hours, the order will be considered confirmed and moved into processing.</li>
                <li>Bulk or custom orders may have additional restrictions, which will be communicated at the time of order.</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                ⏳ Delivery Delays
              </h2>
              <ul style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem' }}>
                <li>While we aim to deliver all food items within 2 days and crochet items within 2 weeks, unexpected delays may occur due to availability of materials, courier issues, or other unforeseen reasons.</li>
                <li>In such cases, customers will be personally informed about the delay and provided with a revised delivery timeline.</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                💵 Refunds
              </h2>
              <ul style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem' }}>
                <li>If an order is canceled within the allowed 2-hour window, a full refund will be issued.</li>
                <li>Refunds are generally processed within 24 hours of cancellation confirmation.</li>
                <li>Any unexpected delay in refund processing will be communicated directly to the customer.</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--primary-color)' }}>
                Product-Specific Policies
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1rem' }}>
                <div style={{ background: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: '8px' }}>
                  <h4 style={{ color: 'var(--success)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    🍲 Food Items
                  </h4>
                  <ul style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', paddingLeft: '1rem' }}>
                    <li>Cancellation within 6 hours only</li>
                    <li>No returns due to perishable nature</li>
                    <li>Delivered within 2 days for freshness</li>
                  </ul>
                </div>
                
                <div style={{ background: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: '8px' }}>
                  <h4 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    🧶 Crochet Items
                  </h4>
                  <ul style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', paddingLeft: '1rem' }}>
                    <li>Cancellation within 24 hours only</li>
                    <li>No returns (custom-made items)</li>
                    <li>Delivered within 2 weeks</li>
                  </ul>
                </div>
              </div>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--primary-color)' }}>
                Exceptions & Special Cases
              </h2>
              <div style={{ background: 'var(--warning-light)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--warning)' }}>
                <h4 style={{ marginBottom: '0.5rem', color: 'var(--warning)' }}>Refunds/Replacements Available For:</h4>
                <ul style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem', margin: 0 }}>
                  <li>Wrong item delivered</li>
                  <li>Product arrived damaged or defective</li>
                  <li>Significant delay beyond promised timeline</li>
                </ul>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '1rem', marginBottom: 0 }}>
                  <strong>Note:</strong> Claims must be reported within 24 hours of delivery with photo evidence.
                </p>
              </div>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--primary-color)' }}>
                How to Request Cancellation/Refund
              </h2>
              <div style={{ background: 'var(--info-light)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--info)' }}>
                <ol style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem' }}>
                  <li>Contact us immediately via WhatsApp: <strong>+91 9970944685</strong></li>
                  <li>Provide your order ID and reason for cancellation</li>
                  <li>For damaged items, include clear photos</li>
                  <li>We'll process your request within 24 hours</li>
                </ol>
              </div>
            </section>

            <div style={{ 
              background: 'var(--primary-light)', 
              padding: '2rem', 
              borderRadius: '12px', 
              border: '1px solid var(--primary-color)',
              textAlign: 'center',
              marginTop: '2rem'
            }}>
              <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                📞 Need Help?
              </h3>
              <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                If you have questions regarding cancellations, refunds, or delivery timelines, please contact us:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
                <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>Stitch & Savour</div>
                <div style={{ color: 'var(--text-secondary)' }}>Owner: Sangita Thakur</div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <a href="mailto:Sangita.shreyas@gmail.com" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>
                    📧 Sangita.shreyas@gmail.com
                  </a>
                  <a href="https://wa.me/919970944685" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>
                    📞 +91 9970944685
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicyPage;