const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
  platform: {
    type: String,
    enum: ['zepto', 'swiggy', 'bigbasket'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  originalPrice: Number,
  discount: Number,
  discountPercentage: Number,
  deliveryTime: String, // e.g., "10-15 mins", "30 mins"
  deliveryFee: Number,
  minimumOrder: Number,
  availability: {
    type: Boolean,
    default: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  subcategory: String,
  brand: String,
  description: String,
  image: String,
  unit: String, // e.g., "1 kg", "500g", "1 piece"
  barcode: String,
  prices: [priceSchema],
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better query performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ 'prices.platform': 1 });
productSchema.index({ createdAt: -1 });

// Update the updatedAt field before saving
productSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Product', productSchema);
