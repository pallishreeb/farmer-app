const mongoose = require("mongoose");


const farmingRequestSchema = new mongoose.Schema(
  {
    location: { type: String, require: true },
    category: { type: String, require: true },
    commodity: { type: String, require: true },
    quality: { type: String, require: true },
    quantity: { type: String, require: true },
    deliveryTime: { type: String, require: true },
    buyerId: { 
      type:mongoose.Schema.Types.ObjectId,
      ref: 'admin'
    },
    farmersToRequest: [
      { 
        type:mongoose.Schema.Types.ObjectId,
        ref: 'admin'
      }
    ],
    farmersAccepted: [
      { 
        type:mongoose.Schema.Types.ObjectId,
        ref: 'admin'
      }
    ],
    farmersDelivered: [
      { 
        type:mongoose.Schema.Types.ObjectId,
        ref: 'admin'
      }
    ]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("farmingRequest", farmingRequestSchema);

