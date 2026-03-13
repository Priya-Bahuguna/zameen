// ══════════════════════════════════════════════════════════════
//  Zameen – Smart Property Intelligence Platform
//  Main Express Server
// ══════════════════════════════════════════════════════════════

const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const dotenv     = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// ── Middleware ─────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ─────────────────────────────────────────────────────
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/properties',   require('./routes/properties'));
app.use('/api/localities',   require('./routes/localities'));
app.use('/api/reviews',      require('./routes/reviews'));
app.use('/api/pricehistory', require('./routes/priceHistory'));
app.use('/api/transactions',  require('./routes/transactions'));

// ── Health check ───────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Zameen API is running',
    version: '1.0.0',
    endpoints: [
      'POST   /api/auth/register',
      'POST   /api/auth/login',
      'GET    /api/auth/me',
      'GET    /api/properties',
      'POST   /api/properties',
      'GET    /api/properties/:id',
      'PUT    /api/properties/:id',
      'DELETE /api/properties/:id',
      'GET    /api/localities',
      'GET    /api/localities/:name',
      'GET    /api/reviews',
      'POST   /api/reviews',
      'GET    /api/pricehistory/:locality',
      'GET    /api/transactions',
      'POST   /api/transactions',
    ]
  });
});

// ── 404 handler ────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global error handler ───────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal Server Error' });
});

// ── Connect to MongoDB & start server ─────────────────────────
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () => console.log(`🚀 Zameen server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
