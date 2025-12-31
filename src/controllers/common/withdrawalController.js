const WithdrawalRequest = require('../../models/common/WithdrawalRequest');
const FemaleUser = require('../../models/femaleUser/FemaleUser');
const AgencyUser = require('../../models/agency/AgencyUser');
const Transaction = require('../../models/common/Transaction');
const razorpay = require('../../config/razorpay');
const AdminConfig = require('../../models/admin/AdminConfig');
const { isValidEmail, isValidMobile } = require('../../validations/validations');
const messages = require('../../validations/messages');

function ensureKycVerified(user, userType) {
  if (userType === 'female') {
    if (!user || 
        !user.kycDetails || 
        !((user.kycDetails.bank && user.kycDetails.bank.status === 'accepted') || 
          (user.kycDetails.upi && user.kycDetails.upi.status === 'accepted'))) {
      return messages.VALIDATION.KYC_NOT_APPROVED('female');
    }
  } else if (userType === 'agency') {
    if (!user || 
        !user.kycDetails || 
        !((user.kycDetails.bank && user.kycDetails.bank.status === 'accepted') || 
          (user.kycDetails.upi && user.kycDetails.upi.status === 'accepted'))) {
      return messages.VALIDATION.KYC_NOT_APPROVED('agency');
    }
  }
  return null;
}

// Create withdrawal request (female or agency context)
exports.createWithdrawalRequest = async (req, res) => {
  try {
    const userType = req.originalUrl.startsWith('/female-user') ? 'female' : 'agency';
    const { coins, rupees, payoutMethod } = req.body;
    
    // Validate input - either coins or rupees must be provided
    if ((!coins && !rupees) || (coins && rupees)) {
      return res.status(400).json({ success: false, message: messages.VALIDATION.AMOUNT_REQUIRED });
    }
    
    if (coins && (isNaN(coins) || coins <= 0)) {
      return res.status(400).json({ success: false, message: messages.VALIDATION.INVALID_COIN_AMOUNT });
    }
    
    if (rupees && (isNaN(rupees) || rupees <= 0)) {
      return res.status(400).json({ success: false, message: messages.VALIDATION.INVALID_RUPEE_AMOUNT });
    }
    
    if (!['bank', 'upi'].includes(payoutMethod)) return res.status(400).json({ success: false, message: messages.VALIDATION.INVALID_PAYOUT_METHOD });
    
    const user = userType === 'female' ? await FemaleUser.findById(req.user.id) : await AgencyUser.findById(req.user.id);
    const kycError = ensureKycVerified(user, userType);
    if (kycError) return res.status(400).json({ success: false, message: kycError });
    
    // For female users, auto-populate payoutDetails from KYC
    let payoutDetails = null;
    if (userType === 'female') {
      if (payoutMethod === 'bank') {
        if (!user.kycDetails || !user.kycDetails.bank || user.kycDetails.bank.status !== 'accepted') {
          return res.status(400).json({ success: false, message: messages.VALIDATION.BANK_DETAILS_NOT_VERIFIED });
        }
        payoutDetails = {
          accountHolderName: user.kycDetails.bank.name,
          accountNumber: user.kycDetails.bank.accountNumber,
          ifsc: user.kycDetails.bank.ifsc
        };
      } else if (payoutMethod === 'upi') {
        if (!user.kycDetails || !user.kycDetails.upi || user.kycDetails.upi.status !== 'accepted') {
          return res.status(400).json({ success: false, message: messages.VALIDATION.UPI_DETAILS_NOT_VERIFIED });
        }
        payoutDetails = {
          vpa: user.kycDetails.upi.upiId
        };
      }
    } else {
      // For agency users, still require manual payoutDetails for backward compatibility
      if (!req.body.payoutDetails) return res.status(400).json({ success: false, message: messages.VALIDATION.PAYOUT_DETAILS_REQUIRED });
      payoutDetails = req.body.payoutDetails;
    }
    
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
        message: messages.WITHDRAWAL.MIN_WITHDRAWAL_AMOUNT(minWithdrawalAmount),
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
        message: messages.WITHDRAWAL.INSUFFICIENT_BALANCE(userType === 'female' ? 'wallet' : 'coin'),
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
      message: messages.WITHDRAWAL.WITHDRAWAL_SUCCESS,
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
    const requests = await WithdrawalRequest.find(filter).sort({ createdAt: -1 });
    
    // Populate user details for each request
    const populatedRequests = [];
    for (let request of requests) {
      const requestData = request.toObject();
      if (requestData.userType === 'female') {
        const user = await FemaleUser.findById(requestData.userId).select('name email kycStatus');
        requestData.userDetails = user;
      } else if (requestData.userType === 'agency') {
        const user = await AgencyUser.findById(requestData.userId).select('name email kycStatus');
        requestData.userDetails = user;
      }
      populatedRequests.push(requestData);
    }
    
    return res.json({ success: true, data: populatedRequests });
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
    
    // Check if Razorpay is configured
    if (!razorpay) {
      return res.status(500).json({ 
        success: false, 
        message: messages.PAYMENT.RAZORPAY_NOT_CONFIGURED
      });
    }
    
    // Check for the correct Razorpay API methods
    console.log('Razorpay API structure:');
    console.log('- Customers:', !!razorpay.customers, typeof razorpay.customers);
    console.log('- FundAccount:', !!razorpay.fundAccount, typeof razorpay.fundAccount);
    console.log('- Payments:', !!razorpay.payments, typeof razorpay.payments);
    
    // Fetch user (coins already debited at request time)
    const userModel = request.userType === 'female' ? FemaleUser : AgencyUser;
    const user = await userModel.findById(request.userId);
    if (!user) return res.status(404).json({ success: false, message: messages.COMMON.USER_NOT_FOUND });
    // No further debit here to avoid double deduction
    
    // For now, let's skip the Razorpay integration and just approve the request
    // This is a temporary solution until we can properly integrate with the new API
    request.status = 'approved';
    request.processedBy = req.admin?._id || req.staff?._id;
    await request.save();
    
    return res.json({ success: true, message: messages.WITHDRAWAL.WITHDRAWAL_APPROVED, data: request });
  } catch (err) {
    console.error('Error approving withdrawal:', err);
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
    
    return res.json({ success: true, message: messages.WITHDRAWAL.WITHDRAWAL_REJECTED });
  } catch (err) {
    console.error('Error rejecting withdrawal:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};