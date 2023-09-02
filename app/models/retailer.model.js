const mongoose = require('mongoose');

const retailerSchema = mongoose.Schema({
    fullName:{type:String,require:true},
    farmName:{type:String,require:true},
    farmAddress:{type:String,require:true},
    city:{type:String,require:true},
    state:{type:String,require:true},
    landmark:{type:String,require:true},
    pincode:{type:Number,require:true},
    phone:{type:Number,require:true},
    profilePicture:{type:Array,require:true},
    userType:{type:String,default:"retailer"}
}, {
    timestamps: true
});

module.exports = mongoose.model('Retailer', retailerSchema);