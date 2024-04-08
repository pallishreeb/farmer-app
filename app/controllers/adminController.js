const Admin = require("../models/admin.model");

exports.getbuyers = (req, res) => {
    Admin.find(
      { userType: { $eq: "buyer" } },
    )
      .sort({ createdAt: -1 })
      .then((userdata) => {
        res.status(200).send({ status: true, result: userdata });
      })
      .catch((err) => {
        return res.status(500).send({ message: "something went wrong" });
      });
  };

  exports.getfarmers= (req, res) => {
    Admin.find(
      { userType: { $eq: "farmer" } },
    )
      .sort({ createdAt: -1 })
      .then((userdata) => {
        res.status(200).send({ status: true, result: userdata });
      })
      .catch((err) => {
        return res.status(500).send({ message: "something went wrong" });
      });
  };

  exports.deleteUser= (req, res) => {
    const { id } = req.params;
    Admin.findByIdAndDelete(id)
        .then(() => {
            res.status(200).send({ status: true, message: "User deleted successfully" });
        })
        .catch((err) => {
            res.status(500).send({ status: false, message: "Failed to delete buyer", error: err });
        });
};

