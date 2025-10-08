const express = require('express');
const router = express.Router();
const maleUserController = require('../../controllers/maleUserControllers/maleUserController');
const followingFollowersController = require('../../controllers/maleUserControllers/followingFollowersController');
const blockListController = require('../../controllers/maleUserControllers/blockListController');
const auth = require('../../middlewares/authMiddleware');
const parser = require('../../config/multer');
const Transaction = require('../../models/common/Transaction');

// Register Male User
router.post('/register', maleUserController.registerUser);

// Login Male User (Send OTP)
router.post('/login', maleUserController.loginUser);

// Get my transactions (male) with optional filters
router.get('/me/transactions', auth, async (req, res) => {
  try {
    const { operationType, startDate, endDate } = req.query;
    const filter = { userType: 'male', userId: req.user._id };
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
router.post('/verify-login-otp', maleUserController.verifyLoginOtp);

// Verify OTP and activate user
router.post('/verify-otp', maleUserController.verifyOtp);

// Get user profile
router.get('/me', auth, maleUserController.getUserProfile);

// Upload Images via form-data (field: images)
router.post('/upload-image', auth, parser.array('images', 5), maleUserController.uploadImage);

// Follow Female User
router.post('/follow', auth, followingFollowersController.followUser);

// Unfollow Female User
router.post('/unfollow', auth, followingFollowersController.unfollowUser);

// Get Following List
router.get('/following', auth, followingFollowersController.getMaleFollowingList);

// Get Followers List
router.get('/followers', auth, followingFollowersController.getMaleFollowersList);

// Buy Coins Package
router.post('/buy-coins', auth, maleUserController.buyCoins);

// Blocklist Routes
router.post('/block', auth, blockListController.blockUser);
router.post('/unblock', auth, blockListController.unblockUser);
router.get('/block-list', auth, blockListController.getBlockList);

// Payment Routes are now handled directly in app.js

module.exports = router;
