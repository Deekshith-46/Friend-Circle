const FemaleUser = require('../../models/femaleUser/FemaleUser');
const Transaction = require('../../models/common/Transaction');
const CallHistory = require('../../models/common/CallHistory');
const GiftReceived = require('../../models/femaleUser/GiftReceived');

// Get female user statistics
exports.getFemaleUserStats = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    
    // Get user data
    const user = await FemaleUser.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Calculate today's start and end times
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    // Calculate week's start and end times (Monday to Sunday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)); // Adjust for Sunday
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Get all transactions for this user
    const transactions = await Transaction.find({ 
      userId: userId,
      userType: 'female',
      action: 'credit'
    });

    // Calculate call earnings
    const callEarningsTransactions = transactions.filter(t => t.earningType === 'call');
    const callEarning = callEarningsTransactions.reduce((sum, t) => sum + t.amount, 0);

    // Calculate gift earnings
    const giftEarningsTransactions = transactions.filter(t => t.earningType === 'gift');
    const giftEarning = giftEarningsTransactions.reduce((sum, t) => sum + t.amount, 0);

    // Calculate other earnings
    const otherEarningsTransactions = transactions.filter(t => t.earningType === 'other');
    const otherEarning = otherEarningsTransactions.reduce((sum, t) => sum + t.amount, 0);

    // Calculate today's earnings
    const todayTransactions = transactions.filter(t => 
      t.createdAt >= startOfDay && t.createdAt < endOfDay
    );
    const todayEarning = todayTransactions.reduce((sum, t) => sum + t.amount, 0);

    // Calculate this week's earnings
    const weekTransactions = transactions.filter(t => 
      t.createdAt >= startOfWeek && t.createdAt <= endOfWeek
    );
    const weekEarning = weekTransactions.reduce((sum, t) => sum + t.amount, 0);

    // Return the stats
    return res.json({
      success: true,
      data: {
        totalOnlineTime: user.totalOnlineMinutes || 0,
        missedCalls: user.missedCalls || 0,
        weekEarning: weekEarning,
        todayEarning: todayEarning,
        callEarning: callEarning,
        giftEarning: giftEarning,
        otherEarning: otherEarning,
        walletBalance: user.walletBalance || 0
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Increment missed calls for a female user
exports.incrementMissedCalls = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    
    const user = await FemaleUser.findByIdAndUpdate(
      userId,
      { $inc: { missedCalls: 1 } },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    return res.json({
      success: true,
      message: 'Missed calls incremented',
      data: {
        missedCalls: user.missedCalls
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};