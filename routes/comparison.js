const express = require('express');
const router = express.Router();
const PriceComparisonService = require('../services/priceComparison');
const Comparison = require('../models/Comparison');

const comparisonService = new PriceComparisonService();

// Compare products across platforms
router.post('/compare', async (req, res) => {
  try {
    const { searchQuery, location } = req.body;
    
    if (!searchQuery) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    if (!location || !location.city || !location.pincode) {
      return res.status(400).json({ error: 'Location (city and pincode) is required' });
    }

    const result = await comparisonService.compareProducts(searchQuery, location);
    res.json(result);
  } catch (error) {
    console.error('Compare products error:', error);
    res.status(500).json({ error: 'Failed to compare products' });
  }
});

// Get comparison history
router.get('/history', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { city, pincode } = req.query;

    const query = {};
    if (city) query.city = city;
    if (pincode) query.pincode = pincode;

    const skip = (page - 1) * limit;
    
    const comparisons = await Comparison.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('results.productId');

    const total = await Comparison.countDocuments(query);

    res.json({
      comparisons,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get comparison history error:', error);
    res.status(500).json({ error: 'Failed to fetch comparison history' });
  }
});

// Get specific comparison by ID
router.get('/:id', async (req, res) => {
  try {
    const comparison = await Comparison.findById(req.params.id)
      .populate('results.productId');
    
    if (!comparison) {
      return res.status(404).json({ error: 'Comparison not found' });
    }

    res.json(comparison);
  } catch (error) {
    console.error('Get comparison error:', error);
    res.status(500).json({ error: 'Failed to fetch comparison' });
  }
});

// Get best deals for a category
router.get('/deals/best', async (req, res) => {
  try {
    const { category, city, pincode } = req.query;
    
    if (!category) {
      return res.status(400).json({ error: 'Category is required' });
    }

    // This would need to be implemented based on your business logic
    // For now, returning a placeholder response
    res.json({
      message: 'Best deals feature coming soon',
      category,
      city,
      pincode
    });
  } catch (error) {
    console.error('Get best deals error:', error);
    res.status(500).json({ error: 'Failed to fetch best deals' });
  }
});

// Get price alerts (future feature)
router.get('/alerts/price', async (req, res) => {
  try {
    // Placeholder for price alerts feature
    res.json({
      message: 'Price alerts feature coming soon'
    });
  } catch (error) {
    console.error('Get price alerts error:', error);
    res.status(500).json({ error: 'Failed to fetch price alerts' });
  }
});

// Create price alert (future feature)
router.post('/alerts/price', async (req, res) => {
  try {
    const { productId, targetPrice, email } = req.body;
    
    // Placeholder for price alert creation
    res.json({
      message: 'Price alert creation feature coming soon',
      productId,
      targetPrice,
      email
    });
  } catch (error) {
    console.error('Create price alert error:', error);
    res.status(500).json({ error: 'Failed to create price alert' });
  }
});

// Get comparison statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const { city, pincode } = req.query;
    
    const query = {};
    if (city) query.city = city;
    if (pincode) query.pincode = pincode;

    const stats = await Comparison.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalComparisons: { $sum: 1 },
          avgSavings: { $avg: '$bestDeal.totalSavings' },
          totalSavings: { $sum: '$bestDeal.totalSavings' }
        }
      }
    ]);

    const trendingSearches = await comparisonService.getTrendingSearches(5);
    const popularCategories = await comparisonService.getPopularCategories(5);

    res.json({
      stats: stats[0] || { totalComparisons: 0, avgSavings: 0, totalSavings: 0 },
      trendingSearches,
      popularCategories
    });
  } catch (error) {
    console.error('Get comparison stats error:', error);
    res.status(500).json({ error: 'Failed to fetch comparison statistics' });
  }
});

module.exports = router;
