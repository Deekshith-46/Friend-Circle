// /controllers/femaleUserControllers/kycController.js
const KYC = require('../../models/femaleUser/KYC');

// Submit KYC
exports.submitKYC = async (req, res) => {
  const { method, accountDetails, upiId } = req.body;
  try {
    const kyc = new KYC({ user: req.user.id, method, accountDetails, upiId });
    await kyc.save();
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
    res.json({ success: true, data: kyc });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
