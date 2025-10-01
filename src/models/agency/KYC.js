const mongoose = require('mongoose');

const agencyKycSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'AgencyUser', required: true },
  method: { type: String, enum: ['account_details', 'upi_id'], required: true },
  accountDetails: { 
    name: String, 
    accountNumber: String, 
    ifsc: String 
  },
  upiId: { type: String },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('AgencyKYC', agencyKycSchema);
