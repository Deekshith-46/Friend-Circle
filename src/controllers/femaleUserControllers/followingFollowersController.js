const FemaleUser = require('../../models/femaleUser/FemaleUser');
const MaleUser = require('../../models/maleUser/MaleUser');
const FemaleFollowers = require('../../models/femaleUser/Followers');
const FemaleFollowing = require('../../models/femaleUser/Following');
const MaleFollowers = require('../../models/maleUser/Followers');
const MaleFollowing = require('../../models/maleUser/Following');
const BlockList = require('../../models/femaleUser/BlockList');
const MaleBlockList = require('../../models/maleUser/BlockList');
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
    // Check if we have the required user information
    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required.' 
      });
    }

    // Find and remove ALL possible relationship combinations
    const results = {
      femaleFollowing: null,
      maleFollowers: null,
      maleFollowing: null,
      femaleFollowers: null
    };

    // 1. Female following Male (FemaleFollowing + MaleFollowers)
    results.femaleFollowing = await FemaleFollowing.findOneAndDelete({ 
      femaleUserId: req.user._id, 
      maleUserId 
    });
    
    if (results.femaleFollowing) {
      // Remove reference from Female user document
      await FemaleUser.findByIdAndUpdate(req.user._id, {
        $pull: { femalefollowing: results.femaleFollowing._id }
      });
      
      // Also remove the corresponding MaleFollowers record
      results.maleFollowers = await MaleFollowers.findOneAndDelete({ 
        maleUserId, 
        femaleUserId: req.user._id
      });
      
      if (results.maleFollowers) {
        // Remove reference from Male user document
        await MaleUser.findByIdAndUpdate(maleUserId, {
          $pull: { malefollowers: results.maleFollowers._id }
        });
      }
    }

    // 2. Male following Female (MaleFollowing + FemaleFollowers)
    results.maleFollowing = await MaleFollowing.findOneAndDelete({ 
      maleUserId, 
      femaleUserId: req.user._id
    });
    
    if (results.maleFollowing) {
      // Remove reference from Male user document
      await MaleUser.findByIdAndUpdate(maleUserId, {
        $pull: { malefollowing: results.maleFollowing._id }
      });
      
      // Also remove the corresponding FemaleFollowers record
      results.femaleFollowers = await FemaleFollowers.findOneAndDelete({ 
        maleUserId, 
        femaleUserId: req.user._id
      });
      
      if (results.femaleFollowers) {
        // Remove reference from Female user document
        await FemaleUser.findByIdAndUpdate(req.user._id, {
          $pull: { followers: results.femaleFollowers._id }
        });
      }
    }

    // Also clean up any related follow request records
    await FollowRequest.deleteMany({ 
      $or: [
        { maleUserId, femaleUserId: req.user._id },
        { maleUserId: req.user._id, femaleUserId: maleUserId }
      ]
    });

    res.json({ success: true, message: 'Unfollowed male user successfully.' });
  } catch (err) {
    console.error('Error in unfollowUser:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get Female User's Following List
exports.getFemaleFollowingList = async (req, res) => {
  try {
    const femaleUser = await FemaleUser.findById(req.user._id);
    
    // Get list of users that the current female user has blocked
    const blockedByCurrentUser = await BlockList.find({ femaleUserId: req.user._id }).select('blockedUserId');
    const blockedByCurrentUserIds = blockedByCurrentUser.map(block => block.blockedUserId);
    
    // Get list of users who have blocked the current female user
    const blockedByOthers = await MaleBlockList.find({ blockedUserId: req.user._id }).select('maleUserId');
    const blockedByOthersIds = blockedByOthers.map(block => block.maleUserId);

    const followingList = await FemaleFollowing.find({ 
      femaleUserId: femaleUser._id,
      maleUserId: { 
        $nin: [...blockedByCurrentUserIds, ...blockedByOthersIds] // Exclude users blocked by either party
      }
    }).populate('maleUserId', 'firstName lastName email');
    
    res.json({ success: true, data: followingList });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get Female User's Followers List
exports.getFemaleFollowersList = async (req, res) => {
  try {
    // Get list of users that the current female user has blocked
    const blockedByCurrentUser = await BlockList.find({ femaleUserId: req.user._id }).select('blockedUserId');
    const blockedByCurrentUserIds = blockedByCurrentUser.map(block => block.blockedUserId);
    
    // Get list of users who have blocked the current female user
    const blockedByOthers = await MaleBlockList.find({ blockedUserId: req.user._id }).select('maleUserId');
    const blockedByOthersIds = blockedByOthers.map(block => block.maleUserId);

    const followersList = await FemaleFollowers.find({ 
      femaleUserId: req.user._id,
      maleUserId: { 
        $nin: [...blockedByCurrentUserIds, ...blockedByOthersIds] // Exclude users blocked by either party
      }
    }).populate('maleUserId', 'firstName lastName email');
    
    res.json({ success: true, data: followersList });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
