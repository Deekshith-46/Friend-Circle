const mongoose = require('mongoose');

const adminConfigSchema = new mongoose.Schema({
  minCallCoins: { 
    type: Number, 
    default: 60,
    min: 0
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