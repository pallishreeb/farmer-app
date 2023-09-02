const User = require("../models/user.model.js");
const UserSetting = require("../models/usersetting.model.js");
const Farmer = require("../models/farmer.model.js");
const TokenObj = require("../middleware/token");
var jwt = require("jsonwebtoken");

exports.registerBuyer= async (req, res) => {
  const phoneExists = await Farmer.findOne({
    phone: req.body.phone,
  });
  let findphone = await User.findOne({ phone: req.body.phone });
  console.log("findnumber",!findphone)
  if (findphone) {
    return res.status(400).send({
      message: "Buyer already exit with this phone number",
    });
  } else if (phoneExists) {
    res.send({
      Message: `Already registered  phoneNumber in Farmer side`,
    });
  }

  //genereate useridnumber
  let buyerid = await generateUseridnumber(
    "buyer",
    req.body.state,
    req.body.city
  );

  // Create a Farmer 
  req.body.userType = "buyer";  req.body.useridnumber = buyerid;
  const dealerObj = new User(req.body);
  console.log(req.body, "dealerObj");
  dealerObj
    .save()
    .then(async (data) => {
      await UserSetting.findOneAndUpdate(
        { settingtype: "useridnumber" },
        { $inc: { "settingdata.buyeridnumber": 1 } }
      );
      res
        .status(200)
        .send({
          status: true,
          message: "Buyer has been created successfully",
          data,
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Buyer.",
      });
    });
};


exports.Usersendotp = async (req, res) => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  console.log(otp, "OTP");
  if (!req.body.phone) {
    return res.status(400).send({
      message: "Phone number can not be empty",
    });
  }
  let findres = await User.findOne({ phone: req.body.phone });

  if (findres && findres._id) {
    console.log("sds", findres._id);
    const result = await User.findByIdAndUpdate(
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
    await User.create(data, (err, result) => {
      if (err) throw err;
      else {
        res.send({ MSG: "Register Done", data: result });
      }
    });
  }
};

exports.Buyerlogin = async (req, res) => {
  if (!req.body.phone || !req.body.otp) {
    return res.status(400).send({
      message: "Phone number or otp can not be empty",
    });
  }
  await User.findOne({ phone: req.body.phone }, function (err, User) {
    const secret = process.env.SECRET;
    if (err) return res.status(500).send({ message: "Error on the server." });
    if (!User) return res.status(404).send({ message: "No farmer found." });
    if (User.otp == req.body.otp) {
      console.log("testing");
      const token = jwt.sign({ id: User._id, phone: User.phone }, secret, {
        expiresIn: "1d", // expires in 24 hours
      });
      console.log(User, "User");
      TokenObj.BuyerToken = token;
      res.status(200).send({
        auth: true,
        token: token,
        name: User.name,
        userType: User.userType,
        center: User.center,
        user_id: User._id,
      });
    } else {
      return res.status(500).send({ Message: "Otp is incorrect !" });
    }
  });
};




exports.getbuyer = (req, res) => {
  let page = (req.query && req.query.page && Number(req.query.page)) || 1;
  let limit = 5;
  let skip = limit * (page - 1);
  User.find(
    { userType: { $eq: "buyer" } },
    {
      crops: 0,
      farmerdetail: 0,
      bankingdetail: 0,
      password: 0,
      __v: 0,
      updatedAt: 0,
    }
  )
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .then((userdata) => {
      res.status(200).send({ status: true, result: userdata });
    })
    .catch((err) => {
      return res.status(500).send({ message: "something went wrong" });
    });
};

exports.getbuyerprofile = async (req, res) => {
  id = req.params.id;
  const result = await User.findById(id);
  if (!result)
    return res
      .status(500)
      .send({ Message: "Can't Find Buyer Data With Given Id" });
  res
    .status(200)
    .send({ Message: "Buyer Data Find Successfully Done", result });
};

exports.updatebuyerbyid = async (req, res) => {
  const result = await User.findByIdAndUpdate(
    req.params.id,
    {
      fullName: req.body.fullName,
      country: req.body.country,
      taluka: req.body.taluka,
      phone: req.body.phone,
      locality: req.body.locality,
      city: req.body.city,
      state: req.body.state,
      pin: req.body.pin,
    },
    {
      new: true,
    }
  );
  if (!result)
    return res
      .status(500)
      .send({ Message: "Can't find Buyer Data with given id" });
  res
    .status(200)
    .send({ Message: "Your Data Successfully Updated", data: result });
};

exports.logoutbuyer = async (req, res) => {
  const result = await User.findByIdAndDelete(req.params.id);
  if (!result)
    return res
      .status(500)
      .send({ Message: "Can't Logout Buyer please Check Your Data" });
  res.status(200).send({ Message: "Buyer Logout Successfully Done..." });
};

let generateUseridnumber = async (usertype, state, city) => {
  let settingresult = await UserSetting.findOne({
    settingtype: "useridnumber",
  });
  //console.log('settingresult',settingresult);
  let finalstr = "",
    usernumber;
  if (usertype == "farmer") {
    finalstr = "FR";
    usernumber =
      settingresult &&
      settingresult.settingdata &&
      settingresult.settingdata.farmeridnumber;
  } else if (usertype == "dealer") {
    finalstr = "DE";
    usernumber =
      settingresult &&
      settingresult.settingdata &&
      settingresult.settingdata.dealeridnumber;
  } else if (usertype == "retailer") {
    finalstr = "RE";
    usernumber =
      settingresult &&
      settingresult.settingdata &&
      settingresult.settingdata.retaileridnumber;
  } else if (usertype == "buyer") {
    finalstr = "BU";
    usernumber =
      settingresult &&
      settingresult.settingdata &&
      settingresult.settingdata.buyeridnumber;
  }
  //console.log('finalstr',finalstr);
  if (state && state[0]) finalstr = finalstr + state[0].toUpperCase();
  if (state && state[1]) finalstr = finalstr + state[1].toUpperCase();
  if (city && city[0]) finalstr = finalstr + city[0].toUpperCase();
  if (city && city[1]) finalstr = finalstr + city[1].toUpperCase();
  //console.log('finalstr2',finalstr,usernumber);
  return finalstr + usernumber;
};
