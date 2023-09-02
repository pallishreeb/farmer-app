const Addfarm = require("../models/addfarm.model");
const User = require("../models/farmer.model");
const Admin = require("../models/admin.model");
exports.addfarm = async (req, res) => {
  try {
    const farmer_id = req.body.farmer_id;
    await Admin.findOne({ _id: farmer_id }, (err, result) => {
      if (err) throw err;
      if (result?._id != farmer_id) {
        res.send({
          MSG: "Ple Enter Valid Farmer_Id, Given Id is Not in Our Database ",
        });
      } else if (result?.userType != "farmer") {
        res.send({
          MSG: `Ple Enter Valid Farmer_Id, this id is ${result?.userType} `,
        });
      } else {
        const data = {
          soil_type: req.body.soil_type,
          land_type: req.body.land_type,
          farmer_id: req.body.farmer_id,
        };
        // console.log("data",data);
        Addfarm.create(data, (err, result) => {
          if (err) throw err;
          else {
            res.send({ Message: "Add farm Successfully Done", result });
          }
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getallfarm = async (req, res) => {
  let findresult = await Addfarm.find({});
  if (!findresult)
    return res.status(500).send({ message: "Oops Can't Found Data." });
  if (findresult == "")
    return res.status(500).send({ message: "Oops Empty Set." });
  res.status(200).send({ status: true, result: findresult });
};

exports.getfarmerfarm = async (req, res) => {
  let findresult = await Addfarm.find({ _id: req.body.id });
  if (!findresult)
    return res.status(500).send({ message: "Oops Can't Found Data." });
  if (findresult == "")
    return res.status(500).send({ Message: "Oops Empty Set" });
  res.status(200).send({ status: true, result: findresult });
};
