const MaleUser = require('../../models/maleUser/MaleUser');
const MaleFollowers = require('../../models/maleUser/Followers');
const MaleFollowing = require('../../models/maleUser/Following');
const FemaleFollowers = require('../../models/femaleUser/Followers');
const BlockList = require('../../models/maleUser/BlockList');

// Follow a Female User
exports.followUser = async (req, res) => {
  const { femaleUserId } = req.body;

  try {
    const maleUser = await MaleUser.findById(req.user.id);

    // Check if the male user is already following the female user
    const existingFollowing = await MaleFollowing.findOne({ maleUserId: req.user.id, femaleUserId });
    if (existingFollowing) {
      return res.status(400).json({ success: false, message: 'Already following this user.' });
    }

    // Check if the female user is blocked by the male user
    const isBlocked = await BlockList.findOne({ 
      maleUserId: req.user.id, 
      blockedUserId: femaleUserId 
    });
    
    if (isBlocked) {
      return res.status(403).json({ 
        success: false, 
        message: 'Cannot follow this user. You have blocked them. Please unblock first to follow.' 
      });
    }

    // Create a new MaleFollowing entry
    const newFollowing = new MaleFollowing({
      maleUserId: req.user.id,
      femaleUserId,
    });
    await newFollowing.save();

    // Now, create the corresponding FemaleFollower entry
    const newFollower = new FemaleFollowers({
      femaleUserId,
      maleUserId: req.user.id,
    });
    await newFollower.save();

    res.json({ success: true, message: 'Following female user successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Unfollow a Female User
exports.unfollowUser = async (req, res) => {
  const { femaleUserId } = req.body;

  try {
    const maleUser = await MaleUser.findById(req.user.id);

    // Remove from Male's Following list
    await MaleFollowing.findOneAndDelete({ maleUserId: req.user.id, femaleUserId });

    // Remove from Female's Follower list
    await FemaleFollowers.findOneAndDelete({ maleUserId: req.user.id, femaleUserId });

    res.json({ success: true, message: 'Unfollowed female user successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get Male User's Following List
exports.getMaleFollowingList = async (req, res) => {
  try {
    const followingList = await MaleFollowing.find({ maleUserId: req.user.id }).populate('femaleUserId', 'firstName lastName email');
    res.json({ success: true, data: followingList });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get Male User's Followers List
exports.getMaleFollowersList = async (req, res) => {
  try {
    const followersList = await MaleFollowers.find({ maleUserId: req.user.id }).populate('femaleUserId', 'firstName lastName email');
    res.json({ success: true, data: followersList });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
