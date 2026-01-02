# UPDATED CALL SYSTEM ARCHITECTURE

This document explains the updated call system architecture with the new two-price, two-margin model where female users control their earnings while admin controls platform margins.

## Table of Contents
1. [Overview](#overview)
2. [Key Changes](#key-changes)
3. [Data Models](#data-models)
4. [API Endpoints](#api-endpoints)
5. [Call Flow](#call-flow)
6. [Admin Configuration](#admin-configuration)

## Overview

The updated call system implements a new architecture where:

- **Female users** set their earning rate (what they receive)
- **Admin** sets platform margins (for agency vs non-agency females)
- **Male users** pay: Female earnings + Platform margin
- **Admin earnings** are tracked via records, not stored in a wallet

## Key Changes

### 1. Call History Model Updates

The CallHistory model now includes separate fields for:
- `femaleEarningPerSecond` - Rate that female gets per second
- `platformMarginPerSecond` - Platform margin per second
- `femaleEarning` - Total coins female earned
- `platformMargin` - Total platform margin

### 2. Admin Configuration Updates

New admin config fields:
- `marginAgency` - Platform margin for agency females
- `marginNonAgency` - Platform margin for non-agency females
- `adminSharePercentage` - Percentage of platform margin that goes to admin

### 3. Call Logic Updates

The new architecture follows this formula:
```
Male Pay Rate = Female Earning Rate + Platform Margin Rate
```

Where platform margin depends on whether the female belongs to an agency:
- Agency females: `platformMarginPerSecond = admin.marginAgency`
- Non-agency females: `platformMarginPerSecond = admin.marginNonAgency`

## Data Models

### CallHistory Schema

```javascript
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

  // Coin Details - Updated for new architecture
  femaleEarningPerSecond: { 
    type: Number, 
    required: true,
    min: 0 
  }, // Rate that female gets per second
  platformMarginPerSecond: { 
    type: Number, 
    required: true,
    min: 0 
  }, // Platform margin per second
  totalCoins: { 
    type: Number, 
    required: true,
    min: 0 
  }, // Total coins male paid (female earning + platform margin)
  femaleEarning: { // Total coins female earned
    type: Number,
    required: true,
    min: 0
  },
  platformMargin: { // Total platform margin
    type: Number,
    required: true,
    min: 0
  },

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
```

### AdminConfig Schema

```javascript
const adminConfigSchema = new mongoose.Schema({
  minCallCoins: { 
    type: Number, 
    default: 60,
    min: 0
  },
  // Call margin settings
  marginAgency: { // Platform margin for agency females
    type: Number,
    default: 1, // 1 coin per second
    min: 0
  },
  marginNonAgency: { // Platform margin for non-agency females
    type: Number,
    default: 1, // 1 coin per second
    min: 0
  },
  adminSharePercentage: { // Percentage of platform margin that goes to admin
    type: Number,
    default: 60, // 60% of platform margin goes to admin, rest to agency
    min: 0,
    max: 100
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
  femaleReferralBonus: {
    type: Number,
    default: 100   // coins
  },
  agencyReferralBonus: {
    type: Number,
    default: 0     // coins
  },
  maleReferralBonus: {
    type: Number,
    default: 100   // coins
  },
  // Other global settings can be added here in the future
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });
```

## API Endpoints

### Call Endpoints

#### POST /male-user/calls/start
- **Purpose**: Validate call and return rates
- **Request**: `{ receiverId, callType }`
- **Response**: 
  ```json
  {
    "success": true,
    "message": "Call can be started",
    "data": {
      "maxSeconds": 60,
      "femaleEarningPerSecond": 2,
      "platformMarginPerSecond": 1,
      "malePayPerSecond": 3,
      "callerCoinBalance": 180,
      "minCallCoins": 60,
      "isAgencyFemale": false
    }
  }
  ```

#### POST /male-user/calls/end
- **Purpose**: Process call completion and distribute earnings
- **Request**: `{ receiverId, duration, callType }`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Call ended successfully",
    "data": {
      "callId": "call_record_id",
      "duration": 60,
      "femaleEarningPerSecond": 2,
      "platformMarginPerSecond": 1,
      "totalCoins": 180,
      "coinsDeducted": 180,
      "femaleEarning": 120,
      "platformMargin": 60,
      "callerRemainingBalance": 0,
      "receiverNewBalance": 120
    }
  }
  ```

### Admin Configuration Endpoints

#### POST /admin/config/margin-agency
- **Purpose**: Update agency female margin
- **Request**: `{ marginAgency: 2 }`
- **Response**: Updated margin value

#### POST /admin/config/margin-non-agency
- **Purpose**: Update non-agency female margin
- **Request**: `{ marginNonAgency: 1 }`
- **Response**: Updated margin value

#### POST /admin/config/admin-share-percentage
- **Purpose**: Update admin share percentage from platform margin
- **Request**: `{ adminSharePercentage: 60 }`
- **Response**: Updated percentage value

## Call Flow

### Case 1: Agency Female

1. **Start Call**:
   - Female earning rate: 2 coins/sec
   - Agency margin: 1 coin/sec (config)
   - Male pay rate: 3 coins/sec

2. **End Call** (1-minute call):
   - Male pays: 180 coins
   - Female receives: 120 coins (guaranteed)
   - Platform margin: 60 coins
   - Admin share: 36 coins (60% of margin)
   - Agency share: 24 coins (40% of margin)

### Case 2: Non-Agency Female

1. **Start Call**:
   - Female earning rate: 2 coins/sec
   - Non-agency margin: 1 coin/sec (config)
   - Male pay rate: 3 coins/sec

2. **End Call** (1-minute call):
   - Male pays: 180 coins
   - Female receives: 120 coins (guaranteed)
   - Platform margin: 60 coins
   - Admin receives: 60 coins (100% of margin)

## Admin Configuration

### Default Values
- `marginAgency`: 1 coin/sec
- `marginNonAgency`: 1 coin/sec
- `adminSharePercentage`: 60%

### Configuration Logic

The platform determines how to distribute the platform margin based on whether the female user belongs to an agency:

```javascript
// Determine if female belongs to agency
const isAgencyFemale = receiver.referredByAgency && receiver.referredByAgency.length > 0;

// Get platform margin based on female type
const platformMarginPerSecond = isAgencyFemale 
  ? adminConfig.marginAgency
  : adminConfig.marginNonAgency;

// Calculate male pay rate per second
const malePayPerSecond = femaleEarningPerSecond + platformMarginPerSecond;

// Distribute platform margin
if (isAgencyFemale) {
  // Calculate admin and agency shares from platform margin
  const adminShare = Math.floor(platformMargin * adminConfig.adminSharePercentage / 100);
  const agencyShare = platformMargin - adminShare;
} else {
  // For non-agency female, the entire platform margin goes to admin
}
```

## Transaction Tracking

### Admin Money Tracking

Admin money is tracked via records, not stored in a wallet:

```javascript
// Create transaction for admin (not stored in admin wallet, just for tracking)
await Transaction.create({
  userType: 'admin',
  userId: 'system', // Using 'system' as placeholder for admin
  operationType: 'commission',
  action: 'credit',
  amount: adminShare,
  earningType: 'call_platform_margin',
  message: `Admin commission from call between ${caller.name || caller.email} and ${receiver.name || receiver.email} for ${billableSeconds} seconds`,
  balanceAfter: 0, // Admin doesn't have a wallet balance, just tracking
  createdBy: 'system',
  relatedId: callRecord._id,
  relatedModel: 'CallHistory'
});
```

This approach ensures that admin earnings are calculated from records rather than stored in a wallet balance, providing accurate reporting and audit trails.