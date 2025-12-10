// Test script for reward system
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const DailyReward = require('./src/models/admin/DailyReward');
const WeeklyReward = require('./src/models/admin/WeeklyReward');
const PendingReward = require('./src/models/common/PendingReward');
const RewardHistory = require('./src/models/common/RewardHistory');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');

  try {
    // Clear existing test data
    await DailyReward.deleteMany({});
    await WeeklyReward.deleteMany({});
    await PendingReward.deleteMany({});
    await RewardHistory.deleteMany({});

    // Create sample daily rewards
    await DailyReward.create([
      { minEarning: 0, maxEarning: 50000, rewardAmount: 1000 },
      { minEarning: 50001, maxEarning: 100000, rewardAmount: 2000 },
      { minEarning: 100001, maxEarning: 999999999, rewardAmount: 3000 }
    ]);

    // Create sample weekly rewards
    await WeeklyReward.create([
      { rank: 1, rewardAmount: 50000 },
      { rank: 2, rewardAmount: 25000 },
      { rank: 3, rewardAmount: 10000 }
    ]);

    console.log('Sample reward data created successfully');

    // Display created data
    const dailyRewards = await DailyReward.find({});
    console.log('Daily Rewards:');
    console.log(dailyRewards);

    const weeklyRewards = await WeeklyReward.find({});
    console.log('Weekly Rewards:');
    console.log(weeklyRewards);

    mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err);
    mongoose.connection.close();
  }
});