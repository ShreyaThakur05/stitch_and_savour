# Stitch & Savour - Complete E-commerce Platform

A comprehensive e-commerce platform for homemade food and handcrafted crochet products, built with React.js and modern web technologies.

## 🌟 Complete Feature Set

### 🛍️ **Customer Experience**
- **Homepage** with hero section, featured products, testimonials, and FAQ
- **Product Catalog** with advanced search, price filters, and category sorting
- **Product Details** with image gallery, customization options, and reviews
- **Shopping Cart** with persistent storage and quantity management
- **Checkout System** with multiple payment options (UPI/QR, COD)
- **User Dashboard** with order history, tracking, and profile management
- **Review System** with ratings and verified purchase badges
- **Wishlist** functionality with heart animations
- **Responsive Design** optimized for all devices
- **Dark/Light Theme** toggle with smooth transitions

### 🎨 **Product Customization**
- **Crochet Items**: Thread type selection (Cotton/Wool), size options, custom sizing
- **Food Items**: Weight-based pricing with multiple quantity options
- **Special Pricing**: Gujiya with piece-based pricing (6/12/24 pieces)
- **Price Calculation**: Dynamic pricing with customization surcharges
- **Selection Validation**: Ensures all options selected before purchase
- **Large Quantity Alerts**: Delivery time warnings for bulk orders

### 💳 **Payment & Delivery**
- **UPI Integration** with dynamic QR code generation
- **Payment Apps** support (GPay, PhonePe, Paytm, BHIM)
- **Cash on Delivery** option available
- **Home Delivery** within 1km radius (₹25 charge)
- **Self Pickup** option (FREE) with location details
- **Manual Payment Confirmation** for reliable order processing

### 📱 **Communication & Support**
- **AI Chatbot** with RAG-based product knowledge
- **WhatsApp Integration** for order confirmations
- **Email Notifications** with order details and tracking
- **Contact Form** with admin reply system
- **PDF Invoice** generation with order details
- **Excel Export** for order management

### 🔧 **Admin Dashboard**
- **Analytics Overview** with sales charts and business insights
- **Order Management** with status updates and delivery tracking
- **Product Management** with add/edit/delete functionality
- **Inventory Tracking** with low stock alerts and cost analysis
- **Customer Insights** with repeat customer analysis
- **Review Management** with rating distribution
- **Message Center** for customer inquiries
- **Heat Map** showing order patterns over 28 days
- **Profit Analysis** with investment vs revenue tracking

### 🛡️ **Security & Performance**
- **JWT Authentication** with role-based access control
- **Form Validation** with error handling
- **Data Persistence** using localStorage
- **Image Optimization** with error fallbacks
- **Performance Optimized** with lazy loading
- **SEO Friendly** with proper meta tags
- **PWA Ready** for mobile installation

### 🎯 **Business Features**
- **Multi-Category Support** (Food & Crochet products)
- **Weight-Based Pricing** for food items (₹/kg calculation)
- **Piece-Based Pricing** for special items like Gujiya
- **Delivery Time Management** with category-specific timelines
- **Raw Material Tracking** with automatic inventory reduction
- **Customer Retention** tracking and analysis
- **Order Heat Map** for business pattern analysis
- **Expense Tracking** with profit margin calculations

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library with hooks
- **React Router** - Client-side routing
- **Context API** - State management
- **CSS-in-JS** - Styled components
- **Lucide React** - Modern icons
- **EmailJS** - Email service integration
- **jsPDF** - PDF generation
- **XLSX** - Excel export functionality

### Services & Integrations
- **UPI Payment** - Dynamic QR code generation
- **WhatsApp** - Order confirmations
- **LocalStorage** - Data persistence
- **Responsive Design** - Mobile-first approach
- **PWA Features** - App-like experience

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stitch_and_savour/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the frontend directory:
   ```env
   REACT_APP_WHATSAPP_NUMBER=+919970944685
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

### 🌐 Deployment (Vercel)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Add Environment Variables** in Vercel dashboard:
   ```
   REACT_APP_WHATSAPP_NUMBER=+919970944685
   ```

## Project Structure

```
stitch_and_savour/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── uploads/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   └── assets/
│   └── package.json
└── README.md
```

## 💡 Business Model

### Product Categories
1. **Handmade Food Items**
   - Weight-based pricing (₹/kg)
   - Fresh preparation on order
   - Traditional recipes

2. **Crochet Products**
   - Made-to-order items
   - Customizable options
   - Premium handcrafted quality

### Revenue Streams
- Product sales with profit margin tracking
- Delivery charges for home delivery
- Premium customization options
- Bulk order discounts

### Target Market
- Local customers (1km delivery radius)
- Quality-conscious buyers
- Festival and occasion shoppers
- Handmade product enthusiasts

## 🔑 Default Credentials

### Admin Access
- **Email:** admin@stitchandsavour.com
- **Password:** admin123

### Test Customer
- **Email:** customer@test.com
- **Password:** test123

## 📁 Project Structure

```
stitch_and_savour/
├── frontend/
│   ├── public/
│   │   ├── images/
│   │   │   ├── products/     # Product images
│   │   │   └── owner/        # Owner photos
│   │   └── index.html
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React Context providers
│   │   ├── services/        # API and external services
│   │   ├── utils/           # Utility functions
│   │   ├── assets/          # Static assets
│   │   └── App.js
│   └── package.json
└── README.md
```

## 🖼️ Image Management

### Product Images
Place images in `frontend/public/images/` with naming convention:
- **Crochet**: `crochet-[product-name]-1.jpg`
- **Food**: `food-[product-name]-1.jpg`
- **Owner**: `sangita-photo.jpg`

## Delivery Areas

The platform currently delivers to:
- **Local:** Sirul and nearby areas (same day delivery)
- **Regional:** Maharashtra (1-2 days)
- **National:** Pan-India courier (3-7 days)

## Contact Information

- **Email:** sangita.shreyas@gmail.com
- **Phone:** +91 9970944685
- **Alt Phone:** +91 8668806190
- **WhatsApp:** +91 9970944685

## 🎯 Key Highlights

- **Production Ready**: Fully functional e-commerce platform
- **Mobile Optimized**: Responsive design for all devices
- **Payment Integration**: UPI/QR code payments with manual confirmation
- **Admin Dashboard**: Complete business management system
- **Customer Experience**: Smooth shopping with customization options
- **Business Intelligence**: Analytics, inventory, and profit tracking
- **Communication**: WhatsApp, email, and chatbot integration
- **Performance**: Optimized for speed and user experience

## 📞 Business Contact

- **Owner:** Sangita Thakur
- **Email:** sangita.shreyas@gmail.com
- **Phone:** +91 9970944685
- **WhatsApp:** +91 9970944685
- **Location:** Alkasa Society, Mohammadwadi, Pune - 411060

## 📄 License

MIT License - Feel free to use for personal and commercial projects.

---

**Built with ❤️ for Stitch & Savour - Where homemade meets handcrafted!**