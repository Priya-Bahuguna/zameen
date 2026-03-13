const mongoose = require('mongoose');

// ── Property Collection Schema ─────────────────────────────────
const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true
  },
  description: { type: String, required: true },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  type: {
    type: String,
    enum: ['buy', 'rent'],
    required: true
  },
  city:     { type: String, required: true },
  location: { type: String, required: true },   // locality/area
  bhk:      { type: Number, required: true, min: 1, max: 10 },
  area:     { type: Number, required: true },   // in sq ft
  floor:       { type: Number, default: 0 },
  totalFloors: { type: Number, default: 1 },
  age:         { type: Number, default: 0 },    // property age in years
  facing:      { type: String, enum: ['North','South','East','West','North-East','North-West','South-East','South-West'], default: 'North' },
  furnished: {
    type: String,
    enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
    required: true
  },
  possession: { type: String, default: 'Ready to Move' },
  amenities:  [{ type: String }],
  images:     [{ type: String }],
  pricePerSqft: { type: Number },

  // Verification system
  verified: { type: Boolean, default: false },
  verifiedAt: { type: Date },
  flaggedAsDuplicate: { type: Boolean, default: false },
  suspiciousPricing:  { type: Boolean, default: false },

  // Owner info
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ownerName:    { type: String, required: true },
  contactPhone: { type: String, required: true },

  // Analytics fields (populated from PriceHistory collection)
  investmentScore: { type: Number, default: 0 },
  rentalYield:     { type: Number, default: 0 },
  areaRating:      { type: Number, default: 0 },

  isActive: { type: Boolean, default: true },
  views:    { type: Number, default: 0 }
}, { timestamps: true });

// Auto-calculate pricePerSqft before saving
propertySchema.pre('save', function (next) {
  if (this.price && this.area && this.area > 0) {
    this.pricePerSqft = Math.round(this.price / this.area);
  }
  next();
});

// Index for fast search
propertySchema.index({ city: 1, type: 1, bhk: 1, price: 1 });
propertySchema.index({ location: 'text', title: 'text' });

module.exports = mongoose.model('Property', propertySchema);
