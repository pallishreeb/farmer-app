const mongoose = require('mongoose');

const RaisequerySchema = mongoose.Schema({
    buyer_username:{require:true,type:String},
    minimum_order_quantity:{require:true,type:Number},
    harvesting_time :{require:true,type:String},
    delivery_date_time :{require:true,type:String},
    product_delivered_states :{require:true,type:String},
    urgent_order_time:{require:true,type:String},
    status:{type:String,enum:["Pending","Success"],default: "Pending",},

}, {
    timestamps: true
});

module.exports = mongoose.model('Raisequery', RaisequerySchema);