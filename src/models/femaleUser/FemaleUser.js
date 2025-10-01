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
  images: [String], // Array for 3 uploaded images
  videoUrl: String, // URL for the 10-second live video
  interests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Interest' }],
  languages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Language' }],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  reviewStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  isVerified: { type: Boolean, default: false },
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MaleUser' }],

  kycStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MaleUser' }],
  femalefollowing: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FemaleFollowers' }],
  earnings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Earnings' }],
  blockList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FemaleUser' }],
  beautyFilter: { type: Boolean, default: false },
  hideAge: { type: Boolean, default: false },
  onlineStatus: { type: Boolean, default: false },
  walletBalance: { type: Number, default: 0 },
  coinBalance: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('FemaleUser', femaleUserSchema);
