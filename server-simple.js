const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const QuickCommerceScraper = require('./services/scraper');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize scraper
const scraper = new QuickCommerceScraper();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [
        process.env.FRONTEND_URL,
        /^https:\/\/.*\.onrender\.com$/, // Allow Render frontend URLs
        /^https:\/\/.*\.vercel\.app$/,   // Allow Vercel URLs
        /^https:\/\/.*\.netlify\.app$/,  // Allow Netlify URLs
      ].filter(Boolean)
    : [
        'http://localhost:3000', 
        'http://localhost:3001',
        'http://localhost:3002',
        /^http:\/\/192\.168\.\d+\.\d+:\d+$/, // Allow local network IPs (192.168.x.x)
        /^http:\/\/10\.\d+\.\d+\.\d+:\d+$/,  // Allow local network IPs (10.x.x.x)
        /^http:\/\/172\.(1[6-9]|2[0-9]|3[0-1])\.\d+\.\d+:\d+$/, // Allow local network IPs (172.16-31.x.x)
      ],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  trustProxy: true // Fix for X-Forwarded-For header warning
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mock data for demonstration
const mockProducts = [
  {
    id: '1',
    name: 'Organic Bananas',
    category: 'Fruits',
    brand: 'Fresh Farm',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300',
    prices: [
      {
        platform: 'zepto',
        price: 45,
        originalPrice: 50,
        deliveryTime: '10-15 mins',
        deliveryFee: 0,
        availability: true
      },
      {
        platform: 'swiggy',
        price: 48,
        originalPrice: 50,
        deliveryTime: '20-30 mins',
        deliveryFee: 0,
        availability: true
      },
      {
        platform: 'bigbasket',
        price: 42,
        originalPrice: 50,
        deliveryTime: '30-45 mins',
        deliveryFee: 0,
        availability: true
      }
    ],
    rating: 4.5,
    reviews: 128
  },
  {
    id: '2',
    name: 'Fresh Milk 1L',
    category: 'Dairy',
    brand: 'Amul',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300',
    prices: [
      {
        platform: 'zepto',
        price: 65,
        originalPrice: 70,
        deliveryTime: '10-15 mins',
        deliveryFee: 0,
        availability: true
      },
      {
        platform: 'swiggy',
        price: 68,
        originalPrice: 70,
        deliveryTime: '20-30 mins',
        deliveryFee: 0,
        availability: true
      },
      {
        platform: 'bigbasket',
        price: 62,
        originalPrice: 70,
        deliveryTime: '30-45 mins',
        deliveryFee: 0,
        availability: true
      }
    ],
    rating: 4.8,
    reviews: 256
  },
  {
    id: '3',
    name: 'Basmati Rice 1kg',
    category: 'Grains',
    brand: 'India Gate',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300',
    prices: [
      {
        platform: 'zepto',
        price: 180,
        originalPrice: 200,
        deliveryTime: '10-15 mins',
        deliveryFee: 0,
        availability: true
      },
      {
        platform: 'swiggy',
        price: 185,
        originalPrice: 200,
        deliveryTime: '20-30 mins',
        deliveryFee: 0,
        availability: true
      },
      {
        platform: 'bigbasket',
        price: 175,
        originalPrice: 200,
        deliveryTime: '30-45 mins',
        deliveryFee: 0,
        availability: true
      }
    ],
    rating: 4.6,
    reviews: 89
  }
];

// Real-time scraping endpoint
app.post('/api/scrape/search', async (req, res) => {
  try {
    const { searchQuery, location } = req.body;
    
    if (!searchQuery || searchQuery.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Search query is required',
        success: false 
      });
    }

    console.log(`🕷️  Received scraping request for: ${searchQuery}`);
    if (location) {
      console.log(`📍 Location provided: ${location.city || 'Unknown'}, ${location.pincode || 'N/A'}`);
    }
    
    // Try real scraping first with location
    console.log(`⏳ Starting real scraping for: ${searchQuery}`);
    const scrapingResult = await scraper.scrapeAllPlatforms(searchQuery.trim(), location);
    
    console.log(`📊 Scraping result: success=${scrapingResult.success}, products=${scrapingResult.products?.length || 0}, platforms=${scrapingResult.platforms?.length || 0}`);
    
    if (scrapingResult.success && scrapingResult.products && scrapingResult.products.length > 0) {
      console.log(`✅ Scraping successful: ${scrapingResult.products.length} products found from ${scrapingResult.platforms?.length || 0} platforms`);
      return res.json({
        success: true,
        results: scrapingResult.products,
        platforms: scrapingResult.platforms || [],
        total: scrapingResult.products.length,
        scrapedAt: scrapingResult.scrapedAt,
        isRealData: true,
        failedPlatforms: scrapingResult.failedPlatforms || []
      });
    } else {
      // Return empty results instead of mock data
      console.log(`⚠️  Scraping returned no products. Error: ${scrapingResult.error || 'No products found'}`);
      return res.json({
        success: false,
        results: [],
        platforms: [],
        total: 0,
        error: scrapingResult.error || 'No products found from any platform',
        scrapedAt: new Date().toISOString(),
        isRealData: true
      });
    }
    
  } catch (error) {
    console.error('❌ Scraping endpoint error:', error);
    
    // Return error instead of mock data
    return res.status(500).json({
      success: false,
      results: [],
      platforms: [],
      total: 0,
      error: error.message,
      scrapedAt: new Date().toISOString(),
      isRealData: true
    });
  }
});

