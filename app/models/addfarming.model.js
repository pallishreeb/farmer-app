
const mongoose = require('mongoose');

const addfarmingSchema=new mongoose.Schema({
    farming_type:{type:String,require:true},
    soil_type:{type:String,require:true},
    farming_type:{type:String,require:true },
    type_of_regular_farming:{type:String,require:true},
}, {
         timestamps: true

})

const Addfarming=mongoose.model("Addfarming",addfarmingSchema);

module.exports = Addfarming