const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    fullName: { type: String},
    city: { type: String},
    address: { type: String },
    village: { type: String },
    postOffice: { type: String},
    tehsil: { type: String},
    taluka: { type: String},
    zipCode: { type: Number },
    state: { type: String },
    firmName: { type: String },
    firmAddress: { type: String },
    location: { type: String },
    phone: { type: Number},
    profilePicture: { type: Array },
    userType: { type: String, default: "farmer" },
    otp: { type: String },
    password: { type: String },
}, {
    timestamps: true
});

module.exports = mongoose.model('admin', adminSchema);