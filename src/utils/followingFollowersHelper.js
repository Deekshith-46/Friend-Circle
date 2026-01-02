const MaleUser = require('../models/maleUser/MaleUser');
const FemaleUser = require('../models/femaleUser/FemaleUser');
const MaleFollowing = require('../models/maleUser/Following');
const MaleFollowers = require('../models/maleUser/Followers');
const FemaleFollowing = require('../models/femaleUser/Following');
const FemaleFollowers = require('../models/femaleUser/Followers');
const BlockList = require('../models/maleUser/BlockList');
const FemaleBlockList = require('../models/femaleUser/BlockList');

/**
 * Get detailed following list with user information
 * @param {String} userId - The user ID to get following list for
 * @param {String} userType - 'male' or 'female'
 * @returns {Array} Array of following objects with user details
 */
const getDetailedFollowingList = async (userId, userType) => {
  try {
    let followingList = [];
    let blockedByCurrentUserIds = [];
    let blockedByOthersIds = [];

    if (userType === 'male') {
      // Get list of users that the current male user has blocked
      const blockedByCurrentUser = await BlockList.find({ maleUserId: userId }).select('blockedUserId');
      blockedByCurrentUserIds = blockedByCurrentUser.map(block => block.blockedUserId);
      
      // Get list of users who have blocked the current male user
      const blockedByOthers = await FemaleBlockList.find({ blockedUserId: userId }).select('femaleUserId');
      blockedByOthersIds = blockedByOthers.map(block => block.femaleUserId);

      // Get following list for male user (female users the male is following)
      followingList = await MaleFollowing.find({ 
        maleUserId: userId,
        femaleUserId: { 
          $nin: [...blockedByCurrentUserIds, ...blockedByOthersIds]
        }
      }).populate({
        path: 'femaleUserId',
        populate: {
          path: 'images',
          model: 'FemaleImage',
          select: 'imageUrl createdAt updatedAt'
        }
      }).select('femaleUserId dateFollowed');
    } else if (userType === 'female') {
      // Get list of users that the current female user has blocked
      const blockedByCurrentUser = await FemaleBlockList.find({ femaleUserId: userId }).select('blockedUserId');
      blockedByCurrentUserIds = blockedByCurrentUser.map(block => block.blockedUserId);
      
      // Get list of users who have blocked the current female user
      const blockedByOthers = await BlockList.find({ blockedUserId: userId }).select('maleUserId');
      blockedByOthersIds = blockedByOthers.map(block => block.maleUserId);

      // Get following list for female user (male users the female is following)
      followingList = await FemaleFollowing.find({ 
        femaleUserId: userId,
        maleUserId: { 
          $nin: [...blockedByCurrentUserIds, ...blockedByOthersIds]
        }
      }).populate({
        path: 'maleUserId',
        populate: {
          path: 'images',
          model: 'MaleImage',
          select: 'imageUrl createdAt updatedAt'
        }
      }).select('maleUserId dateFollowed');
    }

    // Format the response to include relationship information
    const formattedList = followingList.map(relationship => {
      if (userType === 'male') {
        // Extract image URLs from the populated images
        const imageUrls = relationship.femaleUserId.images && Array.isArray(relationship.femaleUserId.images) 
          ? relationship.femaleUserId.images.map(img => ({
              id: img._id,
              url: img.imageUrl,
              createdAt: img.createdAt
            }))
          : [];
        
        return {
          relationshipId: relationship._id,
          followedUser: {
            _id: relationship.femaleUserId._id,
            name: relationship.femaleUserId.name || `${relationship.femaleUserId.firstName} ${relationship.femaleUserId.lastName || ''}`,
            email: relationship.femaleUserId.email,
            gender: relationship.femaleUserId.gender,
            bio: relationship.femaleUserId.bio,
            images: imageUrls,
            createdAt: relationship.femaleUserId.createdAt,
          },
          dateFollowed: relationship.dateFollowed
        };
      } else {
        // Extract image URLs from the populated images
        const imageUrls = relationship.maleUserId.images && Array.isArray(relationship.maleUserId.images) 
          ? relationship.maleUserId.images.map(img => ({
              id: img._id,
              url: img.imageUrl,
              createdAt: img.createdAt
            }))
          : [];
        
        return {
          relationshipId: relationship._id,
          followedUser: {
            _id: relationship.maleUserId._id,
            name: `${relationship.maleUserId.firstName} ${relationship.maleUserId.lastName || ''}`,
            email: relationship.maleUserId.email,
            gender: relationship.maleUserId.gender,
            bio: relationship.maleUserId.bio,
            images: imageUrls,
            createdAt: relationship.maleUserId.createdAt,
          },
          dateFollowed: relationship.dateFollowed
        };
      }
    });

    return formattedList;
  } catch (error) {
    throw new Error(`Error getting following list: ${error.message}`);
  }
};

