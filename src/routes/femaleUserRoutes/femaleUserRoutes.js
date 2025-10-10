const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/authMiddleware');
const femaleUserController = require('../../controllers/femaleUserControllers/femaleUserController');
const followingFollowersController = require('../../controllers/femaleUserControllers/followingFollowersController');
const chatController = require('../../controllers/femaleUserControllers/chatController');
const earningsController = require('../../controllers/femaleUserControllers/earningsController');
const kycController = require('../../controllers/femaleUserControllers/kycController');
const blockListController = require('../../controllers/femaleUserControllers/blockListController');
const { parser, videoParser } = require('../../config/multer');
const Transaction = require('../../models/common/Transaction');
const { getSelectableOptions } = require('../../controllers/common/optionsController');

// Public selectable options for female users
router.get('/options', getSelectableOptions);

 

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

// Add Extra Info after OTP Verification
router.post('/add-info', auth, femaleUserController.addUserInfo);
// Get Female User Profile
router.get('/me', auth, femaleUserController.getUserProfile);  // New route to get profile
// Update User Details (Name, Age, Gender, etc.)
router.put('/update', auth, femaleUserController.addUserInfo);

// Upload Images via form-data (field: images)
router.post('/upload-image', auth, parser.array('images', 5), femaleUserController.uploadImage);

// Upload Video via form-data (field: video)
router.post('/upload-video', auth, videoParser.single('video'), femaleUserController.uploadVideo);

// Delete image by id
router.delete('/images/:imageId', auth, femaleUserController.deleteImage);

// Follow Male User
router.post('/follow', auth, followingFollowersController.followUser);

// Unfollow Male User
router.post('/unfollow', auth, followingFollowersController.unfollowUser);

// Get Following List
router.get('/following', auth, followingFollowersController.getFemaleFollowingList);

// Get Followers List
router.get('/followers', auth, followingFollowersController.getFemaleFollowersList);

// Delete User Account
router.delete('/delete', auth, femaleUserController.deleteUser);

// Chat Routes
router.post('/send-message', auth, chatController.sendMessage);
router.get('/chat-history', auth, chatController.getChatHistory);

// Earnings Routes
router.get('/rewards', auth, earningsController.getRewards);
// router.post('/add-reward', auth, earningsController.addReward);

// KYC Routes
router.post('/submit-kyc', auth, kycController.submitKYC);
router.post('/verify-kyc', auth, kycController.verifyKYC);

// Blocklist Routes
router.post('/block', auth, blockListController.blockUser);
router.post('/unblock', auth, blockListController.unblockUser);
router.get('/block-list', auth, blockListController.getBlockList);  // Get block list

module.exports = router;
