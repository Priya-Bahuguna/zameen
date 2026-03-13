const express  = require('express');
const router   = express.Router();
const Property = require('../models/Property');
const { protect } = require('../middleware/auth');

// ── GET /api/properties ── with all filters ────────────────────
router.get('/', async (req, res) => {
  try {
    const { city, type, bhk, minPrice, maxPrice, furnished, verified,
            location, minArea, maxArea, sort, page = 1, limit = 12 } = req.query;

    // Build filter object dynamically
    const filter = { isActive: true };
    if (city)      filter.city      = new RegExp(city, 'i');
    if (type)      filter.type      = type;
    if (bhk)       filter.bhk       = parseInt(bhk);
    if (furnished) filter.furnished = furnished;
    if (verified === 'true') filter.verified = true;
    if (location)  filter.location  = new RegExp(location, 'i');

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    if (minArea || maxArea) {
      filter.area = {};
      if (minArea) filter.area.$gte = parseFloat(minArea);
      if (maxArea) filter.area.$lte = parseFloat(maxArea);
    }

    // Sort options
    let sortObj = { createdAt: -1 };
    if (sort === 'priceLow')    sortObj = { price: 1 };
    if (sort === 'priceHigh')   sortObj = { price: -1 };
    if (sort === 'areaLarge')   sortObj = { area: -1 };
    if (sort === 'investment')  sortObj = { investmentScore: -1 };
    if (sort === 'newest')      sortObj = { createdAt: -1 };

    const skip  = (parseInt(page) - 1) * parseInt(limit);
    const total = await Property.countDocuments(filter);
    const props = await Property.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      count: props.length,
      properties: props
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/properties/:id ────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const prop = await Property.findById(req.params.id).populate('owner', 'name email phone');
    if (!prop) return res.status(404).json({ success: false, message: 'Property not found' });

    // Increment view count
    await Property.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.json({ success: true, property: prop });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/properties ── create listing ────────────────────
router.post('/', protect, async (req, res) => {
  try {
    const body = { ...req.body, owner: req.user._id };

    // Fraud detection: flag suspicious pricing
    const avgPrices = { Bangalore: 7000, Mumbai: 18000, Gurgaon: 10000, Hyderabad: 7000 };
    const cityAvg   = avgPrices[body.city] || 7000;
    const ppsf      = body.price / body.area;
    if (ppsf > cityAvg * 3) body.suspiciousPricing = true;

    const prop = await Property.create(body);
    res.status(201).json({ success: true, message: 'Listing created successfully', property: prop });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ── PUT /api/properties/:id ────────────────────────────────────
router.put('/:id', protect, async (req, res) => {
  try {
    const prop = await Property.findById(req.params.id);
    if (!prop) return res.status(404).json({ success: false, message: 'Property not found' });
    if (prop.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorised to edit this property' });

    const updated = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, property: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ── DELETE /api/properties/:id ─────────────────────────────────
router.delete('/:id', protect, async (req, res) => {
  try {
    const prop = await Property.findById(req.params.id);
    if (!prop) return res.status(404).json({ success: false, message: 'Property not found' });
    if (prop.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorised' });

    await Property.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Property listing removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/properties/:id/verify ── admin verifies ─────────
router.post('/:id/verify', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Admin only' });
    await Property.findByIdAndUpdate(req.params.id, { verified: true, verifiedAt: new Date() });
    res.json({ success: true, message: 'Property verified' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
