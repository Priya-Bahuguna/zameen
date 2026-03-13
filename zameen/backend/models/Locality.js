const mongoose = require('mongoose');

// ── Locality Collection Schema ─────────────────────────────────
const localitySchema = new mongoose.Schema({
  name:  { type: String, required: true, trim: true },
  city:  { type: String, required: true },
  state: { type: String, default: '' },
  pincode: { type: String, default: '' },

  // Price Analytics
  avgPricePerSqft: { type: Number, default: 0 },
  avgRentPerMonth: { type: Number, default: 0 },

  // Growth data
  growth1Y: { type: Number, default: 0 },   // % growth in 1 year
  growth3Y: { type: Number, default: 0 },
  growth5Y: { type: Number, default: 0 },

  // Investment metrics
  rentalYield:     { type: Number, default: 0 },
  investmentScore: { type: Number, default: 0, min: 0, max: 100 },

  // Area rating parameters (out of 10)
  areaRating:   { type: Number, default: 0 },
  safetyScore:  { type: Number, default: 0 },
  waterSupply:  { type: Number, default: 0 },
  electricity:  { type: Number, default: 0 },
  transport:    { type: Number, default: 0 },
  schools:      { type: Number, default: 0 },
  hospitals:    { type: Number, default: 0 },
  cleanliness:  { type: Number, default: 0 },
  traffic:      { type: Number, default: 0 },

  // Infrastructure tags
  infrastructureTags: [{ type: String }],
  // e.g. ["Metro Nearby", "IT Park", "Hospital", "Mall", "Airport"]

  // Heatmap category
  zone: {
    type: String,
    enum: ['expensive', 'affordable', 'growing'],
    default: 'growing'
  },

  totalListings: { type: Number, default: 0 }
}, { timestamps: true });

localitySchema.index({ name: 1, city: 1 }, { unique: true });

module.exports = mongoose.model('Locality', localitySchema);
