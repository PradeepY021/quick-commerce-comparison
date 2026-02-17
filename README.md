# QuickCommerce Compare

A comprehensive price comparison platform for quick-commerce platforms including Zepto, Swiggy Instamart, and BigBasket. Help users find the best deals and save money on their grocery shopping.

## 🚀 Features

- **Real-time Price Comparison**: Compare prices across Zepto, Swiggy Instamart, and BigBasket
- **Delivery Time Tracking**: See delivery times for each platform
- **Location-based Pricing**: Get accurate prices based on your location
- **Smart Search**: Advanced product search with filters and sorting
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Caching System**: Redis-based caching for optimal performance
- **Web Scraping**: Automated price data collection from platforms

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** for data storage
- **Redis** for caching
- **Puppeteer** for web scraping
- **Axios** for API requests
- **Cheerio** for HTML parsing

### Frontend
- **React 18** with modern hooks
- **React Router** for navigation
- **Styled Components** for styling
- **Framer Motion** for animations
- **React Query** for data fetching
- **Lucide React** for icons

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Redis
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd quick-commerce-comparison
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd client
   npm install
   cd ..
   ```

3. **Environment setup**
   ```bash
   # Copy environment file
   cp env.example .env
   
   # Edit .env with your configuration
   nano .env
   ```

4. **Start the development servers**
   ```bash
   # Start backend server
   npm run dev
   
   # In another terminal, start frontend
   cd client
   npm start
   ```

## 🔧 Configuration

### Environment Variables

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/quick-commerce-comparison
REDIS_URL=redis://localhost:6379

# Server Configuration
PORT=3000
NODE_ENV=development

# API Keys (if available)
ZEPTO_API_KEY=your_zepto_api_key
SWIGGY_API_KEY=your_swiggy_api_key
BIGBASKET_API_KEY=your_bigbasket_api_key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Scraping Configuration
SCRAPING_INTERVAL_MINUTES=30
MAX_CONCURRENT_SCRAPERS=5
```

## 🏗️ Project Structure

```
quick-commerce-comparison/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   └── package.json
├── config/                 # Configuration files
├── models/                 # Database models
├── routes/                 # API routes
├── services/               # Business logic
├── utils/                  # Utility functions
├── server.js              # Main server file
└── package.json
```

## 🚀 API Endpoints

### Products
- `GET /api/products` - Get all products with pagination
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/search/:query` - Search products
- `GET /api/products/categories/list` - Get product categories

### Comparison
- `POST /api/comparison/compare` - Compare products across platforms
- `GET /api/comparison/history` - Get comparison history
- `GET /api/comparison/stats/overview` - Get comparison statistics

### Scraper
- `POST /api/scraper/scrape` - Manual scraping
- `POST /api/scraper/scrape/bulk` - Bulk scraping
- `GET /api/scraper/status` - Get scraping status

## 🔄 Data Flow

```
User Search → Backend API → Scraper Layer → Platform APIs
     ↓              ↓            ↓
Database Cache ← Price Engine ← Normalized Data
     ↓              ↓
Comparison Logic → Frontend Display
```

## 🎯 Business Model

### Revenue Streams
1. **Affiliate Commissions**: Earn from redirects to platforms
2. **Premium Features**: Advanced comparison tools
3. **Sponsored Placements**: Featured product listings
4. **Data Insights**: Anonymized shopping trends for brands

### Target Market
- **Primary**: Price-sensitive consumers in Tier 1 & 2 cities
- **Secondary**: Busy professionals seeking convenience
- **Tertiary**: Budget-conscious families

## 📊 Key Metrics

- **User Engagement**: Daily active users, session duration
- **Conversion Rate**: Users who make purchases after comparison
- **Cost Savings**: Average savings per user per month
- **Platform Coverage**: Number of products compared across platforms

## 🔒 Security & Privacy

- **Rate Limiting**: Prevent API abuse
- **Data Encryption**: Secure data transmission
- **Privacy First**: No personal data collection
- **GDPR Compliance**: User data protection

## 🚀 Deployment

### Production Setup
1. **Database**: MongoDB Atlas or self-hosted
2. **Caching**: Redis Cloud or self-hosted
3. **Hosting**: Vercel, Netlify, or AWS
4. **Monitoring**: Application performance monitoring

### Docker Deployment
```bash
# Build and run with Docker
docker-compose up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@quickcommercecompare.com or create an issue in the repository.

## 🔮 Future Roadmap

- **Mobile App**: Native iOS and Android apps
- **AI Recommendations**: Smart product suggestions
- **Price Alerts**: Notify users of price drops
- **Expansion**: Add more platforms (Blinkit, Grofers, etc.)
- **Analytics Dashboard**: Detailed insights for users

---

**Built with ❤️ for smart shoppers everywhere**
