const rewardCalculator = require('../utils/rewardCalculator');

/**
 * Manual reward calculation script
 * This can be run via command line or scheduled task
 */

const runDailyRewards = async () => {
  console.log('Starting daily rewards calculation...');
  const result = await rewardCalculator.calculateDailyRewards();
  console.log('Daily rewards calculation result:', result);
};

const runWeeklyRewards = async () => {
  console.log('Starting weekly rewards calculation...');
  const result = await rewardCalculator.calculateWeeklyRewards();
  console.log('Weekly rewards calculation result:', result);
};

// Check command line arguments
const args = process.argv.slice(2);

if (args.includes('--daily')) {
  runDailyRewards();
} else if (args.includes('--weekly')) {
  runWeeklyRewards();
} else {
  console.log('Usage: node rewardJob.js [--daily|--weekly]');
  console.log('  --daily: Calculate daily rewards for all users');
  console.log('  --weekly: Calculate weekly rewards for all users');
}