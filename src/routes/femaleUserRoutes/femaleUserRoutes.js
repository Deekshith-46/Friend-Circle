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
    const { operationType, startDate, endDate } = req.query;
    const filter = { userType: 'female', userId: req.user._id };
    if (operationType && ['wallet', 'coin'].includes(operationType)) filter.operationType = operationType;
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
    res.json({ success: true, data: txns });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Verify Login OTP
router.post('/verify-login-otp', femaleUserController.verifyLoginOtp);

router.post('/verify-otp', femaleUserController.verifyOtp);

// Complete Profile after OTP Verification (REQUIRED before login)
router.post('/complete-profile', auth, femaleUserController.completeProfile);

// Add Extra Info after OTP Verification
router.post('/add-info', auth, femaleUserController.addUserInfo);
// Get Female User Profile
router.get('/me', auth, femaleUserController.getUserProfile);  // New route to get profile
// Update User Details (Name, Age, Gender, etc.)
router.put('/update', auth, femaleUserController.addUserInfo);

// Update user interests
router.put('/interests', auth, femaleUserController.updateInterests);

// Update user languages
router.put('/languages', auth, femaleUserController.updateLanguages);

// Online Status Toggle
router.post('/toggle-online-status', auth, femaleUserController.toggleOnlineStatus);

// Upload Images via form-data (field: images)
router.post('/upload-image', auth, parser.array('images', 5), femaleUserController.uploadImage);

// Upload Video via form-data (field: video)
router.post('/upload-video', auth, videoParser.single('video'), femaleUserController.uploadVideo);

// Delete image by id
router.delete('/images/:imageId', auth, femaleUserController.deleteImage);

// Browse male users (paginated)
router.get('/browse-males', auth, femaleUserController.listMaleUsers);

// Follow Male User
router.post('/follow', auth, followingFollowersController.followUser);

// Follow Back a Male User (explicitly follow someone who is already following you)
router.post('/follow-back', auth, followingFollowersController.followBackUser);

// Unfollow Male User
router.post('/unfollow', auth, followingFollowersController.unfollowUser);

// Get Following List
router.get('/following', auth, followingFollowersController.getFemaleFollowingList);

// Get Followers List
router.get('/followers', auth, followingFollowersController.getFemaleFollowersList);

// Follow Request Management Routes
router.use('/follow-requests', followRequestRoutes);

// Delete User Account
router.delete('/delete', auth, femaleUserController.deleteUser);

// Chat Routes
router.post('/send-message', auth, chatController.sendMessage);
router.get('/chat-history', auth, chatController.getChatHistory);

// Earnings Routes
router.get('/rewards', auth, earningsController.getRewards);
// router.post('/add-reward', auth, earningsController.addReward);

// Call Earnings Routes
router.get('/calls/earnings', auth, callEarningsController.getCallEarnings);
router.get('/calls/earnings-stats', auth, callEarningsController.getCallEarningsStats);

// Gift Routes
router.get('/gifts/received', auth, giftController.getReceivedGifts);
router.get('/gifts/stats', auth, giftController.getGiftStats);

// Stats Routes
router.get('/stats', auth, statsController.getFemaleUserStats);
router.get('/stats/:userId', auth, statsController.getFemaleUserStats);
router.get('/rewards/history', auth, statsController.getRewardHistory);
router.post('/increment-missed-calls', auth, statsController.incrementMissedCalls);
router.post('/increment-missed-calls/:userId', auth, statsController.incrementMissedCalls);

// KYC Routes
router.post('/submit-kyc', auth, kycController.submitKYC);
router.post('/verify-kyc', auth, kycController.verifyKYC);

// Blocklist Routes
router.post('/block', auth, blockListController.blockUser);
router.post('/unblock', auth, blockListController.unblockUser);
router.get('/block-list', auth, blockListController.getBlockList);  // Get block list

module.exports = router;