const Product = require('../models/Product');
const Comparison = require('../models/Comparison');
const { getRedisClient } = require('../config/redis');

class PriceComparisonService {
  constructor() {
    this.redisClient = getRedisClient();
  }

  async compareProducts(searchQuery, location) {
    try {
      // Check cache first
      const cacheKey = `comparison:${searchQuery}:${location.city}:${location.pincode}`;
      const cachedResult = await this.getFromCache(cacheKey);
      if (cachedResult) {
        return cachedResult;
      }

      // Search for products
      const products = await this.searchProducts(searchQuery, location);
      
      if (products.length === 0) {
        return { message: 'No products found', results: [] };
      }

      // Compare prices
      const comparisonResults = await this.performComparison(products, location);
      
      // Find best deal
      const bestDeal = this.findBestDeal(comparisonResults);
      
      // Save comparison to database
      const comparison = new Comparison({
        searchQuery,
        location: {
          type: 'Point',
          coordinates: [location.longitude || 0, location.latitude || 0]
        },
        city: location.city,
        pincode: location.pincode,
        results: comparisonResults,
        bestDeal
      });
      
      await comparison.save();
      
      // Cache the result
      await this.setCache(cacheKey, { results: comparisonResults, bestDeal }, 300); // 5 minutes
      
      return { results: comparisonResults, bestDeal };
    } catch (error) {
      console.error('Price comparison error:', error);
      throw error;
    }
  }

  async searchProducts(query, location) {
    try {
      // Search in database first
      const dbProducts = await Product.find({
        $text: { $search: query },
        isActive: true
      }).limit(20);

      if (dbProducts.length > 0) {
        return dbProducts;
      }

      // If no products in database, you might want to trigger scraping
      // This would be handled by the scraper service
      return [];
    } catch (error) {
      console.error('Product search error:', error);
      return [];
    }
  }

  async performComparison(products, location) {
    const results = [];

    for (const product of products) {
      const productPrices = product.prices || [];
      
      if (productPrices.length === 0) continue;

      // Calculate total cost for each platform
      const platformCosts = productPrices.map(price => ({
        platform: price.platform,
        price: price.price,
        deliveryFee: price.deliveryFee || 0,
        deliveryTime: price.deliveryTime,
        totalCost: price.price + (price.deliveryFee || 0),
        availability: price.availability,
        lastUpdated: price.lastUpdated
      }));

      // Sort by total cost
      platformCosts.sort((a, b) => a.totalCost - b.totalCost);

      // Calculate savings
      const highestPrice = Math.max(...platformCosts.map(p => p.totalCost));
      const lowestPrice = Math.min(...platformCosts.map(p => p.totalCost));

      const rankedPlatforms = platformCosts.map((platform, index) => ({
        productId: product._id,
        platform: platform.platform,
        price: platform.price,
        deliveryTime: platform.deliveryTime,
        deliveryFee: platform.deliveryFee,
        totalCost: platform.totalCost,
        savings: highestPrice - platform.totalCost,
        savingsPercentage: ((highestPrice - platform.totalCost) / highestPrice * 100).toFixed(2),
        rank: index + 1,
        availability: platform.availability,
        lastUpdated: platform.lastUpdated
      }));

      results.push({
        product: {
          id: product._id,
          name: product.name,
          category: product.category,
          brand: product.brand,
          image: product.image,
          unit: product.unit
        },
        platforms: rankedPlatforms,
        bestDeal: rankedPlatforms[0],
        totalSavings: highestPrice - lowestPrice
      });
    }

    return results;
  }

  findBestDeal(comparisonResults) {
    if (comparisonResults.length === 0) return null;

    let bestDeal = null;
    let maxSavings = 0;

    comparisonResults.forEach(result => {
      if (result.bestDeal && result.bestDeal.savings > maxSavings) {
        maxSavings = result.bestDeal.savings;
        bestDeal = {
          productId: result.bestDeal.productId,
          platform: result.bestDeal.platform,
          totalSavings: result.bestDeal.savings
        };
      }
    });

    return bestDeal;
  }

  async getTrendingSearches(limit = 10) {
    try {
      const trending = await Comparison.aggregate([
        {
          $group: {
            _id: '$searchQuery',
            count: { $sum: '$searchCount' },
            lastSearched: { $max: '$createdAt' }
          }
        },
        {
          $sort: { count: -1, lastSearched: -1 }
        },
        {
          $limit: limit
        }
      ]);

      return trending.map(item => ({
        query: item._id,
        searchCount: item.count,
        lastSearched: item.lastSearched
      }));
    } catch (error) {
      console.error('Error getting trending searches:', error);
      return [];
    }
  }

  async getPopularCategories(limit = 10) {
    try {
      const popular = await Product.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: '$category',
            productCount: { $sum: 1 },
            avgPrice: { $avg: '$prices.price' }
          }
        },
        {
          $sort: { productCount: -1 }
        },
        {
          $limit: limit
        }
      ]);

      return popular;
    } catch (error) {
      console.error('Error getting popular categories:', error);
      return [];
    }
  }

  async getFromCache(key) {
    if (!this.redisClient) return null;
    
    try {
      const cached = await this.redisClient.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async setCache(key, data, ttlSeconds = 300) {
    if (!this.redisClient) return;
    
    try {
      await this.redisClient.setEx(key, ttlSeconds, JSON.stringify(data));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }
}

module.exports = PriceComparisonService;
