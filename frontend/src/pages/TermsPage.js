import React from 'react';

const TermsPage = () => {
  return (
    <div style={{ padding: '2rem 0', minHeight: '100vh' }}>
      <div className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary-color)', marginBottom: '1rem' }}>
            Terms & Conditions
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
              Welcome to Stitch & Savour. By accessing our website and placing an order, you agree to the following Terms & Conditions. Please read them carefully before making a purchase.
            </p>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--primary-color)' }}>
                1. About Us
              </h2>
              <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                Stitch & Savour is owned and managed by Sangita Thakur. We specialize in homemade food items and handcrafted crochet products, each created with care and passion.
              </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--primary-color)' }}>
                2. Products & Services
              </h2>
              <ul style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem' }}>
                <li>All food items are homemade and perishable, and therefore non-returnable.</li>
                <li>Crochet products are handmade and custom-made, so slight variations in size, color, or design may occur compared to images shown on the website.</li>
                <li>Product images are for illustration purposes only.</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--primary-color)' }}>
                3. Orders & Payments
              </h2>
              <ul style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem' }}>
                <li>Orders can be placed directly through our website using the cart and checkout system.</li>
                <li>We currently accept payments via QR Code (online payment) and Cash on Delivery (COD).</li>
                <li>For COD orders, customers are required to pay the exact amount at the time of delivery.</li>
                <li>Stitch & Savour reserves the right to cancel orders in cases of incomplete payment, stock unavailability, or misuse of the platform.</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--primary-color)' }}>
                4. Delivery Timelines
              </h2>
              <ul style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem' }}>
                <li>Food items: Delivered within 2 days of order confirmation (to ensure freshness).</li>
                <li>Crochet items: Delivered within 2 weeks, as they are custom-made based on your chosen design, thread, and colors.</li>
                <li>Bulk orders: If food quantity exceeds 2 kg, or if more than one crochet product is ordered, delivery timelines may be extended.</li>
                <li>Delays may occur due to unforeseen circumstances such as courier delays, raw material availability, or weather conditions.</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--primary-color)' }}>
                5. Cancellations
              </h2>
              <ul style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem' }}>
                <li>Food orders: Can be canceled within 6 hours of placing the order.</li>
                <li>Crochet orders: Can be canceled within 24 hours of placing the order.</li>
                <li>Bulk and custom orders may have stricter cancellation policies depending on the size and complexity of the order.</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--primary-color)' }}>
                6. Returns & Refunds
              </h2>
              <ul style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem' }}>
                <li>Due to the nature of our products, we do not accept returns.</li>
                <li>Refunds or replacements will only be considered if the wrong item was delivered, or the product arrived damaged.</li>
                <li>Customers must inform us within 24 hours of delivery for such cases, along with order details and proof (photo).</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--primary-color)' }}>
                7. Customer Responsibilities
              </h2>
              <ul style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem' }}>
                <li>Customers must provide accurate delivery information (address and phone number).</li>
                <li>Customers should be available to receive the delivery at the scheduled time.</li>
                <li>For COD orders, the exact amount should be kept ready.</li>
                <li>Customers are advised to check product ingredients (for food items) before ordering in case of allergies.</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--primary-color)' }}>
                8. Limitation of Liability
              </h2>
              <ul style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem' }}>
                <li>Stitch & Savour is not responsible for delays caused by delivery partners or external circumstances.</li>
                <li>We are not responsible for allergic reactions — customers must check ingredient details before purchase.</li>
                <li>Minor variations in handmade crochet products are expected.</li>
                <li>Our maximum liability is limited to the order value paid by the customer.</li>
              </ul>
            </section>

            <div style={{ 
              background: 'var(--bg-tertiary)', 
              padding: '1.5rem', 
              borderRadius: '8px', 
              marginTop: '2rem',
              textAlign: 'center'
            }}>
              <p style={{ margin: 0, fontWeight: '600' }}>
                For any questions regarding these terms, please contact us at:
              </p>
              <p style={{ margin: '0.5rem 0 0 0', color: 'var(--primary-color)' }}>
                Sangita.shreyas@gmail.com | +91 9970944685
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;