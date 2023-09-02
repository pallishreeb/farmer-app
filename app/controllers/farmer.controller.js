const Farmer = require("../models/farmer.model.js");
const User = require("../models/user.model.js");

const Admin = require("../models/admin.model");
const TokenObj = require("../middleware/token");
var jwt = require("jsonwebtoken");
// const UserSetting = require('../models/usersetting.model.js');
// const UserProfile = require('../models/userProfile.model')

exports.sendotp = async (req, res) => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  console.log(otp, "OTP");
  if (!req.body.phone) {
    return res.status(400).send({
      message: "Phone number can not be empty",
    });
  }
  let findres = await Farmer.findOne({ phone: req.body.phone });

  if (findres && findres._id) {
    console.log("sds", findres._id);
    const result = await Farmer.findByIdAndUpdate(
      { _id: findres._id },
      {
        phone: req.body.phone,
        otp: otp,
      },
      { new: true }
    );
    res
      .status(200)
      .send({ Message: "Update Data Successfully Done", data: result });
  } else {
    const data = {
      phone: req.body.phone,
      otp: otp,
    };
    await Farmer.create(data, (err, result) => {
      if (err) throw err;
      else {
        res.send({ MSG: "Register Done", data: result });
      }
    });
  }
};

exports.farmerlogin = async (req, res) => {
  if (!req.body.phone || !req.body.otp) {
    return res.status(400).send({
      message: "Phone number or otp can not be empty",
    });
  }
  await Farmer.findOne({ phone: req.body.phone }, function (err, Farmer) {
    const secret = process.env.SECRET;
    if (err) return res.status(500).send({ message: "Error on the server." });
    if (!Farmer) return res.status(404).send({ message: "No farmer found." });
    if (Farmer.otp == req.body.otp) {
      console.log("testing");
      const token = jwt.sign({ id: Farmer._id, phone: Farmer.phone }, secret, {
        expiresIn: "1d", // expires in 24 hours
      });
      console.log(Farmer, "adminadmin");
      TokenObj.FarmerToken = token;
      res.status(200).send({
        auth: true,
        token: token,
        name: Farmer.name,
        userType: Farmer.userType,
        center: Farmer.center,
        user_id: Farmer._id,
      });
    } else {
      return res.status(500).send({ Message: "Otp is incorrect !" });
    }
  });
};

exports.getAdminByID = async (req, res) => {
  id = req.params.id;
  const result = await Farmer.findById(id);
  if (!result)
    return res
      .status(500)
      .send({ Message: "Can't Find Admin Data With Given Id" });
  res
    .status(200)
    .send({ Message: "Admin Data Find Successfully Done", result });
};

exports.registerFarmer = async (req, res) => {
  const phoneExists = await Farmer.findOne({ phone: req.body.phone });
  const phoneAndEmailExists = await User.findOne({
    phone: req.body.phone,
  });
  if (phoneExists && phoneExists.otp) {
    res.send({
      Message: `Already registered. Please use this OTP to login: ${phoneExists.otp}`,
    });
  } else if (phoneAndEmailExists) {
    res.send({
      Message: `Already registered phone Number in buyer side`,
    });
  } else {
    const data = {
      fullName: req.body.fullName,
      city: req.body.city,
      address: req.body.address,
      village: req.body.village,
      postOffice: req.body.postOffice,
      tehsil: req.body.tehsil,
      taluka: req.body.taluka,
      zipCode: req.body.zipCode,
      state: req.body.state,
      phone: req.body.phone,
      profilePicture: req.file,
    };

    Farmer.create(data, (err, result) => {
      if (err) {
        res.status(400).send({ Message: "Something went wrong", err });
      } else {
        res
          .status(200)
          .send({ msg: "Farmer registration successfully done", result });
      }
    });
  }
};

exports.getfarmers = async (req, res) => {
  const result = await Farmer.find({});
  if (!result) return res.status(500).send({ Message: "Oops..Empty set" });
  res
    .status(200)
    .send({ Message: "Farmer Data Find Successfully Done", result });
};

exports.getfarmerprofile = async (req, res) => {
  id = req.params.id;
  const result = await Farmer.findById(id);
  console.log(result, id, "hehehe");
  if (!result)
    return res
      .status(500)
      .send({ Message: "Can't Find Farmer Data With Given Id" });
  res
    .status(200)
    .send({ Message: "Farmer Data Find Successfully Done", result });
};

