require('dotenv').config();
const connectDB = require('./src/config/db');
const PendingReward = require('./src/models/common/PendingReward');
const FemaleUser = require('./src/models/femaleUser/FemaleUser');

connectDB().then(async () => {
  console.log('Connected to database.');
  
  try {
    const rewards = await PendingReward.find({type: 'daily', status: 'pending'})
      .populate('userId', 'name email walletBalance');
      
    console.log('Pending Daily Rewards from DB:');
    console.log('=====================================');
    rewards.forEach(r => {
      console.log(`  ${r.userId?.name}: wallet=${r.userId?.walletBalance}, earningValue=${r.earningValue}, rewardAmount=${r.rewardAmount}`);
    });
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    process.exit(0);
  }
});