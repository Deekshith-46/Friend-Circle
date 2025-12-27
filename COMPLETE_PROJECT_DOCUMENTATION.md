# Friend Circle - Complete Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Complete Folder Structure](#complete-folder-structure)
3. [Technology Stack](#technology-stack)
4. [Environment Setup](#environment-setup)
5. [Main Application Files](#main-application-files)
6. [Configuration Files](#configuration-files)
7. [Database Models](#database-models)
8. [Controllers](#controllers)
9. [Routes](#routes)
10. [Middlewares](#middlewares)
11. [Utilities](#utilities)
12. [API Endpoints](#api-endpoints)
13. [Setup Instructions](#setup-instructions)

## Project Overview

Friend Circle is a comprehensive dating and social networking platform with multiple user types and sophisticated business logic. The platform supports interactions between male users, female users, agencies, and administrative staff with complex economic models including coins, wallet balances, and various transaction systems.

## Complete Folder Structure

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

## Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based with role-based access control
- **File Upload**: Multer with Cloudinary integration
- **Payment**: Razorpay integration
- **Environment**: Dotenv for configuration management
- **Validation**: Built-in validation and middleware
- **Testing**: Postman collections for API testing

## Environment Setup

The application requires the following environment variables in a `.env` file:

```
MONGO_URI=mongodb://localhost:27017/friend-circle
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
SENDGRID_API_KEY=your_sendgrid_api_key
CLIENT_ORIGIN=http://localhost:3000
NODE_ENV=development
PORT=5000
```

## Main Application Files

### app.js
The main Express application file that sets up middleware, routes, and CORS configuration.

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
app.use('/female-user/favourites', require('./routes/femaleUserRoutes/favouritesRoutes'));  // Favourites Routes for FemaleUser
app.use('/female-user/chat', require('./routes/femaleUserRoutes/chatRoutes'));  // Female User Chat
app.use('/female-user/earnings', require('./routes/femaleUserRoutes/earningsRoutes'));  // Female User Earnings
app.use('/female-user/kyc', require('./routes/femaleUserRoutes/kycRoutes'));  // KYC Routes
app.use('/female-user/withdrawals', require('./routes/femaleUserRoutes/withdrawalRoutes'));  // Withdrawal Routes
app.use('/female-user/blocklist', require('./routes/femaleUserRoutes/blockListRoutes'));  // Blocklist Routes

// Routes for Male User
app.use('/male-user', require('./routes/maleUserRoutes/maleUserRoutes')); // Male User Routes
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
The server startup file that initializes the Express app and starts the server.

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

## Configuration Files

### db.js
Database connection configuration using Mongoose.

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### cloudinary.js
Cloudinary configuration for file uploads.

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
File upload configuration using Multer middleware.

```javascript
const multer = require('multer');
const path = require('path');

// Configure storage for images
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/images/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Configure storage for videos
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/videos/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter for images
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// File filter for videos
const videoFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed!'), false);
  }
};

const imageUpload = multer({ 
  storage: imageStorage, 
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const videoUpload = multer({ 
  storage: videoStorage, 
  fileFilter: videoFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

module.exports = {
  imageUpload,
  videoUpload,
  parser: imageUpload,
  videoParser: videoUpload
};
```

## Database Models

### Admin Models

#### AdminUser.js
Model for admin user accounts.

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
Model for staff user accounts with permissions.

```javascript
const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  phone: { type: String, unique: true },
  status: { type: String, enum: ['publish', 'unpublish'], default: 'publish' },
  permissions: {
    interest: { read: Boolean, write: Boolean, update: Boolean },
    language: { read: Boolean, write: Boolean, update: Boolean },
    religion: { read: Boolean, write: Boolean, update: Boolean },
    relationGoal: { read: Boolean, write: Boolean, update: Boolean },
    gift: { read: Boolean, write: Boolean, update: Boolean },
    page: { read: Boolean, write: Boolean, update: Boolean },
    faq: { read: Boolean, write: Boolean, update: Boolean },
    plan: { read: Boolean, write: Boolean, update: Boolean },
    package: { read: Boolean, write: Boolean, update: Boolean },
    users: { read: Boolean, write: Boolean, update: Boolean },
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
  lastLogin: { type: Date, default: null },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Staff', staffSchema);
```

### Female User Models

#### FemaleUser.js
Main model for female users with all profile information and balances.

```javascript
const mongoose = require('mongoose');

const femaleUserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, sparse: true },
  mobileNumber: { type: String, unique: true, sparse: true },
  otp: String, // For verification
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FemaleImage' }],
  interests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Interest' }],
  languages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Language' }],
  hobbies: [String],
  sports: [String],
  film: [String],
  music: [String],
  travel: [String],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  reviewStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: false },
  profileCompleted: { type: Boolean, default: false },
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Favourites' }],
  kycStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  kycDetails: {
    bank: {
      name: String,
      accountNumber: String,
      ifsc: String,
      verifiedAt: Date
    },
    upi: {
      upiId: String,
      verifiedAt: Date
    }
  },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Followers' }],
  femalefollowing: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FemaleFollowing' }],
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
  age: Number,
  bio: String,
  gender: String,
  videoUrl: String,
}, { timestamps: true });

module.exports = mongoose.model('FemaleUser', femaleUserSchema);
```

### Male User Models

#### MaleUser.js
Model for male users with profile information and balances.

```javascript
const mongoose = require('mongoose');

const maleUserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true, sparse: true },
  mobileNumber: { type: String, unique: true, sparse: true },
  otp: String,
  profileImages: [String], // Cloudinary URLs
  interests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Interest' }],
  languages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Language' }],
  hobbies: [String],
  sports: [String],
  film: [String],
  music: [String],
  travel: [String],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  reviewStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: false },
  profileCompleted: { type: Boolean, default: false },
  walletBalance: { type: Number, default: 0 },
  coinBalance: { type: Number, default: 0 },
  // Referral system
  referralCode: { type: String, unique: true, sparse: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'MaleUser' },
  referralBonusAwarded: { type: Boolean, default: false },
  age: Number,
  bio: String,
  gender: String,
}, { timestamps: true });

module.exports = mongoose.model('MaleUser', maleUserSchema);
```

## Controllers

### Authentication Middleware

#### authMiddleware.js
Handles authentication for different user types based on the request URL.

```javascript
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/admin/AdminUser');
const Staff = require('../models/admin/Staff');
const FemaleUser = require('../models/femaleUser/FemaleUser');
const MaleUser = require('../models/maleUser/MaleUser');
const AgencyUser = require('../models/agency/AgencyUser');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Determine user type based on route
    if (req.originalUrl.startsWith('/admin')) {
      // Check if it's admin or staff
      const admin = await AdminUser.findById(decoded.id).select('-passwordHash');
      if (admin) {
        req.admin = admin;
        req.userType = 'admin';
      } else {
        // Check if it's staff
        req.staff = await Staff.findById(decoded.id).select('-passwordHash');
        if (req.staff) {
          req.userType = 'staff';
        } else {
          return res.status(404).json({ success: false, message: 'User not found' });
        }
      }
    }
    else if (req.originalUrl.startsWith('/female-user')) {
      // Female user authentication
      req.user = await FemaleUser.findById(decoded.id); // Store user data in req.user
      if (!req.user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      
    }
    else if (req.originalUrl.startsWith('/male-user')) {
        // Male user authentication
        req.user = await MaleUser.findById(decoded.id); // Store user data in req.user
        if (!req.user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
    }
    else if (req.originalUrl.startsWith('/agency')) {
        // Agency user authentication
        req.user = await AgencyUser.findById(decoded.id);
        if (!req.user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

module.exports = auth;
```

## Routes

### Admin Routes

#### users.js
Handles all user management routes for admins.

```javascript
const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/authMiddleware');
const { dynamicPermissionCheck } = require('../../middlewares/permissionMiddleware');
const { parser } = require('../../config/multer');
const controller = require('../../controllers/adminControllers/userManagementController');
const femaleUserController = require('../../controllers/femaleUserControllers/femaleUserController');

// List users (all/male/female) => query ?type=male|female
router.get('/', auth, dynamicPermissionCheck, controller.listUsers);

// Toggle status (accepts form-data or JSON)
router.post('/toggle-status', auth, dynamicPermissionCheck, parser.none(), controller.toggleStatus);

// Wallet/Coin operations for a user (accepts JSON or form-data)
router.post('/operate-balance', auth, dynamicPermissionCheck, parser.none(), controller.operateBalance);

// List transactions for a user with optional filters
router.get('/:userType/:userId/transactions', auth, dynamicPermissionCheck, controller.listTransactions);

// Approve/Reject registration review (female or agency)
router.post('/review-registration', auth, dynamicPermissionCheck, parser.none(), controller.reviewRegistration);

// Approve/Reject KYC
router.post('/review-kyc', auth, dynamicPermissionCheck, parser.none(), controller.reviewKYC);

// List pending registrations for admin review
router.get('/pending-registrations', auth, dynamicPermissionCheck, controller.listPendingRegistrations);

// List pending KYCs for admin review
router.get('/pending-kycs', auth, dynamicPermissionCheck, controller.listPendingKYCs);

// Delete user by admin (for testing purposes)
router.delete('/:userType/:userId', auth, dynamicPermissionCheck, controller.deleteUser);

// Cleanup incomplete female profiles (older than 7 days)
router.post('/cleanup-incomplete-profiles', auth, dynamicPermissionCheck, femaleUserController.cleanupIncompleteProfiles);

// Set call rate (coins per second) for female user
router.post('/set-call-rate', auth, dynamicPermissionCheck, parser.none(), controller.setFemaleCallRate);

// Clean up user references (remove invalid interests/languages references)
router.post('/:userType/:userId/cleanup-references', auth, dynamicPermissionCheck, controller.cleanUserReferences);

// Test endpoint to verify route is working
router.get('/test-call-rate-route', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Call rate route is registered correctly!',
    endpoint: 'POST /admin/users/set-call-rate'
  });
});

module.exports = router;
```

## Middlewares

### permissionMiddleware.js
Handles dynamic permission checking for staff users.

```javascript
// Helper function to get module from URL path
const getModuleFromPath = (path) => {
  if (path.includes('/interests')) return 'interest';
  if (path.includes('/languages')) return 'language';
  if (path.includes('/religions')) return 'religion';
  if (path.includes('/relation-goals')) return 'relationGoal';
  if (path.includes('/gifts')) return 'gift';
  if (path.includes('/pages')) return 'page';
  if (path.includes('/faqs')) return 'faq';
  if (path.includes('/plans')) return 'plan';
  if (path.includes('/packages')) return 'package';
  if (path.includes('/users')) return 'users';
  return null;
};

// Helper function to get action from HTTP method
const getActionFromMethod = (method) => {
  switch (method) {
    case 'GET': return 'read';
    case 'POST': return 'write';
    case 'PUT':
    case 'PATCH': return 'update';
    case 'DELETE': return 'update'; // Treat delete as update permission
    default: return 'read';
  }
};

// Dynamic permission middleware
const dynamicPermissionCheck = (req, res, next) => {
  // Admin has full access
  if (req.userType === 'admin') {
    return next();
  }

  // Staff permission check
  if (req.userType === 'staff') {
    const module = getModuleFromPath(req.originalUrl);
    const action = getActionFromMethod(req.method);

    if (!module) {
      return next(); // Allow access to non-module routes
    }

    const permissions = req.staff.permissions;
    const modulePermissions = permissions[module];

    if (!modulePermissions) {
      return res.status(403).json({ 
        success: false, 
        message: `No access to ${module} module` 
      });
    }

    if (!modulePermissions[action]) {
      return res.status(403).json({ 
        success: false, 
        message: `No ${action} permission for ${module} module` 
      });
    }

    return next();
  }

  // If not admin or staff, deny access
  return res.status(403).json({ 
    success: false, 
    message: 'Access denied. Admin or staff required.' 
  });
};

module.exports = { dynamicPermissionCheck };
```

## Utilities

### generateToken.js
Generates JWT tokens for user authentication.

```javascript
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
```

### sendOtp.js
Sends OTP to users via email.

```javascript
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendOtp = async (email, otp) => {
  const msg = {
    to: email,
    from: 'your-verified-sender@example.com', // Change to your verified sender
    subject: 'Your OTP for Verification',
    text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
    html: `<strong>Your OTP is ${otp}. It is valid for 10 minutes.</strong>`,
  };
  
  try {
    await sgMail.send(msg);
    console.log('OTP sent successfully');
  } catch (error) {
    console.error('Error sending OTP:', error);
    // In a real application, you might want to handle this differently
    // For now, we'll just log the error
  }
};

module.exports = sendOtp;
```

## API Endpoints

### Admin Endpoints
- `POST /admin/login` - Admin/Staff login
- `GET /admin/users` - List all users
- `GET /admin/users?type=female` - List female users
- `GET /admin/users?type=male` - List male users
- `GET /admin/users?type=agency` - List agency users
- `POST /admin/users/toggle-status` - Activate/deactivate users
- `POST /admin/users/operate-balance` - Credit/debit user balances

### Female User Endpoints
- `POST /female-user/register` - Register new female user
- `POST /female-user/login` - Login (sends OTP)
- `POST /female-user/verify-otp` - Verify registration OTP
- `POST /female-user/verify-login-otp` - Verify login OTP
- `POST /female-user/complete-profile` - Complete user profile
- `GET /female-user/me` - Get current user profile
- `PUT /female-user/update` - Update user profile
- `PUT /female-user/interests` - Update interests
- `PUT /female-user/languages` - Update languages
- `POST /female-user/upload-image` - Upload user images
- `POST /female-user/upload-video` - Upload user video
- `DELETE /female-user/images/:imageId` - Delete user image
- `GET /female-user/me/balance` - Get balance information
- `GET /female-user/me/withdrawals` - Get withdrawal history
- `POST /female-user/withdrawals/request` - Request withdrawal
- `GET /female-user/earnings` - Get earnings
- `GET /female-user/calls/earnings` - Get call-based earnings
- `GET /female-user/gifts/received` - Get received gifts
- `GET /female-user/stats` - Get user statistics
- `POST /female-user/toggle-online-status` - Toggle online status
- `GET /female-user/browse-males` - Browse male users
- `POST /female-user/follow` - Follow male user
- `POST /female-user/unfollow` - Unfollow male user

### Male User Endpoints
- `POST /male-user/register` - Register new male user
- `POST /male-user/login` - Login (sends OTP)
- `POST /male-user/verify-otp` - Verify registration OTP
- `POST /male-user/verify-login-otp` - Verify login OTP
- `POST /male-user/complete-profile` - Complete user profile
- `GET /male-user/me` - Get current user profile
- `PUT /male-user/update` - Update user profile
- `PUT /male-user/interests` - Update interests
- `PUT /male-user/languages` - Update languages
- `GET /male-user/me/balance` - Get balance information
- `GET /male-user/me/transactions` - Get transaction history
- `POST /male-user/call/:femaleUserId` - Initiate call
- `POST /male-user/end-call/:callId` - End call
- `POST /male-user/gifts/send` - Send gift
- `GET /male-user/gifts/sent` - Get sent gifts
- `GET /male-user/browse-females` - Browse female users
- `POST /male-user/follow` - Follow female user
- `POST /male-user/unfollow` - Unfollow female user

### Agency Endpoints
- `POST /agency/register` - Register new agency
- `POST /agency/verify-otp` - Verify registration OTP
- `POST /agency/login` - Login (sends OTP)
- `POST /agency/verify-login-otp` - Verify login OTP
- `GET /agency/me` - Get current agency profile
- `PUT /agency/details` - Update agency details
- `POST /agency/upload-image` - Upload agency image
- `POST /agency/kyc/submit` - Submit KYC
- `GET /agency/kyc/status` - Get KYC status
- `GET /agency/withdrawals` - Get withdrawal requests
- `POST /agency/withdrawals/request` - Request withdrawal

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Friend-Circle
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory with the following variables:
   ```env
   MONGO_URI=mongodb://localhost:27017/friend-circle
   JWT_SECRET=your_jwt_secret_here
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   SENDGRID_API_KEY=your_sendgrid_api_key
   CLIENT_ORIGIN=http://localhost:3000
   NODE_ENV=development
   PORT=5000
   ```

4. **Create admin user**:
   Run the following command to create an initial admin user:
   ```bash
   node src/utils/createAdmin.js
   ```
   This will create an admin user with:
   - Email: admin@example.com
   - Password: 123456

5. **Start the development server**:
   ```bash
   npm run dev
   ```

6. **API Documentation**:
   - Admin login: `POST /admin/login`
   - Female user registration: `POST /female-user/register`
   - Male user registration: `POST /male-user/register`
   - Agency registration: `POST /agency/register`

7. **Testing**:
   - Use the Postman collections in the `test/` directory to test the APIs
   - Import the collections and set the appropriate environment variables

The application is now ready to use with all user types and features available.