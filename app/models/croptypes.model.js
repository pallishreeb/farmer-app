const mongoose = require('mongoose');

const Croptypesschema = mongoose.Schema({
    parentCategory: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    subcategory: {
        type: Array,
    },
    price: {
        type: String,
        required: true,
    },
    unit: {
        type: String,
        required: true,
    },
    variety: {
        type: [String], // Array of strings
        required: false,
    },
    grade: {
        type: String, // Assuming grade is a string
        required: false,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Croptypes', Croptypesschema);
