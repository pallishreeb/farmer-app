const Admin = require("../models/admin.model");
const TokenObj = require("../middleware/token");
var jwt = require("jsonwebtoken");

// const path = require('path');

exports.sendotp = async (req, res) => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  console.log(otp, "OTP");
  if (!req.body.phone) {
    return res.status(400).send({
      message: "Phone number can not be empty",
    });
  }
  let findres = await Admin.findOne({ phone: req.body.phone });

  if (findres && findres._id) {
    console.log("sds", findres._id);
    const result = await Admin.findByIdAndUpdate(
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
    await Admin.create(data, (err, result) => {
      if (err) throw err;
      else {
        res.send({ MSG: "Register Done", data: result });
      }
    });
  }
};

exports.Adminlogin = async (req, res) => {
  if (!req.body.phone || !req.body.otp) {
    return res.status(400).send({
      message: "Phone number or otp can not be empty",
    });
  }
  await Admin.findOne({ phone: req.body.phone }, function (err, Admin) {
    const secret = process.env.SECRET;
    if (err) return res.status(500).send({ message: "Error on the server." });
    if (!Admin) return res.status(404).send({ message: "No farmer found." });
    if (Admin.otp == req.body.otp) {
      console.log("testing");
      const token = jwt.sign({ id: Admin._id, phone: Admin.phone }, secret, {
        expiresIn: "1d", // expires in 24 hours
      });
      console.log(Admin, "adminadmin");
      TokenObj.AdminToken = token;
      res.status(200).send({
        auth: true,
        token: token,
        name: Admin.name,
        userType: Admin.userType,
        center: Admin.center,
        user_id: Admin._id,
      });
    } else {
      return res.status(500).send({ Message: "Otp is incorrect !" });
    }
  });
};


exports.registerAdmin = async (req, res) => {
  const phoneExists = await Admin.findOne({ phone: req.body.phone });
  if (phoneExists && !phoneExists.otp) {
    res.send({
      Message: `Already registered.`,
    });
  } else if(phoneExists && phoneExists.otp) {
    res.send({
      Message: `Already registered. Please use this OTP to login: ${phoneExists.otp}`,
    });
  } else {
    const data = {
      phone: req.body.phone,
    };
    // console.log(data, "data")
    Admin.create(data, (err, result) => {
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

exports.updateAdmin = async (req, res) => {
  const result = await Admin.findByIdAndUpdate(
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
      firmName: req.body.firmName,
      firmAddress: req.body.firmAddress,
      location: req.body.location,
      phone: req.body.phone,
      profilePicture: req.file,
      userType: req.body.userType
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

exports.getAdmin = async (req, res) => {
  const result = await Admin.findById(
    req.params.id
  );
  if (!result)
    return res
      .status(500)
      .send({ Message: "Can't find Farmer Data with given id" });
  res
    .status(200)
    .send({ Message: "Your Data Successfully Updated", data: result });
};


const path = require('path');

exports.getAdminImage = async (req, res) => {
  const userId = req.params.id;

  try {
    const admin = await Admin.findById(userId);
    if (!admin) {
      res.status(404).send('User not found');
      return;
    }

    const profilePicture = admin.profilePicture;
    if (!Array.isArray(profilePicture) || profilePicture.length === 0) {
      res.status(404).send('Profile picture not found');
      return;
    }

    if (Array.isArray(profilePicture)) {
      profilePicture.map((picture) => {
        // console.log(picture.path); // Output each profile picture path to the console
        const absolutePath = path.resolve(picture.path);
        res.sendFile(absolutePath);
      });
    }

    // res.sendFile(profilePicture[0].path); // Send the profile picture file as the response
  } catch (err) {
    console.error('Failed to retrieve user:', err);
    res.status(500).send('Internal Server Error');
  }
};
