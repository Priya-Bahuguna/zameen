const express  = require('express');
const router   = express.Router();
const Locality = require('../models/Locality');
const { protect, adminOnly } = require('../middleware/auth');

// ── GET /api/localities ── all or filter by city ───────────────
router.get('/', async (req, res) => {
  try {
    const { city, zone, sort } = req.query;
    const filter = {};
    if (city) filter.city = new RegExp(city, 'i');
    if (zone) filter.zone = zone;

    let sortObj = { investmentScore: -1 };
    if (sort === 'growth')  sortObj = { growth5Y: -1 };
    if (sort === 'rating')  sortObj = { areaRating: -1 };
    if (sort === 'price')   sortObj = { avgPricePerSqft: 1 };

    const localities = await Locality.find(filter).sort(sortObj).select('-__v');
    res.json({ success: true, count: localities.length, localities });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/localities/:name ──────────────────────────────────
router.get('/:name', async (req, res) => {
  try {
    const locality = await Locality.findOne({ name: new RegExp(req.params.name, 'i') });
    if (!locality) return res.status(404).json({ success: false, message: 'Locality not found' });
    res.json({ success: true, locality });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/localities ── admin adds new locality ────────────
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const locality = await Locality.create(req.body);
    res.status(201).json({ success: true, locality });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ── PUT /api/localities/:id ────────────────────────────────────
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const updated = await Locality.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, locality: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
