const FemaleUser = require('../../models/femaleUser/FemaleUser');
const FemaleFollowers = require('../../models/femaleUser/Followers');
const FemaleFollowing = require('../../models/femaleUser/Following');
const MaleFollowers = require('../../models/maleUser/Followers');
const BlockList = require('../../models/femaleUser/BlockList');

// Follow a Male User
exports.followUser = async (req, res) => {
  const { maleUserId } = req.body;

  try {
    const femaleUser = await FemaleUser.findById(req.user.id);

    // Check if the user is already following
    const existingFollowing = await FemaleFollowing.findOne({ femaleUserId: req.user.id, maleUserId });
    if (existingFollowing) {
      return res.status(400).json({ success: false, message: 'Already following this user.' });
    }

    // Check if the male user is blocked by the female user
    const isBlocked = await BlockList.findOne({ 
      femaleUserId: req.user.id, 
      blockedUserId: maleUserId 
    });
    
    if (isBlocked) {
      return res.status(403).json({ 
        success: false, 
        message: 'Cannot follow this user. You have blocked them. Please unblock first to follow.' 
      });
    }

    // Create a new FemaleFollowing entry
    const newFemaleFollowing = new FemaleFollowing({
      femaleUserId: req.user.id,
      maleUserId,
    });

    // Add to Female's following list
    await newFemaleFollowing.save();

    // Create a new MaleFollower entry
    const newFollower = new MaleFollowers({
      maleUserId,
      femaleUserId: req.user.id,
    });

    // Add to Male's followers list
    await newFollower.save();

    res.json({ success: true, message: 'Following male user successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Unfollow a Male User
exports.unfollowUser = async (req, res) => {
  const { maleUserId } = req.body;

  try {
    const femaleUser = await FemaleUser.findById(req.user.id);

    // Remove from Female's following list
    await FemaleFollowing.findOneAndDelete({ femaleUserId: req.user.id, maleUserId });

    // Remove from Male's followers list
    await MaleFollowers.findOneAndDelete({ maleUserId, femaleUserId: req.user.id });

    res.json({ success: true, message: 'Unfollowed male user successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get Female User's Following List
exports.getFemaleFollowingList = async (req, res) => {
  try {
    const femaleUser = await FemaleUser.findById(req.user.id);

    const followingList = await FemaleFollowing.find({ femaleUserId: femaleUser._id }).populate('maleUserId', 'firstName lastName email');
    res.json({ success: true, data: followingList });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get Female User's Followers List
exports.getFemaleFollowersList = async (req, res) => {
  try {
    const followersList = await FemaleFollowers.find({ femaleUserId: req.user.id }).populate('maleUserId', 'firstName lastName email');
    res.json({ success: true, data: followersList });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
