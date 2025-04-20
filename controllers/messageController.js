const Message = require('../models/Message');

// Create new message (Contact Us submission)
exports.sendMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const newMessage = new Message({ name, email, message });
    await newMessage.save();

    res.status(201).json({ success: true, message: 'Message sent successfully.' });
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: 'Failed to send message.' });
  }
};

// Get all messages (for admin panel)
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Failed to fetch messages.' });
  }
};

// Mark a message as responded
exports.markResponded = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Message.findByIdAndUpdate(id, { responded: true }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Message not found' });

    res.status(200).json({ success: true, message: 'Marked as responded.' });
  } catch (err) {
    console.error('Error updating message:', err);
    res.status(500).json({ error: 'Failed to update message.' });
  }
};
