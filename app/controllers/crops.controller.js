const Crop = require("../models/crop.model.js");
const CropType = require("../models/croptypes.model.js");

exports.addcategory = async (req, res) => {
  let findres = await CropType.findOne({ name: req.body.name });
  if (findres && findres._id) {
    return res.status(400).send({
      message: "Crop Category already exit",
    });
  }

  // Create a category
  const category = new CropType({
    name: req.body.name,
  });

  category
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the Crop Category.",
      });
    });
};

exports.getcategory = async (req, res) => {
    const findres = await CropType.find({});
    if (findres.length === 0) {
      return res.status(404).send({ message: "No crops found." });
    } else {
      res.send({ message: "Crops found.", data: findres });
    }
};

exports.addSubcategory = async (req, res) => {
  let findcropcategory = await CropType.findOne({
    name: req.body.categoryname,
  });
  if (findcropcategory && findcropcategory._id) {
    let findcropsubcat = await CropType.findOne({
      name: req.body.categoryname,
      "subcategory.name": req.body.subcategoryname,
    });
    if (findcropsubcat && findcropsubcat._id) {
      return res.status(400).send({
        message: "Crop SubCategory already exits in this category",
      });
    }

    let updtoj = { name: req.body.subcategoryname };
    if (req.body.subcategorytype && req.body.subcategorytype != "") {
      updtoj["subcategorytype"] = req.body.subcategorytype;
    }
    let addsubcat = await CropType.findOneAndUpdate(
      { name: req.body.categoryname },
      { $push: { subcategory: updtoj } }
    );
    if (addsubcat) {
      res
        .status(200)
        .send({
          status: true,
          message: "Subcategory has been created successfully",
        });
    } else {
      return res.status(500).send({
        message: "Some error occurred",
      });
    }
  } else {
    return res.status(400).send({
      message: "Crop Category not found",
    });
  }
};

exports.getCropCategorybyname = async (req, res) => {
  let findresult = await CropType.find({ name: req.body.name });
  if (!findresult)
    return res.status(404).send({ message: "No category found." });

  res.status(200).send({ status: true, result: findresult });
};

exports.addCropSubcategory = async (req, res) => {
  let findcropcategory = await CropType.findOne({
    name: req.body.categoryname,
  });
  if (findcropcategory && findcropcategory._id) {
    let findcropsubcat = await CropType.findOne({
      name: req.body.categoryname,
      "subcategory.name": req.body.subcategoryname,
    });
    if (findcropsubcat && findcropsubcat._id) {
      return res.status(400).send({
        message: "Crop SubCategory already exits in this category",
      });
    }

    let updtoj = { name: req.body.subcategoryname };
    if (req.body.subcategorytype && req.body.subcategorytype != "") {
      updtoj["subcategorytype"] = req.body.subcategorytype;
    }
    let addsubcat = await CropType.findOneAndUpdate(
      { name: req.body.categoryname },
      { $push: { subcategory: updtoj } }
    );
    if (addsubcat) {
      res
        .status(200)
        .send({
          status: true,
          message: "Subcategory has been created successfully",
        });
    } else {
      return res.status(500).send({
        message: "Some error occurred",
      });
    }
  } else {
    return res.status(400).send({
      message: "Crop Category not found",
    });
  }
};

exports.addCrop = async (req, res) => {
  const { categoryname, names, price } = req.body;
  const farmer_id = req.user.id;
  try {
    const newData = new Crop({ categoryname, names, price, farmer_id });
    await newData.save();
    res.json({ message: "crop saved successfully", data: newData });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ message: "Error saving data" });
  }
};

exports.getCrop = async (req, res) => {
  let findres = await Crop.find();
  try{
    if (!findres) {
        return res.status(404).send({ message: "No crop found." });
      } else {
        res.send({ message: " crop finded.", data: findres });
      }
  }catch(err){
console.log(err)
  }
 
};

exports.addCropPrice = async (req, res) => {
  let baseprice = req.body.baseprice || [];
  let quoteprice = req.body.quoteprice || [];
  let saleprice = req.body.saleprice || [];
  if (baseprice.length > 0 && quoteprice.length > 0 && saleprice.length > 0) {
    let findcrop = await Crop.findOne({ _id: req.body.cropid });
    if (findcrop && findcrop._id) {
      const updtobj = {
        baseprice: req.body.baseprice,
        saleprice: req.body.saleprice,
        quoteprice: req.body.quoteprice,
      };

      Crop.findOneAndUpdate(
        { _id: findcrop._id },
        { $set: updtobj },
        { new: true }
      )
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the Crop.",
          });
        });
    } else {
      return res.status(400).send({
        message: "Crop not found",
      });
    }
  } else {
    return res.status(400).send({
      message: "Missing parameter",
    });
  }
};

//getCrops by categoryname
exports.getCropsByCategory = async (req, res) => {
  
    try {
      const categoryName = req.query.categoryName;
  
      // Use Mongoose aggregation to find all crops with the specified category
      const result = await Crop.aggregate([
        {
          $match: { category: categoryName },
        },
        {
          $unwind: '$names',
        },
        {
          $group: {
            _id: '$names',
          },
        },
        {
          $project: {
            _id: 0,
            name: '$_id',
          },
        },
      ]);
  
      const uniqueCropNames = [...new Set(result.map(item => item.name))];
  
      // console.log("crops",uniqueCropNames)
      res.json({ crops: uniqueCropNames });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }

};

