const mongoose = require('mongoose');

const maleUserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String},
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: String },
  password: { type: String, required: true },
  bio: { type: String },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  interests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Interest' }],
  languages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Language' }],
  relationshipGoals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RelationshipGoal' }],
  religion: { type: mongoose.Schema.Types.ObjectId, ref: 'Religion' },
  height: { type: String },
  searchPreferences: { type: String, enum: ['male', 'female', 'both'], default: 'female' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FemaleUser' }],
  malefollowing: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MaleFollowing' }],
  malefollowers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MaleFollowers' }], // Added missing followers array
  images: [String], // Array of image URLs
  balance: { type: Number, default: 0 }, // Deprecated: legacy combined balance
  walletBalance: { type: Number, default: 0 },
  coinBalance: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: false }, // Only true after OTP verification
  otp: { type: Number }, // OTP for verification
  // Referral system
  referralCode: { type: String, unique: true, sparse: true }, // 8-char alphanumeric
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'MaleUser' }, // Who referred this user
  referralBonusAwarded: { type: Boolean, default: false }, // Ensure one-time award after verification
}, { timestamps: true });

module.exports = mongoose.model('MaleUser', maleUserSchema);