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
    // subcategoryname: String,
    // subcategorytype: String,
    // baseprice:Array,
    // saleprice:Array,
    // quoteprice:Array
    price:{
        type: Number,
        required: true,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Crops', Cropschema);