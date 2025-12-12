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
// Request in coins (NEW FORMAT - no manual payoutDetails)
{
  "coins": 15000,
  "payoutMethod": "bank"
}

// Request in rupees (NEW FORMAT - no manual payoutDetails)
{
  "rupees": 1500,
  "payoutMethod": "upi"
}

// OLD FORMAT (deprecated for female users)
{
  "coins": 15000,
  "payoutMethod": "bank",
  "payoutDetails": {
    "accountHolderName": "Jane Doe",
    "ifsc": "ABCD0001234",
    "accountNumber": "1234567890"
  }
}

// Agency users still use the old format with manual payoutDetails
{
  "coins": 15000,
  "payoutMethod": "bank",
  "payoutDetails": {
    "accountHolderName": "Jane Doe",
    "ifsc": "ABCD0001234",
    "accountNumber": "1234567890"
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