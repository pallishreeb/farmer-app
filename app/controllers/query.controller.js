// controllers/messageController.js

const Message = require('../models/query.model');
const Admin = require("../models/admin.model");
// Create a new message
exports.postMessage = async (req, res) => {
  try {
    const { sender, receiver, text,product,contractFarming } = req.body;
    console.log(contractFarming,product)
    let message;
    if(product !== ""){
       message = new Message({ sender, receiver,product, text });
    }else{
      message = new Message({ sender, receiver,contractFarming, text });
    }

    await message.save();
    res.status(201).json({ message: 'Message sent successfully', data: message });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};
// Get all messages for admin with unique sender
// Get all messages for admin with unique sender
exports.getMessages = async (req, res) => {
  try {
    const uniqueSenders = await Message.aggregate([
      {
        $sort: { timestamp: -1 } // Sort messages by timestamp in descending order
      },
      {
        $group: {
          _id: "$sender", // Group by sender
          message: { $first: "$$ROOT" } // Get the first (latest) document for each sender
        }
      },
      {
        $lookup: {
          from: "admins", // Collection name for admins
          localField: "_id",
          foreignField: "_id",
          as: "senderDetails" // Store admin details in senderDetails field
        }
      },
      {
        $match: {
          "senderDetails.userType": { $ne: "admin" } // Filter messages where sender is not an admin
        }
      },
      {
        $replaceRoot: { newRoot: "$message" } // Replace the root with the original document
      }
    ]).exec(); // Use exec() to return a promise
    

    // Populate sender field with admin details
    const populatedMessages = await Message.populate(uniqueSenders, { path: 'sender' });

    res.status(200).json({ data: populatedMessages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
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
    }).sort('timestamp').populate('product').populate('contractFarming');
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
    }).populate('contractFarming').populate('product');

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

//get all messages for a buyer or farmer by logged in user Id
exports.getMessageByUserIDAdmin = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find all queries where the user is either the sender or receiver
    const queries = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    }).populate('contractFarming').populate('product');

    const user = await Admin.find({ _id: userId });
    // Respond with the array of user IDs
    res.status(200).json({ user,queries });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
