const TokenObj = require("../middleware/token");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.model");
const User = require("../models/user.model")


const BuyerToken = async (req, res, next) => {
  const reqHeaders = req.headers["x-access-token"];
  console.log("hello");
  if (reqHeaders === TokenObj.BuyerToken) {
    next();
  } else {
    res.send({ MSG: "Unauthorized Buyer" });
  }
};

const FarmerToken = async (req, res, next) => {
  const reqHeaders = req.headers["x-access-token"];
  console.log(reqHeaders, "HELLOOOO", TokenObj.FarmerToken);
  if (reqHeaders === TokenObj.FarmerToken) {
    next();
  } else {
    res.send({ MSG: "Unauthorized Farmer" });
  }
};

const config = process.env;

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, config.SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

function verifyUserType(userType) {
  return async function (req, res, next) {
    const token = req.headers["x-access-token"];
    if (!token) {
      return res.status(401).json({ error: "Token not provided" });
    }

    try {
      const decoded = jwt.verify(token, config.SECRET);
      console.log(decoded.id, 'decoded');
      const admin = await Admin.findOne({
        _id: decoded.id,
      });
      if (!admin) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      console.log(admin, 'admin');
      console.log(decoded, 'decoded');
      if (admin.userType !== userType) {
        return res.status(403).json({ error: 'Access denied' });
      }

      req.user = decoded;
      console.log(req.user, 'req.user');
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token', data: err });
    }
  };
}

function verifyType(userType) {
  return async function (req, res, next) {
    const token = req.headers["x-access-token"];
    if (!token) {
      return res.status(401).json({ error: "Token not provided" });
    }

    try {
      const decoded = jwt.verify(token, config.SECRET);
      console.log(decoded.id, "decoded");
      const admin = await Admin.findOne({
        _id: decoded.id,
      });
      if (!admin) {
        return res.status(401).json({ error: "Invalid token" });
      }

      console.log(admin, "admin");
      console.log(decoded, "decoded");
      if (
        admin.userType !== userType &&
        admin.userType !== "buyer" &&
        admin.userType !== "farmer"
      ) {
        return res.status(403).json({ error: "Access denied" });
      }
      req.user = decoded;
      console.log(req.user, "req.user");
      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid token", data: err });
    }
  };
}


const verifyBuyer = (userType) =>{
  return async function (req, res, next) {
    const token = req.headers["x-access-token"];
    if (!token) {
      return res.status(401).json({ error: "Token not provided" });
    }

    try {
      const decoded = jwt.verify(token, config.SECRET);
      // console.log(decoded.id, "decoded");
      const user = await User.findOne({
        _id: decoded.id,
      });
      if (!user) {
        return res.status(401).json({ error: "Invalid token" });
      }

      // console.log(user, "User");
      if (user.userType !== "buyer") {
        return res.status(403).json({ error: "Access denied" });
      }
      req.user = decoded;
      // console.log(req.user, "req.user");
      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid token", data: err });
    }
  };
}

const verifyFarmer = (userType) =>{
  return async function (req, res, next) {
    const token = req.headers["x-access-token"];
    if (!token) {
      return res.status(401).json({ error: "Token not provided" });
    }

    try {
      const decoded = jwt.verify(token, config.SECRET);
      // console.log(decoded.id, "decoded");
      const user = await User.findOne({
        _id: decoded.id,
      });
      if (!user) {
        return res.status(401).json({ error: "Invalid token" });
      }

      // console.log(user, "User");
      if (user.userType !== "farmer") {
        return res.status(403).json({ error: "Access denied" });
      }
      req.user = decoded;
      // console.log(req.user, "req.user");
      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid token", data: err });
    }
  };
}

const verifyFarmerOrBuyer = (userType) =>{
  return async function (req, res, next) {
    const token = req.headers["x-access-token"];
    if (!token) {
      return res.status(401).json({ error: "Token not provided" });
    }

    try {
      const decoded = jwt.verify(token, config.SECRET);
      // console.log(decoded.id, "decoded");
      const user = await User.findOne({
        _id: decoded.id,
      });
      if (!user) {
        return res.status(401).json({ error: "Invalid token" });
      }

      // console.log(user, "User");
      if (user.userType !== "farmer" || user.userType !== "buyer") {
        return res.status(403).json({ error: "Access denied" });
      }
      req.user = decoded;
      // console.log(req.user, "req.user");
      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid token", data: err });
    }
  };
}
module.exports = {
  BuyerToken,
  FarmerToken,
  verifyUserType,
  verifyToken,
  verifyType,
  verifyBuyer,
  verifyFarmer,
  verifyFarmerOrBuyer
};