exports.updatefarmerbyid = async (req, res) => {
  const result = await Farmer.findByIdAndUpdate(
    req.params.id,
    {
      fullName: req.body.fullName,
      city: req.body.city,
      address: req.body.address,
      village: req.body.village,
      postOffice: req.body.postOffice,
      tehsil: req.body.tehsil,
      taluka: req.body.taluka,
      zipCode: req.body.zipCode,
      state: req.body.state,
      phone: req.body.phone,
      profilePicture: req.file,
      userType:req.body.userType
    },
    {
      new: true,
    }
  );
  if (!result)
    return res
      .status(500)
      .send({ Message: "Can't find Farmer Data with given id" });
  res
    .status(200)
    .send({ Message: "Your Data Successfully Updated", data: result });
};

exports.logoutfarmer = async (req, res) => {
  try {
    const result = await Farmer.findByIdAndDelete(req.params.id);
    if (!result)
      return res
        .status(500)
        .send({ Message: "Can't Logout Farmer please Check Your Data" });
    res.status(200).send({ Message: "Farmer Logout Successfully Done..." });
  } catch (err) {
    console.log(err);
  }
};

// exports.userprofile = (async(req,res)=>{
//   try{
//     const farmer_id = req.body.farmer_id
//     await User.findOne({ _id: farmer_id }, async(err, result) => {
//       console.log(result, "result")
//       if (err) throw err;
//       else {
//         if (result == null) {
//             res.send({ MSG: "Ple Enter Valid Farmer_Id, Given Id is Not in Our Database " })
//         }
//         else{
//           const data={
//             fullname:req.body.fullname,
//             profile:req.file.path,
//             farmer_id:req.body.farmer_id
//           }
//           console.log('file123',req.file)
//           await UserProfile.create(data,(err,result)=>{
//             if(err) throw err;
//             else{
//               res.status(200).send({Message:"User Profile Upload Successfully Done",result})
//             }
//           })
//         }
//       }
//     })
//   }catch(err){
//     console.log(err);
//   }
// })

// exports.getuserprofile=(async(req,res)=>{
//   const result = await UserProfile.find({}).populate("farmer_id")
//   if(!result || result=="") return res.status(500).send({Message:"Oop's Empty Data"})
//   res.status(200).send({Message:"Data Find Successfully Done",result})
// })

// exports.getsingleuserprofile=(async(req,res)=>{
//   const result = await UserProfile.findById(req.params.id).populate("farmer_id");
//   if(result=="" || !result) return res.status(500).send({Message:"Oop's Empty Data"});
//   res.status(200).send({Message:"Data Find Successfully Done",result})
// })

exports.updateuserprofile = async (req, res) => {
  const result = await Farmer.findByIdAndUpdate(
    req.params.id,
    {
      userType: req.body.userType,
    },
    {
      new: true,
    }
  );
  if (!result)
    return res
      .status(500)
      .send({ Message: "Can't find Farmer Data with given id" });
  res
    .status(200)
    .send({ Message: "Your Data Successfully Updated", data: result });
};

// let generateUseridnumber = async(usertype,state,city)=>{
//     let settingresult = await UserSetting.findOne({settingtype:"useridnumber"});
//     //console.log('settingresult',settingresult);
//     let finalstr = "",usernumber;
//     if(usertype=="farmer"){
//       finalstr = "FR";
//       usernumber = settingresult && settingresult.settingdata && settingresult.settingdata.farmeridnumber;
//     }else if(usertype=="dealer"){
//       finalstr = "DE";
//       usernumber = settingresult && settingresult.settingdata && settingresult.settingdata.dealeridnumber;
//     }else if(usertype=="retailer"){
//       finalstr = "RE";
//       usernumber = settingresult && settingresult.settingdata && settingresult.settingdata.retaileridnumber;
//     }else if(usertype=="buyer"){
//       finalstr = "BU";
//       usernumber = settingresult && settingresult.settingdata && settingresult.settingdata.buyeridnumber;
//     }
//     //console.log('finalstr',finalstr);
//     if(state && state[0])
//      finalstr = finalstr+(state[0]).toUpperCase();
//     if(state && state[1])
//      finalstr = finalstr+state[1].toUpperCase();
//     if(city && city[0])
//      finalstr = finalstr+city[0].toUpperCase();
//     if(city && city[1])
//      finalstr = finalstr+city[1].toUpperCase();
//     //console.log('finalstr2',finalstr,usernumber);
//     return finalstr+usernumber;
//   }
