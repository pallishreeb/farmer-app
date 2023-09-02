const mongoose = require("mongoose");

const farmerSchema = mongoose.Schema(
  {
    fullName: { type: String, require: true },
    city: { type: String, require: true },
    address: { type: String, require: true },
    village: { type: String, require: true },
    postOffice: { type: String, require: true },
    tehsil: { type: String, require: true },
    taluka: { type: String, require: true },
    zipCode: { type: Number, require: true },
    state: { type: String, require: true },
    phone: { type: Number, require: true },
    profilePicture: { type: Array, require: true },
    userType: { type: String, default: "farmer" },
    otp: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Farmer", farmerSchema);
