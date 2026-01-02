const mongoose = require('mongoose');

const callHistorySchema = new mongoose.Schema({
  // Caller (Male User)
  callerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'MaleUser', 
    required: true 
  },
  callerType: { 
    type: String, 
    default: 'male',
    enum: ['male'] 
  },
  
  // Receiver (Female User)
  receiverId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'FemaleUser', 
    required: true 
  },
  receiverType: { 
    type: String, 
    default: 'female',
    enum: ['female'] 
  },
  
  // Call Details
  duration: { 
    type: Number, 
    required: true,
    min: 0 
  }, // Duration in seconds
  
  // Coin Details - Updated for new architecture
  femaleEarningPerMinute: { 
    type: Number, 
    required: true,
    min: 0 
  }, // Rate that female gets per minute (source of truth)
  platformMarginPerMinute: { 
    type: Number, 
    required: true,
    min: 0 
  }, // Platform margin per minute (source of truth)
  femaleEarningPerSecond: { 
    type: Number, 
    required: true,
    min: 0 
  }, // Rate that female gets per second (calculated at runtime)
  platformMarginPerSecond: { 
    type: Number, 
    required: true,
    min: 0 
  }, // Platform margin per second (calculated at runtime)
  totalCoins: { 
    type: Number, 
    required: true,
    min: 0 
  }, // Total coins male paid (female earning + platform margin)
  femaleEarning: { // Total coins female earned
    type: Number,
    required: true,
    min: 0
  },
  platformMargin: { // Total platform margin
    type: Number,
    required: true,
    min: 0
  },
  adminEarned: { // Total admin commission from platform margin
    type: Number,
    required: true,
    min: 0
  },
  agencyEarned: { // Total agency commission from platform margin
    type: Number,
    required: true,
    min: 0
  },
  isAgencyFemale: { // Flag to identify if the female belongs to an agency
    type: Boolean,
    required: true,
    default: false
  },
  
  // Call Type
  callType: { 
    type: String, 
    enum: ['audio', 'video'], 
    default: 'video' 
  },
  
  // Call Status
  status: { 
    type: String, 
    enum: ['completed', 'failed', 'insufficient_coins'], 
    default: 'completed' 
  },
  
  // Additional Info
  errorMessage: { type: String },
  
}, { timestamps: true });

// Indexes for efficient queries
callHistorySchema.index({ callerId: 1, createdAt: -1 });
callHistorySchema.index({ receiverId: 1, createdAt: -1 });
callHistorySchema.index({ createdAt: -1 });

module.exports = mongoose.model('CallHistory', callHistorySchema);
