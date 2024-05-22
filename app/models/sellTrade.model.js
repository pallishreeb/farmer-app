const mongoose = require('mongoose');

const sellTradeSchema=new mongoose.Schema({
    pickuplocation:{type:String},
    category:{type:String, },
    product:{type:String},
    variety:{type:String},
    grade:{type:String},
    username:{type:String},
    price:{type:Number,default:0},
    quantity:{type:String,default:0},
    priceQuantityUnit:{type:String},
    Date:{type:String},
    image: [],
    availableFromDate: { type:String }, // Field for the start date of availability
    availableToDate: { type:String },   // Field for the end date of availability
    farmer_id:{type:mongoose.Schema.Types.ObjectId,ref:"admin"}
})

const sellTrade=mongoose.model("sellTrade",sellTradeSchema);

module.exports = sellTrade