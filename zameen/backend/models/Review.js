const mongoose = require('mongoose');

// ── Review Collection Schema ───────────────────────────────────
// Stores community reviews and ratings for localities
const reviewSchema = new mongoose.Schema({
  locality: { type: String, required: true },
  city:     { type: String, required: true },
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: { type: String, required: true },

  // Locality-specific ratings (each 1–10)
  ratings: {
    safety:      { type: Number, min: 1, max: 10, required: true },
    waterSupply: { type: Number, min: 1, max: 10, required: true },
    electricity: { type: Number, min: 1, max: 10, required: true },
    transport:   { type: Number, min: 1, max: 10, required: true },
    schools:     { type: Number, min: 1, max: 10, required: true },
    hospitals:   { type: Number, min: 1, max: 10, required: true },
    cleanliness: { type: Number, min: 1, max: 10, required: true },
    traffic:     { type: Number, min: 1, max: 10, required: true }
  },

  overallRating: { type: Number, min: 1, max: 10 },   // auto-calculated
  reviewText:    { type: String, maxlength: 1000 },
  pros:          [{ type: String }],
  cons:          [{ type: String }],

  // Community discussion
  likes:  { type: Number, default: 0 },
  isVerifiedResident: { type: Boolean, default: false }
}, { timestamps: true });

// Auto-calculate overall rating before save
reviewSchema.pre('save', function (next) {
  const r = this.ratings;
  const sum = r.safety + r.waterSupply + r.electricity + r.transport +
              r.schools + r.hospitals + r.cleanliness + r.traffic;
  this.overallRating = parseFloat((sum / 8).toFixed(1));
  next();
});

// One review per user per locality
reviewSchema.index({ user: 1, locality: 1, city: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
