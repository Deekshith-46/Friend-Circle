const mongoose = require('mongoose');

const adminConfigSchema = new mongoose.Schema({
  minCallCoins: { 
    type: Number, 
    default: null,
    min: 0
  },
  // Call margin settings (per minute - source of truth)
  marginAgencyPerMinute: { // Platform margin per minute for agency females
    type: Number,
    default: null, // Must be explicitly set by admin
    min: 0
  },
  marginNonAgencyPerMinute: { // Platform margin per minute for non-agency females
    type: Number,
    default: null, // Must be explicitly set by admin
    min: 0
  },
  // Legacy fields (will be deprecated)
  marginAgency: { // Platform margin per second for agency females (deprecated)
    type: Number,
    default: null
  },
  marginNonAgency: { // Platform margin per second for non-agency females (deprecated)
    type: Number,
    default: null
  },
  adminSharePercentage: { // Percentage of platform margin that goes to admin
    type: Number,
    default: null, // Must be explicitly set by admin
    min: 0, // Allow 0% for testing purposes
    max: 100
  },
  // Withdrawal settings
  coinToRupeeConversionRate: {
    type: Number,
    default: null, // Must be explicitly set by admin
    min: 0
  },
  minWithdrawalAmount: {
    type: Number,
    default: null, // Must be explicitly set by admin
    min: 0
  },
  femaleReferralBonus: {
    type: Number,
    default: 100   // coins
  },
  agencyReferralBonus: {
    type: Number,
    default: 0     // coins
  },
  maleReferralBonus: {
    type: Number,
    default: 100   // coins
  },
  // Other global settings can be added here in the future
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Ensure only one config document exists
adminConfigSchema.statics.getConfig = async function() {
  let config = await this.findOne();
  if (!config) {
    config = await this.create({});
  }
  return config;
};

module.exports = mongoose.model('AdminConfig', adminConfigSchema);