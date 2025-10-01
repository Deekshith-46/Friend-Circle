const BlockList = require('../../models/maleUser/BlockList');
const MaleFollowing = require('../../models/maleUser/Following');
const FemaleFollowers = require('../../models/femaleUser/Followers');

// Block a female user
exports.blockUser = async (req, res) => {
  const { femaleUserId } = req.body;

  try {
    // Check if already blocked
    const existingBlock = await BlockList.findOne({ 
      maleUserId: req.user.id, 
      blockedUserId: femaleUserId 
    });
    
    if (existingBlock) {
      return res.status(400).json({ 
        success: false, 
        message: 'User is already blocked.' 
      });
    }

    // 1. Remove follow relationship (if exists)
    await MaleFollowing.findOneAndDelete({ 
      maleUserId: req.user.id, 
      femaleUserId 
    });
    
    await FemaleFollowers.findOneAndDelete({ 
      maleUserId: req.user.id, 
      femaleUserId 
    });

    // 2. Add to block list
    const newBlock = new BlockList({
      maleUserId: req.user.id,
      blockedUserId: femaleUserId
    });

    await newBlock.save();

    res.json({ 
      success: true, 
      message: 'User blocked successfully. Follow relationship removed if it existed.' 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Unblock a female user
exports.unblockUser = async (req, res) => {
  const { femaleUserId } = req.body;

  try {
    // Check if user is actually blocked
    const existingBlock = await BlockList.findOne({ 
      maleUserId: req.user.id, 
      blockedUserId: femaleUserId 
    });
    
    if (!existingBlock) {
      return res.status(400).json({ 
        success: false, 
        message: 'User is not blocked.' 
      });
    }

    // Remove from block list
    await BlockList.findOneAndDelete({
      maleUserId: req.user.id,
      blockedUserId: femaleUserId
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
    const blockList = await BlockList.find({ maleUserId: req.user.id }).populate('blockedUserId');
    res.json({ success: true, data: blockList });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