// Individual platform scraping endpoints
app.post('/api/scrape/zepto', async (req, res) => {
  try {
    const { searchQuery } = req.body;
    const result = await scraper.scrapeZepto(searchQuery);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/scrape/swiggy', async (req, res) => {
  try {
    const { searchQuery } = req.body;
    const result = await scraper.scrapeSwiggy(searchQuery);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/scrape/bigbasket', async (req, res) => {
  try {
    const { searchQuery } = req.body;
    const result = await scraper.scrapeBigBasket(searchQuery);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Products endpoints
app.get('/api/products', (req, res) => {
  const { search, category, page = 1, limit = 20 } = req.query;
  
  let filteredProducts = [...mockProducts];
  
  if (search) {
    filteredProducts = filteredProducts.filter(product => 
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (category) {
    filteredProducts = filteredProducts.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  res.json({
    products: paginatedProducts,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredProducts.length,
      pages: Math.ceil(filteredProducts.length / limit)
    }
  });
});

app.get('/api/products/search/:query', (req, res) => {
  const { query } = req.params;
  const searchQuery = query.toLowerCase();
  
  const results = mockProducts.filter(product => 
    product.name.toLowerCase().includes(searchQuery) ||
    product.category.toLowerCase().includes(searchQuery) ||
    product.brand.toLowerCase().includes(searchQuery)
  );
  
  res.json(results);
});

app.get('/api/products/categories/list', (req, res) => {
  const categories = [...new Set(mockProducts.map(product => product.category))];
  res.json(categories);
});

// Comparison endpoints
app.post('/api/comparison/compare', (req, res) => {
  const { searchQuery, location } = req.body;
  
  if (!searchQuery) {
    return res.status(400).json({ error: 'Search query is required' });
  }
  
  const searchTerm = searchQuery.toLowerCase();
  const results = mockProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm)
  );
  
  // Simulate comparison results
  const comparisonResults = results.map(product => {
    // Sort prices by price to calculate correct ranks
    const sortedPrices = [...product.prices].sort((a, b) => a.price - b.price);
    const maxPrice = Math.max(...product.prices.map(p => p.price));
    
    const platforms = product.prices.map(price => ({
      productId: product.id,
      productName: product.name,
      platform: price.platform,
      price: price.price,
      deliveryTime: price.deliveryTime,
      deliveryFee: price.deliveryFee,
      totalCost: price.price + price.deliveryFee,
      savings: maxPrice - price.price,
      rank: sortedPrices.findIndex(p => p.platform === price.platform) + 1,
      availability: price.availability
    }));
    
    // Sort platforms by total cost for best deal
    const sortedPlatforms = platforms.sort((a, b) => a.totalCost - b.totalCost);
    
    return {
      product: {
        id: product.id,
        name: product.name,
        category: product.category,
        brand: product.brand,
        image: product.image
      },
      platforms: sortedPlatforms,
      bestDeal: sortedPlatforms[0]
    };
  });
  
  res.json({
    results: comparisonResults,
    bestDeal: comparisonResults.length > 0 ? comparisonResults[0].bestDeal : null
  });
});

// Real-time scraping endpoint
app.post('/api/scrape/search', async (req, res) => {
  try {
    const { searchQuery, location } = req.body;
    
    if (!searchQuery || searchQuery.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Search query is required',
        success: false 
      });
    }

    console.log(`🕷️  Received scraping request for: ${searchQuery}`);
    if (location) {
      console.log(`📍 Location provided: ${location.city || 'Unknown'}, ${location.pincode || 'N/A'}`);
    }
    
    // Try real scraping first with location
    console.log(`⏳ Starting real scraping for: ${searchQuery}`);
    const scrapingResult = await scraper.scrapeAllPlatforms(searchQuery.trim(), location);
    
    console.log(`📊 Scraping result: success=${scrapingResult.success}, products=${scrapingResult.products?.length || 0}, platforms=${scrapingResult.platforms?.length || 0}`);
    
    if (scrapingResult.success && scrapingResult.products && scrapingResult.products.length > 0) {
      console.log(`✅ Scraping successful: ${scrapingResult.products.length} products found from ${scrapingResult.platforms?.length || 0} platforms`);
      return res.json({
        success: true,
        results: scrapingResult.products,
        platforms: scrapingResult.platforms || [],
        total: scrapingResult.products.length,
        scrapedAt: scrapingResult.scrapedAt,
        isRealData: true,
        failedPlatforms: scrapingResult.failedPlatforms || []
      });
    } else {
      // Return empty results instead of mock data
      console.log(`⚠️  Scraping returned no products. Error: ${scrapingResult.error || 'No products found'}`);
      return res.json({
        success: false,
        results: [],
        platforms: [],
        total: 0,
        error: scrapingResult.error || 'No products found from any platform',
        scrapedAt: new Date().toISOString(),
        isRealData: true
      });
    }
    
  } catch (error) {
    console.error('❌ Scraping endpoint error:', error);
    
    // Return error instead of mock data
    return res.status(500).json({
      success: false,
      results: [],
      platforms: [],
      total: 0,
      error: error.message,
      scrapedAt: new Date().toISOString(),
      isRealData: true
    });
  }
});

// Individual platform scraping endpoints
app.post('/api/scrape/zepto', async (req, res) => {
  try {
    const { searchQuery } = req.body;
    const result = await scraper.scrapeZepto(searchQuery);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/scrape/swiggy', async (req, res) => {
  try {
    const { searchQuery } = req.body;
    const result = await scraper.scrapeSwiggy(searchQuery);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/scrape/bigbasket', async (req, res) => {
  try {
    const { searchQuery } = req.body;
    const result = await scraper.scrapeBigBasket(searchQuery);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Real-time platform search URLs endpoint (no scraping, no mock data)
app.post('/api/platform/search', (req, res) => {
  try {
    const { searchQuery } = req.body;
    
    if (!searchQuery || searchQuery.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Search query is required',
        success: false 
      });
    }

    console.log(`Generating real-time platform URLs for: ${searchQuery}`);
    
    // Generate real-time platform search URLs (no scraping, no mock data)
    const encodedQuery = encodeURIComponent(searchQuery.trim());
    
    const platformUrls = {
      zepto: `https://www.zepto.com/search?q=${encodedQuery}`,
      blinkit: `https://blinkit.com/s/?q=${encodedQuery}`,
      swiggy: `https://www.swiggy.com/instamart/search?q=${encodedQuery}`,
      bigbasket: `https://www.bigbasket.com/ps/?q=${encodedQuery}`
    };

    // Return platform search URLs - users can click to visit real platforms
    return res.json({
      success: true,
      searchQuery: searchQuery.trim(),
      platformUrls: platformUrls,
      platforms: Object.keys(platformUrls),
      message: 'Real-time platform search URLs generated',
      generatedAt: new Date().toISOString(),
      isRealTimeLinks: true
    });
    
  } catch (error) {
    console.error('Platform search URL generation error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/api/comparison/stats/overview', (req, res) => {
  res.json({
    stats: {
      totalComparisons: 150,
      avgSavings: 15.5,
      totalSavings: 2500
    },
    trendingSearches: [
      { query: 'milk', searchCount: 45 },
      { query: 'bread', searchCount: 32 },
      { query: 'eggs', searchCount: 28 }
    ],
    popularCategories: [
      { _id: 'Dairy', productCount: 25, avgPrice: 65 },
      { _id: 'Fruits', productCount: 18, avgPrice: 45 },
      { _id: 'Vegetables', productCount: 15, avgPrice: 35 }
    ]
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await scraper.closeBrowser();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await scraper.closeBrowser();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 QuickCommerce Compare Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🎯 API Base: http://localhost:${PORT}/api`);
  console.log(`\n🕷️  Real-time scraping enabled for:`);
  console.log(`   - Zepto: http://localhost:${PORT}/api/scrape/zepto`);
  console.log(`   - Swiggy: http://localhost:${PORT}/api/scrape/swiggy`);
  console.log(`   - BigBasket: http://localhost:${PORT}/api/scrape/bigbasket`);
  console.log(`   - All platforms: http://localhost:${PORT}/api/scrape/search`);
  console.log(`\n📝 Note: Scraping includes caching and fallback to mock data.`);
});
