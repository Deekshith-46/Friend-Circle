const WithdrawalRequest = require('../../models/common/WithdrawalRequest');
const FemaleUser = require('../../models/femaleUser/FemaleUser');
const AgencyUser = require('../../models/agency/AgencyUser');
const Transaction = require('../../models/common/Transaction');
const razorpay = require('../../config/razorpay');
const AdminConfig = require('../../models/admin/AdminConfig');

function ensureKycVerified(user, userType) {
  if (userType === 'female') {
    if (!user || user.kycStatus !== 'approved') {
      return 'KYC not approved for female user';
    }
  } else if (userType === 'agency') {
    if (!user || user.kycStatus !== 'approved') {
      return 'KYC not approved for agency user';
    }
  }
  return null;
}

// Create withdrawal request (female or agency context)
exports.createWithdrawalRequest = async (req, res) => {
  try {
    const userType = req.originalUrl.startsWith('/female-user') ? 'female' : 'agency';
    const { coins, rupees, payoutMethod, payoutDetails } = req.body;
    
    // Validate input - either coins or rupees must be provided
    if ((!coins && !rupees) || (coins && rupees)) {
      return res.status(400).json({ success: false, message: 'Either coins or rupees amount is required (not both)' });
    }
    
    if (coins && (isNaN(coins) || coins <= 0)) {
      return res.status(400).json({ success: false, message: 'Invalid coin amount' });
    }
    
    if (rupees && (isNaN(rupees) || rupees <= 0)) {
      return res.status(400).json({ success: false, message: 'Invalid rupee amount' });
    }
    
    if (!['bank', 'upi'].includes(payoutMethod)) return res.status(400).json({ success: false, message: 'Invalid payout method' });
    if (!payoutDetails) return res.status(400).json({ success: false, message: 'Payout details required' });
    
    const user = userType === 'female' ? await FemaleUser.findById(req.user.id) : await AgencyUser.findById(req.user.id);
    const kycError = ensureKycVerified(user, userType);
    if (kycError) return res.status(400).json({ success: false, message: kycError });
    
    // Get admin config for withdrawal settings
    const adminConfig = await AdminConfig.getConfig();
    const coinToRupeeRate = adminConfig.coinToRupeeConversionRate || 10; // Default 10 coins = 1 Rupee
    const minWithdrawalAmount = adminConfig.minWithdrawalAmount || 500; // Default 500 Rupees
    
    let coinsRequested, amountInRupees;
    
    // Convert rupees to coins if rupees provided
    if (rupees) {
      amountInRupees = Number(rupees);
      coinsRequested = Math.ceil(amountInRupees * coinToRupeeRate);
    } else {
      coinsRequested = Number(coins);
      amountInRupees = Number((coinsRequested / coinToRupeeRate).toFixed(2));
    }
    
    // Check minimum withdrawal amount
    if (amountInRupees < minWithdrawalAmount) {
      return res.status(400).json({ 
        success: false, 
        message: `Minimum withdrawal amount is ₹${minWithdrawalAmount}`,
        data: {
          minWithdrawalAmount: minWithdrawalAmount,
          requestedAmount: amountInRupees
        }
      });
    }
    
    // For female users, check walletBalance; for agencies, check coinBalance
    let userBalance;
    if (userType === 'female') {
      userBalance = user.walletBalance || 0;
    } else {
      userBalance = user.coinBalance || 0;
    }
    
    // Check balance
    if (userBalance < coinsRequested) {
      return res.status(400).json({ 
        success: false, 
        message: `Insufficient ${userType === 'female' ? 'wallet' : 'coin'} balance`,
        data: {
          available: userBalance,
          required: coinsRequested,
          shortfall: coinsRequested - userBalance
        }
      });
    }
    
    // Debit from appropriate balance field
    if (userType === 'female') {
      user.walletBalance = (user.walletBalance || 0) - coinsRequested;
    } else {
      user.coinBalance = (user.coinBalance || 0) - coinsRequested;
    }
    
    await user.save();
    
    // Create transaction record
    await Transaction.create({
      userType,
      userId: user._id,
      operationType: userType === 'female' ? 'wallet' : 'coin',
      action: 'debit',
      amount: coinsRequested,
      message: 'Withdrawal requested - coins debited',
      balanceAfter: userType === 'female' ? user.walletBalance : user.coinBalance,
      createdBy: user._id
    });
    
    const request = await WithdrawalRequest.create({
      userType,
      userId: user._id,
      coinsRequested,
      amountInRupees,
      payoutMethod,
      payoutDetails,
      status: 'pending'
    });
    
    return res.status(201).json({ 
      success: true, 
      message: 'Withdrawal request created successfully. Your payment will be credited in 24 hours.',
      data: request,
      countdownTimer: 24 * 60 * 60 // 24 hours in seconds for frontend display
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// List own withdrawal requests
exports.listMyWithdrawals = async (req, res) => {
  try {
    const userType = req.originalUrl.startsWith('/female-user') ? 'female' : 'agency';
    const requests = await WithdrawalRequest.find({ userType, userId: req.user.id }).sort({ createdAt: -1 });
    return res.json({ success: true, data: requests });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ADMIN: list all pending/any requests
exports.adminListWithdrawals = async (req, res) => {
  try {
    const { status } = req.query; // optional
    const filter = status ? { status } : {};
    const data = await WithdrawalRequest.find(filter)
      .populate('userId', userType === 'female' ? 'name email kycStatus' : 'name email kycStatus')
      .sort({ createdAt: -1 });
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ADMIN: approve and pay via Razorpay Payouts
exports.adminApproveWithdrawal = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await WithdrawalRequest.findById(id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    if (request.status !== 'pending') return res.status(400).json({ success: false, message: 'Request not pending' });
    
    // Fetch user (coins already debited at request time)
    const userModel = request.userType === 'female' ? FemaleUser : AgencyUser;
    const user = await userModel.findById(request.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    // No further debit here to avoid double deduction
    
    // Razorpay: create contact, fund account, and payout
    const contact = await razorpay.contacts.create({
      name: user.name || user.email,
      email: user.email,
      type: request.userType,
    });
    
    const fundAccountPayload = request.payoutMethod === 'upi' ? {
      contact_id: contact.id,
      account_type: 'vpa',
      vpa: { address: request.payoutDetails.vpa }
    } : {
      contact_id: contact.id,
      account_type: 'bank_account',
      bank_account: {
        name: request.payoutDetails.accountHolderName,
        ifsc: request.payoutDetails.ifsc,
        account_number: request.payoutDetails.accountNumber
      }
    };
    
    const fundAccount = await razorpay.fundAccount.create(fundAccountPayload);
    
    const payout = await razorpay.payouts.create({
      account_number: process.env.RAZORPAY_PAYOUT_ACCOUNT || undefined,
      fund_account_id: fundAccount.id,
      amount: Math.round(request.amountInRupees * 100),
      currency: 'INR',
      mode: request.payoutMethod === 'upi' ? 'UPI' : 'IMPS',
      purpose: 'payout',
      queue_if_low_balance: true,
      narration: 'Withdrawal',
    });
    
    request.status = 'approved';
    request.razorpayContactId = contact.id;
    request.razorpayFundAccountId = fundAccount.id;
    request.razorpayPayoutId = payout.id;
    request.processedBy = req.admin?._id || req.staff?._id;
    await request.save();
    
    return res.json({ success: true, message: 'Withdrawal approved successfully', data: request });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ADMIN: reject
exports.adminRejectWithdrawal = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const request = await WithdrawalRequest.findById(id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    if (request.status !== 'pending') return res.status(400).json({ success: false, message: 'Request not pending' });
    
    request.status = 'rejected';
    request.notes = reason;
    request.processedBy = req.admin?._id || req.staff?._id;
    await request.save();
    
    // Refund coins to user on rejection
    const userModel = request.userType === 'female' ? FemaleUser : AgencyUser;
    const user = await userModel.findById(request.userId);
    if (user) {
      // Credit back to appropriate balance field
      if (request.userType === 'female') {
        user.walletBalance = (user.walletBalance || 0) + request.coinsRequested;
      } else {
        user.coinBalance = (user.coinBalance || 0) + request.coinsRequested;
      }
      
      await user.save();
      
      await Transaction.create({
        userType: request.userType,
        userId: user._id,
        operationType: request.userType === 'female' ? 'wallet' : 'coin',
        action: 'credit',
        amount: request.coinsRequested,
        message: 'Withdrawal rejected - coins refunded',
        balanceAfter: request.userType === 'female' ? user.walletBalance : user.coinBalance,
        createdBy: req.admin?._id || req.staff?._id
      });
    }
    
    return res.json({ success: true, message: 'Withdrawal rejected successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};