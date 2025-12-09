const express = require('express');
const router = express.Router();
const maleUserController = require('../../controllers/maleUserControllers/maleUserController');
const followingFollowersController = require('../../controllers/maleUserControllers/followingFollowersController');
const blockListController = require('../../controllers/maleUserControllers/blockListController');
const callController = require('../../controllers/maleUserControllers/callController');
const auth = require('../../middlewares/authMiddleware');
const { parser } = require('../../config/multer');
const Transaction = require('../../models/common/Transaction');
const { getInterests } = require('../../controllers/common/interestController');
const { getLanguages } = require('../../controllers/common/languageController');
const { preventBlockedInteraction } = require('../../middlewares/blockMiddleware');

// Apply block middleware to all routes except block/unblock
router.use(preventBlockedInteraction);

// Public routes for interests and languages
router.get('/interests', getInterests);
router.get('/languages', getLanguages);

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

// Update user interests
router.put('/interests', auth, maleUserController.updateInterests);

// Update user languages
router.put('/languages', auth, maleUserController.updateLanguages);

// Browse female users (paginated)
router.get('/browse-females', auth, maleUserController.listFemaleUsers);

// Upload Images via form-data (field: images)
router.post('/upload-image', auth, parser.array('images', 5), maleUserController.uploadImage);

// Delete image by id
router.delete('/images/:imageId', auth, maleUserController.deleteImage);

// Send Follow Request to Female User
router.post('/follow-request/send', auth, followingFollowersController.sendFollowRequest);

// Cancel Sent Follow Request
router.post('/follow-request/cancel', auth, followingFollowersController.cancelFollowRequest);

// Get Sent Follow Requests
router.get('/follow-requests/sent', auth, followingFollowersController.getSentFollowRequests);

// Follow Female User (used internally when a follow request is accepted)
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

// Call Routes
router.post('/calls/start', auth, callController.startCall);
router.post('/calls/end', auth, callController.endCall);
router.get('/calls/history', auth, callController.getCallHistory);
router.get('/calls/stats', auth, callController.getCallStats);

// Payment Routes are now handled directly in app.js

module.exports = router;