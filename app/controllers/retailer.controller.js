const Retailer = require('../models/retailer.model');
const Admin = require("../models/admin.model");
// const UserSetting = require('../models/usersetting.model.js');


exports.registerRetailer = (async(req, res) => { 
    // const admin = await Admin.findOne({ phone: req.body.phone })
    // console.log("Admin",admin);
    // if(admin){
      const phoneExits = await Retailer.findOne({phone:req.body.phone})
      if(phoneExits){
        res.send({Message:"This Phone Is Already Registered Please Enter Another Mobile"})
      }else{
        const data={
            fullName:req.body.fullName,
            farmName:req.body.farmName,
            farmAddress:req.body.farmAddress,
            city:req.body.city,
            state:req.body.state,
            landmark:req.body.landmark,
            pincode:req.body.pincode,
            phone:req.body.phone,
            profilePicture:req.file.path,
        }
        Retailer.create(data,(err,result)=>{
          if(err){
            res.status(400).send({Message:"Something Went TO Wrong",err})
          }
          else{
              res.status(200).send({msg:"Retailer Register Successfully Done ",result})
          }
      })
      }
    // }else{
    //   res.send({Message:"Please Enter Login Phone"})
    // }
  });
  
  
  exports.getretailer = (async(req, res) => {
      const result = await Retailer.find({userType:"retailer"});
      if(!result) return res.status(500).send({Message:"Oops..Empty Set"})
      res.status(200).send({Message:"Retailer Data Find Successfully Done",result})
  })
  
  
  exports.getretailerprofile = (async(req,res)=>{
      id=req.params.id;
      const result= await Retailer.findById(id);
      if(!result) return res.status(500).send({Message:"Can't Find Retailer Data With Given ID"})
      res.status(200).send({Message:"Retailer Data Find Successfully Done",result})
  })
  
  
  exports.updateretailerbyid = (async(req,res)=>{
      const result=await Retailer.findByIdAndUpdate(req.params.id,{
        fullName:req.body.fullName,
        farmName:req.body.farmName,
        farmAddress:req.body.farmAddress,
        city:req.body.city,
        state:req.body.state,
        landmark:req.body.landmark,
        pincode:req.body.pincode,
        phone:req.body.phone,
        profilePicture:req.file.path,
      },{
          new:true
      })
      if(!result) return res.status(500).send({Message:"Can't Find Retailer Data with Given ID"})
      res.status(200).send({Message:"Your Data Successfully Updated",data:result})
  })
  
  
  exports.logoutretailer=(async(req,res)=>{
    try{
      const result=await Retailer.findByIdAndDelete(req.params.id);
      if(!result) return res.status(500).send({Message:"Can't Logout Retailer Please Check Your Data"})
      res.status(200).send({Message:"Retailer Logout Successfully Done..."})
    }catch(err){
      console.log(err);
    }
  })

// let generateUseridnumber = async(usertype,state,city)=>{
//     let settingresult = await UserSetting.findOne({settingtype:"useridnumber"});
//     //console.log('settingresult',settingresult);
//     let finalstr = "",usernumber;
//     if(usertype=="retailer"){
//       finalstr = "FR";
//       usernumber = settingresult && settingresult.settingdata && settingresult.settingdata.retailer;
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