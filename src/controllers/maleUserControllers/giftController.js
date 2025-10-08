const Gift = require('../../models/admin/Gift');
const MaleUser = require('../../models/maleUser/MaleUser');
const FemaleUser = require('../../models/femaleUser/FemaleUser');
const Transaction = require('../../models/common/Transaction');

// List available gifts (published)
exports.listGifts = async (req, res) => {
  try {
    const gifts = await Gift.find({ status: 'publish' }).sort({ coin: 1 });
    return res.json({ success: true, data: gifts });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Send a gift from logged-in male user to a female user
exports.sendGift = async (req, res) => {
  try {
    const { femaleUserId, giftId } = req.body;
    if (!femaleUserId || !giftId) {
      return res.status(400).json({ success: false, message: 'femaleUserId and giftId are required' });
    }

    const [male, female, gift] = await Promise.all([
      MaleUser.findById(req.user.id),
      FemaleUser.findById(femaleUserId),
      Gift.findById(giftId)
    ]);

    if (!male) return res.status(404).json({ success: false, message: 'Male user not found' });
    if (!female) return res.status(404).json({ success: false, message: 'Female user not found' });
    if (!gift || gift.status !== 'publish') {
      return res.status(400).json({ success: false, message: 'Invalid gift' });
    }

    const cost = gift.coin || 0;
    if ((male.coinBalance || 0) < cost) {
      return res.status(400).json({ success: false, message: 'You do not have enough coins to gift.' });
    }

    // Adjust balances
    male.coinBalance = (male.coinBalance || 0) - cost;
    female.coinBalance = (female.coinBalance || 0) + cost;

    await male.save();
    await female.save();

    // Record transactions for both users
    await Transaction.create({
      userType: 'male',
      userId: male._id,
      operationType: 'coin',
      action: 'debit',
      amount: cost,
      message: `Gift sent (${gift.giftTitle || 'gift'}) to ${female.email}`,
      balanceAfter: male.coinBalance,
      createdBy: male._id
    });
    await Transaction.create({
      userType: 'female',
      userId: female._id,
      operationType: 'coin',
      action: 'credit',
      amount: cost,
      message: `Gift received (${gift.giftTitle || 'gift'}) from ${male.email}`,
      balanceAfter: female.coinBalance,
      createdBy: male._id
    });

    return res.json({ success: true, message: 'Gift sent successfully.', data: { maleCoinBalance: male.coinBalance, femaleCoinBalance: female.coinBalance } });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};


