# User and Referral System Documentation

This document contains the schema models for female, male, and agency users, along with referral bonus related code and admin approval setup.

## 1. User Schema Models

### 1.1 Female User Schema

```js
const mongoose = require('mongoose');

const femaleUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true, unique: true },
  otp: { 
    type: Number,
    required: function() {
      return !this.isVerified;
    }
  }, // OTP for verification
  name: { type: String },
  age: { type: Number },
  gender: { type: String, enum: ['female', 'male'] },
  bio: { type: String },
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FemaleImage' }],
  videoUrl: String, // URL for the 10-second live video
  interests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Interest' }],
  languages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Language' }],
  // New fields for manually entered preferences (stored as {id, name})
  hobbies: [{ 
    id: { type: String, required: true },
    name: { type: String, required: true }
  }],
  sports: [{ 
    id: { type: String, required: true },
    name: { type: String, required: true }
  }],
  film: [{ 
    id: { type: String, required: true },
    name: { type: String, required: true }
  }],
  music: [{ 
    id: { type: String, required: true },
    name: { type: String, required: true }
  }],
  travel: [{ 
    id: { type: String, required: true },
    name: { type: String, required: true }
  }],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  reviewStatus: { type: String, enum: ['completeProfile', 'pending', 'accepted', 'rejected'], default: 'completeProfile' },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: false }, // Only true after OTP verification
  profileCompleted: { type: Boolean, default: false }, // True only after user completes profile with all details
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MaleUser' }],

  kycStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  kycDetails: { 
    bank: {
      _id: { type: mongoose.Schema.Types.ObjectId },
      name: String,
      accountNumber: String,
      ifsc: String,
      verifiedAt: Date
    },
    upi: {
      _id: { type: mongoose.Schema.Types.ObjectId },
      upiId: String,
      verifiedAt: Date
    }
  },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FemaleFollowers' }], // Fixed: should reference FemaleFollowers, not MaleUser
  femalefollowing: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FemaleFollowing' }], // Fixed: should reference FemaleFollowing
  earnings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Earnings' }],
  blockList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FemaleUser' }],
  beautyFilter: { type: Boolean, default: false },
  hideAge: { type: Boolean, default: false },
  onlineStatus: { type: Boolean, default: false },
  onlineStartTime: { type: Date },
  totalOnlineMinutes: { type: Number, default: 0 },
  missedCalls: { type: Number, default: 0 },
  walletBalance: { type: Number, default: 0 },
  coinBalance: { type: Number, default: 0 },
  // Call rate system
  coinsPerSecond: { type: Number, default: 2 }, // Admin-configurable rate for video/audio calls
  // Referral system
  referralCode: { type: String, unique: true, sparse: true },
  referredByFemale: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FemaleUser' }],
  referredByAgency: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AgencyUser' }],
}, { timestamps: true });

module.exports = mongoose.model('FemaleUser', femaleUserSchema);
```

### 1.2 Male User Schema

```js
const mongoose = require('mongoose');

const maleUserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String},
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: String },
  password: { type: String, required: true },
  bio: { type: String },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  interests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Interest' }],
  languages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Language' }],
  // New fields for manually entered preferences
  hobbies: [{ type: String }],
  sports: [{ type: String }],
  film: [{ type: String }],
  music: [{ type: String }],
  travel: [{ type: String }],
  relationshipGoals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RelationshipGoal' }],
  religion: { type: mongoose.Schema.Types.ObjectId, ref: 'Religion' },
  height: { type: String },
  searchPreferences: { type: String, enum: ['male', 'female', 'both'], default: 'female' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FemaleUser' }],
  malefollowing: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MaleFollowing' }],
  malefollowers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MaleFollowers' }], // Added missing followers array
  images: [String], // Array of image URLs
  balance: { type: Number, default: 0 }, // Deprecated: legacy combined balance
  walletBalance: { type: Number, default: 0 },
  coinBalance: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: false }, // Only true after OTP verification
  otp: { type: Number }, // OTP for verification
  profileCompleted: { type: Boolean, default: false }, // Track if user has completed profile
  // Referral system
  referralCode: { type: String, unique: true, sparse: true }, // 8-char alphanumeric
  referredBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MaleUser' }], 
}, { timestamps: true });

module.exports = mongoose.model('MaleUser', maleUserSchema);
```

