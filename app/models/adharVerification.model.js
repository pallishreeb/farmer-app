const mongoose = require("mongoose");

const adharVerificationSchema = new mongoose.Schema({
    adharNumber:{require:true,type:Number,
        validate: {
            validator: function(v) {
              return /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/.test(v);
            }}},
    frontSidePhoto:{type:Array,require:true},
    backSidePhoto:{type:Array,require:true},
    farmer_id:{type:mongoose.Schema.Types.ObjectId,ref:"Users"}
})

module.exports = mongoose.model("adharVerification",adharVerificationSchema)