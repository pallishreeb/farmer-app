const mongoose = require("mongoose");


const farmingRequestSchema = new mongoose.Schema(
  {
    location: { type: String, require: true },
    category: { type: String, require: true },
    commodity: { type: String, require: true },
    quality: { type: String, require: true },
    quantity: { type: Number, require: true },
    deliveryTime: { type: String, require: true },
    buyerId: { 
      type:mongoose.Schema.Types.ObjectId,
      ref: 'Users'
    },
    farmersToRequest: [
      { 
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Users'
      }
    ],
    farmersAccepted: [
      { 
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Users'
      }
    ],
    farmersDelivered: [
      { 
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Users'
      }
    ]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("farmingRequest", farmingRequestSchema);

