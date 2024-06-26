const mongoose = require('mongoose');
const Sequence = require('./sequence.model');  // Update the path accordingly

const adminSchema = mongoose.Schema({
    userId: { type: Number, unique: true },
    fullName: { type: String },
    email: { type: String },
    city: { type: String },
    address: { type: String },
    village: { type: String },
    postOffice: { type: String },
    tehsil: { type: String },
    taluka: { type: String },
    zipCode: { type: Number },
    state: { type: String },
    firmName: { type: String },
    firmAddress: { type: String },
    location: { type: String },
    phone: { type: Number },
    profilePicture: { type: Array },
    userType: { type: String, default: "farmer" },
    otp: { type: String },
    password: { type: String },
}, {
    timestamps: true
});

// Pre-save hook to assign userId
adminSchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            const sequence = await Sequence.findOneAndUpdate(
                { name: 'userId' },
                { $inc: { value: 1 } },
                { new: true, upsert: true }  // upsert: create the document if it doesn't exist
            );

            this.userId = sequence.value;
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

module.exports = mongoose.model('admin', adminSchema);
