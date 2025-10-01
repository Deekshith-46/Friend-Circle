const Gift = require('../../models/admin/Gift');
const createAuditLog = require('../../utils/createAuditLog');
const getUserId = require('../../utils/getUserId');

exports.createGift = async (req, res) => {
  try {
    const { coin, status } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    const userId = getUserId(req);
    const gift = await Gift.create({ coin, status, imageUrl, createdBy: userId });

    await createAuditLog(userId, 'CREATE', 'Gift', gift._id, { coin, status, imageUrl });

    res.status(201).json({ success: true, data: gift });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAllGifts = async (req, res) => {
  try {
    const gifts = await Gift.find();
    res.json({ success: true, data: gifts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateGift = async (req, res) => {
  try {
    const { coin, status } = req.body;
    const updateData = { coin, status };
    if (req.file) updateData.imageUrl = req.file.path;

    const userId = getUserId(req);
    const gift = await Gift.findByIdAndUpdate(req.params.id, updateData, { new: true });

    await createAuditLog(userId, 'UPDATE', 'Gift', gift._id, updateData);

    res.json({ success: true, data: gift });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteGift = async (req, res) => {
  try {
    const gift = await Gift.findByIdAndDelete(req.params.id);
    const userId = getUserId(req);
    await createAuditLog(userId, 'DELETE', 'Gift', gift._id, { giftTitle: gift.giftTitle });
    res.json({ success: true, message: 'Gift deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
