const mongoose = require('mongoose');

const regulerFarmingSchema = mongoose.Schema({
    soilType:{type:String,require:true,enum:["Alluvial Soil", "Black Soil", "Forest Soil", "Other"]},
    regulerFarmingType:{type:String,require:true,enum:["Horticulture", "Floriculture", "Aquaculture", "Agriculture"]},
    cropQuantity:{type:Number,require:true},
    farmer_id:{type:mongoose.Schema.Types.ObjectId, ref:"Users                              "}
}, {
    timestamps: true
});

module.exports = mongoose.model('regulerFarming', regulerFarmingSchema);