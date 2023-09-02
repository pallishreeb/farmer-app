const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const Message = require("../models/chat.model");
const app = express();

const server = http.createServer(app);
const io = socketIO(server);

let receivedMessages = [];

io.on("connection", (socket) => {
  console.log("A client connected.");
  socket.emit("initialMessages", receivedMessages);
  socket.on("message", async (data) => {
    const { message, senderId, receiverId } = data;
    console.log(`Received message: ${message}`);
    receivedMessages.push({ message, senderId, receiverId });
    try {
      const savedMessage = new Message({ text: message, senderId, receiverId });
      await savedMessage.save();
    } catch (error) {
      console.error("Error saving message to MongoDB:", error);
    }

    io.emit("message", { message, senderId, receiverId });
  });

  socket.on("disconnect", () => {
    console.log("A client disconnected.");
  });
});

exports.SendMessage = async (req, res) => {
  const { message, receiverId } = req.body;
  let senderId = req.user.id;
  if (!message || !receiverId) {
    return res
      .status(400)
      .json({ error: "Message or receiverId not provided." });
  }
  const savedMessage = new Message({ text: message, senderId, receiverId });
  savedMessage.save().catch((error) => {
    console.error("Error saving message to MongoDB:", error);
  });
  io.emit("message", { message, senderId, receiverId });
  receivedMessages.push({ message, senderId, receiverId });
  res.send({ MSG: "Message sent", Data: message });
};


exports.ReceivedMessage = async (req, res) => {
    try {
        const messages = await Message.find({}).exec();
        return res.status(200).json({ messages: messages.map((msg) => msg) });
      } catch (error) {
        console.error('Error retrieving messages from MongoDB:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
  };
  
  exports.MessagebysenderId = async (req, res) => {
    const { senderId } = req.params;
    try {
      const messages = await Message.find({ senderId: senderId }).exec();
      console.log(messages,'messages')
      return res.status(200).json({ messages: messages.map((msg) => msg) });
    } catch (error) {

      console.error('Error retrieving messages from MongoDB:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  exports.MessagebyreceiverId = async (req, res) => {
    const { receiverId } = req.params;
    try {
      const messages = await Message.find({ receiverId: receiverId }).exec();
      console.log(messages,'messages')
      return res.status(200).json({ messages: messages.map((msg) => msg) });
    } catch (error) {

      console.error('Error retrieving messages from MongoDB:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };