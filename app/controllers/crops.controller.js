const Crop = require("../models/crop.model.js");
const CropType = require("../models/croptypes.model.js");

exports.addcategory = async (req, res) => {
  try {
    let findres = await CropType.findOne({ name: req.body.name });
    if (findres && findres._id) {
      return res.status(400).send({
        message: "Crop Category already exists",
      });
    }

    // Create a category
    const category = new CropType({
      parentCategory: req.body.parentCategory,
      name: req.body.name,
      price: req.body.price,
      unit: req.body.unit,
      variety: req.body.variety || [], // Default to empty array if not provided
      grade: req.body.grade || ''      // Default to empty string if not provided
    });

    let data = await category.save();
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Crop Category.",
    });
  }
};

exports.getcategory = async (req, res) => {
    const findres = await CropType.find({});
    if (findres.length === 0) {
      return res.status(404).send({ message: "No category found." });
    } else {
      res.send({ message: "Categories found.", data: findres });
    }
};

exports.getCropCategorybyname = async (req, res) => {
  let findresult = await CropType.find({ name: req.body.name });
  if (!findresult)
    return res.status(404).send({ message: "No category found." });

  res.status(200).send({ status: true, result: findresult });
};

exports.getCropCategorybyId = async (req, res) => {
  let findresult = await CropType.find({ _id: req.params.id });
  if (!findresult)
    return res.status(404).send({ message: "No category found." });

  res.status(200).send({ status: true, result: findresult });
};
exports.getCategorybyParent= async (req, res) => {
  let findresult = await CropType.find({ parentCategory: req.query.name });
  if (!findresult)
    return res.status(404).send({ message: "No category found." });

  res.status(200).send({ status: true, result: findresult });
};
exports.editCategory = async (req, res) => {
  const categoryId = req.params.id;
  const { parentCategory, name, price, unit, variety, grade } = req.body;

  try {
    let category = await CropType.findById(categoryId);

    if (!category) {
      return res.status(404).send({ message: "Category not found." });
    }

    category.parentCategory = parentCategory || category.parentCategory;
    category.name = name || category.name;
    category.price = price || category.price;
    category.unit = unit || category.unit;
    if (variety !== undefined) category.variety = variety;
    if (grade !== undefined) category.grade = grade;

    const updatedCategory = await category.save();
    res.send(updatedCategory);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error updating the category.",
    });
  }
};

exports.deleteCategory = async (req, res) => {
  const categoryId = req.params.id; 

  try {
    const category = await CropType.findById(categoryId);

    if (!category) {
      return res.status(404).send({ message: "Category not found." });
    }

    await category.remove();
    res.send({ message: "Category deleted successfully!" });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error deleting the category.",
    });
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
      const categoryname = req.query.categoryname;
      const allCrops = await Crop.find({categoryname:categoryname})  
      console.log("crops",allCrops)
      res.json({ crops: allCrops });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }

};

