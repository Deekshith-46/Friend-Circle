// /controllers/femaleUserControllers/blockListController.js
const BlockList = require('../../models/femaleUser/BlockList');
const FemaleFollowing = require('../../models/femaleUser/Following');
const MaleFollowers = require('../../models/maleUser/Followers');

// Block a male user
exports.blockUser = async (req, res) => {
  const { maleUserId } = req.body;
  
  try {
    // Check if already blocked
    const existingBlock = await BlockList.findOne({ 
      femaleUserId: req.user.id, 
      blockedUserId: maleUserId 
    });
    
    if (existingBlock) {
      return res.status(400).json({ 
        success: false, 
        message: 'User is already blocked.' 
      });
    }

    // 1. Remove follow relationship (if exists)
    await FemaleFollowing.findOneAndDelete({ 
      femaleUserId: req.user.id, 
      maleUserId 
    });
    
    await MaleFollowers.findOneAndDelete({ 
      maleUserId, 
      femaleUserId: req.user.id 
    });

    // 2. Add to block list
    const block = new BlockList({ 
      femaleUserId: req.user.id, 
      blockedUserId: maleUserId 
    });
    
    await block.save();
    
    res.json({ 
      success: true, 
      message: 'User blocked successfully. Follow relationship removed if it existed.' 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Unblock a male user
exports.unblockUser = async (req, res) => {
  const { maleUserId } = req.body;
  
  try {
    // Check if user is actually blocked
    const existingBlock = await BlockList.findOne({ 
      femaleUserId: req.user.id, 
      blockedUserId: maleUserId 
    });
    
    if (!existingBlock) {
      return res.status(400).json({ 
        success: false, 
        message: 'User is not blocked.' 
      });
    }

    // Remove from block list
    await BlockList.findOneAndDelete({ 
      femaleUserId: req.user.id, 
      blockedUserId: maleUserId 
    });
    
    res.json({ 
      success: true, 
      message: 'User unblocked successfully. You can now follow them again if desired.' 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get block list
exports.getBlockList = async (req, res) => {
  try {
    const blockList = await BlockList.find({ femaleUserId: req.user.id }).populate('blockedUserId');
    res.json({ success: true, data: blockList });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

