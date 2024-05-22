const SellModel = require("../models/sellTrade.model")
const Order = require("../models/orders.model")
const path = require('path');
const fs = require('fs');
const mongoose = require("mongoose")

exports.sellTrade = async(req,res)=>{
  let images = [];
  const farmer_id = req.user.id;
  if (req.files && req.files.length > 0) {
    for (var i = 0; i < req.files.length; i++) {
      console.log(req.files[i]);
      images.push(req.files[i].path)
    }
  }

    const data={
        username:req.body.username,
        pickuplocation:req.body.pickuplocation,
        category:req.body.category,
        product:req.body.product,
        variety:req.body.variety,
        grade:req.body.grade,
        price:req.body.price,
        Date:req.body.Date,
        quantity:req.body.quantity,
        image:images,
        availableFromDate: req.body.availableFromDate,
        availableToDate: req.body.availableToDate, 
        priceQuantityUnit:req.body.priceQuantityUnit,
        farmer_id:farmer_id
    }
    // console.log("data",data)
    await SellModel.create(data,(err,result)=>{
        if(err) throw err;
        else{
            res.status(200).send({Message:"Selltrade Insert Successfully Done..",result})   
        }
    })
}

exports.GetSellTrade = async (req,res)=>{
    let findresult = await SellModel.find({}).populate('farmer_id');
    if (!findresult) return res.status(500).send({message:"oops Can't found data."});
    if(findresult=="")return res.status(500).send({Message:"oops Empty Set"})
    res.status(200).send({ status: true, result:findresult });
}

exports.GetBySellTrade = async (req,res)=>{
    const id = req.params.id
    let findresult = await SellModel.findOne({_id:id});
    if(!findresult) return res.status(500).send({Message:"oops Can't found data."})
    if(findresult=="")return res.status(500).send({Message:"oops Empty Set"})
    res.status(200).send({ status: true, result:findresult });
}

exports.GetbyimageSellTrade = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await SellModel.findById(productId);

    if (!product || !product.image || product.image.length === 0) {
      return res.status(404).json({ message: 'Image not found' });
    }
    // let image = [];
    // let imagePath;
    // if (product.image && product.image.length > 0) {
    //   for (var i = 0; i < product.image.length; i++) {
    //     imagePath = product.image[i];
    //     image.push(fs.readFileSync(imagePath))
    //   }
    // }
    const imagePath = product.image[0];
    const image = fs.readFileSync(imagePath);
    res.setHeader('Content-Type', 'image/png'); 
    res.send(image);
  } catch (err) {
    res.status(500).json({ message: 'no such file or directory',Error: err});
  }
};

exports.GetImageForSellTrade = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await SellModel.findById(productId);

    if (!product || !product.image || product.image.length === 0) {
      return res.status(404).json({ message: 'Image not found' });
    }
    let image = [];
    if (product.image && product.image.length > 0) {
      for (var i = 0; i < product.image.length; i++) {
        image.push( product.image[i])
      }
    }
    res.send(image);
  } catch (err) {
    res.status(500).json({ message: 'no such file or directory',Error: err});
  }
};

