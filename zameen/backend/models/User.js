const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

// ── User Collection Schema ─────────────────────────────────────
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false   // never returned in queries by default
  },
  phone: {
    type: String,
    match: [/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number']
  },
  role: {
    type: String,
    enum: ['buyer', 'owner', 'admin'],
    default: 'buyer'
  },
  isKYCVerified: {
    type: Boolean,
    default: false
  },
  savedProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  avatar: { type: String, default: '' }
}, { timestamps: true });

// ── Hash password before saving ────────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ── Method: compare entered password with hashed ───────────────
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
