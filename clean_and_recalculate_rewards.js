require('dotenv').config();
const connectDB = require('./src/config/db');
const PendingReward = require('./src/models/common/PendingReward');
const FemaleUser = require('./src/models/femaleUser/FemaleUser');
const rewardCalculator = require('./src/utils/rewardCalculator');

connectDB().then(async () => {
  console.log('Connected to database.');
  
  try {
    // First, let's clean up existing pending rewards
    console.log('Cleaning up existing pending rewards...');
    const deletedRewards = await PendingReward.deleteMany({type: 'daily', status: 'pending'});
    console.log(`Deleted ${deletedRewards.deletedCount} pending daily rewards.`);
    
    // Now let's trigger the daily rewards calculation again
    console.log('Triggering daily rewards calculation...');
    const result = await rewardCalculator.calculateDailyRewards();
    console.log('Daily rewards calculation result:', result);
    
    // Let's check what pending rewards were created
    console.log('\nChecking newly created pending rewards...');
    const rewards = await PendingReward.find({type: 'daily'})
      .sort({createdAt: -1})
      .limit(10)
      .populate('userId', 'name email walletBalance');
      
    console.log('\nNewly Created Pending Daily Rewards:');
    console.log('=====================================');
    let validRewards = 0;
    let invalidRewards = 0;
    
    rewards.forEach(reward => {
      if (reward.userId?.walletBalance > 0) {
        console.log(`✓ User: ${reward.userId?.name} (${reward.userId?.email})`);
        console.log(`  Wallet Balance: ${reward.userId?.walletBalance}`);
        console.log(`  Earning Value: ${reward.earningValue}`);
        console.log(`  Reward Amount: ${reward.rewardAmount}`);
        console.log(`  Status: ${reward.status}`);
        console.log('-------------------------------------');
        validRewards++;
      } else {
        console.log(`✗ User: ${reward.userId?.name} (${reward.userId?.email})`);
        console.log(`  Wallet Balance: ${reward.userId?.walletBalance} (INVALID - should not receive rewards)`);
        console.log(`  Earning Value: ${reward.earningValue}`);
        console.log(`  Reward Amount: ${reward.rewardAmount}`);
        console.log(`  Status: ${reward.status}`);
        console.log('-------------------------------------');
        invalidRewards++;
      }
    });
    
    console.log(`\nSummary:`);
    console.log(`  Valid rewards (wallet > 0): ${validRewards}`);
    console.log(`  Invalid rewards (wallet <= 0): ${invalidRewards}`);
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    process.exit(0);
  }
});