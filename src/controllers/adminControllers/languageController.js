const Language = require('../../models/admin/Language');
const createAuditLog = require('../../utils/createAuditLog');
const getUserId = require('../../utils/getUserId');

exports.createLanguage = async (req, res) => {
  try {
    const { title, status } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    const userId = getUserId(req);

    const language = await Language.create({
      title,
      imageUrl,
      status,
      createdBy: userId
    });

    await createAuditLog(userId, 'CREATE', 'Language', language._id, { title, status, imageUrl });

    res.status(201).json({ success: true, data: language });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAllLanguages = async (req, res) => {
  try {
    const languages = await Language.find();
    res.json({ success: true, data: languages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateLanguage = async (req, res) => {
  try {
    const { title, status } = req.body;
    const updateData = { title, status };
    if (req.file) updateData.imageUrl = req.file.path;

    const userId = getUserId(req);

    const language = await Language.findByIdAndUpdate(req.params.id, updateData, { new: true });

    await createAuditLog(userId, 'UPDATE', 'Language', language._id, updateData);

    res.json({ success: true, data: language });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteLanguage = async (req, res) => {
  try {
    const language = await Language.findByIdAndDelete(req.params.id);
    const userId = getUserId(req);
    
    await createAuditLog(userId, 'DELETE', 'Language', language._id, { title: language.title });
    res.json({ success: true, message: 'Language deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
