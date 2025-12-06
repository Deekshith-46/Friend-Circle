const MaleUser = require('../../models/maleUser/MaleUser');
const FemaleUser = require('../../models/femaleUser/FemaleUser');
const CallHistory = require('../../models/common/CallHistory');
const Transaction = require('../../models/common/Transaction');

// End Call - Calculate coins, deduct from male, credit to female
exports.endCall = async (req, res) => {
  const { receiverId, duration, callType } = req.body;
  const callerId = req.user._id; // Authenticated male user

  try {
    // Validate input
    if (!receiverId || duration === undefined || duration === null) {
      return res.status(400).json({
        success: false,
        message: 'receiverId and duration are required'
      });
    }

    // Validate duration
    if (duration < 0) {
      return res.status(400).json({
        success: false,
        message: 'Duration cannot be negative'
      });
    }

    // If duration is 0 or very short (less than 1 second), no charges
    if (duration === 0) {
      const callRecord = await CallHistory.create({
        callerId,
        receiverId,
        duration: 0,
        coinsPerSecond: 0,
        totalCoins: 0,
        callType: callType || 'video',
        status: 'completed'
      });

      return res.json({
        success: true,
        message: 'Call ended (no charges for 0 duration)',
        data: {
          duration: 0,
          coinsDeducted: 0,
          coinsCredited: 0,
          callId: callRecord._id
        }
      });
    }

    // Get caller (male user) and receiver (female user)
    const caller = await MaleUser.findById(callerId);
    const receiver = await FemaleUser.findById(receiverId);

    if (!caller) {
      return res.status(404).json({
        success: false,
        message: 'Caller not found'
      });
    }

    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Receiver not found'
      });
    }

    // Get the per-second rate from female user
    const coinsPerSecond = receiver.coinsPerSecond || 2; // Default 2 if not set

    // Calculate total coins
    const totalCoins = Math.ceil(duration * coinsPerSecond);

    // Check if male user has sufficient balance
    if (caller.coinBalance < totalCoins) {
      // Record failed call due to insufficient coins
      const callRecord = await CallHistory.create({
        callerId,
        receiverId,
        duration,
        coinsPerSecond,
        totalCoins,
        callType: callType || 'video',
        status: 'insufficient_coins',
        errorMessage: `Insufficient coins. Required: ${totalCoins}, Available: ${caller.coinBalance}`
      });

      return res.status(400).json({
        success: false,
        message: 'Insufficient coins',
        data: {
          required: totalCoins,
          available: caller.coinBalance,
          shortfall: totalCoins - caller.coinBalance,
          callId: callRecord._id
        }
      });
    }

    // Deduct coins from male user
    caller.coinBalance -= totalCoins;
    await caller.save();

    // Credit coins to female user (wallet balance for withdrawal)
    receiver.walletBalance = (receiver.walletBalance || 0) + totalCoins;
    await receiver.save();

    // Create call history record
    const callRecord = await CallHistory.create({
      callerId,
      receiverId,
      duration,
      coinsPerSecond,
      totalCoins,
      callType: callType || 'video',
      status: 'completed'
    });

    // Create transaction records
    await Transaction.create({
      userType: 'male',
      userId: callerId,
      operationType: 'coin',
      action: 'debit',
      amount: totalCoins,
      message: `Video/Audio call with ${receiver.name || receiver.email} for ${duration} seconds`,
      balanceAfter: caller.coinBalance,
      createdBy: callerId,
      relatedId: callRecord._id,
      relatedModel: 'CallHistory'
    });

    await Transaction.create({
      userType: 'female',
      userId: receiverId,
      operationType: 'wallet',
      action: 'credit',
      amount: totalCoins,
      message: `Earnings from call with ${caller.name || caller.email} for ${duration} seconds`,
      balanceAfter: receiver.walletBalance,
      createdBy: receiverId,
      relatedId: callRecord._id,
      relatedModel: 'CallHistory'
    });

    // Return success response
    return res.json({
      success: true,
      message: 'Call ended successfully',
      data: {
        callId: callRecord._id,
        duration,
        coinsPerSecond,
        totalCoins,
        coinsDeducted: totalCoins,
        coinsCredited: totalCoins,
        callerRemainingBalance: caller.coinBalance,
        receiverNewBalance: receiver.walletBalance
      }
    });

  } catch (err) {
    console.error('Error ending call:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// Get call history for male user
exports.getCallHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 50, skip = 0 } = req.query;

    const calls = await CallHistory.find({ callerId: userId })
      .populate('receiverId', 'name email profilePicture')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await CallHistory.countDocuments({ callerId: userId });

    return res.json({
      success: true,
      data: calls,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip)
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// Get call statistics for male user
exports.getCallStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const stats = await CallHistory.aggregate([
      { $match: { callerId: userId, status: 'completed' } },
      {
        $group: {
          _id: null,
          totalCalls: { $sum: 1 },
          totalDuration: { $sum: '$duration' },
          totalCoinsSpent: { $sum: '$totalCoins' }
        }
      }
    ]);

    const result = stats.length > 0 ? stats[0] : {
      totalCalls: 0,
      totalDuration: 0,
      totalCoinsSpent: 0
    };

    return res.json({
      success: true,
      data: result
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
