FemaleUser.js

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

MaleUser.js

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


AgencyUser.js

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

Transaction.js

const mongoose = require('mongoose');

// Generic transaction model for wallet and coin operations across Male/Female users
const transactionSchema = new mongoose.Schema({
  userType: { type: String, enum: ['male', 'female', 'agency'], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  operationType: { type: String, enum: ['wallet', 'coin'], required: true },
  action: { type: String, enum: ['credit', 'debit'], required: true },
  amount: { type: Number, required: true, min: 0 },
  message: { type: String },
  balanceAfter: { type: Number, required: true },
  earningType: { type: String, enum: ['call', 'gift', 'other'] }, // Type of earning for female users
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);

processReferralBonus.js

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
    if ((!user.referredBy || user.referredBy.length === 0) && (!user.referredByAgency || user.referredByAgency.length === 0)) {
      return false;
    }
    
    let referrer = null;
    let referralBonusAmount = 0;
    let bonusType = null; // 'wallet' or 'coin'
    
    // Determine referrer and bonus amount based on user type and referral source
    if (userType === 'female') {
      // Female user - can only be referred by Female or Agency
      if (user.referredBy && user.referredBy.length > 0) { // Referred by Female
        referrer = await FemaleUser.findById(user.referredBy[0]);
        if (referrer) {
          referralBonusAmount = config.femaleReferralBonus || 100;
          bonusType = 'wallet';
        }
      } else if (user.referredByAgency && user.referredByAgency.length > 0) { // Referred by Agency
        referrer = await AgencyUser.findById(user.referredByAgency[0]);
        if (referrer) {
          referralBonusAmount = config.agencyReferralBonus || 100;
          bonusType = 'wallet';
        }
      }
    } else if (userType === 'agency') {
      // Agency user - can only be referred by Agency
      if (user.referredByAgency && user.referredByAgency.length > 0) {
        referrer = await AgencyUser.findById(user.referredByAgency[0]);
        if (referrer) {
          referralBonusAmount = config.agencyReferralBonus || 100;
          bonusType = 'wallet';
        }
      }
    } else if (userType === 'male') {
      // Male user - can only be referred by Male
      if (user.referredBy && user.referredBy.length > 0) {
        referrer = await MaleUser.findById(user.referredBy[0]);
        if (referrer) {
          referralBonusAmount = config.maleReferralBonus || 100;
          bonusType = 'coin';
        }
      }
    }
    
    // Validate referrer and prevent self-referral
    if (!referrer || referrer._id.toString() === user._id.toString()) {
      return false;
    }
    
    // Update referrer's balance based on bonus type
    if (bonusType === 'wallet') {
      referrer.walletBalance = (referrer.walletBalance || 0) + referralBonusAmount;
    } else if (bonusType === 'coin') {
      referrer.coinBalance = (referrer.coinBalance || 0) + referralBonusAmount;
    }
    await referrer.save();
    
    // Update referred user's balance based on user type
    if (userType === 'male') {
      // Male user gets coin bonus
      user.coinBalance = (user.coinBalance || 0) + referralBonusAmount;
    } else {
      // Female and Agency users get wallet bonus
      user.walletBalance = (user.walletBalance || 0) + referralBonusAmount;
    }
    
    await user.save();
    
    // Create transaction records for both referrer and referred user
    await Transaction.create({
      userType: getTransactionUserType(referrer.constructor.modelName),
      userId: referrer._id,
      operationType: bonusType,
      action: 'credit',
      amount: referralBonusAmount,
      message: `Referral bonus for inviting ${getUserEmail(user, userType)}`,
      balanceAfter: bonusType === 'wallet' ? referrer.walletBalance : referrer.coinBalance,
      createdBy: referrer._id
    });
    
    await Transaction.create({
      userType: getTransactionUserType(user.constructor.modelName),
      userId: user._id,
      operationType: bonusType,
      action: 'credit',
      amount: referralBonusAmount,
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


AdminConfig.js
const mongoose = require('mongoose');

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

// Ensure only one config document exists
adminConfigSchema.statics.getConfig = async function() {
  let config = await this.findOne();
  if (!config) {
    config = await this.create({});
  }
  return config;
};

module.exports = mongoose.model('AdminConfig', adminConfigSchema);

maleUserController.js
const MaleUser = require('../../models/maleUser/MaleUser');
const Image = require('../../models/maleUser/Image');
const FemaleUser = require('../../models/femaleUser/FemaleUser');
const MaleBlockList = require('../../models/maleUser/BlockList');
const FemaleBlockList = require('../../models/femaleUser/BlockList');
const Package = require('../../models/maleUser/Package');
const AdminConfig = require('../../models/admin/AdminConfig');
const generateToken = require('../../utils/generateToken');  // Utility function to generate JWT token
const generateReferralCode = require('../../utils/generateReferralCode');
const Transaction = require('../../models/common/Transaction');
const sendOtp = require('../../utils/sendOtp');  // Utility function to send OTP via email
const { isValidEmail, isValidMobile } = require('../../validations/validations');
const messages = require('../../validations/messages');

// Update user interests
exports.updateInterests = async (req, res) => {
  try {
    const { interestIds } = req.body;
    const userId = req.user._id;

    if (!interestIds || !Array.isArray(interestIds)) {
      return res.status(400).json({
        success: false,
        message: messages.PROFILE.INTEREST_REQUIRED
      });
    }

    const user = await MaleUser.findByIdAndUpdate(
      userId,
      { interests: interestIds },
      { new: true }
    ).populate('interests', 'title');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: messages.COMMON.USER_NOT_FOUND
      });
    }

    return res.json({
      success: true,
      message: "Interests updated successfully",
      data: {
        interests: user.interests
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Update user languages
exports.updateLanguages = async (req, res) => {
  try {
    const { languageIds } = req.body;
    const userId = req.user._id;

    if (!languageIds || !Array.isArray(languageIds)) {
      return res.status(400).json({
        success: false,
        message: messages.PROFILE.LANGUAGE_REQUIRED
      });
    }

    const user = await MaleUser.findByIdAndUpdate(
      userId,
      { languages: languageIds },
      { new: true }
    ).populate('languages', 'title');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: messages.COMMON.USER_NOT_FOUND
      });
    }

    return res.json({
      success: true,
      message: "Languages updated successfully",
      data: {
        languages: user.languages
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Update user hobbies
exports.updateHobbies = async (req, res) => {
  try {
    const { hobbies } = req.body;
    const userId = req.user._id;

    if (!hobbies || !Array.isArray(hobbies)) {
      return res.status(400).json({
        success: false,
        message: messages.PROFILE.HOBBIES_REQUIRED
      });
    }

    const user = await MaleUser.findByIdAndUpdate(
      userId,
      { hobbies: hobbies },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: messages.COMMON.USER_NOT_FOUND
      });
    }

    return res.json({
      success: true,
      message: "Hobbies updated successfully",
      data: {
        hobbies: user.hobbies
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Update user sports
exports.updateSports = async (req, res) => {
  try {
    const { sports } = req.body;
    const userId = req.user._id;

    if (!sports || !Array.isArray(sports)) {
      return res.status(400).json({
        success: false,
        message: messages.PROFILE.SPORTS_REQUIRED
      });
    }

    const user = await MaleUser.findByIdAndUpdate(
      userId,
      { sports: sports },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: messages.COMMON.USER_NOT_FOUND
      });
    }

    return res.json({
      success: true,
      message: "Sports updated successfully",
      data: {
        sports: user.sports
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Update user film preferences
exports.updateFilm = async (req, res) => {
  try {
    const { film } = req.body;
    const userId = req.user._id;

    if (!film || !Array.isArray(film)) {
      return res.status(400).json({
        success: false,
        message: messages.PROFILE.FILM_REQUIRED
      });
    }

    const user = await MaleUser.findByIdAndUpdate(
      userId,
      { film: film },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: messages.COMMON.USER_NOT_FOUND
      });
    }

    return res.json({
      success: true,
      message: "Film preferences updated successfully",
      data: {
        film: user.film
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Update user music preferences
exports.updateMusic = async (req, res) => {
  try {
    const { music } = req.body;
    const userId = req.user._id;

    if (!music || !Array.isArray(music)) {
      return res.status(400).json({
        success: false,
        message: messages.PROFILE.MUSIC_REQUIRED
      });
    }

    const user = await MaleUser.findByIdAndUpdate(
      userId,
      { music: music },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: messages.COMMON.USER_NOT_FOUND
      });
    }

    return res.json({
      success: true,
      message: "Music preferences updated successfully",
      data: {
        music: user.music
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Update user travel preferences
exports.updateTravel = async (req, res) => {
  try {
    const { travel } = req.body;
    const userId = req.user._id;

    if (!travel || !Array.isArray(travel)) {
      return res.status(400).json({
        success: false,
        message: messages.PROFILE.TRAVEL_REQUIRED
      });
    }

    const user = await MaleUser.findByIdAndUpdate(
      userId,
      { travel: travel },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: messages.COMMON.USER_NOT_FOUND
      });
    }

    return res.json({
      success: true,
      message: "Travel preferences updated successfully",
      data: {
        travel: user.travel
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Register Male User and Send OTP
exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, password, referralCode } = req.body;

  const otp = Math.floor(1000 + Math.random() * 9000);  // Generate 4-digit OTP

  try {
    // Validate email
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: messages.COMMON.INVALID_EMAIL
      });
    }

    // Check if the email is already registered
    const existingUser = await MaleUser.findOne({ email });
    
    if (existingUser) {
      // If user exists but is not verified, allow re-registration
      if (!existingUser.isVerified || !existingUser.isActive) {
        // Update existing user with new OTP and referral info
        existingUser.otp = otp;
        existingUser.isVerified = false;
        existingUser.isActive = false;
        
        // Handle referral code if provided
        if (referralCode) {
          const referredByUser = await MaleUser.findOne({ referralCode });
          if (referredByUser) {
            existingUser.referredBy = [referredByUser._id];
          }
        }
        
        await existingUser.save();
        await sendOtp(email, otp);
        
        return res.status(201).json({
          success: true,
          message: messages.AUTH.OTP_SENT_EMAIL,
          referralCode: existingUser.referralCode,
          otp: otp // For testing purposes
        });
      } else {
        // User is already verified and active
        return res.status(400).json({ 
          success: false, 
          message: messages.AUTH.USER_ALREADY_EXISTS
        });
      }
    }

    // Prepare referral linkage if provided and valid
    let referredByUser = null;
    if (referralCode) {
      referredByUser = await MaleUser.findOne({ referralCode });
    }

    // Ensure unique referral code
    let myReferral = generateReferralCode();
    while (await MaleUser.findOne({ referralCode: myReferral })) {
      myReferral = generateReferralCode();
    }

    // Create a new MaleUser
    const newUser = new MaleUser({ 
      firstName, 
      lastName, 
      email, 
      password, 
      otp, 
      referredBy: referredByUser ? [referredByUser._id] : [], 
      referralCode: myReferral,
      isVerified: false,
      isActive: false
    });
    await newUser.save();

    // Send OTP via email (using a utility function like SendGrid or any mail service)
    await sendOtp(email, otp);  // Assumed that sendOtp function handles OTP sending

    res.status(201).json({
      success: true,
      message: messages.AUTH.OTP_SENT_EMAIL,
      referralCode: newUser.referralCode,
      otp: otp // For testing purposes
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Login Male User (Send OTP)
exports.loginUser = async (req, res) => {
  const { email } = req.body;

  try {
    // Validate email
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: messages.COMMON.INVALID_EMAIL
      });
    }

    // Check if the user exists
    const user = await MaleUser.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: messages.COMMON.USER_NOT_FOUND });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(400).json({ success: false, message: messages.AUTH.ACCOUNT_NOT_VERIFIED });
    }
    // Check if user is active
    if (user.status === 'inactive') {
      return res.status(403).json({ success: false, message: messages.AUTH.ACCOUNT_DEACTIVATED });
    }

    // Generate new OTP for login
    const otp = Math.floor(1000 + Math.random() * 9000);
    user.otp = otp;
    await user.save();

    // Send OTP via email
    await sendOtp(email, otp);

    res.json({
      success: true,
      message: messages.AUTH.OTP_SENT_LOGIN,
      otp: otp // For testing purposes
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Verify Login OTP
exports.verifyLoginOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Validate email if provided
    if (email && !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: messages.COMMON.INVALID_EMAIL
      });
    }

    // If email is provided, look for user by both email and otp
    // If only otp is provided, look for user by otp who is verified
    let user;
    if (email) {
      user = await MaleUser.findOne({ email, otp, isVerified: true });
    } else if (otp) {
      user = await MaleUser.findOne({ otp, isVerified: true });
    } else {
      return res.status(400).json({ success: false, message: messages.COMMON.EMAIL_OR_OTP_REQUIRED });
    }
    
    if (user) {
      // Clear OTP after successful login
      user.otp = undefined;
      await user.save();

      // Generate JWT token
      const token = generateToken(user._id);

      res.json({
        success: true,
        message: messages.AUTH.LOGIN_SUCCESS,
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
      });
    } else {
      res.status(400).json({ success: false, message: messages.COMMON.INVALID_OTP });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Verify OTP and complete registration
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    // Validate email if provided
    if (email && !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: messages.COMMON.INVALID_EMAIL
      });
    }

    // If email is provided, look for user by both email and otp
    // If only otp is provided, look for user by otp who is not yet verified
    let user;
    if (email) {
      user = await MaleUser.findOne({ email, otp });
    } else if (otp) {
      user = await MaleUser.findOne({ otp, isVerified: false });
    } else {
      return res.status(400).json({ success: false, message: messages.COMMON.EMAIL_OR_OTP_REQUIRED });
    }
    
    if (!user) {
      return res.status(400).json({ success: false, message: messages.COMMON.INVALID_OTP });
    }
    
    user.isVerified = true;
    user.isActive = true;    // Mark the user as active
    user.otp = undefined;  // Clear OTP after verification

    await user.save();

    res.json({ 
      success: true, 
      message: messages.AUTH.OTP_VERIFIED,
      data: {
        token: generateToken(user._id),
        user: {
          id: user._id,
          email: user.email,
          isVerified: user.isVerified,
          isActive: user.isActive
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Upload Images (multipart form-data)
exports.uploadImage = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: messages.IMAGE.NO_IMAGES });
    }

    const uploadedUrls = req.files.map((f) => f.path);

    // Save each image in Image collection
    for (const url of uploadedUrls) {
      const newImage = new Image({ maleUserId: req.user.id, imageUrl: url });
      await newImage.save();
    }

    // Also persist to MaleUser.images array
    const user = await MaleUser.findById(req.user.id);
    user.images = Array.isArray(user.images) ? [...user.images, ...uploadedUrls] : uploadedUrls;
    await user.save();

    res.json({ success: true, message: messages.IMAGE.IMAGE_UPLOAD_SUCCESS, urls: uploadedUrls });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Buy Coins
exports.buyCoins = async (req, res) => {
  const { packageId } = req.body;
  try {
    const selectedPackage = await Package.findById(packageId);
    const maleUser = await MaleUser.findById(req.user.id);
    maleUser.balance += selectedPackage.coins;
    await maleUser.save();
    res.json({ success: true, message: messages.COINS.COINS_ADDED(selectedPackage.coins) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get Male User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await MaleUser.findById(req.user.id)
      .select('-otp -password')
      .populate('interests', 'title')
      .populate('languages', 'title');
      
    if (!user) {
      return res.status(404).json({ success: false, message: messages.COMMON.USER_NOT_FOUND });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// List/browse female users for male users (paginated)
exports.listFemaleUsers = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    // Get list of users that the current male user has blocked
    const blockedByCurrentUser = await MaleBlockList.find({ maleUserId: req.user.id }).select('blockedUserId');
    const blockedByCurrentUserIds = blockedByCurrentUser.map(block => block.blockedUserId);
    
    // Get list of users who have blocked the current male user
    const blockedByOthers = await FemaleBlockList.find({ blockedUserId: req.user.id }).select('femaleUserId');
    const blockedByOthersIds = blockedByOthers.map(block => block.femaleUserId);

    const filter = { 
      status: 'active', 
      reviewStatus: 'accepted',
      _id: { 
        $nin: [...blockedByCurrentUserIds, ...blockedByOthersIds] // Exclude users blocked by either party
      }
    };

    const [items, total] = await Promise.all([
      FemaleUser.find(filter)
        .select('name age bio images')
        .populate({ path: 'images', select: 'imageUrl', options: { limit: 1 } })
        .skip(skip)
        .limit(limit)
        .lean(),
      FemaleUser.countDocuments(filter)
    ]);

    const data = items.map((u) => ({
      _id: u._id,
      name: u.name,
      age: u.age,
      bio: u.bio,
      avatarUrl: Array.isArray(u.images) && u.images[0] ? u.images[0].imageUrl : null
    }));

    return res.json({ success: true, page, limit, total, data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Complete male profile and award referral bonus if applicable
exports.completeProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const user = await MaleUser.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: messages.COMMON.USER_NOT_FOUND });
    }

    // Check if profile is already completed
    if (user.profileCompleted) {
      return res.status(400).json({ 
        success: false, 
        message: 'Profile already completed'
      });
    }

    // Update profile completion status
    user.profileCompleted = true;
    await user.save();
    
    // Process referral bonus if the user was referred
    if (user.referredBy && user.referredBy.length > 0) {
      const processReferralBonus = require('../../utils/processReferralBonus');
      const result = await processReferralBonus(user, 'male');
      if (result) {
        console.log(`Referral bonus processed for male user ${user._id} after profile completion`);
      }
    }
    
    return res.json({
      success: true,
      message: 'Profile completed successfully',
      data: {
        profileCompleted: true
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Delete an image by image id (owned by the authenticated male user)
exports.deleteImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const imageDoc = await Image.findById(imageId);
    if (!imageDoc) {
      return res.status(404).json({ success: false, message: messages.USER.IMAGE_NOT_FOUND });
    }
    if (String(imageDoc.maleUserId) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: messages.USER.NOT_AUTHORIZED_DELETE_IMAGE });
    }
    await Image.deleteOne({ _id: imageDoc._id });

    // Remove url from MaleUser.images array if it exists there
    try {
      const user = await MaleUser.findById(req.user.id);
      if (Array.isArray(user.images)) {
        user.images = user.images.filter((url) => url !== imageDoc.imageUrl);
        await user.save();
      }
    } catch (_) {}

    return res.json({ success: true, message: messages.IMAGE.IMAGE_DELETED });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

femaleUserController.js
const FemaleUser = require('../../models/femaleUser/FemaleUser');
const MaleUser = require('../../models/maleUser/MaleUser');
const FemaleBlockList = require('../../models/femaleUser/BlockList');
const MaleBlockList = require('../../models/maleUser/BlockList');
const generateToken = require('../../utils/generateToken');
const sendOtp = require('../../utils/sendOtp');
const FemaleImage = require('../../models/femaleUser/Image');
const AdminConfig = require('../../models/admin/AdminConfig');
const WithdrawalRequest = require('../../models/common/WithdrawalRequest');
const { isValidEmail, isValidMobile } = require('../../validations/validations');
const messages = require('../../validations/messages');

// Helper function to award referral bonuses
const awardReferralBonus = async (user, adminConfig) => {
  if (!user || !adminConfig || user.referralBonusAwarded) {
    return false; // No user, no config, or bonus already awarded
  }
  
  const Transaction = require('../../models/common/Transaction');
  
  try {
    // Determine referral bonus amount based on referral source
    let referralBonusAmount;
    let referrer;
    
    if (user.referredByFemale) {
      // Female user referred by another female user
      referralBonusAmount = adminConfig.femaleReferralBonus || 100;
      const FemaleModel = require('../../models/femaleUser/FemaleUser');
      referrer = await FemaleModel.findById(user.referredByFemale);
      
      if (referrer) {
        // Add referral bonus to both referrer and referred user's wallet balance
        referrer.walletBalance = (referrer.walletBalance || 0) + referralBonusAmount;
        user.walletBalance = (user.walletBalance || 0) + referralBonusAmount;
        await referrer.save();
        
        // Create transaction for referrer
        await Transaction.create({ 
          userType: 'female', 
          userId: referrer._id, 
          operationType: 'wallet', 
          action: 'credit', 
          amount: referralBonusAmount, 
          message: `Referral bonus for inviting ${user.email}`, 
          balanceAfter: referrer.walletBalance, 
          createdBy: referrer._id 
        });
        
        // Create transaction for referred user
        await Transaction.create({ 
          userType: 'female', 
          userId: user._id, 
          operationType: 'wallet', 
          action: 'credit', 
          amount: referralBonusAmount, 
          message: `Referral signup bonus using referral code`, 
          balanceAfter: user.walletBalance, 
          createdBy: user._id 
        });
      }
    } else if (user.referredByAgency) {
      // Female user referred by an agency
      referralBonusAmount = adminConfig.agencyReferralBonus || 100;
      const AgencyModel = require('../../models/agency/AgencyUser');
      referrer = await AgencyModel.findById(user.referredByAgency);
      
      if (referrer) {
        // Add referral bonus to both agency and referred user's wallet balance
        referrer.walletBalance = (referrer.walletBalance || 0) + referralBonusAmount;
        user.walletBalance = (user.walletBalance || 0) + referralBonusAmount;
        await referrer.save();
        
        // Create transaction for agency
        await Transaction.create({ 
          userType: 'agency', 
          userId: referrer._id, 
          operationType: 'wallet', 
          action: 'credit', 
          amount: referralBonusAmount, 
          message: `Agency referral bonus for inviting ${user.email}`, 
          balanceAfter: referrer.walletBalance, 
          createdBy: referrer._id 
        });
        
        // Create transaction for referred user
        await Transaction.create({ 
          userType: 'female', 
          userId: user._id, 
          operationType: 'wallet', 
          action: 'credit', 
          amount: referralBonusAmount, 
          message: `Referral signup bonus via agency`, 
          balanceAfter: user.walletBalance, 
          createdBy: user._id 
        });
      }
    } else {
      // No referral - return early
      return false;
    }
    
    // Mark referral bonus as awarded
    user.referralBonusAwarded = true;
    await user.save();
    
    return true; // Successfully awarded referral bonus
  } catch (error) {
    console.error('Error awarding referral bonus:', error);
    return false; // Error occurred
  }
};

// Update user interests
exports.updateInterests = async (req, res) => {
  try {
    const { interestIds } = req.body;
    const userId = req.user._id;

    if (!interestIds || !Array.isArray(interestIds)) {
      return res.status(400).json({
        success: false,
        message: messages.PROFILE.INTEREST_REQUIRED
      });
    }

    const user = await FemaleUser.findByIdAndUpdate(
      userId,
      { interests: interestIds },
      { new: true }
    ).populate('interests', 'title');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: messages.COMMON.USER_NOT_FOUND
      });
    }

    return res.json({
      success: true,
      message: messages.FEMALE_USER.INTERESTS_UPDATED_SUCCESS,
      data: {
        interests: user.interests
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Update user languages
exports.updateLanguages = async (req, res) => {
  try {
    const { languageIds } = req.body;
    const userId = req.user._id;

    if (!languageIds || !Array.isArray(languageIds)) {
      return res.status(400).json({
        success: false,
        message: messages.PROFILE.LANGUAGE_REQUIRED
      });
    }

    const user = await FemaleUser.findByIdAndUpdate(
      userId,
      { languages: languageIds },
      { new: true }
    ).populate('languages', 'title');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: messages.COMMON.USER_NOT_FOUND
      });
    }

    return res.json({
      success: true,
      message: messages.FEMALE_USER.LANGUAGES_UPDATED_SUCCESS,
      data: {
        languages: user.languages
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Update user hobbies
exports.updateHobbies = async (req, res) => {
  try {
    const { hobbies } = req.body;
    const userId = req.user._id;

    if (!hobbies || !Array.isArray(hobbies)) {
      return res.status(400).json({
        success: false,
        message: messages.PROFILE.HOBBIES_REQUIRED
      });
    }

    const user = await FemaleUser.findByIdAndUpdate(
      userId,
      { hobbies: hobbies },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: messages.COMMON.USER_NOT_FOUND
      });
    }

    return res.json({
      success: true,
      message: messages.FEMALE_USER.HOBBIES_UPDATED_SUCCESS,
      data: {
        hobbies: user.hobbies
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Update user sports
exports.updateSports = async (req, res) => {
  try {
    const { sports } = req.body;
    const userId = req.user._id;

    if (!sports || !Array.isArray(sports)) {
      return res.status(400).json({
        success: false,
        message: messages.PROFILE.SPORTS_REQUIRED
      });
    }

    const user = await FemaleUser.findByIdAndUpdate(
      userId,
      { sports: sports },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: messages.COMMON.USER_NOT_FOUND
      });
    }

    return res.json({
      success: true,
      message: messages.FEMALE_USER.SPORTS_UPDATED_SUCCESS,
      data: {
        sports: user.sports
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Update user film preferences
exports.updateFilm = async (req, res) => {
  try {
    const { film } = req.body;
    const userId = req.user._id;

    if (!film || !Array.isArray(film)) {
      return res.status(400).json({
        success: false,
        message: messages.PROFILE.FILM_REQUIRED
      });
    }

    const user = await FemaleUser.findByIdAndUpdate(
      userId,
      { film: film },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: messages.COMMON.USER_NOT_FOUND
      });
    }

    return res.json({
      success: true,
      message: messages.FEMALE_USER.FILM_UPDATED_SUCCESS,
      data: {
        film: user.film
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Update user music preferences
exports.updateMusic = async (req, res) => {
  try {
    const { music } = req.body;
    const userId = req.user._id;

    if (!music || !Array.isArray(music)) {
      return res.status(400).json({
        success: false,
        message: messages.PROFILE.MUSIC_REQUIRED
      });
    }

    const user = await FemaleUser.findByIdAndUpdate(
      userId,
      { music: music },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: messages.COMMON.USER_NOT_FOUND
      });
    }

    return res.json({
      success: true,
      message: "Music preferences updated successfully",
      data: {
        music: user.music
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Update user travel preferences
exports.updateTravel = async (req, res) => {
  try {
    const { travel } = req.body;
    const userId = req.user._id;

    if (!travel || !Array.isArray(travel)) {
      return res.status(400).json({
        success: false,
        message: messages.PROFILE.TRAVEL_REQUIRED
      });
    }

    const user = await FemaleUser.findByIdAndUpdate(
      userId,
      { travel: travel },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: messages.COMMON.USER_NOT_FOUND
      });
    }

    return res.json({
      success: true,
      message: messages.FEMALE_USER.TRAVEL_UPDATED_SUCCESS,
      data: {
        travel: user.travel
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// User Registration (Email and Mobile Number) - ONLY ONCE PER USER
exports.registerUser = async (req, res) => {
  const { email, mobileNumber, referralCode } = req.body;
  const otp = Math.floor(1000 + Math.random() * 9000); // Generate 4-digit OTP

  try {
    // Validate email and mobile number
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: messages.COMMON.INVALID_EMAIL
      });
    }
    
    if (!isValidMobile(mobileNumber)) {
      return res.status(400).json({
        success: false,
        message: messages.VALIDATION.INVALID_MOBILE
      });
    }

    // ⚠️ IMPORTANT: Check if user already exists - NO MULTIPLE SIGNUPS ALLOWED
    const existingUser = await FemaleUser.findOne({ $or: [{ email }, { mobileNumber }] });
    
    if (existingUser) {
      // User already exists - REJECT signup, redirect to login
      return res.status(400).json({ 
        success: false, 
        message: messages.AUTH.USER_ALREADY_EXISTS_LOGIN,
        redirectTo: 'LOGIN'
      });
    }

    // Generate unique referral code for new user
    const generateReferralCode = require('../../utils/generateReferralCode');
    let myReferral = generateReferralCode();
    while (await FemaleUser.findOne({ referralCode: myReferral })) {
      myReferral = generateReferralCode();
    }

    // Link referral if provided: can be a FemaleUser or AgencyUser code
    let referredByFemale = null;
    let referredByAgency = null;
    if (referralCode) {
      const FemaleModel = require('../../models/femaleUser/FemaleUser');
      const AgencyModel = require('../../models/agency/AgencyUser');
      referredByFemale = await FemaleModel.findOne({ referralCode });
      if (!referredByFemale) {
        referredByAgency = await AgencyModel.findOne({ referralCode });
      }
    }

    // Create new user with initial state
    const newUser = new FemaleUser({ 
      email, 
      mobileNumber, 
      otp, 
      referralCode: myReferral, 
      referredByFemale: referredByFemale ? [referredByFemale._id] : [], 
      referredByAgency: referredByAgency ? [referredByAgency._id] : [],
      isVerified: false,      // Will be true after OTP verification
      isActive: false,        // Will be true after OTP verification
      profileCompleted: false, // Will be true after profile completion
      reviewStatus: 'completeProfile' // Initial state
    });
    await newUser.save();
    await sendOtp(email, otp); // Send OTP via SendGrid

    res.status(201).json({
      success: true,
      message: messages.AUTH.OTP_SENT_EMAIL,
      otp: otp // For testing purposes
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Login Female User (Send OTP) - ALWAYS ALLOWED AFTER OTP VERIFICATION
exports.loginUser = async (req, res) => {
  const { email } = req.body;

  try {
    // Validate email
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: messages.COMMON.INVALID_EMAIL
      });
    }

    // Check if the user exists
    const user = await FemaleUser.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: messages.COMMON.USER_NOT_FOUND });
    }

    // Check if user is verified (OTP verified during signup)
    if (!user.isVerified) {
      return res.status(400).json({ success: false, message: messages.AUTH.ACCOUNT_NOT_VERIFIED });
    }
    
    // Check if user is active
    if (user.status === 'inactive') {
      return res.status(403).json({ success: false, message: messages.AUTH.ACCOUNT_DEACTIVATED });
    }

    // Generate new OTP for login
    const otp = Math.floor(1000 + Math.random() * 9000);
    user.otp = otp;
    await user.save();

    // Send OTP via email
    await sendOtp(email, otp);

    res.json({
      success: true,
      message: messages.AUTH.OTP_SENT_LOGIN,
      otp: otp // For testing purposes
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Verify Login OTP - Returns reviewStatus-based response
exports.verifyLoginOtp = async (req, res) => {
  const { otp } = req.body;

  try {
    const user = await FemaleUser.findOne({ otp, isVerified: true });
    
    if (user) {
      // Clear OTP after successful login
      user.otp = undefined;
      await user.save();

      // Generate JWT token
      const token = generateToken(user._id);

      // Determine redirect based on reviewStatus
      let redirectTo = 'COMPLETE_PROFILE'; // default
      
      if (user.reviewStatus === 'completeProfile') {
        redirectTo = 'COMPLETE_PROFILE';
      } else if (user.reviewStatus === 'pending') {
        redirectTo = 'UNDER_REVIEW';
      } else if (user.reviewStatus === 'accepted') {
        redirectTo = 'DASHBOARD';
      } else if (user.reviewStatus === 'rejected') {
        redirectTo = 'REJECTED';
      }

      res.json({
        success: true,
        message: messages.AUTH.LOGIN_SUCCESS,
        token,
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            mobileNumber: user.mobileNumber,
            profileCompleted: user.profileCompleted,
            reviewStatus: user.reviewStatus
          },
          redirectTo: redirectTo
        }
      });
    } else {
      res.status(400).json({ success: false, message: messages.COMMON.INVALID_OTP });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// OTP Verification for Registration
exports.verifyOtp = async (req, res) => {
  const { otp } = req.body;

  try {
    const user = await FemaleUser.findOne({ otp, isVerified: false });

    if (user) {
      const token = generateToken(user._id);
      
      // After OTP verification:
      user.isVerified = true;  // Mark as verified
      user.isActive = true;    // Mark as active
      user.otp = undefined;    // Clear OTP
      user.reviewStatus = 'completeProfile'; // Ensure status is completeProfile
      // profileCompleted remains false until profile is completed

      await user.save();
      
      res.json({ 
        success: true, 
        token,
        message: messages.AUTH.OTP_VERIFIED,
        data: {
          profileCompleted: false,
          reviewStatus: 'completeProfile',
          redirectTo: 'COMPLETE_PROFILE'
        }
      });
    } else {
      res.status(400).json({ success: false, message: messages.COMMON.INVALID_OTP });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Add Extra Information (Name, Age, Gender, etc.)
exports.addUserInfo = async (req, res) => {
  const { name, age, gender, bio, videoUrl, interests, languages, hobbies, sports, film, music, travel } = req.body; // images is managed via upload endpoint
  try {
    const user = await FemaleUser.findById(req.user.id);
    user.name = name;
    user.age = age;
    user.gender = gender;
    user.bio = bio;
    user.videoUrl = videoUrl;
    user.interests = interests;
    user.languages = languages;
    if (hobbies) user.hobbies = hobbies;
    if (sports) user.sports = sports;
    if (film) user.film = film;
    if (music) user.music = music;
    if (travel) user.travel = travel;
    await user.save();
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Complete user profile after OTP verification - UNIFIED API (accepts multipart form-data)
// Accepts: images (multipart), video (multipart), profile details (form fields)
exports.completeUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Helper function to parse string values that might be JSON-encoded
    const parseValue = (value) => {
      if (typeof value === 'string') {
        // Remove quotes if present
        const trimmed = value.trim();
        if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || 
            (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
          return trimmed.slice(1, -1);
        }
        // Try to parse as JSON array/object
        if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
          try {
            return JSON.parse(trimmed);
          } catch (e) {
            return value;
          }
        }
        return value;
      }
      return value;
    };
    
    // Parse and sanitize incoming data
    const name = parseValue(req.body.name);
    const age = parseValue(req.body.age);
    const gender = parseValue(req.body.gender);
    const bio = parseValue(req.body.bio);
    const interests = parseValue(req.body.interests);
    const languages = parseValue(req.body.languages);
    const hobbies = parseValue(req.body.hobbies);
    const sports = parseValue(req.body.sports);
    const film = parseValue(req.body.film);
    const music = parseValue(req.body.music);
    const travel = parseValue(req.body.travel);
    
    // Debug logging
    console.log('Raw interests:', req.body.interests, 'Type:', typeof req.body.interests);
    console.log('Parsed interests:', interests, 'Type:', typeof interests, 'IsArray:', Array.isArray(interests));
    console.log('Raw languages:', req.body.languages, 'Type:', typeof req.body.languages);
    console.log('Parsed languages:', languages, 'Type:', typeof languages, 'IsArray:', Array.isArray(languages));
    
    // Find the user
    const user = await FemaleUser.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: messages.COMMON.USER_NOT_FOUND });
    }

    // Check if profile is already completed
    if (user.profileCompleted) {
      return res.status(400).json({ 
        success: false, 
        message: messages.REGISTRATION.PROFILE_COMPLETED
      });
    }

    // Validate required fields for profile completion
    if (!name || !age || !gender || !bio) {
      return res.status(400).json({ 
        success: false, 
        message: messages.REGISTRATION.PROFILE_REQUIRED_FIELDS
      });
    }

    // Handle image uploads from multipart request
    const uploadedImages = req.files?.images || [];
    const uploadedVideo = req.files?.video?.[0];
    
    // Check if images provided (either in request or already uploaded)
    const hasImages = uploadedImages.length > 0 || (user.images && user.images.length > 0);
    if (!hasImages) {
      return res.status(400).json({ 
        success: false, 
        message: messages.REGISTRATION.PROFILE_MIN_IMAGES
      });
    }

    // Check if video provided (either in request or already uploaded)
    const hasVideo = uploadedVideo || user.videoUrl;
    if (!hasVideo) {
      return res.status(400).json({ 
        success: false, 
        message: messages.REGISTRATION.PROFILE_VIDEO_REQUIRED
      });
    }

    // Process uploaded images (if provided in this request)
    if (uploadedImages.length > 0) {
      const currentCount = Array.isArray(user.images) ? user.images.length : 0;
      const remainingSlots = Math.max(0, 5 - currentCount);
      const filesToProcess = uploadedImages.slice(0, remainingSlots);
      
      const createdImageIds = [];
      for (const f of filesToProcess) {
        const newImage = await FemaleImage.create({ femaleUserId: userId, imageUrl: f.path });
        createdImageIds.push(newImage._id);
      }
      
      user.images = [...(user.images || []), ...createdImageIds];
    }

    // Process uploaded video (if provided in this request)
    if (uploadedVideo) {
      user.videoUrl = uploadedVideo.path;
    }

    // Update user profile
    user.name = name;
    user.age = age;
    user.gender = gender;
    user.bio = bio;
    
    // Arrays - only update if provided and validate ObjectIds
    if (interests && Array.isArray(interests) && interests.length > 0) {
      console.log('✅ Setting interests:', interests);
      // Validate that these interest IDs exist
      const Interest = require('../../models/admin/Interest');
      const validInterests = await Interest.find({ _id: { $in: interests } });
      console.log('Valid interests found:', validInterests.length, 'out of', interests.length);
      user.interests = validInterests.map(i => i._id);
    } else {
      console.log('❌ Not setting interests. Value:', interests, 'IsArray:', Array.isArray(interests), 'Length:', interests?.length);
    }
    
    if (languages && Array.isArray(languages) && languages.length > 0) {
      console.log('✅ Setting languages:', languages);
      // Validate that these language IDs exist
      const Language = require('../../models/admin/Language');
      const validLanguages = await Language.find({ _id: { $in: languages } });
      console.log('Valid languages found:', validLanguages.length, 'out of', languages.length);
      user.languages = validLanguages.map(l => l._id);
    } else {
      console.log('❌ Not setting languages. Value:', languages, 'IsArray:', Array.isArray(languages), 'Length:', languages?.length);
    }
    
    if (hobbies && Array.isArray(hobbies) && hobbies.length > 0) {
      user.hobbies = hobbies.map(item => {
        if (typeof item === 'object' && item.id && item.name) {
          return { id: item.id, name: item.name };
        }
        const id = require('crypto').randomBytes(8).toString('hex');
        const name = item.name || item;
        return { id, name };
      });
    }
    if (sports && Array.isArray(sports) && sports.length > 0) {
      user.sports = sports.map(item => {
        if (typeof item === 'object' && item.id && item.name) {
          return { id: item.id, name: item.name };
        }
        const id = require('crypto').randomBytes(8).toString('hex');
        const name = item.name || item;
        return { id, name };
      });
    }
    if (film && Array.isArray(film) && film.length > 0) {
      user.film = film.map(item => {
        if (typeof item === 'object' && item.id && item.name) {
          return { id: item.id, name: item.name };
        }
        const id = require('crypto').randomBytes(8).toString('hex');
        const name = item.name || item;
        return { id, name };
      });
    }
    if (music && Array.isArray(music) && music.length > 0) {
      user.music = music.map(item => {
        if (typeof item === 'object' && item.id && item.name) {
          return { id: item.id, name: item.name };
        }
        const id = require('crypto').randomBytes(8).toString('hex');
        const name = item.name || item;
        return { id, name };
      });
    }
    if (travel && Array.isArray(travel) && travel.length > 0) {
      user.travel = travel.map(item => {
        if (typeof item === 'object' && item.id && item.name) {
          return { id: item.id, name: item.name };
        }
        const id = require('crypto').randomBytes(8).toString('hex');
        const name = item.name || item;
        return { id, name };
      });
    }
    
    console.log('📝 User before save - interests:', user.interests, 'languages:', user.languages);
    
    // 🔑 KEY STATE CHANGES:
    user.profileCompleted = true;      // Profile is now complete
    user.reviewStatus = 'pending';     // Set to pending for admin review

    await user.save();
    
    res.json({ 
      success: true, 
      message: messages.REGISTRATION.PROFILE_COMPLETED_SUCCESS,
      data: {
        profileCompleted: true,
        reviewStatus: 'pending',
        redirectTo: 'UNDER_REVIEW',
        uploadedImages: uploadedImages.length,
        uploadedVideo: !!uploadedVideo
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Utility function to clean up invalid interests and languages references
const cleanUpUserReferences = async (userId) => {
  try {
    const FemaleUser = require('../../models/femaleUser/FemaleUser');
    const Interest = require('../../models/admin/Interest');
    const Language = require('../../models/admin/Language');
    
    const user = await FemaleUser.findById(userId);
    if (!user) return null;
    
    let updateNeeded = false;
    let updatedInterests = [];
    let updatedLanguages = [];
    
    // Check and clean up interests
    if (user.interests && user.interests.length > 0) {
      const validInterests = await Interest.find({ 
        _id: { $in: user.interests } 
      });
      updatedInterests = validInterests.map(i => i._id);
      if (updatedInterests.length !== user.interests.length) {
        updateNeeded = true;
      }
    }
    
    // Check and clean up languages
    if (user.languages && user.languages.length > 0) {
      const validLanguages = await Language.find({ 
        _id: { $in: user.languages } 
      });
      updatedLanguages = validLanguages.map(l => l._id);
      if (updatedLanguages.length !== user.languages.length) {
        updateNeeded = true;
      }
    }
    
    // Update user if there are invalid references
    if (updateNeeded) {
      await FemaleUser.findByIdAndUpdate(userId, {
        interests: updatedInterests,
        languages: updatedLanguages
      });
      console.log(`Cleaned up references for user ${userId}`);
    }
    
    return {
      originalInterestsCount: user.interests ? user.interests.length : 0,
      validInterestsCount: updatedInterests.length,
      originalLanguagesCount: user.languages ? user.languages.length : 0,
      validLanguagesCount: updatedLanguages.length,
      cleaned: updateNeeded
    };
  } catch (error) {
    console.error('Error cleaning up user references:', error);
    return null;
  }
};

// Get Female User Profile
exports.getUserProfile = async (req, res) => {
  try {
    // Clean up invalid references first
    await cleanUpUserReferences(req.user.id);
    
    const user = await FemaleUser.findById(req.user.id)
      .select('-otp')
      .populate({
        path: 'images',
        select: 'femaleUserId imageUrl createdAt updatedAt'
      })
      .populate({
        path: 'interests',
        select: 'title _id status'
      })
      .populate({
        path: 'languages',
        select: 'title _id status'
      });
      
    if (!user) {
      return res.status(404).json({ success: false, message: messages.COMMON.USER_NOT_FOUND });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update User Info
exports.updateUserInfo = async (req, res) => {
  try {
    const user = await FemaleUser.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: messages.COMMON.USER_NOT_FOUND });
    }

    // Helper function to parse form-data values (handles JSON strings)
    const parseFormValue = (value) => {
      if (!value) return value;
      if (typeof value === 'string') {
        // Remove surrounding quotes if present
        const trimmed = value.trim();
        if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || 
            (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
          return trimmed.slice(1, -1);
        }
        // Try to parse as JSON array/object
        if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
          try {
            return JSON.parse(trimmed);
          } catch (e) {
            console.error('Failed to parse JSON:', trimmed, e);
            return value;
          }
        }
        return value;
      }
      return value;
    };

    // Parse all incoming values
    const name = parseFormValue(req.body.name);
    const age = parseFormValue(req.body.age);
    const gender = parseFormValue(req.body.gender);
    const bio = parseFormValue(req.body.bio);
    const videoUrl = parseFormValue(req.body.videoUrl);
    const interests = parseFormValue(req.body.interests);
    const languages = parseFormValue(req.body.languages);
    const hobbies = parseFormValue(req.body.hobbies);
    const sports = parseFormValue(req.body.sports);
    const film = parseFormValue(req.body.film);
    const music = parseFormValue(req.body.music);
    const travel = parseFormValue(req.body.travel);

    console.log('📥 Parsed values:', { name, age, bio, travel, hobbies, sports, film, music });

    // Update basic fields
    if (name) user.name = name;
    if (age) user.age = age;
    if (gender) user.gender = gender;
    if (bio) user.bio = bio;
    if (videoUrl) user.videoUrl = videoUrl;
    
    // Update interests if provided and validate
    if (interests) {
      const Interest = require('../../models/admin/Interest');
      const interestArray = Array.isArray(interests) ? interests : [interests];
      const validInterests = await Interest.find({ _id: { $in: interestArray } });
      user.interests = validInterests.map(i => i._id);
    }
    
    // Update languages if provided and validate
    if (languages) {
      const Language = require('../../models/admin/Language');
      const languageArray = Array.isArray(languages) ? languages : [languages];
      const validLanguages = await Language.find({ _id: { $in: languageArray } });
      user.languages = validLanguages.map(l => l._id);
    }
    
    // Helper to process preference arrays
    const processPreferenceArray = (items, fieldName) => {
      if (!items || !Array.isArray(items) || items.length === 0) return null;
      
      console.log(`Processing ${fieldName}:`, items);
      
      try {
        const processed = items.map((item, index) => {
          console.log(`  Item ${index}:`, item, 'Type:', typeof item);
          
          if (!item) {
            console.log(`  Skipping null/undefined item at index ${index}`);
            return null;
          }
          
          if (typeof item === 'object' && item !== null) {
            if (item.id && item.name) {
              return { id: item.id, name: item.name };
            }
            console.warn(`  Item ${index} missing id or name:`, item);
            return null;
          }
          
          // Handle string or primitive
          const id = require('crypto').randomBytes(8).toString('hex');
          const name = String(item);
          return { id, name };
        }).filter(Boolean);
        
        console.log(`  Processed ${fieldName}:`, processed);
        return processed;
      } catch (err) {
        console.error(`Error processing ${fieldName}:`, err);
        throw err;
      }
    };
    
    // Update preferences - APPEND new items to existing arrays
    if (hobbies) {
      const newHobbies = processPreferenceArray(hobbies, 'hobbies');
      if (newHobbies && newHobbies.length > 0) {
        const existingIds = (user.hobbies || []).map(h => h.id);
        const uniqueNew = newHobbies.filter(h => !existingIds.includes(h.id));
        user.hobbies = [...(user.hobbies || []), ...uniqueNew];
      }
    }
    
    if (sports) {
      const newSports = processPreferenceArray(sports, 'sports');
      if (newSports && newSports.length > 0) {
        const existingIds = (user.sports || []).map(s => s.id);
        const uniqueNew = newSports.filter(s => !existingIds.includes(s.id));
        user.sports = [...(user.sports || []), ...uniqueNew];
      }
    }
    
    if (film) {
      const newFilm = processPreferenceArray(film, 'film');
      if (newFilm && newFilm.length > 0) {
        const existingIds = (user.film || []).map(f => f.id);
        const uniqueNew = newFilm.filter(f => !existingIds.includes(f.id));
        user.film = [...(user.film || []), ...uniqueNew];
      }
    }
    
    if (music) {
      const newMusic = processPreferenceArray(music, 'music');
      if (newMusic && newMusic.length > 0) {
        const existingIds = (user.music || []).map(m => m.id);
        const uniqueNew = newMusic.filter(m => !existingIds.includes(m.id));
        user.music = [...(user.music || []), ...uniqueNew];
      }
    }
    
    if (travel) {
      const newTravel = processPreferenceArray(travel, 'travel');
      if (newTravel && newTravel.length > 0) {
        const existingIds = (user.travel || []).map(t => t.id);
        const uniqueNew = newTravel.filter(t => !existingIds.includes(t.id));
        user.travel = [...(user.travel || []), ...uniqueNew];
      }
    }
    
    await user.save();
    
    // Return updated user with populated fields
    const updatedUser = await FemaleUser.findById(user._id)
      .populate('interests', 'title')
      .populate('languages', 'title');
    
    res.json({ 
      success: true, 
      message: 'Profile updated successfully',
      data: updatedUser 
    });
  } catch (err) {
    console.error('❌ Error in updateUserInfo:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete Female User Account
exports.deleteUser = async (req, res) => {
  try {
    await FemaleUser.findByIdAndDelete(req.user.id);
    res.json({ success: true, message: messages.USER.USER_DELETED });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get balance information for female user
exports.getBalanceInfo = async (req, res) => {
  try {
    const user = await FemaleUser.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: messages.COMMON.USER_NOT_FOUND });
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

// Upload Images (for profile completion or later updates)
exports.uploadImage = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: messages.IMAGE.NO_IMAGES });
    }

    const user = await FemaleUser.findById(req.user.id).populate('images');
    if (!user) {
      return res.status(404).json({ success: false, message: messages.COMMON.USER_NOT_FOUND });
    }

    const currentCount = Array.isArray(user.images) ? user.images.length : 0;
    const remainingSlots = Math.max(0, 5 - currentCount);
    
    if (remainingSlots === 0) {
      return res.status(400).json({ 
        success: false, 
        message: messages.REGISTRATION.IMAGE_LIMIT_REACHED 
      });
    }

    const filesToProcess = req.files.slice(0, remainingSlots);
    const skipped = req.files.length - filesToProcess.length;

    const createdImageIds = [];
    for (const f of filesToProcess) {
      const newImage = await FemaleImage.create({ 
        femaleUserId: req.user.id, 
        imageUrl: f.path 
      });
      createdImageIds.push(newImage._id);
    }

    user.images = [...(user.images || []).map(img => img._id ? img._id : img), ...createdImageIds];
    await user.save();

    // Populate and return
    const updatedUser = await FemaleUser.findById(user._id).populate('images');

    return res.json({ 
      success: true, 
      message: messages.IMAGE.IMAGE_UPLOAD_SUCCESS, 
      data: {
        added: createdImageIds.length, 
        skipped: skipped,
        totalImages: updatedUser.images.length,
        images: updatedUser.images
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Upload Video (for profile completion or later updates)
exports.uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: messages.NOTIFICATION.NO_VIDEO_UPLOADED 
      });
    }

    const videoUrl = req.file.path;
    const publicId = req.file.filename; // cloudinary public_id
    const resourceType = req.file.resource_type || 'video';
    const duration = req.file.duration;
    const bytes = req.file.bytes;
    
    const user = await FemaleUser.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: messages.COMMON.USER_NOT_FOUND 
      });
    }
    
    // Store old video URL for potential cleanup
    const oldVideoUrl = user.videoUrl;
    
    // Update with new video
    user.videoUrl = videoUrl;
    await user.save();

    res.json({ 
      success: true,
      message: messages.NOTIFICATION.VIDEO_UPLOADED_SUCCESS,
      data: {
        url: videoUrl,
        secureUrl: videoUrl,
        publicId,
        resourceType,
        duration,
        bytes,
        replacedOldVideo: !!oldVideoUrl
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete an image by image id (owned by the authenticated female user)
exports.deleteImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    const imageDoc = await FemaleImage.findById(imageId);
    if (!imageDoc) {
      return res.status(404).json({ 
        success: false, 
        message: messages.USER.IMAGE_NOT_FOUND 
      });
    }
    
    if (String(imageDoc.femaleUserId) !== String(req.user.id)) {
      return res.status(403).json({ 
        success: false, 
        message: messages.USER.NOT_AUTHORIZED_DELETE_IMAGE 
      });
    }

    // Remove ref from user.images and delete image document
    await FemaleUser.updateOne(
      { _id: req.user.id }, 
      { $pull: { images: imageDoc._id } }
    );
    await FemaleImage.deleteOne({ _id: imageDoc._id });
    
    // Get updated user with remaining images
    const user = await FemaleUser.findById(req.user.id).populate('images');

    return res.json({ 
      success: true, 
      message: messages.IMAGE.IMAGE_DELETED,
      data: {
        deletedImageId: imageId,
        remainingImages: user.images.length,
        images: user.images
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Delete video
exports.deleteVideo = async (req, res) => {
  try {
    const user = await FemaleUser.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: messages.COMMON.USER_NOT_FOUND 
      });
    }
    
    if (!user.videoUrl) {
      return res.status(400).json({ 
        success: false, 
        message: 'No video to delete' 
      });
    }
    
    // Store video URL for potential Cloudinary cleanup
    const deletedVideoUrl = user.videoUrl;
    
    // Remove video URL
    user.videoUrl = null;
    await user.save();
    
    return res.json({ 
      success: true, 
      message: 'Video deleted successfully',
      data: {
        deletedVideoUrl,
        hasVideo: false
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Delete preference item (hobbies, sports, film, music, travel)
exports.deletePreferenceItem = async (req, res) => {
  try {
    const { type, itemId } = req.params; // type: hobbies|sports|film|music|travel
    
    const validTypes = ['hobbies', 'sports', 'film', 'music', 'travel'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ 
        success: false, 
        message: `Invalid type. Must be one of: ${validTypes.join(', ')}` 
      });
    }
    
    const user = await FemaleUser.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: messages.COMMON.USER_NOT_FOUND 
      });
    }
    
    // Remove item by MongoDB's _id (subdocument ID)
    const originalLength = (user[type] || []).length;
    user[type] = (user[type] || []).filter(item => String(item._id) !== String(itemId));
    
    if (user[type].length === originalLength) {
      return res.status(404).json({ 
        success: false, 
        message: `Item with _id ${itemId} not found in ${type}` 
      });
    }
    
    await user.save();
    
    return res.json({ 
      success: true, 
      message: `${type} item deleted successfully`,
      data: {
        type,
        deletedItemId: itemId,
        remaining: user[type]
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// List/browse male users for female users (paginated)
exports.listMaleUsers = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    // Get list of users that the current female user has blocked
    const blockedByCurrentUser = await FemaleBlockList.find({ femaleUserId: req.user.id }).select('blockedUserId');
    const blockedByCurrentUserIds = blockedByCurrentUser.map(block => block.blockedUserId);
    
    // Get list of users who have blocked the current female user
    const blockedByOthers = await MaleBlockList.find({ blockedUserId: req.user.id }).select('maleUserId');
    const blockedByOthersIds = blockedByOthers.map(block => block.maleUserId);

    const filter = { 
      status: 'active', 
      reviewStatus: 'accepted',
      _id: { 
        $nin: [...blockedByCurrentUserIds, ...blockedByOthersIds] // Exclude users blocked by either party
      }
    };

    const [items, total] = await Promise.all([
      MaleUser.find(filter)
        .select('firstName lastName age bio profileImages')
        .skip(skip)
        .limit(limit)
        .lean(),
      MaleUser.countDocuments(filter)
    ]);

    const data = items.map((u) => ({
      _id: u._id,
      firstName: u.firstName,
      lastName: u.lastName,
      age: u.age,
      bio: u.bio,
      avatarUrl: Array.isArray(u.profileImages) && u.profileImages.length > 0 ? u.profileImages[0] : null
    }));

    return res.json({ success: true, page, limit, total, data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Cleanup incomplete profiles (can be run as a cron job or manually)
// Deletes profiles that are not completed within a specified time period
exports.cleanupIncompleteProfiles = async (req, res) => {
  try {
    // Delete profiles that are not completed and older than 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const result = await FemaleUser.deleteMany({
      profileCompleted: false,
      createdAt: { $lt: sevenDaysAgo }
    });

    return res.json({ 
      success: true, 
      message: `Cleaned up ${result.deletedCount} incomplete profile(s)`,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Update review status and award referral bonus if applicable
exports.updateReviewStatus = async (req, res) => {
  try {
    const { userId, reviewStatus } = req.body;
    
    const user = await FemaleUser.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: messages.COMMON.USER_NOT_FOUND });
    }
    
    const oldReviewStatus = user.reviewStatus;
    user.reviewStatus = reviewStatus;
    await user.save();
    
    // Award referral bonus when reviewStatus becomes "accepted" and user was referred
    if (reviewStatus === 'accepted' && oldReviewStatus !== 'accepted' && ((user.referredByFemale && user.referredByFemale.length > 0) || (user.referredByAgency && user.referredByAgency.length > 0))) {
      const processReferralBonus = require('../../utils/processReferralBonus');
      const result = await processReferralBonus(user, 'female');
      if (result) {
        console.log(`Referral bonus processed for female user ${user._id} after review status accepted`);
      }
    }
    
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

// Toggle online status for female user
exports.toggleOnlineStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const { onlineStatus } = req.body; // true for online, false for offline
    
    if (typeof onlineStatus !== 'boolean') {
      return res.status(400).json({ 
        success: false, 
        message: 'onlineStatus (boolean) is required in request body' 
      });
    }

    const user = await FemaleUser.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: messages.COMMON.USER_NOT_FOUND });
    }

    // If going online
    if (onlineStatus) {
      // Set online start time
      user.onlineStartTime = new Date();
      user.onlineStatus = true;
    } 
    // If going offline
    else {
      // Calculate online duration and add to total
      if (user.onlineStartTime) {
        const endTime = new Date();
        const durationMinutes = (endTime - user.onlineStartTime) / (1000 * 60); // Convert ms to minutes
        user.totalOnlineMinutes = (user.totalOnlineMinutes || 0) + durationMinutes;
        user.onlineStartTime = null; // Reset start time
      }
      user.onlineStatus = false;
    }

    await user.save();

    return res.json({ 
      success: true, 
      message: messages.USER.STATUS_UPDATED(onlineStatus),
      data: {
        onlineStatus: user.onlineStatus,
        totalOnlineMinutes: user.totalOnlineMinutes || 0
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

agencyUserController.js

const AgencyUser = require('../../models/agency/AgencyUser');
const AgencyImage = require('../../models/agency/Image');
const generateToken = require('../../utils/generateToken');
const sendOtp = require('../../utils/sendOtp');
const { isValidEmail, isValidMobile } = require('../../validations/validations');
const messages = require('../../validations/messages');
const { checkAndMarkAgencyProfileCompleted } = require('../../utils/agencyProfileChecker');

// Agency Registration (Email and Mobile Number) - ONLY ONCE PER USER
exports.agencyRegister = async (req, res) => {
  const { email, mobileNumber, referralCode } = req.body;
  const otp = Math.floor(1000 + Math.random() * 9000); // Generate 4-digit OTP

  try {
    // Validate email and mobile number
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: messages.COMMON.INVALID_EMAIL
      });
    }
    
    if (!isValidMobile(mobileNumber)) {
      return res.status(400).json({
        success: false,
        message: messages.VALIDATION.INVALID_MOBILE
      });
    }

    // ⚠️ IMPORTANT: Check if agency already exists - NO MULTIPLE SIGNUPS ALLOWED
    const existingAgency = await AgencyUser.findOne({ $or: [{ email }, { mobileNumber }] });
    
    if (existingAgency) {
      // Agency already exists - REJECT signup, redirect to login
      return res.status(400).json({ 
        success: false, 
        message: 'Agency already exists, please login',
        redirectTo: 'LOGIN'
      });
    }

    // Generate unique referral code for new user
    const generateReferralCode = require('../../utils/generateReferralCode');
    let myReferral = generateReferralCode();
    while (await AgencyUser.findOne({ referralCode: myReferral })) {
      myReferral = generateReferralCode();
    }

    // Link referral if provided: can be an AgencyUser code
    let referredByAgency = null;
    if (referralCode) {
      referredByAgency = await AgencyUser.findOne({ referralCode });
    }

    // Create new agency with initial state
    const newAgency = new AgencyUser({ 
      email, 
      mobileNumber, 
      otp, 
      referralCode: myReferral, 
      referredByAgency: referredByAgency ? [referredByAgency._id] : [],
      isVerified: false,      // Will be true after OTP verification
      isActive: false,        // Will be true after OTP verification
      profileCompleted: false, // Will be true after profile completion
      reviewStatus: 'completeProfile' // Initial state
    });
    await newAgency.save();
    await sendOtp(email, otp); // Send OTP via SendGrid

    res.status(201).json({
      success: true,
      message: messages.AUTH.OTP_SENT_EMAIL,
      otp: otp // For testing purposes
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Login Agency User (Send OTP) - ALWAYS ALLOWED AFTER OTP VERIFICATION
exports.agencyLogin = async (req, res) => {
  const { email } = req.body;

  try {
    // Validate email
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: messages.COMMON.INVALID_EMAIL
      });
    }

    // Check if the agency exists
    const agency = await AgencyUser.findOne({ email });
    if (!agency) {
      return res.status(404).json({ success: false, message: messages.COMMON.USER_NOT_FOUND });
    }

    // Check if agency is verified (OTP verified during signup)
    if (!agency.isVerified) {
      return res.status(400).json({ success: false, message: messages.AUTH.ACCOUNT_NOT_VERIFIED });
    }

    // Generate new OTP for login
    const otp = Math.floor(1000 + Math.random() * 9000);
    agency.otp = otp;
    await agency.save();

    // Send OTP via email
    await sendOtp(email, otp);

    res.json({
      success: true,
      message: messages.AUTH.OTP_SENT_LOGIN,
      otp: otp // For testing purposes
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Verify Login OTP - Returns reviewStatus-based response
exports.agencyVerifyLoginOtp = async (req, res) => {
  const { otp } = req.body;

  try {
    const agency = await AgencyUser.findOne({ otp, isVerified: true });
    
    if (agency) {
      // Clear OTP after successful login
      agency.otp = undefined;
      await agency.save();

      // Generate JWT token
      const token = generateToken(agency._id);

      // Determine redirect based on reviewStatus
      let redirectTo = 'COMPLETE_PROFILE'; // default
      
      if (agency.reviewStatus === 'completeProfile') {
        redirectTo = 'COMPLETE_PROFILE';
      } else if (agency.reviewStatus === 'pending') {
        redirectTo = 'UNDER_REVIEW';
      } else if (agency.reviewStatus === 'accepted') {
        redirectTo = 'DASHBOARD';
      } else if (agency.reviewStatus === 'rejected') {
        redirectTo = 'REJECTED';
      }

      res.json({
        success: true,
        message: messages.AUTH.LOGIN_SUCCESS,
        token,
        data: {
          agency: {
            id: agency._id,
            firstName: agency.firstName,
            lastName: agency.lastName,
            email: agency.email,
            mobileNumber: agency.mobileNumber,
            profileCompleted: agency.profileCompleted,
            reviewStatus: agency.reviewStatus
          },
          redirectTo: redirectTo
        }
      });
    } else {
      res.status(400).json({ success: false, message: messages.COMMON.INVALID_OTP });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// OTP Verification for Registration
exports.agencyVerifyOtp = async (req, res) => {
  const { otp } = req.body;

  try {
    const agency = await AgencyUser.findOne({ otp, isVerified: false });

    if (agency) {
      const token = generateToken(agency._id);
      
      // After OTP verification:
      agency.isVerified = true;  // Mark as verified
      agency.isActive = true;    // Mark as active
      agency.otp = undefined;    // Clear OTP
      agency.status = 'active';  // Set status to active
      agency.reviewStatus = 'completeProfile'; // Ensure status is completeProfile
      // profileCompleted remains false until profile is completed

      await agency.save();
      
      res.json({ 
        success: true, 
        token,
        message: messages.AUTH.OTP_VERIFIED,
        data: {
          profileCompleted: false,
          reviewStatus: 'completeProfile',
          redirectTo: 'COMPLETE_PROFILE'
        }
      });
    } else {
      res.status(400).json({ success: false, message: messages.COMMON.INVALID_OTP });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Complete agency profile - accepts form-data with details and optional image
exports.completeAgencyProfile = async (req, res) => {
  try {
    const { firstName, lastName, aadharOrPanNum } = req.body;
    
    // Helper function to clean form-data values that might be JSON-encoded strings
    const cleanValue = (value) => {
      if (typeof value === 'string') {
        // Remove surrounding quotes if present
        const trimmed = value.trim();
        if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || 
            (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
          return trimmed.slice(1, -1);
        }
        // Try to parse as JSON in case it's a JSON-encoded string
        if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
          try {
            return JSON.parse(trimmed);
          } catch (e) {
            return value;
          }
        }
        return value;
      }
      return value;
    };
    
    const agency = await AgencyUser.findById(req.user.id);
    if (!agency) {
      return res.status(404).json({ success: false, message: messages.COMMON.USER_NOT_FOUND });
    }

    // Check if profile is already completed
    if (agency.profileCompleted) {
      return res.status(400).json({ 
        success: false, 
        message: 'Profile already completed' 
      });
    }

    // Clean and validate required fields
    const cleanedFirstName = cleanValue(firstName);
    const cleanedLastName = cleanValue(lastName);
    const cleanedAadharOrPanNum = cleanValue(aadharOrPanNum);
    
    if (!cleanedFirstName || !cleanedLastName) {
      return res.status(400).json({ 
        success: false, 
        message: 'First name and last name are required' 
      });
    }

    // Validate that aadharOrPanNum is provided
    if (!cleanedAadharOrPanNum) {
      return res.status(400).json({ 
        success: false, 
        message: 'Aadhar or PAN number is required' 
      });
    }

    // Update agency details
    agency.firstName = cleanedFirstName;
    agency.lastName = cleanedLastName;
    agency.aadharOrPanNum = cleanedAadharOrPanNum;
    
    // Handle image upload if provided
    if (req.file) {
      const imageUrl = req.file.path;
      
      // Create image record
      const imageRecord = new AgencyImage({ agencyUserId: req.user.id, imageUrl });
      await imageRecord.save();
      
      agency.image = imageUrl;
    }

    await agency.save();

    // Check if both details and image are provided to mark profile as completed
    const profileCompleted = await checkAndMarkAgencyProfileCompleted(agency._id);
    
    // Reload agency to get updated values after profile completion check
    const updatedAgency = await AgencyUser.findById(req.user.id);

    res.json({ 
      success: true, 
      message: profileCompleted ? 'Profile completed and submitted for review' : 'Agency details saved successfully',
      data: {
        firstName: updatedAgency.firstName,
        lastName: updatedAgency.lastName,
        aadharOrPanNum: updatedAgency.aadharOrPanNum,
        image: updatedAgency.image,
        profileCompleted: updatedAgency.profileCompleted,
        reviewStatus: updatedAgency.reviewStatus
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update agency profile details
exports.updateAgencyProfile = async (req, res) => {
  try {
    const { firstName, lastName, aadharOrPanNum } = req.body;
    
    // Helper function to clean form-data values that might be JSON-encoded strings
    const cleanValue = (value) => {
      if (typeof value === 'string') {
        // Remove surrounding quotes if present
        const trimmed = value.trim();
        if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || 
            (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
          return trimmed.slice(1, -1);
        }
        // Try to parse as JSON in case it's a JSON-encoded string
        if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
          try {
            return JSON.parse(trimmed);
          } catch (e) {
            return value;
          }
        }
        return value;
      }
      return value;
    };
    
    const agency = await AgencyUser.findById(req.user.id);
    if (!agency) {
      return res.status(404).json({ success: false, message: messages.COMMON.USER_NOT_FOUND });
    }

    // Clean the input values
    const cleanedFirstName = cleanValue(firstName);
    const cleanedLastName = cleanValue(lastName);
    const cleanedAadharOrPanNum = cleanValue(aadharOrPanNum);
    
    // Update agency details if provided
    if (cleanedFirstName) agency.firstName = cleanedFirstName;
    if (cleanedLastName) agency.lastName = cleanedLastName;
    if (cleanedAadharOrPanNum) agency.aadharOrPanNum = cleanedAadharOrPanNum;
    
    // Handle image upload if provided
    if (req.file) {
      const imageUrl = req.file.path;
      
      // Create image record
      const imageRecord = new AgencyImage({ agencyUserId: req.user.id, imageUrl });
      await imageRecord.save();
      
      agency.image = imageUrl;
    }

    await agency.save();

    // Check if both details and image are provided to mark profile as completed
    const profileCompleted = await checkAndMarkAgencyProfileCompleted(agency._id);
    
    // Reload agency to get updated values after profile completion check
    const updatedAgency = await AgencyUser.findById(req.user.id);

    res.json({ 
      success: true, 
      message: profileCompleted ? 'Profile completed and submitted for review' : 'Agency details updated successfully',
      data: {
        firstName: updatedAgency.firstName,
        lastName: updatedAgency.lastName,
        aadharOrPanNum: updatedAgency.aadharOrPanNum,
        image: updatedAgency.image,
        profileCompleted: updatedAgency.profileCompleted,
        reviewStatus: updatedAgency.reviewStatus
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get agency profile
exports.agencyMe = async (req, res) => {
  try {
    const agency = await AgencyUser.findById(req.user.id).select('-otp');
    if (!agency) return res.status(404).json({ success: false, message: messages.COMMON.USER_NOT_FOUND });
    
    res.json({ success: true, data: agency });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update review status and award referral bonus if applicable
exports.updateReviewStatus = async (req, res) => {
  try {
    const { userId, reviewStatus } = req.body;
    
    const agency = await AgencyUser.findById(userId);
    if (!agency) {
      return res.status(404).json({ success: false, message: messages.COMMON.USER_NOT_FOUND });
    }
    
    const oldReviewStatus = agency.reviewStatus;
    agency.reviewStatus = reviewStatus;
    await agency.save();
    
    // Award referral bonus when reviewStatus becomes "accepted" and agency was referred
    if (reviewStatus === 'accepted' && oldReviewStatus !== 'accepted' && agency.referredByAgency && agency.referredByAgency.length > 0) {
      const processReferralBonus = require('../../utils/processReferralBonus');
      const result = await processReferralBonus(agency, 'agency');
      if (result) {
        console.log(`Referral bonus processed for agency user ${agency._id} after review status accepted`);
      }
    }
    
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


adminController.js

const AdminUser = require('../../models/admin/AdminUser');
const Staff = require('../../models/admin/Staff');
const AdminConfig = require('../../models/admin/AdminConfig');
const bcrypt = require('bcryptjs');
const generateToken = require('../../utils/generateToken');
const createAuditLog = require('../../utils/createAuditLog');
const { isValidEmail, isValidMobile } = require('../../validations/validations');
const messages = require('../../validations/messages');

// Login Admin or Staff (unified login with user type selection)
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password, userType } = req.body;
    
    // Validate email
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: messages.COMMON.INVALID_EMAIL
      });
    }
    
    if (userType === 'admin') {
      const admin = await AdminUser.findOne({ email });
      if (!admin) return res.status(400).json({ success: false, message: messages.ADMIN.INVALID_CREDENTIALS });

      const isMatch = await bcrypt.compare(password, admin.passwordHash);
      if (!isMatch) return res.status(400).json({ success: false, message: messages.ADMIN.INVALID_CREDENTIALS });

      res.json({
        success: true,
        data: {
          token: generateToken(admin._id),
          user: { id: admin._id, name: admin.name, email: admin.email, type: 'admin' }
        }
      });
    } else if (userType === 'staff') {
      const staff = await Staff.findOne({ email, status: 'publish' });
      if (!staff) return res.status(400).json({ success: false, message: messages.ADMIN.INVALID_CREDENTIALS_STAFF });

      const isMatch = await bcrypt.compare(password, staff.passwordHash);
      if (!isMatch) return res.status(400).json({ success: false, message: messages.ADMIN.INVALID_CREDENTIALS });

      res.json({
        success: true,
        data: {
          token: generateToken(staff._id),
          user: { id: staff._id, email: staff.email, type: 'staff', permissions: staff.permissions }
        }
      });
    } else {
      return res.status(400).json({ success: false, message: messages.ADMIN.INVALID_USER_TYPE });
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

    res.json({ success: true, message: messages.USER.USER_DELETED });
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
        message: messages.ADMIN.MIN_CALL_COINS_REQUIRED 
      });
    }
    
    const numericValue = Number(minCallCoins);
    if (!Number.isFinite(numericValue) || numericValue < 0) {
      return res.status(400).json({ 
        success: false, 
        message: messages.ADMIN.MIN_CALL_COINS_INVALID 
      });
    }
    
    // Get or create config and update minCallCoins
    let config = await AdminConfig.getConfig();
    config.minCallCoins = numericValue;
    await config.save();
    
    return res.json({
      success: true,
      message: messages.ADMIN.MIN_CALL_COINS_UPDATED,
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
        message: messages.ADMIN.CONVERSION_RATE_REQUIRED 
      });
    }
    
    const numericValue = Number(coinToRupeeConversionRate);
    if (!Number.isFinite(numericValue) || numericValue <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: messages.ADMIN.CONVERSION_RATE_INVALID 
      });
    }
    
    // Get or create config and update coinToRupeeConversionRate
    let config = await AdminConfig.getConfig();
    config.coinToRupeeConversionRate = numericValue;
    await config.save();
    
    return res.json({
      success: true,
      message: messages.ADMIN.CONVERSION_RATE_UPDATED,
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
        message: messages.ADMIN.MIN_WITHDRAWAL_REQUIRED 
      });
    }
    
    const numericValue = Number(minWithdrawalAmount);
    if (!Number.isFinite(numericValue) || numericValue <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: messages.ADMIN.MIN_WITHDRAWAL_INVALID 
      });
    }
    
    // Get or create config and update minWithdrawalAmount
    let config = await AdminConfig.getConfig();
    config.minWithdrawalAmount = numericValue;
    await config.save();
    
    return res.json({
      success: true,
      message: messages.ADMIN.MIN_WITHDRAWAL_UPDATED,
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
    const { bonus, femaleReferralBonus, agencyReferralBonus, maleReferralBonus } = req.body;

    const config = await AdminConfig.getConfig();
    
    // Handle backward compatibility: if 'bonus' is provided, map it to femaleReferralBonus
    if (bonus !== undefined && bonus !== null) {
      const numericValue = Number(bonus);
      if (!Number.isFinite(numericValue) || numericValue < 0) {
        return res.status(400).json({ 
          success: false, 
          message: messages.ADMIN.BONUS_INVALID 
        });
      }
      config.femaleReferralBonus = numericValue; // Map old bonus to female bonus for backward compatibility
    }
    
    // Update female referral bonus if provided
    if (femaleReferralBonus !== undefined && femaleReferralBonus !== null) {
      const numericValue = Number(femaleReferralBonus);
      if (!Number.isFinite(numericValue) || numericValue < 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'femaleReferralBonus must be a valid non-negative number' 
        });
      }
      config.femaleReferralBonus = numericValue;
    }
    
    // Update agency referral bonus if provided
    if (agencyReferralBonus !== undefined && agencyReferralBonus !== null) {
      const numericValue = Number(agencyReferralBonus);
      if (!Number.isFinite(numericValue) || numericValue < 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'agencyReferralBonus must be a valid non-negative number' 
        });
      }
      config.agencyReferralBonus = numericValue;
    }
    
    // Update male referral bonus if provided
    if (maleReferralBonus !== undefined && maleReferralBonus !== null) {
      const numericValue = Number(maleReferralBonus);
      if (!Number.isFinite(numericValue) || numericValue < 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'maleReferralBonus must be a valid non-negative number' 
        });
      }
      config.maleReferralBonus = numericValue;
    }

    await config.save();

    res.json({
      success: true,
      message: messages.ADMIN.BONUS_UPDATED,
      data: {
        femaleReferralBonus: config.femaleReferralBonus,
        agencyReferralBonus: config.agencyReferralBonus,
        maleReferralBonus: config.maleReferralBonus
      }
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
        femaleReferralBonus: config.femaleReferralBonus,
        agencyReferralBonus: config.agencyReferralBonus,
        maleReferralBonus: config.maleReferralBonus
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
    const { bonus, femaleReferralBonus, agencyReferralBonus, maleReferralBonus } = req.body;

    const config = await AdminConfig.getConfig();
    
    // Handle backward compatibility: if 'bonus' is provided, map it to femaleReferralBonus
    if (bonus !== undefined && bonus !== null) {
      const numericValue = Number(bonus);
      if (!Number.isFinite(numericValue) || numericValue < 0) {
        return res.status(400).json({ 
          success: false, 
          message: messages.ADMIN.BONUS_INVALID 
        });
      }
      config.femaleReferralBonus = numericValue; // Map old bonus to female bonus for backward compatibility
    }
    
    // Update female referral bonus if provided
    if (femaleReferralBonus !== undefined && femaleReferralBonus !== null) {
      const numericValue = Number(femaleReferralBonus);
      if (!Number.isFinite(numericValue) || numericValue < 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'femaleReferralBonus must be a valid non-negative number' 
        });
      }
      config.femaleReferralBonus = numericValue;
    }
    
    // Update agency referral bonus if provided
    if (agencyReferralBonus !== undefined && agencyReferralBonus !== null) {
      const numericValue = Number(agencyReferralBonus);
      if (!Number.isFinite(numericValue) || numericValue < 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'agencyReferralBonus must be a valid non-negative number' 
        });
      }
      config.agencyReferralBonus = numericValue;
    }
    
    // Update male referral bonus if provided
    if (maleReferralBonus !== undefined && maleReferralBonus !== null) {
      const numericValue = Number(maleReferralBonus);
      if (!Number.isFinite(numericValue) || numericValue < 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'maleReferralBonus must be a valid non-negative number' 
        });
      }
      config.maleReferralBonus = numericValue;
    }

    await config.save();

    res.json({
      success: true,
      message: messages.ADMIN.BONUS_UPDATED,
      data: {
        femaleReferralBonus: config.femaleReferralBonus,
        agencyReferralBonus: config.agencyReferralBonus,
        maleReferralBonus: config.maleReferralBonus
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
    const previousFemaleBonus = config.femaleReferralBonus;
    const previousAgencyBonus = config.agencyReferralBonus;
    
    config.referralBonus = 100; // Reset to default value
    config.femaleReferralBonus = 100; // Reset to default value
    config.agencyReferralBonus = 0; // Reset to default value
    
    await config.save();

    res.json({
      success: true,
      message: messages.ADMIN.BONUS_RESET,
      data: {
        previousBonus: previousBonus,
        previousFemaleBonus: previousFemaleBonus,
        previousAgencyBonus: previousAgencyBonus,
        newBonus: config.referralBonus,
        newFemaleBonus: config.femaleReferralBonus,
        newAgencyBonus: config.agencyReferralBonus
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

userManagementController.js

const MaleUser = require('../../models/maleUser/MaleUser');
const FemaleUser = require('../../models/femaleUser/FemaleUser');
const getUserId = require('../../utils/getUserId');
const Transaction = require('../../models/common/Transaction');
const AgencyUser = require('../../models/agency/AgencyUser');
const { isValidEmail, isValidMobile } = require('../../validations/validations');
const messages = require('../../validations/messages');

// Utility function to clean up invalid interests and languages references for a user
const cleanUpUserReferences = async (userId) => {
	try {
		const FemaleUser = require('../../models/femaleUser/FemaleUser');
		const Interest = require('../../models/admin/Interest');
		const Language = require('../../models/admin/Language');
		
		const user = await FemaleUser.findById(userId);
		if (!user) return null;
		
		let updateNeeded = false;
		let updatedInterests = [];
		let updatedLanguages = [];
		
		// Check and clean up interests
		if (user.interests && user.interests.length > 0) {
			const validInterests = await Interest.find({ 
				_id: { $in: user.interests } 
			});
			updatedInterests = validInterests.map(i => i._id);
			if (updatedInterests.length !== user.interests.length) {
				updateNeeded = true;
			}
		}
		
		// Check and clean up languages
		if (user.languages && user.languages.length > 0) {
			const validLanguages = await Language.find({ 
				_id: { $in: user.languages } 
			});
			updatedLanguages = validLanguages.map(l => l._id);
			if (updatedLanguages.length !== user.languages.length) {
				updateNeeded = true;
			}
		}
		
		// Update user if there are invalid references
		if (updateNeeded) {
			await FemaleUser.findByIdAndUpdate(userId, {
				interests: updatedInterests,
				languages: updatedLanguages
			});
			console.log(`Cleaned up references for user ${userId}`);
		}
		
		return {
			originalInterestsCount: user.interests ? user.interests.length : 0,
			validInterestsCount: updatedInterests.length,
			originalLanguagesCount: user.languages ? user.languages.length : 0,
			validLanguagesCount: updatedLanguages.length,
			cleaned: updateNeeded
		};
	} catch (error) {
		console.error('Error cleaning up user references:', error);
		return null;
	}
};

// Clean up user references (admin endpoint)
exports.cleanUserReferences = async (req, res) => {
	try {
		const { userId } = req.params;
		const result = await cleanUpUserReferences(userId);
		
		if (!result) {
			return res.status(404).json({ success: false, message: messages.COMMON.USER_NOT_FOUND });
		}
		
		return res.json({ 
			success: true, 
			message: messages.USER_MANAGEMENT.USER_REFERENCES_CLEANED,
			data: result 
		});
	} catch (err) {
		return res.status(500).json({ success: false, error: err.message });
	}
};

// List users
exports.listUsers = async (req, res) => {
	try {
		const { type } = req.query; // 'male' | 'female' | 'agency' | undefined (all)
		let data;
		if (type === 'male') {
			data = await MaleUser.find();
		} else if (type === 'female') {
			data = await FemaleUser.find().populate({
				path: 'images',
				select: 'femaleUserId imageUrl createdAt updatedAt'
			}).populate({
				path: 'interests',
				select: 'title _id status'
			}).populate({
				path: 'languages',
				select: 'title _id status'
			});
		} else if (type === 'agency') {
			data = await AgencyUser.find();
		} else {
			const [males, females, agencies] = await Promise.all([
				MaleUser.find(),
				FemaleUser.find().populate({
					path: 'images',
					select: 'femaleUserId imageUrl createdAt updatedAt'
				}).populate({
					path: 'interests',
					select: 'title _id status'
				}).populate({
					path: 'languages',
					select: 'title _id status'
				}),
				AgencyUser.find()
			]);
			data = { males, females, agencies };
		}
		return res.json({ success: true, data });
	} catch (err) {
		return res.status(500).json({ success: false, error: err.message });
	}
};

// Toggle status active/inactive
exports.toggleStatus = async (req, res) => {
	try {
		const { userType, userId, status } = req.body; // userType: 'male' | 'female'; status: 'active' | 'inactive'
		if (!['male', 'female'].includes(userType)) {
			return res.status(400).json({ success: false, message: messages.USER_MANAGEMENT.INVALID_USER_TYPE });
		}
		if (!['active', 'inactive'].includes(status)) {
			return res.status(400).json({ success: false, message: messages.USER_MANAGEMENT.INVALID_STATUS });
		}
		const Model = userType === 'male' ? MaleUser : FemaleUser;
		const user = await Model.findByIdAndUpdate(userId, { status }, { new: true });
		if (!user) return res.status(404).json({ success: false, message: messages.COMMON.USER_NOT_FOUND });
		return res.json({ success: true, data: user });
	} catch (err) {
		return res.status(500).json({ success: false, error: err.message });
	}
};

// Wallet/Coin operation (credit/debit) for specific user
exports.operateBalance = async (req, res) => {
    try {
        const { userType, userId, operationType, action, amount, message } = req.body;
        if (!['male', 'female'].includes(userType)) return res.status(400).json({ success: false, message: 'Invalid userType' });
        if (!['wallet', 'coin'].includes(operationType)) return res.status(400).json({ success: false, message: messages.USER_MANAGEMENT.INVALID_OPERATION_TYPE });
        if (!['credit', 'debit'].includes(action)) return res.status(400).json({ success: false, message: messages.USER_MANAGEMENT.INVALID_ACTION });
        const numericAmount = Number(amount);
        if (!Number.isFinite(numericAmount) || numericAmount <= 0) return res.status(400).json({ success: false, message: messages.USER_MANAGEMENT.INVALID_AMOUNT });

        const Model = userType === 'male' ? MaleUser : FemaleUser;
        const user = await Model.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: messages.COMMON.USER_NOT_FOUND });

        const balanceField = operationType === 'wallet' ? 'walletBalance' : 'coinBalance';
        const currentBalance = user[balanceField] || 0;
        const updatedBalance = action === 'credit' ? currentBalance + numericAmount : currentBalance - numericAmount;
        if (updatedBalance < 0) return res.status(400).json({ success: false, message: messages.USER_MANAGEMENT.INSUFFICIENT_BALANCE });

        user[balanceField] = updatedBalance;
        await user.save();

        const txn = await Transaction.create({
            userType,
            userId: user._id,
            operationType,
            action,
            amount: numericAmount,
            message: message || (action === 'credit' ? messages.USER_MANAGEMENT.BALANCE_CREDITED : messages.USER_MANAGEMENT.BALANCE_DEBITED),
            balanceAfter: updatedBalance,
            createdBy: req.admin?._id || req.staff?._id
        });

        return res.json({ success: true, data: { userId: user._id, [balanceField]: updatedBalance, transaction: txn } });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

// Approve/Reject registration for female or agency
exports.reviewRegistration = async (req, res) => {
    try {
        const { userType, userId, reviewStatus } = req.body; // userType: 'female' | 'agency'; reviewStatus: 'accepted' | 'rejected'
        if (!['female', 'agency'].includes(userType)) return res.status(400).json({ success: false, message: messages.USER_MANAGEMENT.INVALID_USER_TYPE });
        if (!['accepted', 'rejected'].includes(reviewStatus)) return res.status(400).json({ success: false, message: messages.USER_MANAGEMENT.INVALID_REVIEW_STATUS });
        
        const Model = userType === 'female' ? FemaleUser : AgencyUser;
        
        // Get the user before update to check old review status
        const userBeforeUpdate = await Model.findById(userId);
        if (!userBeforeUpdate) return res.status(404).json({ success: false, message: messages.COMMON.USER_NOT_FOUND });
        
        const oldReviewStatus = userBeforeUpdate.reviewStatus;
        
        // Update the review status
        const user = await Model.findByIdAndUpdate(userId, { reviewStatus }, { new: true });
        
        // Trigger referral bonus if status changed to "accepted" from a non-accepted status
        if (reviewStatus === 'accepted' && oldReviewStatus !== 'accepted') {
            // Check if user was referred
            if (userType === 'female' && 
                ((user.referredByFemale && user.referredByFemale.length > 0) || 
                 (user.referredByAgency && user.referredByAgency.length > 0))) {
                
                // Process referral bonus for female user
                const processReferralBonus = require('../../utils/processReferralBonus');
                await processReferralBonus(user, 'female');
                
            } else if (userType === 'agency' && 
                      (user.referredByAgency && user.referredByAgency.length > 0)) {
                
                // Process referral bonus for agency user
                const processReferralBonus = require('../../utils/processReferralBonus');
                await processReferralBonus(user, 'agency');
            }
        }
        
        return res.json({ success: true, data: user });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

// Approve/Reject KYC by admin/staff
exports.reviewKYC = async (req, res) => {
    try {
        const { kycId, status, kycType, rejectionReason } = req.body; // status: 'approved' | 'rejected', kycType: 'female' | 'agency'
        if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ success: false, message: messages.USER_MANAGEMENT.INVALID_STATUS });
        if (!['female', 'agency'].includes(kycType)) return res.status(400).json({ success: false, message: messages.USER_MANAGEMENT.INVALID_USER_KYC_TYPE });
        
        let kyc;
        if (kycType === 'female') {
            const FemaleKYC = require('../../models/femaleUser/KYC');
            kyc = await FemaleKYC.findByIdAndUpdate(kycId, { status, verifiedBy: req.admin?._id || req.staff?._id }, { new: true });
            if (!kyc) return res.status(404).json({ success: false, message: messages.USER_MANAGEMENT.FEMALE_KYC_NOT_FOUND });
            // Update FemaleUser kycStatus and kycDetails when KYC is approved
            if (status === 'approved') {
                // Update only the specific method that was approved
                const user = await FemaleUser.findById(kyc.user);
                
                // Initialize kycDetails with new structure if it doesn't exist or has old structure
                if (!user.kycDetails || !user.kycDetails.bank || !user.kycDetails.upi) {
                    user.kycDetails = {
                        bank: {},
                        upi: {}
                    };
                }
                
                const mongoose = require('mongoose');
                
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
            } else if (status === 'rejected') {
                await FemaleUser.findByIdAndUpdate(kyc.user, { 
                    kycStatus: 'rejected',
                    kycDetails: { verifiedAt: new Date() }
                });
            }
        } else {
            const AgencyKYC = require('../../models/agency/KYC');
            kyc = await AgencyKYC.findByIdAndUpdate(kycId, { status, verifiedBy: req.admin?._id || req.staff?._id }, { new: true });
            if (!kyc) return res.status(404).json({ success: false, message: messages.USER_MANAGEMENT.AGENCY_KYC_NOT_FOUND });
            // Update AgencyUser kycStatus when KYC is approved
            if (status === 'approved') {
                await AgencyUser.findByIdAndUpdate(kyc.user, { kycStatus: 'approved' });
            }
        }
        
        return res.json({ success: true, data: kyc });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

// List pending registrations (female/agency) for admin review
exports.listPendingRegistrations = async (req, res) => {
    try {
        const { userType } = req.query; // 'female' | 'agency' | undefined (all)
        let data = {};
        if (!userType || userType === 'female') {
            data.females = await FemaleUser.find({ reviewStatus: 'pending' }).select('-otp -passwordHash');
        }
        if (!userType || userType === 'agency') {
            data.agencies = await AgencyUser.find({ reviewStatus: 'pending' }).select('-otp');
        }
        return res.json({ success: true, data });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

// List pending KYCs for admin review
exports.listPendingKYCs = async (req, res) => {
    try {
        const FemaleKYC = require('../../models/femaleUser/KYC');
        const AgencyKYC = require('../../models/agency/KYC');
        
        const [femaleKycs, agencyKycs] = await Promise.all([
            FemaleKYC.find({ status: 'pending' }).populate('user', 'name email mobileNumber'),
            AgencyKYC.find({ status: 'pending' }).populate('user', 'firstName lastName email mobileNumber')
        ]);
        
        return res.json({ success: true, data: { femaleKycs, agencyKycs } });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};
// List transactions for a user with optional date filters
exports.listTransactions = async (req, res) => {
    try {
        const { userType, userId } = req.params;
        const { operationType, startDate, endDate } = req.query;
        if (!['male', 'female'].includes(userType)) return res.status(400).json({ success: false, message: 'Invalid userType' });

        const filter = { userType, userId };
        if (operationType && ['wallet', 'coin'].includes(operationType)) {
            filter.operationType = operationType;
        }
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) {
                const inclusiveEnd = new Date(endDate);
                inclusiveEnd.setHours(23, 59, 59, 999);
                filter.createdAt.$lte = inclusiveEnd;
            }
        }

        const txns = await Transaction.find(filter).sort({ createdAt: -1 });
        return res.json({ success: true, data: txns });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

// Delete user by admin (for testing purposes)
exports.deleteUser = async (req, res) => {
    try {
        const { userType, userId } = req.params; // userType: 'male' | 'female' | 'agency'
        if (!['male', 'female', 'agency'].includes(userType)) {
            return res.status(400).json({ success: false, message: messages.USER_MANAGEMENT.INVALID_USER_TYPE });
        }

        let Model;
        if (userType === 'male') {
            Model = MaleUser;
        } else if (userType === 'female') {
            Model = FemaleUser;
        } else {
            Model = AgencyUser;
        }

        const user = await Model.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: messages.COMMON.USER_NOT_FOUND });
        }

        return res.json({ 
            success: true, 
            message: messages.USER_MANAGEMENT.USER_DELETED_SUCCESS(userType),
            deletedUser: { id: user._id, email: user.email }
        });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

// Set coins per second rate for female user
exports.setFemaleCallRate = async (req, res) => {
    try {
        const { userId, coinsPerSecond } = req.body;
        
        if (!userId) {
            return res.status(400).json({ success: false, message: messages.USER_MANAGEMENT.USER_ID_REQUIRED });
        }
        
        if (coinsPerSecond === undefined || coinsPerSecond === null) {
            return res.status(400).json({ success: false, message: messages.USER_MANAGEMENT.COINS_PER_SECOND_REQUIRED });
        }
        
        const numericRate = Number(coinsPerSecond);
        if (!Number.isFinite(numericRate) || numericRate < 0) {
            return res.status(400).json({ 
                success: false, 
                message: messages.USER_MANAGEMENT.COINS_PER_SECOND_INVALID 
            });
        }
        
        const femaleUser = await FemaleUser.findByIdAndUpdate(
            userId,
            { coinsPerSecond: numericRate },
            { new: true }
        ).select('name email coinsPerSecond');
        
        if (!femaleUser) {
            return res.status(404).json({ success: false, message: messages.COMMON.USER_NOT_FOUND });
        }
        
        return res.json({
            success: true,
            message: messages.USER_MANAGEMENT.CALL_RATE_UPDATED(femaleUser.name, femaleUser.email),
            data: {
                userId: femaleUser._id,
                name: femaleUser.name,
                email: femaleUser.email,
                coinsPerSecond: femaleUser.coinsPerSecond
            }
        });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};
