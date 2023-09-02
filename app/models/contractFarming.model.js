const mongoose = require('mongoose');

const contractFarmingSchema = mongoose.Schema({
    soilType:{type:String,require:true,enum:["Alluvial Soil", "Black Soil", "Forest Soil", "Other"]},
    cropQuantity:{type:Number,require:true} ,      
    farmer_id:{type:mongoose.Schema.Types.ObjectId,ref:"Users"}
}, {
    timestamps: true
});

module.exports = mongoose.model('contractFarming', contractFarmingSchema);