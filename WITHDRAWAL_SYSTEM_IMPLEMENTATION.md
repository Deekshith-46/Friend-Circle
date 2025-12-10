# Female User Withdrawal System Implementation

## Overview
This document describes the implementation of the female user withdrawal system, which allows female users to withdraw their earned coins as cash. The system follows the specified flow where `walletBalance` stores withdrawable coins and `coinBalance` is only for spending.

## Key Features

### Admin Configuration
- **Coin to Rupee Conversion Rate**: Default 10 coins = ₹1
- **Minimum Withdrawal Amount**: Default ₹500
- Admins can update these settings via API endpoints

### User Requirements
- KYC must be approved before withdrawal
- Users must have sufficient wallet balance
- Withdrawal amount must meet minimum threshold

### Supported Inputs
- Users can request withdrawal in coins or rupees
- System automatically converts between coins and rupees based on admin rate

## Implementation Details

### 1. Admin Configuration Settings

#### Models Updated
- `src/models/admin/AdminConfig.js` - Added withdrawal settings fields

#### Schema Changes
```javascript
const adminConfigSchema = new mongoose.Schema({
  minCallCoins: { 
    type: Number, 
    default: 60,
    min: 0
  },
  // Withdrawal settings
  coinToRupeeConversionRate: {
    type: Number,
    default: 10, // 10 coins = 1 Rupee
    min: 0
  },
  minWithdrawalAmount: {
    type: Number,
    default: 500, // Minimum withdrawal amount in Rupees
    min: 0
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });
```

#### New Controller Functions
Added to `src/controllers/adminControllers/adminController.js`:

```javascript
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
```

#### New API Endpoints
Added to `src/routes/adminRoutes/admin.js`:
```javascript
router.post('/config/coin-to-rupee-rate', auth, dynamicPermissionCheck, parser.none(), controller.updateCoinToRupeeRate);
router.post('/config/min-withdrawal-amount', auth, dynamicPermissionCheck, parser.none(), controller.updateMinWithdrawalAmount);
```

### 2. Withdrawal Controller Updates

#### File Modified
- `src/controllers/common/withdrawalController.js`

#### Key Changes
- Modified to use `walletBalance` instead of `coinBalance` for female users
- Added validation for KYC approval
- Implemented minimum withdrawal amount checking
- Added support for both coin and rupee inputs
- Updated transaction logging
- Improved refund mechanism for rejected withdrawals

#### Enhanced Create Withdrawal Request Function
```javascript
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
```

#### Enhanced Admin Reject Function
```javascript
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
```

### 3. New Female User Endpoints

#### Routes Added
- `GET /female-user/me/balance` - Get balance information
- `GET /female-user/me/withdrawals` - Get withdrawal history

Added to `src/routes/femaleUserRoutes/femaleUserRoutes.js`:
```javascript
// Get balance information (wallet and coin balances)
router.get('/me/balance', auth, femaleUserController.getBalanceInfo);

// Get withdrawal history
router.get('/me/withdrawals', auth, femaleUserController.getWithdrawalHistory);
```

#### Controller Functions Added
Added to `src/controllers/femaleUserControllers/femaleUserController.js`:

```javascript
// Get balance information for female user
exports.getBalanceInfo = async (req, res) => {
  try {
    const user = await FemaleUser.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Get admin config for conversion rate
    const adminConfig = await AdminConfig.getConfig();
    const coinToRupeeRate = adminConfig.coinToRupeeConversionRate || 10; // Default 10 coins = 1 Rupee
    
    const walletBalance = user.walletBalance || 0;
    const coinBalance = user.coinBalance || 0;
    
    const walletBalanceInRupees = Number((walletBalance / coinToRupeeRate).toFixed(2));
    const coinBalanceInRupees = Number((coinBalance / coinToRupeeRate).toFixed(2));
    
    return res.json({
      success: true,
      data: {
        walletBalance: {
          coins: walletBalance,
          rupees: walletBalanceInRupees
        },
        coinBalance: {
          coins: coinBalance,
          rupees: coinBalanceInRupees
        },
        conversionRate: {
          coinsPerRupee: coinToRupeeRate
        }
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Get withdrawal history for female user
exports.getWithdrawalHistory = async (req, res) => {
  try {
    const requests = await WithdrawalRequest.find({ 
      userType: 'female', 
      userId: req.user.id 
    }).sort({ createdAt: -1 });
    
    return res.json({ success: true, data: requests });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
```

