const mongoose = require('mongoose');

// ── Transaction Collection Schema ─────────────────────────────
// Records property inquiries, viewings, and deal closures
const transactionSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  buyer:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  owner:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  transactionType: {
    type: String,
    enum: ['inquiry', 'site_visit', 'deal_closed', 'rental_agreement'],
    default: 'inquiry'
  },

  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },

  agreedPrice: { type: Number },
  propertyCity:     { type: String },
  propertyLocation: { type: String },

  // Inquiry details
  buyerName:  { type: String },
  buyerPhone: { type: String },
  buyerEmail: { type: String },
  message:    { type: String },

  scheduledDate: { type: Date },
  completedAt:   { type: Date },
  notes:         { type: String }
}, { timestamps: true });

transactionSchema.index({ property: 1, status: 1 });
transactionSchema.index({ buyer: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
