const Chat = require('../../models/maleUser/Chat');

// Send a message
exports.sendMessage = async (req, res) => {
  const { receiver, message, media, isVoiceNote, isDisappearing } = req.body;

  try {
    const newMessage = new Chat({
      sender: req.user.id,  // Sender is the logged-in male user
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

// Get chat history
exports.getChatHistory = async (req, res) => {
  const { receiverId } = req.query;

  if (!receiverId) {
    return res.status(400).json({ success: false, message: 'Receiver ID is required' });
  }

  try {
    const chats = await Chat.find({
      $or: [
        { sender: req.user.id, receiver: receiverId },
        { sender: receiverId, receiver: req.user.id }
      ]
    }).sort('sentAt');  // Sort by sent time

    res.json({ success: true, data: chats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
