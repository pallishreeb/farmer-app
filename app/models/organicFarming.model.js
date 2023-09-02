const mongoose = require('mongoose');

const organicFarmingSchema = mongoose.Schema({
    soilType:{type:String,require:true,enum:["Alluvial Soil", "Black Soil", "Forest Soil", "Other"]},
    landType:{type:String,require:true,enum:["Irrigated Land", "Non-Irrigated Land"]},
    organicFarmType:{type:String,require:true,enum:["Integrated Organic Farming", "Crop Rotation", "Soil Management", "Compost Farming"]},
    organicFarmingMethod:{type:String,require:true,enum:["Weed Management", "Compost Management", "Bio Pest Control", "Green Manure"]},
    farmer_id:{type:mongoose.Schema.Types.ObjectId, ref:"Users"}
}, {
    timestamps: true
});

module.exports = mongoose.model('organicFarming', organicFarmingSchema);