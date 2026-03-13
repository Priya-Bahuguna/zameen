const express      = require('express');
const router       = express.Router();
const PriceHistory = require('../models/PriceHistory');
const { protect, adminOnly } = require('../middleware/auth');

// ── GET /api/pricehistory/:locality ───────────────────────────
router.get('/:locality', async (req, res) => {
  try {
    const { city, type, bhk } = req.query;
    const filter = { locality: new RegExp(req.params.locality, 'i') };
    if (city) filter.city = new RegExp(city, 'i');
    if (type) filter.propertyType = type;
    if (bhk)  filter.bhk = parseInt(bhk);

    const data = await PriceHistory.findOne(filter);
    if (!data) return res.status(404).json({ success: false, message: 'No price history data found' });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/pricehistory ── all localities ────────────────────
router.get('/', async (req, res) => {
  try {
    const { city } = req.query;
    const filter = {};
    if (city) filter.city = new RegExp(city, 'i');
    const all = await PriceHistory.find(filter).select('-__v');
    res.json({ success: true, count: all.length, data: all });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/pricehistory ── admin adds data ─────────────────
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    // Calculate growth percentages automatically
    const { yearlyData } = req.body;
    if (yearlyData && yearlyData.length >= 2) {
      const last  = yearlyData[yearlyData.length - 1].avgPricePerSqft;
      const y1ago = yearlyData[yearlyData.length - 2]?.avgPricePerSqft;
      const y3ago = yearlyData[yearlyData.length - 4]?.avgPricePerSqft;
      const y5ago = yearlyData[0]?.avgPricePerSqft;

      req.body.growth1Y = y1ago ? parseFloat(((last - y1ago) / y1ago * 100).toFixed(1)) : 0;
      req.body.growth3Y = y3ago ? parseFloat(((last - y3ago) / y3ago * 100).toFixed(1)) : 0;
      req.body.growth5Y = y5ago ? parseFloat(((last - y5ago) / y5ago * 100).toFixed(1)) : 0;
    }

    const record = await PriceHistory.findOneAndUpdate(
      { locality: req.body.locality, city: req.body.city, propertyType: req.body.propertyType || 'buy' },
      req.body,
      { new: true, upsert: true, runValidators: true }
    );
    res.status(201).json({ success: true, data: record });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
