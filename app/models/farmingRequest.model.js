const mongoose = require("mongoose");


const farmingRequestSchema = new mongoose.Schema(
  {
    location: { type: String, require: true },
    category: { type: String, require: true },
    commodity: { type: String, require: true },
    quality: { type: String, require: true },
    quantity: { type: String, require: true },
    deliveryTime: { type: String, require: true },
    price: { type: String },
    isApproved: { type: Boolean, default:false },
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
    ],
    image: [],
    priceQuantityUnit: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("farmingRequest", farmingRequestSchema);

