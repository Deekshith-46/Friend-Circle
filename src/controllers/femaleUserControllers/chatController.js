// /controllers/femaleUserControllers/chatController.js
const Chat = require('../../models/femaleUser/Chat');

// Send Message (text, image, video, etc.)
exports.sendMessage = async (req, res) => {
  const { receiver, message, media, isVoiceNote, isDisappearing } = req.body;
  try {
    const newMessage = new Chat({
      sender: req.user.id,
      receiver,
      message,
      media,
      isVoiceNote,
      isDisappearing
    });
    await newMessage.save();
    res.json({ success: true, data: newMessage });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get Chat History
exports.getChatHistory = async (req, res) => {
  const { receiver } = req.query;
  if (!receiver) {
    return res.status(400).json({ success: false, message: 'Receiver ID is required' });
  }
  try {
    const chats = await Chat.find({
      $or: [
        { sender: req.user.id, receiver },
        { sender: receiver, receiver: req.user.id }
      ]
    }).sort('sentAt');
    res.json({ success: true, data: chats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
