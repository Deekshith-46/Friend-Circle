const MaleBlockList = require('../models/maleUser/BlockList');
const FemaleBlockList = require('../models/femaleUser/BlockList');
const messages = require('../validations/messages');

// Middleware to check if users have blocked each other
const checkBlockStatus = async (userId, targetUserId, userType, targetUserType) => {
  try {
    // Check if user has blocked target
    let block1, block2;
    
    if (userType === 'male') {
      block1 = await MaleBlockList.findOne({ 
        maleUserId: userId, 
        blockedUserId: targetUserId 
      });
    } else {
      block1 = await FemaleBlockList.findOne({ 
        femaleUserId: userId, 
        blockedUserId: targetUserId 
      });
    }
    
    // Check if target has blocked user
    if (targetUserType === 'male') {
      block2 = await MaleBlockList.findOne({ 
        maleUserId: targetUserId, 
        blockedUserId: userId 
      });
    } else {
      block2 = await FemaleBlockList.findOne({ 
        femaleUserId: targetUserId, 
        blockedUserId: userId 
      });
    }
    
    return {
      userBlockedTarget: !!block1,
      targetBlockedUser: !!block2,
      isBlocked: !!(block1 || block2)
    };
  } catch (err) {
    console.error('Error checking block status:', err);
    return {
      userBlockedTarget: false,
      targetBlockedUser: false,
      isBlocked: false,
      error: err.message
    };
  }
};

// Middleware to prevent blocked users from interacting
const preventBlockedInteraction = async (req, res, next) => {
  try {
    // Skip check for certain routes that don't involve user interactions
    const skipRoutes = [
      '/block',
      '/unblock',
      '/block-list',
      '/toggle-online-status'
    ];
    
    const fullPath = req.originalUrl;
    if (skipRoutes.some(route => fullPath.includes(route))) {
      return next();
    }
    
    // Check if req.user exists (authenticated user)
    if (!req.user) {
      return next(); // No authenticated user, continue
    }
    
    // Get target user ID from request body or params
    const targetUserId = req.body.femaleUserId || req.body.maleUserId || req.params.userId;
    
    if (!targetUserId) {
      return next(); // No target user specified, continue
    }
    
    // Check if we have the required user information
    if (!req.user._id || !req.userType) {
      return next(); // Missing required user information, continue
    }
    
    // Check block status
    const blockStatus = await checkBlockStatus(
      req.user._id, 
      targetUserId, 
      req.userType,
      req.body.femaleUserId ? 'female' : 'male'
    );
    
    if (blockStatus.isBlocked) {
      return res.status(403).json({ 
        success: false, 
        message: messages.BLOCK.BLOCKED_CANNOT_INTERACT 
      });
    }
    
    next();
  } catch (err) {
    console.error('Error in block middleware:', err);
    next();
  }
};

module.exports = {
  checkBlockStatus,
  preventBlockedInteraction
};