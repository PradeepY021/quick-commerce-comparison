const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const PriceComparisonService = require('../services/priceComparison');

const comparisonService = new PriceComparisonService();

// Get all products with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const category = req.query.category;
    const search = req.query.search;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;
    
    const products = await Product.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .populate('prices.platform');

    const total = await Product.countDocuments(query);

    res.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Search products
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { city, pincode } = req.query;
    
    const products = await Product.find({
      $text: { $search: query },
      isActive: true
    }).limit(10);

    res.json(products);
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({ error: 'Failed to search products' });
  }
});

// Get product categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get popular categories
router.get('/categories/popular', async (req, res) => {
  try {
    const popular = await comparisonService.getPopularCategories();
    res.json(popular);
  } catch (error) {
    console.error('Get popular categories error:', error);
    res.status(500).json({ error: 'Failed to fetch popular categories' });
  }
});

// Get trending searches
router.get('/trending/searches', async (req, res) => {
  try {
    const trending = await comparisonService.getTrendingSearches();
    res.json(trending);
  } catch (error) {
    console.error('Get trending searches error:', error);
    res.status(500).json({ error: 'Failed to fetch trending searches' });
  }
});

// Update product prices (admin only)
router.put('/:id/prices', async (req, res) => {
  try {
    const { platform, price, originalPrice, deliveryTime, deliveryFee, availability } = req.body;
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
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
    res.json(product);
  } catch (error) {
    console.error('Update product prices error:', error);
    res.status(500).json({ error: 'Failed to update product prices' });
  }
});

module.exports = router;
