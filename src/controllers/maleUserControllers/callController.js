const MaleUser = require('../../models/maleUser/MaleUser');
const FemaleUser = require('../../models/femaleUser/FemaleUser');
const CallHistory = require('../../models/common/CallHistory');
const Transaction = require('../../models/common/Transaction');
const AdminConfig = require('../../models/admin/AdminConfig');

// Start Call - Check minimum coins requirement and calculate max duration
exports.startCall = async (req, res) => {
  const { receiverId, callType } = req.body;
  const callerId = req.user._id; // Authenticated male user

  try {
    // Validate input
    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: 'receiverId is required'
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

    // Check if users follow each other (they are matched)
    const isCallerFollowing = caller.malefollowing && caller.malefollowing.includes(receiverId);
    const isReceiverFollowing = receiver.femalefollowing && receiver.femalefollowing.includes(callerId);
    
    if (!isCallerFollowing || !isReceiverFollowing) {
      return res.status(400).json({
        success: false,
        message: 'Both users must follow each other to start a call'
      });
    }

    // Check block list (no blocking between them)
    const isCallerBlocked = receiver.blockList && receiver.blockList.includes(callerId);
    const isReceiverBlocked = caller.blockList && caller.blockList.includes(receiverId);
    
    if (isCallerBlocked || isReceiverBlocked) {
      return res.status(400).json({
        success: false,
        message: 'Either user has blocked the other, cannot start call'
      });
    }

    // Get the per-second rate from female user
    const coinsPerSecond = receiver.coinsPerSecond || 2; // Default 2 if not set
    
    // Get minimum call coins setting from admin config
    const adminConfig = await AdminConfig.getConfig();
    const minCallCoins = adminConfig.minCallCoins || 60; // Default 60 if not set

    // Check minimum balance requirement
    if (caller.coinBalance < minCallCoins) {
      return res.status(400).json({
        success: false,
        message: `Minimum ${minCallCoins} coins required to start a call`,
        data: {
          available: caller.coinBalance,
          required: minCallCoins,
          shortfall: minCallCoins - caller.coinBalance
        }
      });
    }

    // Calculate maximum possible seconds
    const maxSeconds = Math.floor(caller.coinBalance / coinsPerSecond);

    // Check if user has enough coins for at least 1 second
    if (maxSeconds <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Not enough coins to start call',
        data: {
          available: caller.coinBalance,
          rate: coinsPerSecond,
          maxSeconds: 0
        }
      });
    }

    // Return success response with maxSeconds for frontend timer
    return res.json({
      success: true,
      message: 'Call can be started',
      data: {
        maxSeconds,
        coinsPerSecond,
        callerCoinBalance: caller.coinBalance,
        minCallCoins
      }
    });

  } catch (err) {
    console.error('Error starting call:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

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
    
    // Get minimum call coins setting from admin config
    const adminConfig = await AdminConfig.getConfig();
    const minCallCoins = adminConfig.minCallCoins || 60; // Default 60 if not set

    // Calculate maximum possible seconds based on current balance
    const maxSeconds = Math.floor(caller.coinBalance / coinsPerSecond);
    
    // Apply hard limit (safety) - billable seconds cannot exceed maxSeconds
    const billableSeconds = Math.min(duration, maxSeconds);
    
    // Calculate coins to charge based on billable seconds
    const coinsToCharge = billableSeconds * coinsPerSecond;
    
    // Additional safety check - ensure user has at least the coins to charge
    if (caller.coinBalance < coinsToCharge) {
      // Record failed call due to insufficient coins
      const callRecord = await CallHistory.create({
        callerId,
        receiverId,
        duration,
        coinsPerSecond,
        totalCoins: coinsToCharge,
        callType: callType || 'video',
        status: 'insufficient_coins',
        errorMessage: `Insufficient coins. Required: ${coinsToCharge}, Available: ${caller.coinBalance}`
      });

      return res.status(400).json({
        success: false,
        message: 'Insufficient coins',
        data: {
          required: coinsToCharge,
          available: caller.coinBalance,
          shortfall: coinsToCharge - caller.coinBalance,
          callId: callRecord._id
        }
      });
    }

    // Deduct coins from male user
    caller.coinBalance -= coinsToCharge;
    await caller.save();

    // Credit coins to female user (wallet balance for withdrawal)
    receiver.walletBalance = (receiver.walletBalance || 0) + coinsToCharge;
    await receiver.save();

    // Create call history record
    const callRecord = await CallHistory.create({
      callerId,
      receiverId,
      duration,
      coinsPerSecond,
      totalCoins: coinsToCharge,
      callType: callType || 'video',
      status: 'completed'
    });

    // Create transaction records
    await Transaction.create({
      userType: 'male',
      userId: callerId,
      operationType: 'coin',
      action: 'debit',
      amount: coinsToCharge,
      message: `Video/Audio call with ${receiver.name || receiver.email} for ${billableSeconds} seconds`,
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
      amount: coinsToCharge,
      message: `Earnings from call with ${caller.name || caller.email} for ${billableSeconds} seconds`,
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
        duration: billableSeconds,
        coinsPerSecond,
        totalCoins: coinsToCharge,
        coinsDeducted: coinsToCharge,
        coinsCredited: coinsToCharge,
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
