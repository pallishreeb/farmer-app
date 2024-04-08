// models/message.js

const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'admin', // Reference to the User model for sender
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'admin', // Reference to the User model for receiver
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'sellTrade', // Reference to the User model for receiver
  },
  contractFarming: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'farmingRequest', // Reference to the User model for receiver
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('query', querySchema);
