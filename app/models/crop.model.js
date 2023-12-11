const mongoose = require('mongoose');
const nameSchema = new mongoose.Schema({
   
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
});
const Cropschema = mongoose.Schema({
    names: {
        type: [nameSchema],
        required: true,
    },
    categoryname: String,
    price:{
        type: Number,
        required: true,
    },
    farmer_id:{type:mongoose.Schema.Types.ObjectId,ref:"admin"}
}, {
    timestamps: true
});

module.exports = mongoose.model('Crops', Cropschema);