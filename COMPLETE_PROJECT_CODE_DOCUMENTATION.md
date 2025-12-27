# Friend Circle - Complete Project Code Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Folder Structure](#folder-structure)
3. [Main Application Files](#main-application-files)
4. [Configuration Files](#configuration-files)
5. [Database Models](#database-models)
6. [Controllers](#controllers)
7. [Routes](#routes)
8. [Middlewares](#middlewares)
9. [Utilities](#utilities)
10. [Environment Setup](#environment-setup)

## Project Overview

Friend Circle is a comprehensive dating and social networking platform with multiple user types and sophisticated business logic. The platform supports interactions between male users, female users, agencies, and administrative staff with complex economic models including coins, wallet balances, and various transaction systems.

## Folder Structure

```
Friend-Circle/
├── api/
│   └── index.js
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   ├── cloudinary.js
│   │   ├── db.js
│   │   ├── multer.js
│   │   └── razorpay.js
│   ├── controllers/
│   │   ├── adminControllers/
│   │   │   ├── adminController.js
│   │   │   ├── faqController.js
│   │   │   ├── giftController.js
│   │   │   ├── interestController.js
│   │   │   ├── languageController.js
│   │   │   ├── packageController.js
│   │   │   ├── pageController.js
│   │   │   ├── planController.js
│   │   │   ├── relationGoalController.js
│   │   │   ├── religionController.js
│   │   │   ├── rewardController.js
│   │   │   ├── staffController.js
│   │   │   └── userManagementController.js
│   │   ├── agencyControllers/
│   │   │   ├── agencyUserController.js
│   │   │   └── kycController.js
│   │   ├── common/
│   │   │   ├── interestController.js
│   │   │   ├── languageController.js
│   │   │   ├── optionsController.js
│   │   │   ├── withdrawalController.js
│   │   │   └── referralController.js
│   │   ├── femaleUserControllers/
│   │   │   ├── blockListController.js
│   │   │   ├── callEarningsController.js
│   │   │   ├── chatController.js
│   │   │   ├── earningsController.js
│   │   │   ├── favouritesController.js
│   │   │   ├── femaleUserController.js
│   │   │   ├── followRequestController.js
│   │   │   ├── followingFollowersController.js
│   │   │   ├── giftController.js
│   │   │   ├── kycController.js
│   │   │   └── statsController.js
│   │   └── maleUserControllers/
│   │       ├── blockListController.js
│   │       ├── callController.js
│   │       ├── chatController.js
│   │       ├── favouritesController.js
│   │       ├── followingFollowersController.js
│   │       ├── giftController.js
│   │       ├── maleUserController.js
│   │       ├── paymentController.js
│   │       ├── profileController.js
│   │       └── testController.js
│   ├── jobs/
│   │   └── rewardJob.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── blockMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── permissionMiddleware.js
│   ├── models/
│   │   ├── admin/
│   │   │   ├── AdminConfig.js
│   │   │   ├── AdminUser.js
│   │   │   ├── AuditLog.js
│   │   │   ├── DailyReward.js
│   │   │   ├── FAQ.js
│   │   │   ├── Gift.js
│   │   │   ├── Interest.js
│   │   │   ├── Language.js
│   │   │   ├── Package.js
│   │   │   ├── Page.js
│   │   │   ├── Plan.js
│   │   │   ├── RelationGoal.js
│   │   │   ├── Religion.js
│   │   │   ├── Staff.js
│   │   │   └── WeeklyReward.js
│   │   ├── agency/
│   │   │   ├── AgencyUser.js
│   │   │   ├── Image.js
│   │   │   └── KYC.js
│   │   ├── common/
│   │   │   ├── CallHistory.js
│   │   │   ├── FollowRequest.js
│   │   │   ├── PendingReward.js
│   │   │   ├── RewardHistory.js
│   │   │   ├── Transaction.js
│   │   │   └── WithdrawalRequest.js
│   │   ├── femaleUser/
│   │   │   ├── BlockList.js
│   │   │   ├── Chat.js
│   │   │   ├── Earnings.js
│   │   │   ├── Favourites.js
│   │   │   ├── FemaleUser.js
│   │   │   ├── Followers.js
│   │   │   ├── Following.js
│   │   │   ├── GiftReceived.js
│   │   │   ├── Image.js
│   │   │   ├── Invite.js
│   │   │   ├── KYC.js
│   │   │   └── Reward.js
│   │   └── maleUser/
│   │       ├── BlockList.js
│   │       ├── Chat.js
│   │       ├── Favourites.js
│   │       ├── Followers.js
│   │       ├── Following.js
│   │       ├── Image.js
│   │       ├── MaleUser.js
│   │       ├── Package.js
│   │       └── Payment.js
│   ├── routes/
│   │   ├── adminRoutes/
│   │   │   ├── admin.js
│   │   │   ├── faq.js
│   │   │   ├── gift.js
│   │   │   ├── interest.js
│   │   │   ├── language.js
│   │   │   ├── package.js
│   │   │   ├── page.js
│   │   │   ├── payoutRoutes.js
│   │   │   ├── plan.js
│   │   │   ├── relationGoal.js
│   │   │   ├── religion.js
│   │   │   ├── reward.js
│   │   │   ├── staff.js
│   │   │   └── users.js
│   │   ├── agencyRoutes/
│   │   │   ├── agencyUserRoutes.js
│   │   │   ├── kycRoutes.js
│   │   │   └── withdrawalRoutes.js
│   │   ├── femaleUserRoutes/
│   │   │   ├── blockListRoutes.js
│   │   │   ├── chatRoutes.js
│   │   │   ├── earningsRoutes.js
│   │   │   ├── favouritesRoutes.js
│   │   │   ├── femaleUserRoutes.js
│   │   │   ├── followRequestRoutes.js
│   │   │   ├── kycRoutes.js
│   │   │   └── withdrawalRoutes.js
│   │   ├── maintenance/
│   │   │   └── routes.js
│   │   └── maleUserRoutes/
│   │       ├── blockListRoutes.js
│   │       ├── chatRoutes.js
│   │       ├── favouritesRoutes.js
│   │       ├── maleUserRoutes.js
│   │       ├── paymentRoutes.js
│   │       ├── profileRoutes.js
│   │       └── giftRoutes.js
│   └── utils/
│       ├── createAdmin.js
│       ├── createAuditLog.js
│       ├── generateReferralCode.js
│       ├── generateToken.js
│       ├── getUserId.js
│       ├── rewardCalculator.js
│       ├── rewardScheduler.js
│       └── sendOtp.js
├── test/
│   ├── AdminStaff.postman_collection.json
│   ├── AdminUsers.postman_collection.json
│   ├── Agency.postman_collection.json
│   └── FemaleUser.postman_collection.json
├── .gitignore
├── CALL_SYSTEM_API_TESTING_GUIDE.md
├── FEMALE_STATS_API_ROUTES.md
├── FOLLOW_REQUEST_SYSTEM.md
├── MIN_CALL_COINS_FEATURE.md
├── PREFERENCES_UPDATE_API.md
├── PROJECT_DOCUMENTATION.md
├── REFERRAL_BONUS_SYSTEM.md
├── REWARD_SYSTEM.md
├── WITHDRAWAL_SYSTEM_IMPLEMENTATION.md
├── check_interests_languages.js
├── check_user_refs.js
├── package-lock.json
├── package.json
├── paying_system.md
└── vercel.json
```

## Main Application Files

### package.json
```json
{
  "name": "project_file",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "build": "echo 'No build step required'",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@sendgrid/mail": "^8.1.6",
    "bcryptjs": "^3.0.2",
    "cloudinary": "^1.41.3",
    "cors": "^2.8.5",
    "dotenv": "^17.2.2",
    "express": "^5.1.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.18.2",
    "multer": "^2.0.2",
    "multer-storage-cloudinary": "^4.0.0",
    "nodemon": "^3.1.11",
    "razorpay": "^2.9.6"
  }
}
```

### app.js
```javascript
const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
const cors = require('cors');
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*', credentials: true }));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Dating App API is running!',
    timestamp: new Date().toISOString(),
    endpoints: {
      admin: '/admin/login',
      maleUser: '/male-user/register',
      femaleUser: '/female-user/register',
      agency: '/agency/register'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'API is healthy' });
});

// Routes
app.use('/admin', require('./routes/adminRoutes/admin'));
app.use('/admin/interests', require('./routes/adminRoutes/interest'));
app.use('/admin/languages', require('./routes/adminRoutes/language'));
app.use('/admin/religions', require('./routes/adminRoutes/religion'));
app.use('/admin/relation-goals', require('./routes/adminRoutes/relationGoal'));
app.use('/admin/gifts', require('./routes/adminRoutes/gift'));
app.use('/admin/pages', require('./routes/adminRoutes/page'));
app.use('/admin/faqs', require('./routes/adminRoutes/faq'));
app.use('/admin/plans', require('./routes/adminRoutes/plan'));
app.use('/admin/packages', require('./routes/adminRoutes/package'));
app.use('/admin/staff', require('./routes/adminRoutes/staff'));
app.use('/admin/users', require('./routes/adminRoutes/users'));
app.use('/admin/rewards', require('./routes/adminRoutes/reward'));
app.use('/admin/payouts', require('./routes/adminRoutes/payoutRoutes'));


// Routes for Female User
app.use('/female-user', require('./routes/femaleUserRoutes/femaleUserRoutes'));  // Female User Registration & Info
// Routes for Female User
app.use('/female-user/favourites', require('./routes/femaleUserRoutes/favouritesRoutes'));  // Favourites Routes for FemaleUser
app.use('/female-user/chat', require('./routes/femaleUserRoutes/chatRoutes'));  // Female User Chat
app.use('/female-user/earnings', require('./routes/femaleUserRoutes/earningsRoutes'));  // Female User Earnings
app.use('/female-user/kyc', require('./routes/femaleUserRoutes/kycRoutes'));  // KYC Routes
app.use('/female-user/withdrawals', require('./routes/femaleUserRoutes/withdrawalRoutes'));  // Withdrawal Routes
app.use('/female-user/blocklist', require('./routes/femaleUserRoutes/blockListRoutes'));  // Blocklist Routes

// Routes for Male User
app.use('/male-user', require('./routes/maleUserRoutes/maleUserRoutes')); // Male User Routes
// Routes for Male User
app.use('/male-user/favourites', require('./routes/maleUserRoutes/favouritesRoutes'));  // Favourites Routes
app.use('/male-user/chat', require('./routes/maleUserRoutes/chatRoutes')); // Chat Routes
app.use('/male-user/blocklist', require('./routes/maleUserRoutes/blockListRoutes')); // Block List Routes
app.use('/male-user/profile', require('./routes/maleUserRoutes/profileRoutes')); // Profile Routes
app.use('/male-user/payment', require('./routes/maleUserRoutes/paymentRoutes')); // Payment Routes
app.use('/male-user/gifts', require('./routes/maleUserRoutes/giftRoutes')); // Gift Routes

// Routes for Agency User
app.use('/agency', require('./routes/agencyRoutes/agencyUserRoutes'));
app.use('/agency/withdrawals', require('./routes/agencyRoutes/withdrawalRoutes'));

// Error middleware
app.use(require('./middlewares/errorMiddleware'));

module.exports = app;
```

### server.js
```javascript
const app = require('./app');
const PORT = process.env.PORT || 5000;

// For Vercel deployment
if (process.env.NODE_ENV === 'production') {
  module.exports = app;
} else {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
```

### vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

## Configuration Files

### db.js
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### cloudinary.js
```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
```

### multer.js
```javascript
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

// Image storage configuration
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'admin_uploads',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

// Video storage configuration
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'female_videos',
    allowed_formats: ['mp4', 'mov', 'avi', 'mkv'],
    resource_type: 'video',
  },
});

const parser = multer({ storage: imageStorage });
const videoParser = multer({ 
  storage: videoStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for videos
  }
});

module.exports = { parser, videoParser };
```

### razorpay.js
```javascript
const Razorpay = require('razorpay');

let razorpayInstance = null;

// Only initialize Razorpay if credentials are available
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  try {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  } catch (error) {
    console.error('Failed to initialize Razorpay:', error.message);
    razorpayInstance = null;
  }
} else {
  console.warn('Razorpay credentials not found in environment variables. Payout functionality will be disabled.');
  razorpayInstance = null;
}

module.exports = razorpayInstance;
```

## Database Models

### Admin Models

#### AdminUser.js
```javascript
const mongoose = require('mongoose');

const adminUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  phone: { type: String, unique: true },
  lastLogin: { type: Date, default: null },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('AdminUser', adminUserSchema);
```

#### Staff.js
```javascript
const mongoose = require('mongoose');

// granular permission triple per module: read/write/update
const permissionTripleSchema = new mongoose.Schema({
	read: { type: Boolean, default: false },
	write: { type: Boolean, default: false },
	update: { type: Boolean, default: false }
}, { _id: false });

// Allowed modules (exclude: payment gateway, payout, user list, fake user, report, notification, wallet, coin)
const staffPermissionsSchema = new mongoose.Schema({
	interest: { type: permissionTripleSchema, default: () => ({}) },
	language: { type: permissionTripleSchema, default: () => ({}) },
	religion: { type: permissionTripleSchema, default: () => ({}) },
	relationGoals: { type: permissionTripleSchema, default: () => ({}) },
	plan: { type: permissionTripleSchema, default: () => ({}) },
	package: { type: permissionTripleSchema, default: () => ({}) },
	page: { type: permissionTripleSchema, default: () => ({}) },
	faq: { type: permissionTripleSchema, default: () => ({}) },
	gift: { type: permissionTripleSchema, default: () => ({}) },
	users: { type: permissionTripleSchema, default: () => ({}) }
}, { _id: false });

const staffSchema = new mongoose.Schema({
	adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser', required: true },
	email: { type: String, required: true, unique: true },
	passwordHash: { type: String, required: true },
	status: { type: String, enum: ['publish', 'unpublish'], default: 'publish' },
	permissions: { type: staffPermissionsSchema, default: () => ({}) }
}, { timestamps: true });

module.exports = mongoose.model('Staff', staffSchema);
```

### Female User Models

#### FemaleUser.js
```javascript
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
  // New fields for manually entered preferences
  hobbies: [{ type: String }],
  sports: [{ type: String }],
  film: [{ type: String }],
  music: [{ type: String }],
  travel: [{ type: String }],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  reviewStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
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
  referredByFemale: { type: mongoose.Schema.Types.ObjectId, ref: 'FemaleUser' },
  referredByAgency: { type: mongoose.Schema.Types.ObjectId, ref: 'AgencyUser' },
  referralBonusAwarded: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('FemaleUser', femaleUserSchema);
```

### Male User Models

#### MaleUser.js
```javascript
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
  // Referral system
  referralCode: { type: String, unique: true, sparse: true }, // 8-char alphanumeric
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'MaleUser' }, // Who referred this user
  referralBonusAwarded: { type: Boolean, default: false }, // Ensure one-time award after verification
}, { timestamps: true });

module.exports = mongoose.model('MaleUser', maleUserSchema);
```

### Agency Models

#### AgencyUser.js
```javascript
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
	aadharNumber: { type: String },
	panNumber: { type: String },
	image: { type: String },
	referralCode: { type: String, unique: true, sparse: true },
	status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
	reviewStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
	kycStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('AgencyUser', agencyUserSchema);
```

## Controllers

### Admin Controller

#### adminController.js
```javascript
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
```

### Female User Controller

#### femaleUserController.js
```javascript
const FemaleUser = require('../../models/femaleUser/FemaleUser');
const MaleUser = require('../../models/maleUser/MaleUser');
const FemaleBlockList = require('../../models/femaleUser/BlockList');
const MaleBlockList = require('../../models/maleUser/BlockList');
const generateToken = require('../../utils/generateToken');
const sendOtp = require('../../utils/sendOtp');
const FemaleImage = require('../../models/femaleUser/Image');
const AdminConfig = require('../../models/admin/AdminConfig');
const WithdrawalRequest = require('../../models/common/WithdrawalRequest');

// Update user interests
exports.updateInterests = async (req, res) => {
  try {
    const { interestIds } = req.body;
    const userId = req.user._id;

    if (!interestIds || !Array.isArray(interestIds)) {
      return res.status(400).json({
        success: false,
        message: "Interest IDs array is required"
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
        message: "User not found"
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
        message: "Language IDs array is required"
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
        message: "User not found"
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
        message: "Hobbies array is required"
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
        message: "User not found"
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
        message: "Sports array is required"
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
        message: "User not found"
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
        message: "Film preferences array is required"
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
        message: "User not found"
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
        message: "Music preferences array is required"
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
        message: "User not found"
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
        message: "Travel preferences array is required"
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
        message: "User not found"
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

// User Registration (Email and Mobile Number)
exports.registerUser = async (req, res) => {
  const { email, mobileNumber, referralCode } = req.body;
  const otp = Math.floor(1000 + Math.random() * 9000); // Generate 4-digit OTP

  try {
    // Check if user already exists
    const existingUser = await FemaleUser.findOne({ $or: [{ email }, { mobileNumber }] });
    
    if (existingUser) {
      // If user exists but profile is not completed, allow re-registration
      if (!existingUser.profileCompleted) {
        // Delete the incomplete profile and allow fresh registration
        await FemaleUser.findByIdAndDelete(existingUser._id);
        // Continue with new registration below
      } else if (!existingUser.isVerified || !existingUser.isActive) {
        // Profile is complete but awaiting verification - resend OTP
        existingUser.otp = otp;
        await existingUser.save();
        await sendOtp(email, otp);
        
        return res.status(201).json({
          success: true,
          message: "OTP sent to your email for verification.",
          otp: otp // For testing purposes
        });
      } else {
        // User is already verified and active with complete profile
        return res.status(400).json({ 
          success: false, 
          message: "User already exists and is verified. Please login instead." 
        });
      }
    }

    // Create a temporary user entry with just email, mobile, and OTP
    // Profile details will be added after OTP verification
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

    const newUser = new FemaleUser({ 
      email, 
      mobileNumber, 
      otp, 
      referralCode: myReferral, 
      referredByFemale: referredByFemale?._id, 
      referredByAgency: referredByAgency?._id,
      isVerified: false,
      isActive: false,
      profileCompleted: false // Profile not completed yet
    });
    await newUser.save();
    await sendOtp(email, otp); // Send OTP via SendGrid

    res.status(201).json({
      success: true,
      message: "OTP sent to your email.",
      otp: otp // For testing purposes
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Login Female User (Send OTP)
exports.loginUser = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists
    const user = await FemaleUser.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Check if user has completed profile
    if (!user.profileCompleted) {
      return res.status(403).json({ 
        success: false, 
        message: 'Please signUp and complete your profile first before logging in.' 
      });
    }

    // Registration review gate
    if (user.reviewStatus !== 'approved') {
      return res.status(403).json({ 
        success: false, 
        message: 'Your registration is under review or rejected. Please wait for admin approval.' 
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(400).json({ success: false, message: 'Please verify your account first.' });
    }
    // Check if user is active
    if (user.status === 'inactive') {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated by admin or staff.' });
    }

    // Generate new OTP for login
    const otp = Math.floor(1000 + Math.random() * 9000);
    user.otp = otp;
    await user.save();

    // Send OTP via email
    await sendOtp(email, otp);

    res.json({
      success: true,
      message: 'OTP sent to your email for login verification.',
      otp: otp // For testing purposes
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Verify Login OTP
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

      res.json({
        success: true,
        message: 'Login successful.',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          mobileNumber: user.mobileNumber
        }
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid OTP or user not found.' });
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
      user.isVerified = true; // Mark the user as verified
      user.isActive = true;   // Mark the user as active
      user.otp = undefined;   // Clear OTP after verification
      // NOTE: profileCompleted remains false until user completes profile
      // Referral bonus will be awarded after profile completion

      await user.save();
      res.json({ 
        success: true, 
        token,
        message: "OTP verified successfully. Please complete your profile to continue.",
        profileCompleted: false
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid OTP" });
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

// Complete user profile after OTP verification
exports.completeUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, age, gender, bio, interests, languages, hobbies, sports, film, music, travel } = req.body;
    
    // Find the user
    const user = await FemaleUser.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Get admin config for referral bonus
    const adminConfig = await AdminConfig.getConfig();
    const referralBonusAmount = adminConfig.referralBonus || 100; // Default to 100 coins if not set

    // Check if profile is already completed
    if (user.profileCompleted) {
      return res.status(400).json({ 
        success: false, 
        message: 'Profile is already completed and under review.' 
      });
    }

    // Validate required fields for profile completion
    if (!name || !age || !gender || !bio) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, age, gender, and bio are required to complete profile.' 
      });
    }

    // Check if at least one image is uploaded
    if (!user.images || user.images.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'At least one image is required to complete profile.' 
      });
    }

    // Check if video is uploaded
    if (!user.videoUrl) {
      return res.status(400).json({ 
        success: false, 
        message: 'A video is required to complete profile.' 
      });
    }

    // Update user profile
    user.name = name;
    user.age = age;
    user.gender = gender;
    user.bio = bio;
    if (interests) user.interests = interests;
    if (languages) user.languages = languages;
    if (hobbies) user.hobbies = hobbies;
    if (sports) user.sports = sports;
    if (film) user.film = film;
    if (music) user.music = music;
    if (travel) user.travel = travel;
    user.profileCompleted = true;
    user.reviewStatus = 'pending'; // Set review status to pending for admin approval

    // Award referral bonus after profile completion
    if (!user.referralBonusAwarded && (user.referredByFemale || user.referredByAgency)) {
      const Transaction = require('../../models/common/Transaction');
      
      if (user.referredByFemale) {
        const FemaleModel = require('../../models/femaleUser/FemaleUser');
        const referrer = await FemaleModel.findById(user.referredByFemale);
        if (referrer) {
          // Add referral bonus to walletBalance instead of coinBalance
          referrer.walletBalance = (referrer.walletBalance || 0) + referralBonusAmount;
          user.walletBalance = (user.walletBalance || 0) + referralBonusAmount;
          await referrer.save();
          
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
          user.referralBonusAwarded = true;
        }
      } else if (user.referredByAgency) {
        // Add referral bonus to walletBalance instead of coinBalance
        user.walletBalance = (user.walletBalance || 0) + referralBonusAmount;
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
        user.referralBonusAwarded = true;
      }
    }

    await user.save();
    
    res.json({ 
      success: true, 
      message: 'Profile completed successfully! Your account is now pending admin approval.',
      data: {
        profileCompleted: true,
        reviewStatus: 'pending'
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
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update Female User Info
exports.updateUserInfo = async (req, res) => {
  const { name, age, gender, bio, videoUrl, interests, languages, hobbies, sports, film, music, travel } = req.body; // images is managed via upload endpoint
  try {
    const user = await FemaleUser.findById(req.user.id);
    if (name) user.name = name;
    if (age) user.age = age;
    if (gender) user.gender = gender;
    if (bio) user.bio = bio;
    if (videoUrl) user.videoUrl = videoUrl;
    if (interests) user.interests = interests;
    if (languages) user.languages = languages;
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

// Delete Female User Account
exports.deleteUser = async (req, res) => {
  try {
    await FemaleUser.findByIdAndDelete(req.user.id);
    res.json({ success: true, message: 'User account deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

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

// Upload Images (multipart form-data)
exports.uploadImage = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images uploaded.' });
    }

    const user = await FemaleUser.findById(req.user.id).populate('images');

    const currentCount = Array.isArray(user.images) ? user.images.length : 0;
    const remainingSlots = Math.max(0, 5 - currentCount);
    if (remainingSlots === 0) {
      return res.status(400).json({ success: false, message: 'Image limit reached. Maximum 5 images allowed.' });
    }

    const filesToProcess = req.files.slice(0, remainingSlots);
    const skipped = req.files.length - filesToProcess.length;

    const createdImageIds = [];
    for (const f of filesToProcess) {
      const newImage = await FemaleImage.create({ femaleUserId: req.user.id, imageUrl: f.path });
      createdImageIds.push(newImage._id);
    }

    user.images = [...(user.images || []).map(img => img._id ? img._id : img), ...createdImageIds];
    await user.save();

    return res.json({ success: true, message: 'Images uploaded successfully.', added: createdImageIds.length, skipped });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Upload Video (multipart form-data)
exports.uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No video uploaded.' });
    }

    const videoUrl = req.file.path;
    const publicId = req.file.filename; // cloudinary public_id
    const resourceType = req.file.resource_type || 'video';
    const duration = req.file.duration;
    const bytes = req.file.bytes;
    const user = await FemaleUser.findById(req.user.id);
    
    // Delete old video if exists
    if (user.videoUrl) {
      // You might want to delete the old video from Cloudinary here
      // For now, we'll just replace the URL
    }
    
    user.videoUrl = videoUrl;
    await user.save();

    res.json({ 
      success: true,
      message: 'Video uploaded successfully.',
      // New structured payload for frontend consumers
      data: {
        url: videoUrl,
        secureUrl: videoUrl,
        publicId,
        resourceType,
        duration,
        bytes
      },
      // Backward compatibility
      videoUrl: videoUrl 
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
      return res.status(404).json({ success: false, message: 'Image not found' });
    }
    if (String(imageDoc.femaleUserId) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this image' });
    }

    // Remove ref from user.images and delete image document
    await FemaleUser.updateOne({ _id: req.user.id }, { $pull: { images: imageDoc._id } });
    await FemaleImage.deleteOne({ _id: imageDoc._id });

    return res.json({ success: true, message: 'Image deleted successfully' });
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
      reviewStatus: 'approved',
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
      return res.status(404).json({ success: false, message: 'User not found' });
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
      message: `Status updated to ${onlineStatus ? 'online' : 'offline'}`,
      data: {
        onlineStatus: user.onlineStatus,
        totalOnlineMinutes: user.totalOnlineMinutes || 0
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
```

## Routes

### femaleUserRoutes.js
```javascript
const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/authMiddleware');
const femaleUserController = require('../../controllers/femaleUserControllers/femaleUserController');
const followingFollowersController = require('../../controllers/femaleUserControllers/followingFollowersController');
const chatController = require('../../controllers/femaleUserControllers/chatController');
const earningsController = require('../../controllers/femaleUserControllers/earningsController');
const callEarningsController = require('../../controllers/femaleUserControllers/callEarningsController');
const giftController = require('../../controllers/femaleUserControllers/giftController');
const statsController = require('../../controllers/femaleUserControllers/statsController');
const kycController = require('../../controllers/femaleUserControllers/kycController');
const blockListController = require('../../controllers/femaleUserControllers/blockListController');
const { parser, videoParser } = require('../../config/multer');
const Transaction = require('../../models/common/Transaction');
const { getInterests } = require('../../controllers/common/interestController');
const { getLanguages } = require('../../controllers/common/languageController');
const { preventBlockedInteraction } = require('../../middlewares/blockMiddleware');

// Import the new follow request routes
const followRequestRoutes = require('./followRequestRoutes');

// Apply block middleware to all routes except block/unblock
router.use(preventBlockedInteraction);

// Public routes for interests and languages
router.get('/interests', getInterests);
router.get('/languages', getLanguages);


// Registration and OTP
router.post('/register', femaleUserController.registerUser);

// Login Female User (Send OTP)
router.post('/login', femaleUserController.loginUser);

// Get my transactions (female) with optional filters
router.get('/me/transactions', auth, async (req, res) => {
  try {
    const { operation