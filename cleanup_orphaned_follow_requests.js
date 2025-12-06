/**
 * Migration script to clean up orphaned follow request records
 * This script removes follow request records that don't have corresponding following relationships
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Load models
const FollowRequest = require('./src/models/common/FollowRequest');
const MaleFollowing = require('./src/models/maleUser/Following');
const FemaleFollowing = require('./src/models/femaleUser/Following');

// Connect to MongoDB
const connectDB = require('./src/config/db');

async function cleanupOrphanedFollowRequests() {
  try {
    await connectDB();
    console.log('Connected to database');
    
    // Find all accepted follow requests
    const acceptedRequests = await FollowRequest.find({ status: 'accepted' });
    console.log(`Found ${acceptedRequests.length} accepted follow requests`);
    
    let cleanedCount = 0;
    
    // Check each accepted request to see if the relationship actually exists
    for (const request of acceptedRequests) {
      let relationshipExists = false;
      
      // Check if it's a male following female
      if (request.maleUserId && request.femaleUserId) {
        const maleFollowing = await MaleFollowing.findOne({
          maleUserId: request.maleUserId,
          femaleUserId: request.femaleUserId
        });
        
        if (maleFollowing) {
          relationshipExists = true;
        }
      }
      
      // If no relationship exists, delete the orphaned follow request
      if (!relationshipExists) {
        await FollowRequest.deleteOne({ _id: request._id });
        console.log(`Deleted orphaned follow request: ${request._id}`);
        cleanedCount++;
      }
    }
    
    console.log(`Cleaned up ${cleanedCount} orphaned follow request records`);
    console.log('Cleanup completed successfully');
    
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the cleanup if this script is executed directly
if (require.main === module) {
  cleanupOrphanedFollowRequests();
}

module.exports = cleanupOrphanedFollowRequests;