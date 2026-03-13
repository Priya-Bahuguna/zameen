const mongoose = require('mongoose');

// ── PriceHistory Collection Schema ────────────────────────────
// Stores historical price data per locality per year
const priceHistorySchema = new mongoose.Schema({
  locality:    { type: String, required: true },
  city:        { type: String, required: true },
  propertyType:{ type: String, enum: ['buy', 'rent', 'all'], default: 'buy' },
  bhk:         { type: Number, default: 0 },   // 0 = all BHK types

  // Yearly data points
  yearlyData: [{
    year:            { type: Number, required: true },
    avgPricePerSqft: { type: Number, required: true },
    avgTotalPrice:   { type: Number },
    totalTransactions: { type: Number, default: 0 },
    growthPercent:   { type: Number, default: 0 }
  }],

  // Calculated fields
  growth1Y: { type: Number, default: 0 },
  growth3Y: { type: Number, default: 0 },
  growth5Y: { type: Number, default: 0 },

  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

priceHistorySchema.index({ locality: 1, city: 1, propertyType: 1 });

module.exports = mongoose.model('PriceHistory', priceHistorySchema);
