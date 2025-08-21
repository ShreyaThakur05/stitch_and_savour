import React from 'react';
import { Heart, Award, Users, Truck } from 'lucide-react';

const AboutPage = () => {
  return (
    <div style={{ padding: '2rem 0', minHeight: '100vh' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--primary-color)', marginBottom: '1rem' }}>
            About Stitch & Savour
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Where food and craft come together, straight from home to your heart
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center', marginBottom: '4rem' }}>
          <div>
            <img
              src="/images/sangita-photo.jpg"
              alt="Sangita Thakur"
              style={{
                width: '100%',
                maxWidth: '400px',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
              }}
              onError={(e) => {
                e.target.src = '/images/placeholder.jpg';
              }}
            />
          </div>
          <div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>
              Meet Sangita Thakur 💛
            </h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              At Stitch & Savour, every product tells a story, a story of warmth, care, and creativity. 
              Founded by Sangita Thakur, our little venture is built on love for homemade food and the joy of handmade crochet art.
            </p>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              What started as a hobby in the kitchen and a passion for crocheting slowly grew into something bigger. 
              Friends and family who tasted Sangita's food or received her crochet gifts always asked the same question:
            </p>
            <blockquote style={{
              fontSize: '1.2rem',
              fontStyle: 'italic',
              color: 'var(--primary-color)',
              borderLeft: '4px solid var(--primary-color)',
              paddingLeft: '1rem',
              margin: '1.5rem 0'
            }}>
              "Why don't you share this with more people?"
            </blockquote>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
              That simple encouragement gave birth to Stitch & Savour, a place where food and craft come together, 
              straight from home to your heart.
            </p>
          </div>
        </div>

        <div style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍲</div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '1rem' }}>Our Food</h3>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
                All our food items are homemade, crafted with fresh ingredients and traditional methods. 
                From everyday treats to special delicacies, everything is prepared in small batches to ensure quality and taste. 
                Our promise is simple: food that feels like it's made in your own kitchen.
              </p>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧵</div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '1rem' }}>Our Crochet</h3>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
                Crochet is not just an art, it's patience woven into every loop. Each product is handcrafted with attention to detail, 
                customizable with your favorite designs, colors, and threads. Whether it's for yourself or as a gift, 
                our crochet items are made to last and carry a touch of warmth.
              </p>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', textAlign: 'center', marginBottom: '3rem' }}>
            What Makes Us Special
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ 
                background: 'var(--primary-color)', 
                borderRadius: '50%', 
                width: '80px', 
                height: '80px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 1rem auto'
              }}>
                <Heart size={32} color="white" />
              </div>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem' }}>Homemade & Handmade</h4>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Zero mass production. Pure craftsmanship with personal care in every creation.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ 
                background: 'var(--success)', 
                borderRadius: '50%', 
                width: '80px', 
                height: '80px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 1rem auto'
              }}>
                <Award size={32} color="white" />
              </div>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem' }}>Customization</h4>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Your vision, our craft. Custom designs, colors, and styles made just for you.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ 
                background: 'var(--warning)', 
                borderRadius: '50%', 
                width: '80px', 
                height: '80px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 1rem auto'
              }}>
                <Truck size={32} color="white" />
              </div>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem' }}>Order. Cook. Deliver.</h4>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Click to order, we cook fresh, deliver hot. That's the Stitch & Savour promise.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ 
                background: 'var(--info)', 
                borderRadius: '50%', 
                width: '80px', 
                height: '80px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 1rem auto'
              }}>
                <Users size={32} color="white" />
              </div>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem' }}>From Our Home to Yours</h4>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Every recipe and stitch carries a mother's love, crafted for your family's joy.
              </p>
            </div>
          </div>
        </div>

        <div style={{ 
          background: 'var(--bg-secondary)', 
          padding: '3rem', 
          borderRadius: '16px', 
          border: '1px solid var(--border-color)',
          textAlign: 'center',
          marginBottom: '4rem'
        }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>Our Philosophy</h2>
          <p style={{ 
            fontSize: '1.2rem', 
            lineHeight: '1.8', 
            color: 'var(--text-secondary)', 
            maxWidth: '800px', 
            margin: '0 auto' 
          }}>
            We believe in making simple things special. A home-cooked meal or a handmade gift carries more than flavor or beauty, 
            it carries love, effort, and memories. At Stitch & Savour, we're here to share that feeling with you.
          </p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>Join Our Journey</h2>
          <p style={{ 
            fontSize: '1.2rem', 
            color: 'var(--text-secondary)', 
            marginBottom: '2rem',
            maxWidth: '600px',
            margin: '0 auto 2rem auto'
          }}>
            Whether you're craving something delicious or looking for a unique handmade gift, 
            Stitch & Savour is here to make it for you.
          </p>
          <div style={{ 
            fontSize: '1.2rem', 
            fontWeight: '600', 
            color: 'var(--primary-color)',
            marginBottom: '2rem'
          }}>
            With love,<br />
            Sangita Thakur<br />
            <span style={{ fontSize: '1rem', fontWeight: '400' }}>Founder, Stitch & Savour</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/products" className="btn btn-primary">
              Explore Our Products
            </a>
            <a href="/contact" className="btn btn-outline">
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;