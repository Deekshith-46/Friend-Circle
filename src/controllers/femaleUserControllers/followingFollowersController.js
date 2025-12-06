const FemaleUser = require('../../models/femaleUser/FemaleUser');
const FemaleFollowers = require('../../models/femaleUser/Followers');
const FemaleFollowing = require('../../models/femaleUser/Following');
const MaleFollowers = require('../../models/maleUser/Followers');
const MaleFollowing = require('../../models/maleUser/Following');
const BlockList = require('../../models/femaleUser/BlockList');
const FollowRequest = require('../../models/common/FollowRequest');

// Follow a Male User (Explicit follow-back functionality)
exports.followBackUser = async (req, res) => {
  const { maleUserId } = req.body;

  try {
    const femaleUser = await FemaleUser.findById(req.user._id);

    // Check if there's already a following relationship
    const existingFollowing = await FemaleFollowing.findOne({ femaleUserId: req.user._id, maleUserId });
    if (existingFollowing) {
      return res.status(400).json({ success: false, message: 'Already following this user.' });
    }

    // Check if the male user is actually following the female user (exists in female's followers list)
    const isFollower = await FemaleFollowers.findOne({ femaleUserId: req.user._id, maleUserId });
    if (!isFollower) {
      return res.status(400).json({ success: false, message: 'This user is not following you.' });
    }

    // Check if the male user is blocked by the female user
    const isBlocked = await BlockList.findOne({ 
      femaleUserId: req.user._id, 
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
      femaleUserId: req.user._id,
      maleUserId,
    });

    // Add to Female's following list
    await newFemaleFollowing.save();

    // Create a new MaleFollower entry
    const newFollower = new MaleFollowers({
      maleUserId,
      femaleUserId: req.user._id,
    });

    // Add to Male's followers list
    await newFollower.save();

    // Update user documents to include references to these relationships
    // Add the new following reference to the female user's document
    await FemaleUser.findByIdAndUpdate(req.user._id, {
      $addToSet: { femalefollowing: newFemaleFollowing._id }
    });

    // Add the new follower reference to the male user's document
    await MaleUser.findByIdAndUpdate(maleUserId, {
      $addToSet: { malefollowers: newFollower._id }
    });

    res.json({ success: true, message: 'Following male user successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Follow a Male User
exports.followUser = async (req, res) => {
  const { maleUserId } = req.body;

  try {
    const femaleUser = await FemaleUser.findById(req.user._id);

    // Check if there's already a following relationship
    const existingFollowing = await FemaleFollowing.findOne({ femaleUserId: req.user._id, maleUserId });
    if (existingFollowing) {
      return res.status(400).json({ success: false, message: 'Already following this user.' });
    }

    // Check if the male user is blocked by the female user
    const isBlocked = await BlockList.findOne({ 
      femaleUserId: req.user._id, 
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
      femaleUserId: req.user._id,
      maleUserId,
    });

    // Add to Female's following list
    await newFemaleFollowing.save();

    // Create a new MaleFollower entry
    const newFollower = new MaleFollowers({
      maleUserId,
      femaleUserId: req.user._id,
    });

    // Add to Male's followers list
    await newFollower.save();

    // Update user documents to include references to these relationships
    // Add the new following reference to the female user's document
    await FemaleUser.findByIdAndUpdate(req.user._id, {
      $addToSet: { femalefollowing: newFemaleFollowing._id }
    });

    // Add the new follower reference to the male user's document
    await MaleUser.findByIdAndUpdate(maleUserId, {
      $addToSet: { malefollowers: newFollower._id }
    });

    res.json({ success: true, message: 'Following male user successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Unfollow a Male User
exports.unfollowUser = async (req, res) => {
  const { maleUserId } = req.body;

  try {
    const femaleUser = await FemaleUser.findById(req.user._id);

    // Find the following record to get its ID for removing from user document
    const followingRecord = await FemaleFollowing.findOne({ femaleUserId: req.user._id, maleUserId });
    
    if (followingRecord) {
      // Remove the following reference from the female user's document
      await FemaleUser.findByIdAndUpdate(req.user._id, {
        $pull: { femalefollowing: followingRecord._id }
      });

      // Find the corresponding follower record to get its ID for removing from male user's document
      const followerRecord = await MaleFollowers.findOne({ maleUserId, femaleUserId: req.user._id });
      
      if (followerRecord) {
        // Remove the follower reference from the male user's document
        await MaleUser.findByIdAndUpdate(maleUserId, {
          $pull: { malefollowers: followerRecord._id }
        });
        
        // Remove from Male's followers list
        await MaleFollowers.findOneAndDelete({ maleUserId, femaleUserId: req.user._id });
      }

      // Remove from Female's following list
      await FemaleFollowing.findOneAndDelete({ femaleUserId: req.user._id, maleUserId });
      
      // Also clean up any related follow request records (in case female user initiated follow)
      // Note: This would be rare since typically males initiate follows, but included for completeness
      await FollowRequest.deleteMany({ 
        maleUserId: maleUserId, 
        femaleUserId: req.user._id,
        status: 'accepted'
      });
    }

    res.json({ success: true, message: 'Unfollowed male user successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get Female User's Following List
exports.getFemaleFollowingList = async (req, res) => {
  try {
    const femaleUser = await FemaleUser.findById(req.user._id);

    const followingList = await FemaleFollowing.find({ femaleUserId: femaleUser._id }).populate('maleUserId', 'firstName lastName email');
    res.json({ success: true, data: followingList });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get Female User's Followers List
exports.getFemaleFollowersList = async (req, res) => {
  try {
    const followersList = await FemaleFollowers.find({ femaleUserId: req.user._id }).populate('maleUserId', 'firstName lastName email');
    res.json({ success: true, data: followersList });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};