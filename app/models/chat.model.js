const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    text: String,
    senderId: String,
    receiverId: String,
  },
   {
    timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);