### 1.3 Agency User Schema

```js
const mongoose = require('mongoose');

const agencyUserSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	mobileNumber: { type: String, required: true, unique: true },
	otp: {
		type: Number,
		required: function() {
			return !this.isVerified;
		}
	},
	isVerified: { type: Boolean, default: false },
	isActive: { type: Boolean, default: false }, // Only true after OTP verification
	firstName: { type: String },
	lastName: { type: String },
	aadharOrPanNum: { type: String },
	image: { type: String },
	referralCode: { type: String, unique: true, sparse: true },
	// Referral system
	referredByAgency: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AgencyUser' }], 
	status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
	profileCompleted: { type: Boolean, default: false },
	reviewStatus: { type: String, enum: ['completeProfile', 'pending', 'accepted', 'rejected'], default: 'completeProfile' },
	kycStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
	walletBalance: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('AgencyUser', agencyUserSchema);
```

## 2. Referral Bonus System

### 2.1 Process Referral Bonus Utility

```js
const AdminConfig = require('../models/admin/AdminConfig');
const FemaleUser = require('../models/femaleUser/FemaleUser');
const AgencyUser = require('../models/agency/AgencyUser');
const MaleUser = require('../models/maleUser/MaleUser');
const Transaction = require('../models/common/Transaction');

/**
 * Process referral bonus for a user based on their type
 * @param {Object} user - The user who was referred
 * @param {string} userType - The type of user ('female', 'agency', or 'male')
 * @returns {boolean} - True if referral bonus was processed, false otherwise
 */
const processReferralBonus = async (user, userType) => {
  try {
    // Get admin config for referral bonus amounts
    const config = await AdminConfig.getConfig();
    
    // Check if user has been referred
    let hasReferral = false;
    
    if (userType === 'female') {
      hasReferral = (user.referredByFemale && user.referredByFemale.length > 0) || 
                   (user.referredByAgency && user.referredByAgency.length > 0);
    } else if (userType === 'agency') {
      hasReferral = user.referredByAgency && user.referredByAgency.length > 0;
    } else if (userType === 'male') {
      hasReferral = user.referredBy && user.referredBy.length > 0;
    }
    
    if (!hasReferral) {
      return false;
    }
    
    let referrer = null;
    let referralBonusAmount = 0;
    let referrerBonusAmount = 0;
    let referredUserBonusAmount = 0;
    let bonusType = null; // 'wallet' or 'coin'
    
    // Determine referrer and bonus amount based on user type and referral source
    if (userType === 'female') {
      // Female user - can be referred by Female or Agency
      if (user.referredByFemale && user.referredByFemale.length > 0) { // Referred by Female
        referrer = await FemaleUser.findById(user.referredByFemale[0]);
        if (referrer) {
          // Both referrer and referred get femaleReferralBonus
          const femaleBonus = config.femaleReferralBonus;
          if (femaleBonus === undefined || femaleBonus <= 0) return false;
          referralBonusAmount = femaleBonus;
          referrerBonusAmount = femaleBonus;
          referredUserBonusAmount = femaleBonus;
          bonusType = 'wallet';
        }
      } else if (user.referredByAgency && user.referredByAgency.length > 0) { // Referred by Agency
        referrer = await AgencyUser.findById(user.referredByAgency[0]);
        if (referrer) {
          // Agency gets agencyReferralBonus, Female gets femaleReferralBonus
          const agencyBonus = config.agencyReferralBonus;
          const femaleBonus = config.femaleReferralBonus;
          if (agencyBonus === undefined || agencyBonus <= 0 || femaleBonus === undefined || femaleBonus <= 0) return false;
          referrerBonusAmount = agencyBonus;
          referredUserBonusAmount = femaleBonus;
          bonusType = 'wallet';
        }
      }
    } else if (userType === 'agency') {
      // Agency user - can only be referred by Agency
      if (user.referredByAgency && user.referredByAgency.length > 0) {
        referrer = await AgencyUser.findById(user.referredByAgency[0]);
        if (referrer) {
          // Both referrer and referred get agencyReferralBonus
          const agencyBonus = config.agencyReferralBonus;
          if (agencyBonus === undefined || agencyBonus <= 0) return false;
          referrerBonusAmount = agencyBonus;
          referredUserBonusAmount = agencyBonus;
          bonusType = 'wallet';
        }
      }
    } else if (userType === 'male') {
      // Male user - can only be referred by Male
      if (user.referredBy && user.referredBy.length > 0) {
        referrer = await MaleUser.findById(user.referredBy[0]);
        if (referrer) {
          // Both referrer and referred get maleReferralBonus in coins
          const maleBonus = config.maleReferralBonus;
          if (maleBonus === undefined || maleBonus <= 0) return false;
          referrerBonusAmount = maleBonus;
          referredUserBonusAmount = maleBonus;
          bonusType = 'coin';
        }
      }
    }
    
    // Validate referrer and prevent self-referral
    if (!referrer || referrer._id.toString() === user._id.toString()) {
      return false;
    }
    
    // Validate bonus amounts to ensure they are properly set
    if (referrerBonusAmount <= 0 || referredUserBonusAmount <= 0) {
      return false;
    }
    
    // Update referrer's balance based on bonus type
    if (bonusType === 'wallet') {
      referrer.walletBalance = (referrer.walletBalance || 0) + referrerBonusAmount;
    } else if (bonusType === 'coin') {
      referrer.coinBalance = (referrer.coinBalance || 0) + referrerBonusAmount;
    }
    await referrer.save();
    
    // Update referred user's balance based on bonus type
    if (bonusType === 'wallet') {
      user.walletBalance = (user.walletBalance || 0) + referredUserBonusAmount;
    } else if (bonusType === 'coin') {
      user.coinBalance = (user.coinBalance || 0) + referredUserBonusAmount;
    }
    
    await user.save();
    
    // Create transaction records for both referrer and referred user
    await Transaction.create({
      userType: getTransactionUserType(referrer.constructor.modelName),
      userId: referrer._id,
      operationType: bonusType,
      action: 'credit',
      amount: referrerBonusAmount,
      message: `Referral bonus for inviting ${getUserEmail(user, userType)}`,
      balanceAfter: bonusType === 'wallet' ? referrer.walletBalance : referrer.coinBalance,
      createdBy: referrer._id
    });
    
    await Transaction.create({
      userType: getTransactionUserType(user.constructor.modelName),
      userId: user._id,
      operationType: bonusType,
      action: 'credit',
      amount: referredUserBonusAmount,
      message: `Referral signup bonus using ${getReferrerCode(referrer, userType)}`,
      balanceAfter: bonusType === 'wallet' ? user.walletBalance : user.coinBalance,
      createdBy: user._id
    });
    
    return true;
  } catch (error) {
    console.error('Error processing referral bonus:', error);
    return false;
  }
};

// Helper function to get transaction user type
function getTransactionUserType(modelName) {
  if (modelName.includes('Female')) return 'female';
  if (modelName.includes('Agency')) return 'agency';
  if (modelName.includes('Male')) return 'male';
  return 'unknown';
}

// Helper function to get user email
function getUserEmail(user, userType) {
  if (userType === 'female') return user.email || user._id;
  if (userType === 'agency') return user.email || user._id;
  if (userType === 'male') return user.email || user._id;
  return user._id;
}

// Helper function to get referrer code
function getReferrerCode(referrer, userType) {
  if (userType === 'female' && referrer.referralCode) return referrer.referralCode;
  if (userType === 'agency' && referrer.referralCode) return referrer.referralCode;
  if (userType === 'male' && referrer.referralCode) return referrer.referralCode;
  return referrer._id;
}

module.exports = processReferralBonus;
```

## 3. Admin Approval System

### 3.1 Update Review Status (Admin Controller)

```js
// In userManagementController.js
exports.updateReviewStatus = async (req, res) => {
    try {
        const { userId, userType, reviewStatus } = req.body;
        
        if (!['female', 'agency'].includes(userType)) {
            return res.status(400).json({ success: false, message: messages.USER_MANAGEMENT.INVALID_USER_TYPE });
        }
        
        if (!['pending', 'accepted', 'rejected'].includes(reviewStatus)) {
            return res.status(400).json({ success: false, message: messages.USER_MANAGEMENT.INVALID_STATUS });
        }
        
        let Model;
        if (userType === 'female') {
            Model = FemaleUser;
        } else {
            Model = AgencyUser;
        }
        
        const user = await Model.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: messages.COMMON.USER_NOT_FOUND });
        }
        
        const oldReviewStatus = user.reviewStatus;
        user.reviewStatus = reviewStatus;
        await user.save();
        
        // Trigger referral bonus if status changed to "accepted" from a non-accepted status
        if (reviewStatus === 'accepted' && oldReviewStatus !== 'accepted') {
            
            if (userType === 'female') {
                // Process referral bonus for female user
                const processReferralBonus = require('../../utils/processReferralBonus');
                await processReferralBonus(user, 'female');
            }
            
            if (userType === 'agency') {
                // Process referral bonus for agency user
                const processReferralBonus = require('../../utils/processReferralBonus');
                await processReferralBonus(user, 'agency');
            }
        }
        
        return res.json({ 
            success: true, 
            message: messages.USER_MANAGEMENT.REVIEW_STATUS_UPDATED_SUCCESS,
            data: { 
                userId: user._id, 
                reviewStatus: user.reviewStatus 
            } 
        });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};
```

