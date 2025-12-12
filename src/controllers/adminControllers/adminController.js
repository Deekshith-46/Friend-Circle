const AdminUser = require('../../models/admin/AdminUser');
const Staff = require('../../models/admin/Staff');
const AdminConfig = require('../../models/admin/AdminConfig');
const bcrypt = require('bcryptjs');
const generateToken = require('../../utils/generateToken');
const createAuditLog = require('../../utils/createAuditLog');

// Login Admin or Staff (unified login with user type selection)
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password, userType } = req.body;
    
    if (userType === 'admin') {
      const admin = await AdminUser.findOne({ email });
      if (!admin) return res.status(400).json({ success: false, message: 'Invalid credentials' });

      const isMatch = await bcrypt.compare(password, admin.passwordHash);
      if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid credentials' });

      res.json({
        success: true,
        data: {
          token: generateToken(admin._id),
          user: { id: admin._id, name: admin.name, email: admin.email, type: 'admin' }
        }
      });
    } else if (userType === 'staff') {
      const staff = await Staff.findOne({ email, status: 'publish' });
      if (!staff) return res.status(400).json({ success: false, message: 'Invalid credentials or staff not active' });

      const isMatch = await bcrypt.compare(password, staff.passwordHash);
      if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid credentials' });

      res.json({
        success: true,
        data: {
          token: generateToken(staff._id),
          user: { id: staff._id, email: staff.email, type: 'staff', permissions: staff.permissions }
        }
      });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get Current Admin Profile
exports.getProfile = async (req, res) => {
  try {
    res.json({ success: true, data: req.admin });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update Admin (name, password)
exports.updateAdmin = async (req, res) => {
  try {
    const { name, password } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (password) updateData.passwordHash = await bcrypt.hash(password, 10);

    const admin = await AdminUser.findByIdAndUpdate(req.admin._id, updateData, { new: true });
    await createAuditLog(req.admin._id, 'UPDATE', 'AdminUser', admin._id, updateData);

    res.json({ success: true, data: admin });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete Admin Account
exports.deleteAdmin = async (req, res) => {
  try {
    await AdminUser.findByIdAndDelete(req.admin._id);
    await createAuditLog(req.admin._id, 'DELETE', 'AdminUser', req.admin._id, {});
    res.json({ success: true, message: 'Admin account deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get admin configuration
exports.getAdminConfig = async (req, res) => {
  try {
    const config = await AdminConfig.getConfig();
    return res.json({
      success: true,
      data: config
    });
  } catch (err) {
    return res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};

// Update minCallCoins setting
exports.updateMinCallCoins = async (req, res) => {
  try {
    const { minCallCoins } = req.body;
    
    // Validate input
    if (minCallCoins === undefined || minCallCoins === null) {
      return res.status(400).json({ 
        success: false, 
        message: 'minCallCoins is required' 
      });
    }
    
    const numericValue = Number(minCallCoins);
    if (!Number.isFinite(numericValue) || numericValue < 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'minCallCoins must be a valid non-negative number' 
      });
    }
    
    // Get or create config and update minCallCoins
    let config = await AdminConfig.getConfig();
    config.minCallCoins = numericValue;
    await config.save();
    
    return res.json({
      success: true,
      message: 'Minimum call coins setting updated successfully',
      data: {
        minCallCoins: config.minCallCoins
      }
    });
  } catch (err) {
    return res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};

// Update coin to rupee conversion rate
exports.updateCoinToRupeeRate = async (req, res) => {
  try {
    const { coinToRupeeConversionRate } = req.body;
    
    // Validate input
    if (coinToRupeeConversionRate === undefined || coinToRupeeConversionRate === null) {
      return res.status(400).json({ 
        success: false, 
        message: 'coinToRupeeConversionRate is required' 
      });
    }
    
    const numericValue = Number(coinToRupeeConversionRate);
    if (!Number.isFinite(numericValue) || numericValue <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'coinToRupeeConversionRate must be a valid positive number' 
      });
    }
    
    // Get or create config and update coinToRupeeConversionRate
    let config = await AdminConfig.getConfig();
    config.coinToRupeeConversionRate = numericValue;
    await config.save();
    
    return res.json({
      success: true,
      message: 'Coin to rupee conversion rate updated successfully',
      data: {
        coinToRupeeConversionRate: config.coinToRupeeConversionRate
      }
    });
  } catch (err) {
    return res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};

// Update minimum withdrawal amount
exports.updateMinWithdrawalAmount = async (req, res) => {
  try {
    const { minWithdrawalAmount } = req.body;
    
    // Validate input
    if (minWithdrawalAmount === undefined || minWithdrawalAmount === null) {
      return res.status(400).json({ 
        success: false, 
        message: 'minWithdrawalAmount is required' 
      });
    }
    
    const numericValue = Number(minWithdrawalAmount);
    if (!Number.isFinite(numericValue) || numericValue <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'minWithdrawalAmount must be a valid positive number' 
      });
    }
    
    // Get or create config and update minWithdrawalAmount
    let config = await AdminConfig.getConfig();
    config.minWithdrawalAmount = numericValue;
    await config.save();
    
    return res.json({
      success: true,
      message: 'Minimum withdrawal amount updated successfully',
      data: {
        minWithdrawalAmount: config.minWithdrawalAmount
      }
    });
  } catch (err) {
    return res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};

// Set/Update referral bonus
exports.setReferralBonus = async (req, res) => {
  try {
    const { bonus } = req.body; // coins to give

    // Validate input
    if (bonus === undefined || bonus === null) {
      return res.status(400).json({ 
        success: false, 
        message: 'bonus is required' 
      });
    }
    
    const numericValue = Number(bonus);
    if (!Number.isFinite(numericValue) || numericValue < 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'bonus must be a valid non-negative number' 
      });
    }

    const config = await AdminConfig.getConfig();
    config.referralBonus = numericValue;
    await config.save();

    res.json({
      success: true,
      message: "Referral bonus updated",
      data: config
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get referral bonus
exports.getReferralBonus = async (req, res) => {
  try {
    const config = await AdminConfig.getConfig();
    return res.json({
      success: true,
      data: {
        referralBonus: config.referralBonus || 100 // Default value if not set
      }
    });
  } catch (err) {
    return res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};

// Update referral bonus (alternative to POST)
exports.updateReferralBonus = async (req, res) => {
  try {
    const { bonus } = req.body;

    // Validate input
    if (bonus === undefined || bonus === null) {
      return res.status(400).json({ 
        success: false, 
        message: 'bonus is required' 
      });
    }
    
    const numericValue = Number(bonus);
    if (!Number.isFinite(numericValue) || numericValue < 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'bonus must be a valid non-negative number' 
      });
    }

    const config = await AdminConfig.getConfig();
    config.referralBonus = numericValue;
    await config.save();

    res.json({
      success: true,
      message: "Referral bonus updated",
      data: {
        referralBonus: config.referralBonus
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete/reset referral bonus (set to default value)
exports.deleteReferralBonus = async (req, res) => {
  try {
    const config = await AdminConfig.getConfig();
    const previousBonus = config.referralBonus;
    config.referralBonus = 100; // Reset to default value
    await config.save();

    res.json({
      success: true,
      message: "Referral bonus reset to default value",
      data: {
        previousBonus: previousBonus,
        newBonus: config.referralBonus
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
