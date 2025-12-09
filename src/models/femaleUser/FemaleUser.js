const mongoose = require('mongoose');

const femaleUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true, unique: true },
  otp: { 
    type: Number,
    required: function() {
      return !this.isVerified;
    }
  }, // OTP for verification
  name: { type: String },
  age: { type: Number },
  gender: { type: String, enum: ['female', 'male'] },
  bio: { type: String },
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FemaleImage' }],
  videoUrl: String, // URL for the 10-second live video
  interests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Interest' }],
  languages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Language' }],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  reviewStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: false }, // Only true after OTP verification
  profileCompleted: { type: Boolean, default: false }, // True only after user completes profile with all details
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MaleUser' }],

  kycStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FemaleFollowers' }], // Fixed: should reference FemaleFollowers, not MaleUser
  femalefollowing: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FemaleFollowing' }], // Fixed: should reference FemaleFollowing
  earnings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Earnings' }],
  blockList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FemaleUser' }],
  beautyFilter: { type: Boolean, default: false },
  hideAge: { type: Boolean, default: false },
  onlineStatus: { type: Boolean, default: false },
  onlineStartTime: { type: Date },
  totalOnlineMinutes: { type: Number, default: 0 },
  missedCalls: { type: Number, default: 0 },
  walletBalance: { type: Number, default: 0 },
  coinBalance: { type: Number, default: 0 },
  // Call rate system
  coinsPerSecond: { type: Number, default: 2 }, // Admin-configurable rate for video/audio calls
  // Referral system
  referralCode: { type: String, unique: true, sparse: true },
  referredByFemale: { type: mongoose.Schema.Types.ObjectId, ref: 'FemaleUser' },
  referredByAgency: { type: mongoose.Schema.Types.ObjectId, ref: 'AgencyUser' },
  referralBonusAwarded: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('FemaleUser', femaleUserSchema);