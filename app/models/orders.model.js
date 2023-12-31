const mongoose = require('mongoose');

const orderSchema=new mongoose.Schema({
    deliveryLocation: { type: String, require: true },
    category: { type: String, require: true },
    commodity: { type: String, require: true },
    quality: { type: String, require: true },
    quantity: { type: String, require: true },
    deliveryTime: { type: String, require: true },
    status: { type: String,enum:["Placed", "Packing", "Shipping", "Delivered","Cancelled"],default:"Placed"},
    tradeId: { 
        type:mongoose.Schema.Types.ObjectId,
        ref: 'sellTrade'
      },
    buyerId: { 
      type:mongoose.Schema.Types.ObjectId,
      ref: 'admin'
    },
    farmer_id:{type:mongoose.Schema.Types.ObjectId,ref:"admin"}
})

const order =mongoose.model("order",orderSchema);

module.exports = order