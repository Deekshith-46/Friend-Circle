const AgencyKYC = require('../../models/agency/KYC');

// Submit KYC for agency
exports.submitKYC = async (req, res) => {
  const { method, accountDetails, upiId } = req.body;
  try {
    const kyc = new AgencyKYC({ 
      user: req.user.id, 
      method, 
      accountDetails, 
      upiId 
    });
    await kyc.save();
    res.json({ success: true, message: "KYC submitted for verification." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get agency KYC status
exports.getKYCStatus = async (req, res) => {
  try {
    const kyc = await AgencyKYC.findOne({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: kyc });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