/**
 * Get detailed followers list with user information
 * @param {String} userId - The user ID to get followers list for
 * @param {String} userType - 'male' or 'female'
 * @returns {Array} Array of followers objects with user details
 */
const getDetailedFollowersList = async (userId, userType) => {
  try {
    let followersList = [];
    let blockedByCurrentUserIds = [];
    let blockedByOthersIds = [];

    if (userType === 'male') {
      // Get list of users that the current male user has blocked
      const blockedByCurrentUser = await BlockList.find({ maleUserId: userId }).select('blockedUserId');
      blockedByCurrentUserIds = blockedByCurrentUser.map(block => block.blockedUserId);
      
      // Get list of users who have blocked the current male user
      const blockedByOthers = await FemaleBlockList.find({ blockedUserId: userId }).select('femaleUserId');
      blockedByOthersIds = blockedByOthers.map(block => block.femaleUserId);

      // Get followers list for male user (female users following the male)
      followersList = await MaleFollowers.find({ 
        maleUserId: userId,
        femaleUserId: { 
          $nin: [...blockedByCurrentUserIds, ...blockedByOthersIds]
        }
      }).populate({
        path: 'femaleUserId',
        populate: {
          path: 'images',
          model: 'FemaleImage',
          select: 'imageUrl createdAt updatedAt'
        }
      }).select('femaleUserId dateFollowed');
    } else if (userType === 'female') {
      // Get list of users that the current female user has blocked
      const blockedByCurrentUser = await FemaleBlockList.find({ femaleUserId: userId }).select('blockedUserId');
      blockedByCurrentUserIds = blockedByCurrentUser.map(block => block.blockedUserId);
      
      // Get list of users who have blocked the current female user
      const blockedByOthers = await BlockList.find({ blockedUserId: userId }).select('maleUserId');
      blockedByOthersIds = blockedByOthers.map(block => block.maleUserId);

      // Get followers list for female user (male users following the female)
      followersList = await FemaleFollowers.find({ 
        femaleUserId: userId,
        maleUserId: { 
          $nin: [...blockedByCurrentUserIds, ...blockedByOthersIds]
        }
      }).populate({
        path: 'maleUserId',
        populate: {
          path: 'images',
          model: 'MaleImage',
          select: 'imageUrl createdAt updatedAt'
        }
      }).select('maleUserId dateFollowed');
    }

    // Format the response to include relationship information
    const formattedList = followersList.map(relationship => {
      if (userType === 'male') {
        // Extract image URLs from the populated images
        const imageUrls = relationship.femaleUserId.images && Array.isArray(relationship.femaleUserId.images) 
          ? relationship.femaleUserId.images.map(img => ({
              id: img._id,
              url: img.imageUrl,
              createdAt: img.createdAt
            }))
          : [];
        
        return {
          relationshipId: relationship._id,
          followerUser: {
            _id: relationship.femaleUserId._id,
            name: relationship.femaleUserId.name,
            email: relationship.femaleUserId.email,
            gender: relationship.femaleUserId.gender,
            bio: relationship.femaleUserId.bio,
            images: imageUrls,
            createdAt: relationship.femaleUserId.createdAt,
          },
          dateFollowed: relationship.dateFollowed
        };
      } else {
        // Extract image URLs from the populated images
        const imageUrls = relationship.maleUserId.images && Array.isArray(relationship.maleUserId.images) 
          ? relationship.maleUserId.images.map(img => ({
              id: img._id,
              url: img.imageUrl,
              createdAt: img.createdAt
            }))
          : [];
        
        return {
          relationshipId: relationship._id,
          followerUser: {
            _id: relationship.maleUserId._id,
            name: `${relationship.maleUserId.firstName} ${relationship.maleUserId.lastName || ''}`,
            email: relationship.maleUserId.email,
            gender: relationship.maleUserId.gender,
            bio: relationship.maleUserId.bio,
            images: imageUrls,
            createdAt: relationship.maleUserId.createdAt,
          },
          dateFollowed: relationship.dateFollowed
        };
      }
    });

    return formattedList;
  } catch (error) {
    throw new Error(`Error getting followers list: ${error.message}`);
  }
};

module.exports = {
  getDetailedFollowingList,
  getDetailedFollowersList
};