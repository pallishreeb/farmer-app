// controllers/messageController.js

const Message = require('../models/query.model');
const Admin = require("../models/admin.model");
// Create a new message
exports.postMessage = async (req, res) => {
  try {
    const { sender, receiver, text,product } = req.body;
    const message = new Message({ sender, receiver,product, text });
    await message.save();
    res.status(201).json({ message: 'Message sent successfully', data: message });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// Get all messages between two users (buyer and farmer)
exports.getMessagesBetweenUsers = async (req, res) => {
  try {
    const { userId1, userId2 } = req.query;
    const messages = await Message.find({
      $or: [
        { sender: userId1, receiver: userId2 },
        { sender: userId2, receiver: userId1 },
      ],
    }).sort('timestamp').populate('product');
    res.status(200).json({ data: messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    const messageId = req.query.messageId;
    await Message.findByIdAndRemove(messageId);
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
};

//get all messages for a buyer or farmer by logged in user Id
exports.getMessageByUserID = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find all queries where the user is either the sender or receiver
    const queries = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    });

    // Extract unique receiver and sender IDs from the queries
    const userIds = [...new Set(queries.map((query) => query.sender.toString() !== userId ? query.sender.toString() : query.receiver.toString()))];
    // Fetch user details for the extracted user IDs
    const users = await Admin.find({ _id: { $in: userIds } });
    // Respond with the array of user IDs
    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