#### Required Imports
Added to `src/controllers/femaleUserControllers/femaleUserController.js`:
```javascript
const AdminConfig = require('../../models/admin/AdminConfig');
const WithdrawalRequest = require('../../models/common/WithdrawalRequest');
```

### 4. Data Models

#### AdminConfig Schema
```javascript
{
  coinToRupeeConversionRate: { type: Number, default: 10 },
  minWithdrawalAmount: { type: Number, default: 500 }
}
```

#### FemaleUser Fields Used
- `walletBalance` - Withdrawable coins
- `coinBalance` - Spending coins (non-withdrawable)
- `kycStatus` - Must be 'approved' for withdrawals

## API Endpoints

### Admin Configuration
```
POST /admin/config/coin-to-rupee-rate
{
  "coinToRupeeConversionRate": 10
}

POST /admin/config/min-withdrawal-amount
{
  "minWithdrawalAmount": 500
}
```

### Female User Withdrawal
```
GET /female-user/me/balance
Response:
{
  "success": true,
  "data": {
    "walletBalance": {
      "coins": 26000,
      "rupees": 2600
    },
    "coinBalance": {
      "coins": 5000,
      "rupees": 500
    },
    "conversionRate": {
      "coinsPerRupee": 10
    }
  }
}

GET /female-user/me/withdrawals
Response:
{
  "success": true,
  "data": [
    {
      "userType": "female",
      "userId": "...",
      "coinsRequested": 15000,
      "amountInRupees": 1500,
      "status": "approved",
      "payoutMethod": "bank",
      "payoutDetails": {...},
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}

POST /female-user/withdrawals
// Request in coins
{
  "coins": 15000,
  "payoutMethod": "bank",
  "payoutDetails": {
    "accountHolderName": "Jane Doe",
    "ifsc": "ABCD0001234",
    "accountNumber": "1234567890"
  }
}

// Request in rupees
{
  "rupees": 1500,
  "payoutMethod": "upi",
  "payoutDetails": {
    "vpa": "jane.doe@upi"
  }
}
```

### Admin Withdrawal Management
```
GET /admin/payouts
GET /admin/payouts/:id/approve
POST /admin/payouts/:id/reject
{
  "reason": "Incorrect bank details"
}
```

## Validation Logic

1. **KYC Check**: User's `kycStatus` must be 'approved'
2. **Minimum Amount**: Requested amount must be ≥ configured minimum
3. **Balance Check**: User's `walletBalance` must be ≥ requested coins
4. **Input Validation**: Either coins or rupees must be provided (not both)

## Conversion Formula

- **Coins to Rupees**: `rupees = coins / coinToRupeeConversionRate`
- **Rupees to Coins**: `coins = ceil(rupees * coinToRupeeConversionRate)`

## Transaction Logging

All withdrawal operations are logged in the Transaction model:
- Withdrawal requests: 'debit' from wallet
- Rejected withdrawals: 'credit' back to wallet
- Operation type: 'wallet' for female users

## Error Handling

The system provides descriptive error messages for:
- Insufficient balance
- KYC not approved
- Amount below minimum
- Invalid input parameters

## Security Considerations

- All endpoints are protected with authentication middleware
- KYC verification is required before any withdrawal
- Balance checks prevent overdrafts
- Transaction logging provides audit trail
- Proper error handling prevents information leakage

## Testing Scenarios

1. **Valid Withdrawal**: User with sufficient balance requests valid amount
2. **Insufficient Balance**: User requests more than available balance
3. **Below Minimum**: User requests amount below minimum threshold
4. **KYC Not Approved**: User with pending/rejected KYC tries to withdraw
5. **Invalid Input**: Malformed request data
6. **Admin Approval**: Admin approves a withdrawal request
7. **Admin Rejection**: Admin rejects a withdrawal request with reason
8. **Balance Refund**: Rejected withdrawal properly refunds user balance