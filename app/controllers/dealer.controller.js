const User = require('../models/user.model');
const UserSetting = require('../models/usersetting.model.js');
const Admin = require('../models/admin.model');
var md5 = require('md5');

exports.createdealer = async(req, res) => {
    let findphone = await Admin.findOne({ phone: req.body.phone});
    if(findphone && findphone._id){
        return res.status(400).send({
            message: "Dealer already exit with this phone number"
        });
    }
    let findemail = await Admin.findOne({ email: req.body.email});
    if(findemail && findemail._id){
        return res.status(400).send({
            message: "Dealer already exit with this email"
        });
    }

    //genereate useridnumber
    let dealerid = await generateUseridnumber("dealer",req.body.state,req.body.city);

    // Create a Farmer
    req.body.userType = "dealer";
    req.body.password = md5(req.body.password);
    req.body.useridnumber = dealerid;
    const dealerObj = new User(req.body);

    // Save Farmer in the database
    dealerObj.save()
    .then(async(data) => {
        //increase the farmer id number
        await UserSetting.findOneAndUpdate({settingtype:"useridnumber"},{$inc:{"settingdata.dealeridnumber":1}});
        res.status(200).send({ status: true,message:"Dealer has been created successfully" });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Dealer."
        });
    });    
};

exports.getdealers = (req, res) => {
    let page = req.query && req.query.page && Number(req.query.page) || 1;
    let limit = 5;
    let skip = limit * (page - 1);
    Admin.find({userType:{$eq:"dealer"}},{crops:0,farmerdetail:0,bankingdetail:0,password:0,__v:0,updatedAt:0})
     .sort({createdAt:-1})
     .limit(limit)
     .skip(skip)
     .then(userdata=>{
        res.status(200).send({ status: true, result:userdata });
     })
     .catch(err=>{
        return res.status(500).send({ message: "something went wrong" });
     })
};

exports.getdealerprofile = async(req,res)=>{
    id=req.params.id;
    const result= await Admin.findById(id);
    if(!result) return res.status(500).send({Message:"Can't Find Dealer Data With Given Id"})
    res.status(200).send({Message:"Dealer Data Find Successfully Done",result});
}

exports.updatedealerbyid = async(req,res)=>{
    const result=await Admin.findByIdAndUpdate(req.params.id,{
        name:req.body.name,
        phone:req.body.phone, 
        email:req.body.email, 
        password:req.body.password,
        locality:req.body.locality,
        city:req.body.city,
        state:req.body.state,
        taluk:req.body.taluk,
        country:req.body.country,
        pin:req.body.pin
    },{
        new:true
    })
    if(!result) return res.status(500).send({Message:"Can't find Dealer Data with given id"})
    res.status(200).send({Message:"Your Data Successfully Updated",data:result})
}

exports.logoutdealer=async(req,res)=>{
    const result=await Admin.findByIdAndDelete(req.params.id);
    if(!result) return res.status(500).send({Message:"Can't Logout Dealer please Check Your Data"})
    res.status(200).send({Message:"Dealer Logout Successfully Done..."})
}


let generateUseridnumber = async(usertype,state,city)=>{
    let settingresult = await UserSetting.findOne({settingtype:"useridnumber"});
    //console.log('settingresult',settingresult);
    let finalstr = "",usernumber;
    if(usertype=="farmer"){
      finalstr = "FR";
      usernumber = settingresult && settingresult.settingdata && settingresult.settingdata.farmeridnumber;
    }else if(usertype=="dealer"){
      finalstr = "DE";
      usernumber = settingresult && settingresult.settingdata && settingresult.settingdata.dealeridnumber;
    }else if(usertype=="retailer"){
      finalstr = "RE";
      usernumber = settingresult && settingresult.settingdata && settingresult.settingdata.retaileridnumber;
    }else if(usertype=="buyer"){
      finalstr = "BU";
      usernumber = settingresult && settingresult.settingdata && settingresult.settingdata.buyeridnumber;
    }
    //console.log('finalstr',finalstr);
    if(state && state[0])
     finalstr = finalstr+(state[0]).toUpperCase();
    if(state && state[1])
     finalstr = finalstr+state[1].toUpperCase();
    if(city && city[0])
     finalstr = finalstr+city[0].toUpperCase();
    if(city && city[1])
     finalstr = finalstr+city[1].toUpperCase();
    //console.log('finalstr2',finalstr,usernumber);
    return finalstr+usernumber;
  }                                                      