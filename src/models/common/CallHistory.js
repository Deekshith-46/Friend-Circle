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
  
  // Coin Details
  coinsPerSecond: { 
    type: Number, 
    required: true,
    min: 0 
  }, // Rate at the time of call
  totalCoins: { 
    type: Number, 
    required: true,
    min: 0 
  }, // Total coins deducted/credited
  
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