### 3.2 Female User Review Status Update (Female User Controller)

```js
// In femaleUserController.js
exports.updateReviewStatus = async (req, res) => {
  try {
    const { reviewStatus } = req.body;
    const userId = req.user._id;
    
    if (!['completeProfile', 'pending', 'accepted', 'rejected'].includes(reviewStatus)) {
      return res.status(400).json({ success: false, message: messages.USER_MANAGEMENT.INVALID_STATUS });
    }
    
    const user = await FemaleUser.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: messages.COMMON.USER_NOT_FOUND });
    }
    
    // Check if user has completed all required profile information
    if (reviewStatus === 'pending' && 
        (!user.name || !user.age || !user.gender || !user.images || user.images.length === 0)) {
      return res.status(400).json({ 
        success: false, 
        message: messages.USER_MANAGEMENT.COMPLETE_PROFILE_BEFORE_SUBMISSION 
      });
    }
    
    const oldReviewStatus = user.reviewStatus;
    user.reviewStatus = reviewStatus;
    await user.save();

    // Note: Referral bonus is handled only in admin approval, not in user-side review status update
    
    return res.json({
      success: true,
      message: 'Review status updated successfully',
      data: {
        userId: user._id,
        reviewStatus: user.reviewStatus
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
```

### 3.3 Agency User Review Status Update (Agency User Controller)

```js
// In agencyUserController.js
exports.updateReviewStatus = async (req, res) => {
  try {
    const { reviewStatus } = req.body;
    const userId = req.user._id;
    
    if (!['completeProfile', 'pending', 'accepted', 'rejected'].includes(reviewStatus)) {
      return res.status(400).json({ success: false, message: messages.USER_MANAGEMENT.INVALID_STATUS });
    }
    
    const agency = await AgencyUser.findById(userId);
    if (!agency) {
      return res.status(404).json({ success: false, message: messages.COMMON.USER_NOT_FOUND });
    }
    
    // Check if user has completed all required profile information
    if (reviewStatus === 'pending' && 
        (!agency.firstName || !agency.lastName || !agency.aadharOrPanNum || !agency.image)) {
      return res.status(400).json({ 
        success: false, 
        message: messages.USER_MANAGEMENT.COMPLETE_PROFILE_BEFORE_SUBMISSION 
      });
    }
    
    const oldReviewStatus = agency.reviewStatus;
    agency.reviewStatus = reviewStatus;
    await agency.save();
    
    // Note: Referral bonus is handled only in admin approval, not in user-side review status update
    
    return res.json({
      success: true,
      message: 'Review status updated successfully',
      data: {
        userId: agency._id,
        reviewStatus: agency.reviewStatus
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
```

## 4. Referral Bonus Configuration

The referral bonus system is configured through the AdminConfig model and includes different bonus amounts for different user types:

- Female referral bonus: Bonus given when a female user refers another female user
- Agency referral bonus: Bonus given when an agency refers a female user or another agency
- Male referral bonus: Bonus given when a male user refers another male user

The system ensures that:
1. Referral bonuses are only processed when users are approved by admin
2. Both referrer and referred user receive bonuses
3. Transaction records are created for audit purposes
4. Self-referrals are prevented
5. Different balance types (wallet vs coin) are handled appropriately per user type