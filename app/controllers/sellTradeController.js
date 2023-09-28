const SellModel = require("../models/sellTrade.model")
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
    let findresult = await SellModel.find({});
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

exports.updatesellTrade = async(req,res)=>{
    console.log(req.files,'filreeee')
    const sellTrade=await SellModel.findByIdAndUpdate(req.params.id,{
        username:req.body.username,
        pickuplocation:req.body.pickuplocation,
        category:req.body.category,
        product:req.body.product,
        variety:req.body.variety,
        grade:req.body.grade,
        price:req.body.price,
        quantity:req.body.quantity,        
        Date:req.body.Date,                                                                                                     
        image:req.file.path
    },{
        new:true
    })
    if(!sellTrade) return res.status(500).send({Message:"Can't found sellTrade Data with given id"})
    res.send({Message:"Your Data Successfully Updated",data:sellTrade})
}

exports.DeleteSellTrade = async (req,res)=>{
    const id = req.params.id
    let findresult = await SellModel.findByIdAndDelete({_id:id});
    if(!findresult)return res.status(500).send({Message:"Can't found data"})
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