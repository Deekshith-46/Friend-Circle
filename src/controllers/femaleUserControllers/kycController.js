// /controllers/femaleUserControllers/kycController.js
const KYC = require('../../models/femaleUser/KYC');
const FemaleUser = require('../../models/femaleUser/FemaleUser');
const mongoose = require('mongoose');
const { isValidEmail, isValidMobile } = require('../../validations/validations');
const messages = require('../../validations/messages');

// Submit KYC
exports.submitKYC = async (req, res) => {
  const { method, accountDetails, upiId } = req.body;
  try {
    const kyc = new KYC({ user: req.user.id, method, accountDetails, upiId });
    await kyc.save();
    
    // Also update user's kycDetails field
    const user = await FemaleUser.findById(req.user.id);
    
    // Initialize kycDetails with new structure if it doesn't exist or has old structure
    if (!user.kycDetails || !user.kycDetails.bank || !user.kycDetails.upi) {
      user.kycDetails = {
        bank: {},
        upi: {}
      };
    }
    
    if (method === "account_details" && accountDetails) {
      user.kycDetails.bank = {
        _id: new mongoose.Types.ObjectId(),
        name: accountDetails.name,
        accountNumber: accountDetails.accountNumber,
        ifsc: accountDetails.ifsc,
        verifiedAt: null
      };
    }
    
    if (method === "upi_id" && upiId) {
      user.kycDetails.upi = {
        _id: new mongoose.Types.ObjectId(),
        upiId: upiId,
        verifiedAt: null
      };
    }
    
    user.kycStatus = "pending";
    await user.save();
    
    res.json({ success: true, message: "KYC submitted for verification." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Admin can verify KYC
exports.verifyKYC = async (req, res) => {
  const { kycId, status } = req.body;
  try {
    const kyc = await KYC.findById(kycId);
    kyc.status = status;
    await kyc.save();
    
    // Also update user's kycDetails field if approved
    if (status === 'approved') {
      const user = await FemaleUser.findById(kyc.user);
      
      // Initialize kycDetails with new structure if it doesn't exist or has old structure
      if (!user.kycDetails || !user.kycDetails.bank || !user.kycDetails.upi) {
        user.kycDetails = {
          bank: {},
          upi: {}
        };
      }
      
      if (kyc.method === 'account_details' && kyc.accountDetails) {
        // Update bank details with verified timestamp
        user.kycDetails.bank = {
          _id: user.kycDetails.bank._id || new mongoose.Types.ObjectId(),
          name: kyc.accountDetails.name,
          accountNumber: kyc.accountDetails.accountNumber,
          ifsc: kyc.accountDetails.ifsc,
          verifiedAt: new Date()
        };
      } else if (kyc.method === 'upi_id' && kyc.upiId) {
        // Update UPI details with verified timestamp
        user.kycDetails.upi = {
          _id: user.kycDetails.upi._id || new mongoose.Types.ObjectId(),
          upiId: kyc.upiId,
          verifiedAt: new Date()
        };
      }
      
      // Set overall KYC status to approved
      user.kycStatus = 'approved';
      await user.save();
    }
    
    res.json({ success: true, data: kyc });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};