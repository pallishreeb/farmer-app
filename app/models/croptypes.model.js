const mongoose = require('mongoose');

const Croptypesschema = mongoose.Schema({  
    name: {
        type: String,
        required: true,
    },
    subcategory: {
        type: Array,
        required: true,
    },

}, {
    timestamps: true
});

module.exports = mongoose.model('Croptypes', Croptypesschema);