const User = require('../models/user.model.js');
const Admin = require("../models/admin.model");
const UserType = require('../models/usertype.model.js');
const CityState = require('../models/citystate.model.js');
const Crop = require('../models/crop.model.js');
const CropType = require('../models/croptypes.model.js');
const UserSetting = require('../models/usersetting.model.js');
const cropModel = require('../models/crop.model.js');
const TokenObj = require('../middleware/token')

var md5 = require('md5');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../../config/keys.config.js');
const { Router } = require('express');
const multer = require("multer")
var ObjectId = require('mongodb').ObjectID;


// exports.adminotpsend = async (req, res) => {
//     const { phone } = req.body;

//     if (!phone) {
//         res.status(400).json({ error: "Please Enter Your phone" })
//     }

//     try {
//         const presuer = await Admin.findOne({ phone: phone });

//         if (presuer) {
//             const OTP = Math.floor(1000 + Math.random() * 9000);

//             const existEmail = await Admin.findOne({ phone: phone });

//             if (existEmail) {
//                 const updateData = await Admin.findByIdAndUpdate({ _id: existEmail._id }, {
//                     otp: OTP
//                 }, { new: true }
//                 );

//                 await updateData.save();
//                 //console And Res OTP
//                 console.log("updateData", OTP)
//                 res.send({ "otp": OTP })

//             } else {

//                 const saveOtpData = new userotp({
//                     phone, otp: otp
//                 });

//                 await saveOtpData.save();
//                 console.log("saveOtpData", saveOtpData.otp)

//             }
//         }
//         else {
//             res.status(400).json({ error: "This User Not Exist In our Db" })
//         }
//     } catch (error) {
//         res.status(400).json({ error: "Invalid Details", error })
//     }
// };



// exports.updateAdmin = async (req, res) => {
//     const OTP = Math.floor(1000 + Math.random() * 9000);
//     const result = await Admin.findByIdAndUpdate(req.params.id, {
//         phone: req.body.phone,
//         otp: OTP
//     }, { new: true })
//     if (!result) {
//         return res.status(400).send({ Message: "Can't find Data With given Id" })
//     }
//     res.status(200).send({ Message: "Update Data Successfully Done", data: result })
// }

exports.deleteAdmin = async (req, res) => {
    const result = await Admin.findByIdAndDelete(req.params.id)
    if (!result) {
        return res.status(400).send({ Message: "Can't Find data With Given Id" })
    }
    res.status(200).send({ Message: "Delete Post Successfully Done", data: result });
}

exports.getUsertypes = (req, res) => {
    UserType.find({}, function (err, usertypes) {
        if (err) return res.status(500).send({ message: 'Error on the server.' });
        if (!usertypes) return res.status(404).send({ message: 'No usertype found.' });

        res.status(200).send({ status: true, result: usertypes });
    });
};

exports.getcitystate = (req, res) => {
    CityState.find({}, function (err, citystatesres) {
        if (err) return res.status(500).send({ message: 'Error on the server.' });
        if (!citystatesres) return res.status(404).send({ message: 'No city state found.' });

        res.status(200).send({ status: true, result: citystatesres });
    });
};

exports.landmeasurementunits = (req, res) => {
    const measurementunits = ["Square Feet", "Acre", "Hectare", "Gaj", "Bigha"];
    res.status(200).send({ status: true, result: measurementunits });
};

exports.landtypes = (req, res) => {
    const landtype = ["Irrigated", "Nonirrigated"];
    res.status(200).send({ status: true, result: landtype });
};



exports.userdetail = (req, res) => {
    if (req.params && req.params.userid) {
        User.findOne({ _id: req.params.userid, userType: { $ne: "admin" } }, { password: 0, __v: 0, updatedAt: 0 }, function (err, userdata) {
            if (err) return res.status(500).send({ message: 'Error on the server.' });
            if (!userdata) return res.status(404).send({ message: 'No User found.' });

            res.status(200).send({ status: true, result: userdata });
        });
    } else {
        return res.status(422).send({ message: "missing required parameter" });
    }
};





let generateUseridnumber = async (usertype, state, city) => {
    let settingresult = await UserSetting.findOne({ settingtype: "useridnumber" });
    //console.log('settingresult',settingresult);
    let finalstr = "", usernumber;
    if (usertype == "farmer") {
        finalstr = "FR";
        usernumber = settingresult && settingresult.settingdata && settingresult.settingdata.farmeridnumber;
    } else if (usertype == "dealer") {
        finalstr = "DE";
        usernumber = settingresult && settingresult.settingdata && settingresult.settingdata.dealeridnumber;
    } else if (usertype == "retailer") {
        finalstr = "RE";
        usernumber = settingresult && settingresult.settingdata && settingresult.settingdata.retaileridnumber;
    } else if (usertype == "buyer") {
        finalstr = "BU";
        usernumber = settingresult && settingresult.settingdata && settingresult.settingdata.buyeridnumber;
    }
    //console.log('finalstr',finalstr);
    if (state && state[0])
        finalstr = finalstr + (state[0]).toUpperCase();
    if (state && state[1])
        finalstr = finalstr + state[1].toUpperCase();
    if (city && city[0])
        finalstr = finalstr + city[0].toUpperCase();
    if (city && city[1])
        finalstr = finalstr + city[1].toUpperCase();
    //console.log('finalstr2',finalstr,usernumber);
    return finalstr + usernumber;
}                                                      