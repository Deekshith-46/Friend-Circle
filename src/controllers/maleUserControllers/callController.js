const MaleUser = require('../../models/maleUser/MaleUser');
const FemaleUser = require('../../models/femaleUser/FemaleUser');
const CallHistory = require('../../models/common/CallHistory');
const Transaction = require('../../models/common/Transaction');
const AdminConfig = require('../../models/admin/AdminConfig');
const MaleFollowing = require('../../models/maleUser/Following');
const FemaleFollowing = require('../../models/femaleUser/Following');
const messages = require('../../validations/messages');

// Start Call - Check minimum coins requirement and calculate max duration
exports.startCall = async (req, res) => {
  const { receiverId, callType } = req.body;
  const callerId = req.user._id; // Authenticated male user

  try {
    // Validate input
    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: messages.CALL.RECEIVER_REQUIRED
      });
    }

    // Get caller (male user) and receiver (female user)
    const caller = await MaleUser.findById(callerId);
    const receiver = await FemaleUser.findById(receiverId);

    if (!caller) {
      return res.status(404).json({
        success: false,
        message: messages.CALL.CALLER_NOT_FOUND
      });
    }

    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: messages.CALL.RECEIVER_NOT_FOUND
      });
    }

    // Check if users follow each other (they are matched)
    // We need to check the actual following collections, not just the arrays in user documents
    const isCallerFollowing = await MaleFollowing.findOne({ 
      maleUserId: callerId, 
      femaleUserId: receiverId 
    });
    
    const isReceiverFollowing = await FemaleFollowing.findOne({ 
      femaleUserId: receiverId, 
      maleUserId: callerId 
    });
    
    if (!isCallerFollowing || !isReceiverFollowing) {
      return res.status(400).json({
        success: false,
        message: messages.CALL.FOLLOW_EACH_OTHER
      });
    }

    // Check block list (no blocking between them)
    const isCallerBlocked = receiver.blockList && receiver.blockList.includes(callerId);
    const isReceiverBlocked = caller.blockList && caller.blockList.includes(receiverId);
    
    if (isCallerBlocked || isReceiverBlocked) {
      return res.status(400).json({
        success: false,
        message: messages.CALL.BLOCKED_CANNOT_CALL
      });
    }

    // Get admin config
    const adminConfig = await AdminConfig.getConfig();
    
    // Validate admin margins per minute are configured
    if (adminConfig.marginAgencyPerMinute === undefined || adminConfig.marginAgencyPerMinute === null) {
      return res.status(400).json({
        success: false,
        message: 'Admin margin per minute for agency females not configured'
      });
    }
    
    if (adminConfig.marginNonAgencyPerMinute === undefined || adminConfig.marginNonAgencyPerMinute === null) {
      return res.status(400).json({
        success: false,
        message: 'Admin margin per minute for non-agency females not configured'
      });
    }
    
    // Get female earning rate per minute and convert to per second
    if (!receiver.coinsPerMinute) {
      return res.status(400).json({
        success: false,
        message: 'Female call rate not set'
      });
    }
    
    const femaleEarningPerSecond = receiver.coinsPerMinute / 60;
    
    // Determine if female belongs to agency
    const isAgencyFemale = receiver.referredByAgency && receiver.referredByAgency.length > 0;
    
    // Get platform margin per minute and convert to per second
    const platformMarginPerMinute = isAgencyFemale 
      ? adminConfig.marginAgencyPerMinute
      : adminConfig.marginNonAgencyPerMinute;
    
    const platformMarginPerSecond = platformMarginPerMinute / 60;
    
    // Calculate male pay rate per second
    const malePayPerSecond = femaleEarningPerSecond + platformMarginPerSecond;
    
    // Get minimum call coins setting from admin config
    if (adminConfig.minCallCoins === undefined || adminConfig.minCallCoins === null) {
      return res.status(400).json({
        success: false,
        message: 'Minimum call coins not configured by admin'
      });
    }
    const minCallCoins = adminConfig.minCallCoins;

    // Check if user can afford at least 1 second of the call
    if (caller.coinBalance < malePayPerSecond) {
      return res.status(400).json({
        success: false,
        message: messages.CALL.NOT_ENOUGH_COINS,
        data: {
          available: caller.coinBalance,
          required: malePayPerSecond,
          shortfall: malePayPerSecond - caller.coinBalance
        }
      });
    }

    // Calculate maximum possible seconds based on male's balance and the total rate
    const maxSeconds = Math.floor(caller.coinBalance / malePayPerSecond);

    // Check if user has enough coins for at least 1 second
    if (maxSeconds <= 0) {
      return res.status(400).json({
        success: false,
        message: messages.CALL.NOT_ENOUGH_COINS,
        data: {
          available: caller.coinBalance,
          femaleEarningPerSecond,
          platformMarginPerSecond,
          malePayPerSecond,
          maxSeconds: 0
        }
      });
    }

    // Return success response with maxSeconds for frontend timer
    return res.json({
      success: true,
      message: messages.CALL.CALL_CAN_START,
      data: {
        maxSeconds,
        femaleEarningPerSecond,
        platformMarginPerSecond,
        malePayPerSecond,
        callerCoinBalance: caller.coinBalance,
        minCallCoins,
        isAgencyFemale
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
        message: messages.CALL.DURATION_REQUIRED
      });
    }

    // Validate duration
    if (duration < 0) {
      return res.status(400).json({
        success: false,
        message: messages.CALL.DURATION_NEGATIVE
      });
    }

    // Get caller (male user) and receiver (female user)
    const caller = await MaleUser.findById(callerId);
    const receiver = await FemaleUser.findById(receiverId);

    if (!caller || !receiver) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Determine if female belongs to agency (needed for zero duration calls)
    const isAgencyFemale = receiver.referredByAgency && receiver.referredByAgency.length > 0;
    
    // If duration is 0 or very short (less than 1 second), no charges
    if (duration === 0) {
      const callRecord = await CallHistory.create({
        callerId,
        receiverId,
        duration: 0,
        femaleEarningPerMinute: receiver.coinsPerMinute,
        platformMarginPerMinute: platformMarginPerMinute,
        femaleEarningPerSecond: 0,
        platformMarginPerSecond: 0,
        totalCoins: 0,
        femaleEarning: 0,
        platformMargin: 0,
        adminEarned: 0,
        agencyEarned: 0,
        isAgencyFemale,
        callType: callType || 'video',
        status: 'completed'
      });

      return res.json({
        success: true,
        message: messages.CALL.CALL_NO_CHARGES,
        data: {
          duration: 0,
          coinsDeducted: 0,
          coinsCredited: 0,
          callId: callRecord._id
        }
      });
    }

    // Get admin config
    const adminConfig = await AdminConfig.getConfig();
    
    // Validate admin margins per minute are configured
    if (adminConfig.marginAgencyPerMinute === undefined || adminConfig.marginAgencyPerMinute === null) {
      return res.status(400).json({
        success: false,
        message: 'Admin margin per minute for agency females not configured'
      });
    }
    
    if (adminConfig.marginNonAgencyPerMinute === undefined || adminConfig.marginNonAgencyPerMinute === null) {
      return res.status(400).json({
        success: false,
        message: 'Admin margin per minute for non-agency females not configured'
      });
    }
    
    // Get female earning rate per minute and convert to per second
    if (!receiver.coinsPerMinute) {
      return res.status(400).json({
        success: false,
        message: 'Female call rate not set'
      });
    }
    
    const femaleEarningPerSecond = receiver.coinsPerMinute / 60;
    
    // Get platform margin per minute and convert to per second (isAgencyFemale already defined above)
    const platformMarginPerMinute = isAgencyFemale 
      ? adminConfig.marginAgencyPerMinute
      : adminConfig.marginNonAgencyPerMinute;
    
    const platformMarginPerSecond = platformMarginPerMinute / 60;
    
    // Calculate male pay rate per second
    const malePayPerSecond = femaleEarningPerSecond + platformMarginPerSecond;
    
    // Get minimum call coins setting from admin config
    if (adminConfig.minCallCoins === undefined || adminConfig.minCallCoins === null) {
      return res.status(400).json({
        success: false,
        message: 'Minimum call coins not configured by admin'
      });
    }
    const minCallCoins = adminConfig.minCallCoins;

    // Calculate maximum possible seconds based on current balance
    const maxSeconds = Math.floor(caller.coinBalance / malePayPerSecond);
    
    // Check if user has enough coins for the requested duration
    // If not, reject the call entirely rather than adjusting the duration
    const requestedMalePay = duration * malePayPerSecond;
    
    if (caller.coinBalance < requestedMalePay) {
      // For failed calls, no earnings should be recorded
      const adminEarned = 0;
      const agencyEarned = 0;
      const femaleEarning = 0;
      const platformMargin = 0;
      
      // Record failed call attempt (no earnings generated)
      const callRecord = await CallHistory.create({
        callerId,
        receiverId,
        duration,
        femaleEarningPerMinute: receiver.coinsPerMinute,
        platformMarginPerMinute: platformMarginPerMinute,
        femaleEarningPerSecond,
        platformMarginPerSecond,
        totalCoins: 0, // No coins actually spent
        femaleEarning,
        platformMargin,
        adminEarned,
        agencyEarned,
        isAgencyFemale,
        callType: callType || 'video',
        status: 'insufficient_coins',
        errorMessage: `Insufficient coins. Required: ${requestedMalePay}, Available: ${caller.coinBalance}`
      });

      return res.status(400).json({
        success: false,
        message: messages.CALL.INSUFFICIENT_COINS,
        data: {
          required: requestedMalePay,
          available: caller.coinBalance,
          shortfall: requestedMalePay - caller.coinBalance,
          callId: callRecord._id
        }
      });
    }
    
    // If we get here, user has enough coins for the full duration
    const billableSeconds = duration;
    
    // Calculate amounts for each party
    const femaleEarning = billableSeconds * femaleEarningPerSecond;
    const platformMargin = billableSeconds * platformMarginPerSecond;
    const malePay = femaleEarning + platformMargin;
    
    // Deduct coins from male user
    caller.coinBalance -= malePay;
    await caller.save();

    // Credit earnings to female user's wallet balance (real money she can withdraw)
    receiver.walletBalance = (receiver.walletBalance || 0) + femaleEarning;
    await receiver.save();

    // Calculate admin and agency shares from platform margin
    let adminEarned = 0;
    let agencyEarned = 0;
    
    if (isAgencyFemale) {
      // For agency females, split the platform margin
      if (adminConfig.adminSharePercentage === undefined || adminConfig.adminSharePercentage === null) {
        return res.status(400).json({
          success: false,
          message: 'Admin share percentage not configured'
        });
      }
      const adminShare = Math.round(platformMargin * adminConfig.adminSharePercentage / 100);
      const agencyShare = platformMargin - adminShare;
      adminEarned = adminShare;
      agencyEarned = agencyShare;
    } else {
      // For non-agency females, all platform margin goes to admin
      adminEarned = platformMargin;
      agencyEarned = 0;
    }
    
    // Create call history record
    const callRecord = await CallHistory.create({
      callerId,
      receiverId,
      duration: billableSeconds,
      femaleEarningPerMinute: receiver.coinsPerMinute,
      platformMarginPerMinute: platformMarginPerMinute,
      femaleEarningPerSecond,
      platformMarginPerSecond,
      totalCoins: malePay,
      femaleEarning,
      platformMargin,
      adminEarned,
      agencyEarned,
      isAgencyFemale,
      callType: callType || 'video',
      status: 'completed'
    });

    // Create transaction records
    await Transaction.create({
      userType: 'male',
      userId: callerId,
      operationType: 'coin',
      action: 'debit',
      amount: malePay,
      message: `Video/Audio call with ${receiver.name || receiver.email} for ${billableSeconds} seconds (Female earning: ${femaleEarning}, Platform margin: ${platformMargin})`,
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
      amount: femaleEarning,
      earningType: 'call',
      message: `Earnings from call with ${caller.name || caller.email} for ${billableSeconds} seconds`,
      balanceAfter: receiver.walletBalance,
      createdBy: receiverId,
      relatedId: callRecord._id,
      relatedModel: 'CallHistory'
    });

    // Create transaction for admin revenue tracking (not a wallet credit)
    // We'll skip creating a transaction for admin revenue to avoid validation issues
    // Admin revenue is tracked in the call history record instead
    // Future enhancement: create separate admin revenue tracking model
    
    // Create transaction for agency commission and update agency wallet (if applicable)
    if (agencyEarned > 0 && receiver.referredByAgency && receiver.referredByAgency.length > 0) {
      const agencyUserId = receiver.referredByAgency[0]; // Get first agency
      
      // Update agency wallet balance
      const AgencyUser = require('../../models/agency/AgencyUser');
      const agency = await AgencyUser.findById(agencyUserId);
      if (agency) {
        agency.walletBalance = (agency.walletBalance || 0) + agencyEarned;
        await agency.save();
      }
      
      await Transaction.create({
        userType: 'agency',
        userId: agencyUserId,
        operationType: 'wallet',
        action: 'credit',
        amount: agencyEarned,
        earningType: 'call',
        message: `Agency commission from call between ${caller.name || caller.email} and ${receiver.name || receiver.email} for ${billableSeconds} seconds`,
        balanceAfter: agency ? agency.walletBalance : 0, // Agency wallet balance after update
        createdBy: callerId,
        relatedId: callRecord._id,
        relatedModel: 'CallHistory'
      });
    }

    // Return success response
    return res.json({
      success: true,
      message: messages.CALL.CALL_ENDED_SUCCESS,
      data: {
        callId: callRecord._id,
        duration: billableSeconds,
        femaleEarningPerSecond,
        platformMarginPerSecond,
        totalCoins: malePay,
        coinsDeducted: malePay,
        femaleEarning,
        platformMargin,
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
