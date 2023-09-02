const mongoose = require("mongoose");

const panVerificationSchema = new mongoose.Schema({
    panNumber:{type:String,require:true},
    panCardPhoto:{require:true,type:Array},
    farmer_id:{type:mongoose.Schema.Types.ObjectId,ref:"Users"}
})

module.exports = mongoose.model("panVerification",panVerificationSchema);

