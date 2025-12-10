require('dotenv').config();
const connectDB = require('./src/config/db');
const PendingReward = require('./src/models/common/PendingReward');
const FemaleUser = require('./src/models/femaleUser/FemaleUser');
const DailyReward = require('./src/models/admin/DailyReward');

connectDB().then(async () => {
  console.log('Connected to database.');
  
  try {
    // Simulate the getPendingRewards API endpoint logic for daily rewards
    const type = 'daily';
    const filter = { status: 'pending', type };
    
    // Get all pending rewards first
    let pendingRewards = await PendingReward.find(filter)
      .populate('userId', 'name email walletBalance')
      .sort({ createdAt: -1 });
    
    console.log('All pending rewards from DB:');
    pendingRewards.forEach(r => {
      console.log(`  ${r.userId?.name}: wallet=${r.userId?.walletBalance}, earningValue=${r.earningValue}, rewardAmount=${r.rewardAmount}`);
    });
    
    // For daily rewards, filter out users who no longer qualify based on current wallet balance
    if (type === 'daily') {
      // Get all daily reward configurations
      const dailyRewards = await DailyReward.find().sort({ minWalletBalance: 1 });
      
      console.log('\nDaily reward configurations:');
      dailyRewards.forEach(r => {
        console.log(`  minWalletBalance=${r.minWalletBalance} -> rewardAmount=${r.rewardAmount}`);
      });
      
      pendingRewards = pendingRewards.filter(reward => {
        // Skip rewards for users with no user data
        if (!reward.userId) return false;
        
        // Find the appropriate reward rule for this reward amount
        const rewardRule = dailyRewards.find(rule => rule.rewardAmount === reward.rewardAmount);
        
        // If we can't find the rule, exclude this reward
        if (!rewardRule) return false;
        
        // Only include rewards where user's current wallet balance >= the reward rule's minimum threshold
        const qualifies = reward.userId.walletBalance >= rewardRule.minWalletBalance;
        console.log(`\nChecking if ${reward.userId?.name} qualifies:`);
        console.log(`  Current wallet: ${reward.userId.walletBalance}`);
        console.log(`  Required minimum: ${rewardRule.minWalletBalance}`);
        console.log(`  Qualifies: ${qualifies}`);
        return qualifies;
      });
    }
    
    console.log('\nFiltered pending rewards (what API should return):');
    console.log('=====================================');
    pendingRewards.forEach(r => {
      console.log(`  ${r.userId?.name}: wallet=${r.userId?.walletBalance}, earningValue=${r.earningValue}, rewardAmount=${r.rewardAmount}`);
    });
    
    console.log(`\nTotal rewards that should be returned: ${pendingRewards.length}`);
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    process.exit(0);
  }
});