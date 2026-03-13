const express  = require('express');
const router   = express.Router();
const Review   = require('../models/Review');
const Locality = require('../models/Locality');
const { protect } = require('../middleware/auth');

// ── GET /api/reviews?locality=X&city=Y ────────────────────────
router.get('/', async (req, res) => {
  try {
    const { locality, city } = req.query;
    const filter = {};
    if (locality) filter.locality = new RegExp(locality, 'i');
    if (city)     filter.city     = new RegExp(city, 'i');

    const reviews = await Review.find(filter)
      .sort({ createdAt: -1 })
      .populate('user', 'name avatar isKYCVerified')
      .select('-__v');

    res.json({ success: true, count: reviews.length, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/reviews ── submit review ─────────────────────────
router.post('/', protect, async (req, res) => {
  try {
    const { locality, city, ratings, reviewText, pros, cons } = req.body;

    const review = await Review.create({
      locality, city,
      user: req.user._id,
      userName: req.user.name,
      ratings, reviewText, pros, cons
    });

    // Update locality aggregate scores
    const allReviews = await Review.find({ locality, city });
    const n = allReviews.length;
    if (n > 0) {
      const avg = (key) =>
        parseFloat((allReviews.reduce((s, r) => s + (r.ratings[key] || 0), 0) / n).toFixed(1));

      await Locality.findOneAndUpdate(
        { name: new RegExp(locality, 'i'), city: new RegExp(city, 'i') },
        {
          areaRating:  parseFloat((allReviews.reduce((s, r) => s + r.overallRating, 0) / n).toFixed(1)),
          safetyScore: avg('safety'),
          waterSupply: avg('waterSupply'),
          electricity: avg('electricity'),
          transport:   avg('transport'),
          schools:     avg('schools'),
          hospitals:   avg('hospitals'),
          cleanliness: avg('cleanliness'),
          traffic:     avg('traffic')
        },
        { upsert: true }
      );
    }

    res.status(201).json({ success: true, message: 'Review submitted successfully', review });
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ success: false, message: 'You have already reviewed this locality' });
    res.status(400).json({ success: false, message: err.message });
  }
});

// ── DELETE /api/reviews/:id ────────────────────────────────────
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorised' });
    await review.deleteOne();
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