exports.updatesellTrade = async (req, res) => {
  try {
      const sellTrade = await SellModel.findById(req.params.id);
      if (!sellTrade) {
          return res.status(404).send({ message: "Sell trade not found" });
      }

      // Update fields only if they are present in the request body
      if (req.body.username) sellTrade.username = req.body.username;
      if (req.body.pickuplocation) sellTrade.pickuplocation = req.body.pickuplocation;
      if (req.body.category) sellTrade.category = req.body.category;
      if (req.body.product) sellTrade.product = req.body.product;
      if (req.body.variety) sellTrade.variety = req.body.variety;
      if (req.body.grade) sellTrade.grade = req.body.grade;
      if (req.body.price) sellTrade.price = req.body.price;
      if (req.body.quantity) sellTrade.quantity = req.body.quantity;
      if (req.body.Date) sellTrade.Date = req.body.Date;
      if (req.file) sellTrade.image = req.file.path;
      if (req.body.availableFromDate) sellTrade.availableFromDate = req.body.availableFromDate;
      if (req.body.availableToDate) sellTrade.availableToDate = req.body.availableToDate;
      if(req.body.priceQuantityUnit)  sellTrade.priceQuantityUnit = req.body.priceQuantityUnit
      // Save the updated sell trade document
      const updatedSellTrade = await sellTrade.save();
      res.send({ message: "Sell trade updated successfully", data: updatedSellTrade });
  } catch (error) {
      console.error("Error updating sell trade:", error);
      res.status(500).send({ message: "Internal server error" });
  }
};
exports.updatesellTradeByAdmin = async(req,res)=>{

  // Prepare the data object with optional fields
  const data = {
    pickuplocation:req.body.pickuplocation,
    category:req.body.category,
    product:req.body.product,
    variety:req.body.variety,
    grade:req.body.grade,
    price:req.body.price,
    quantity:req.body.quantity,                                                                                                            
    availableFromDate: req.body.availableFromDate,
    availableToDate: req.body.availableToDate, 
  };
  if(req.body.priceQuantityUnit)  data.priceQuantityUnit = req.body.priceQuantityUnit
  const sellTrade=await SellModel.findByIdAndUpdate(req.params.id,data,{
      new:true
  })
  if(!sellTrade) return res.status(500).send({Message:"Can't found sellTrade Data with given id"})
  res.send({Message:"Your Data Successfully Updated",data:sellTrade})
}

exports.DeleteSellTrade = async (req,res)=>{
    const id = req.params.id
    let findresult = await SellModel.findByIdAndDelete({_id:id});
    if(!findresult)return res.status(500).send({Message:"Can't found data"})
      // Delete associated orders
      await Order.deleteMany({ tradeId: id });
    if(findresult=="")return res.status(500).send({Message:"oops Empty Set"})
    res.status(200).send({msg:"Data Deleted", status: true });
}


exports.getVariety = async (req, res) => {
    const bananaVarieties = ["Cavendish", "Gros Michel", "Lady Finger (also known as Sugar Banana)", "Red Banana", "Burro Banana", "Manzano Banana", "Plantain"];
    const appleVarieties = ["Red Delicious", "Golden Delicious", "Granny Smith", "Fuji", "Honeycrisp", "Gala", "McIntosh", "Cripps Pink (Pink Lady)", "Braeburn"];
    const allVarieties = {
      bananas: bananaVarieties,
      apples: appleVarieties,
    };
    res.send({ MSG: "Get List Of Varieties", Data: allVarieties });
  };
   
exports.GetMySellTrade = async (req,res)=>{
    const farmer_id = req.user.id;
    let findresult = await SellModel.find({farmer_id: mongoose.Types.ObjectId(farmer_id)});
    if (!findresult) return res.status(500).send({message:"oops Can't found data."});
    if(findresult=="")return res.status(500).send({Message:"oops Empty Set"})
    res.status(200).send({ status: true, result:findresult });
}

exports.SearchSellTrade = async (req, res) => {
  try {
    // Extract the product query parameter from the request
    const { product } = req.query;
    
    // Build the query object
    const query = {};
    if (product) {
      query.product = { $regex: new RegExp(product, 'i') }; // Case-insensitive search
    }

    // Find sell trades matching the query and populate the farmer_id field
    const findresult = await SellModel.find(query).populate('farmer_id');
    if (!findresult || findresult.length === 0) {
      return res.status(404).send({ message: "No sell trades found matching the criteria." });
    }

    res.status(200).send({ status: true, result: findresult });
  } catch (error) {
    console.error("Error fetching sell trades:", error);
    res.status(500).send({ message: "An error occurred while fetching sell trades." });
  }
};
