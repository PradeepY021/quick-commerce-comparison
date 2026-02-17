const mongoose = require('mongoose');

const comparisonSchema = new mongoose.Schema({
  searchQuery: {
    type: String,
    required: true,
    index: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  city: {
    type: String,
    required: true,
    index: true
  },
  pincode: {
    type: String,
    required: true,
    index: true
  },
  results: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    platform: {
      type: String,
      enum: ['zepto', 'swiggy', 'bigbasket'],
      required: true
    },
    price: Number,
    deliveryTime: String,
    deliveryFee: Number,
    totalCost: Number, // price + delivery fee
    savings: Number, // compared to highest price
    rank: Number // 1 = best deal
  }],
  bestDeal: {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    platform: String,
    totalSavings: Number
  },
  searchCount: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Indexes
comparisonSchema.index({ searchQuery: 1, city: 1, pincode: 1 });
comparisonSchema.index({ location: '2dsphere' });
comparisonSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Comparison', comparisonSchema);
