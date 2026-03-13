const express     = require('express');
const router      = express.Router();
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');

// ── GET /api/transactions ── user's transactions ───────────────
router.get('/', protect, async (req, res) => {
  try {
    const filter = {};
    if (req.user.role !== 'admin') {
      filter.$or = [{ buyer: req.user._id }, { owner: req.user._id }];
    }
    const txns = await Transaction.find(filter)
      .populate('property', 'title city location price type images')
      .populate('buyer',  'name email phone')
      .populate('owner',  'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: txns.length, transactions: txns });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/transactions ── create inquiry / booking ─────────
router.post('/', protect, async (req, res) => {
  try {
    const txn = await Transaction.create({
      ...req.body,
      buyer: req.user._id,
      buyerName:  req.user.name,
      buyerEmail: req.user.email
    });
    res.status(201).json({ success: true, message: 'Inquiry submitted successfully', transaction: txn });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ── PUT /api/transactions/:id ── update status ─────────────────
router.put('/:id', protect, async (req, res) => {
  try {
    const txn = await Transaction.findById(req.params.id);
    if (!txn) return res.status(404).json({ success: false, message: 'Transaction not found' });

    const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, transaction: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
