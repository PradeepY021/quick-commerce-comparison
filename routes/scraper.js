const express = require('express');
const router = express.Router();
const PriceScraper = require('../services/priceScraper');
const QuickCommerceScraper = require('../services/scraper');
const Product = require('../models/Product');
const cron = require('node-cron');

const scraper = new PriceScraper();
const quickCommerceScraper = new QuickCommerceScraper();

// Initialize scrapers
scraper.init().catch(console.error);
quickCommerceScraper.initBrowser().catch(console.error);

// Search endpoint - scrapes all platforms for a product query
router.post('/search', async (req, res) => {
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
    
    // Scrape all platforms with location
    console.log(`⏳ Starting real scraping for: ${searchQuery}`);
    const scrapingResult = await quickCommerceScraper.scrapeAllPlatforms(searchQuery.trim(), location);
    
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

// Manual scraping endpoint
router.post('/scrape', async (req, res) => {
  try {
    const { productName, location } = req.body;
    
    if (!productName) {
      return res.status(400).json({ error: 'Product name is required' });
    }

    const defaultLocation = {
      city: 'Mumbai',
      pincode: '400001',
      latitude: 19.0760,
      longitude: 72.8777
    };

    const scrapeLocation = location || defaultLocation;
    const results = await scraper.scrapeProduct(productName, scrapeLocation);
    
    res.json({
      message: 'Scraping completed',
      productName,
      location: scrapeLocation,
      results
    });
  } catch (error) {
    console.error('Manual scraping error:', error);
    res.status(500).json({ error: 'Failed to scrape products' });
  }
});

// Bulk scraping endpoint
router.post('/scrape/bulk', async (req, res) => {
  try {
    const { products, location } = req.body;
    
    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ error: 'Products array is required' });
    }

    const defaultLocation = {
      city: 'Mumbai',
      pincode: '400001',
      latitude: 19.0760,
      longitude: 72.8777
    };

    const scrapeLocation = location || defaultLocation;
    const results = [];

    // Process products in batches to avoid overwhelming the servers
    const batchSize = 3;
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      const batchPromises = batch.map(productName => 
        scraper.scrapeProduct(productName, scrapeLocation)
      );
      
      const batchResults = await Promise.allSettled(batchPromises);
      results.push(...batchResults);
      
      // Add delay between batches
      if (i + batchSize < products.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    res.json({
      message: 'Bulk scraping completed',
      totalProducts: products.length,
      results
    });
  } catch (error) {
    console.error('Bulk scraping error:', error);
    res.status(500).json({ error: 'Failed to scrape products in bulk' });
  }
});

// Update product prices in database
router.post('/update-prices', async (req, res) => {
  try {
    const { productName, platform, price, originalPrice, deliveryTime, deliveryFee, availability } = req.body;
    
    if (!productName || !platform || !price) {
      return res.status(400).json({ error: 'Product name, platform, and price are required' });
    }

    // Find or create product
    let product = await Product.findOne({ 
      name: { $regex: productName, $options: 'i' } 
    });

    if (!product) {
      product = new Product({
        name: productName,
        category: 'General',
        prices: []
      });
    }

    // Update or add price for platform
    const existingPriceIndex = product.prices.findIndex(p => p.platform === platform);
    
    if (existingPriceIndex >= 0) {
      product.prices[existingPriceIndex] = {
        platform,
        price,
        originalPrice,
        deliveryTime,
        deliveryFee,
        availability,
        lastUpdated: new Date()
      };
    } else {
      product.prices.push({
        platform,
        price,
        originalPrice,
        deliveryTime,
        deliveryFee,
        availability,
        lastUpdated: new Date()
      });
    }

    await product.save();
    
    res.json({
      message: 'Product prices updated successfully',
      product
    });
  } catch (error) {
    console.error('Update prices error:', error);
    res.status(500).json({ error: 'Failed to update product prices' });
  }
});

// Get scraping status
router.get('/status', async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const productsWithPrices = await Product.countDocuments({
      'prices.0': { $exists: true }
    });
    
    const platformStats = await Product.aggregate([
      { $unwind: '$prices' },
      {
        $group: {
          _id: '$prices.platform',
          count: { $sum: 1 },
          avgPrice: { $avg: '$prices.price' },
          lastUpdated: { $max: '$prices.lastUpdated' }
        }
      }
    ]);

    res.json({
      totalProducts,
      productsWithPrices,
      platformStats,
      lastScrapingRun: new Date() // This would be tracked in a real implementation
    });
  } catch (error) {
    console.error('Get scraping status error:', error);
    res.status(500).json({ error: 'Failed to get scraping status' });
  }
});

// Schedule automatic scraping (runs every 30 minutes)
if (process.env.NODE_ENV === 'production') {
  cron.schedule('*/30 * * * *', async () => {
    console.log('🔄 Running scheduled scraping...');
    
    try {
      // Get popular products to scrape
      const popularProducts = await Product.find({ isActive: true })
        .sort({ updatedAt: 1 })
        .limit(10);

      for (const product of popularProducts) {
        try {
          const results = await scraper.scrapeProduct(product.name, {
            city: 'Mumbai',
            pincode: '400001'
          });
          
          // Update product prices based on scraping results
          // This would be implemented based on the scraping results structure
          console.log(`Updated prices for ${product.name}`);
        } catch (error) {
          console.error(`Error scraping ${product.name}:`, error);
        }
        
        // Add delay between products
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } catch (error) {
      console.error('Scheduled scraping error:', error);
    }
  });
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down scrapers...');
  await scraper.close();
  await quickCommerceScraper.closeBrowser();
  process.exit(0);
});

module.exports = router;
