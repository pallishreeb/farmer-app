const AdharVerification = require("../models/adharVerification.model");
const PanVerification = require("../models/panVerification.model");
const User = require("../models/user.model");

exports.addadharcard = (async(req,res)=>{
    try{
        const farmer_id = req.body.farmer_id
        await User.findOne({ _id: farmer_id }, async(err, result) => {
            // console.log(result, "result")
            if (err) throw err;
            else {
                if (result == null) {
                    res.send({ MSG: "Ple Enter Valid Farmer_Id, Given Id is Not in Our Database " })
                }
                else{
                    const data={
                        adharNumber:req.body.adharNumber,
                        frontSidePhoto:req.files.frontSidePhoto,
                        backSidePhoto:req.files.backSidePhoto,
                        farmer_id:req.body.farmer_id
                    }
                    // console.log(data.frontSidePhoto,'FRONTSIDE');
                    await AdharVerification.create(data,(err,result)=>{
                        if(err) throw err;
                        else{
                            res.send({Message:"Your Data Successfully Inserted",result})
                        }
                    });
                }
            }
        })
    }catch(err){
        console.log(err);
    }
})
  

exports.addpancard = (async(req,res)=>{
    try{
        const farmer_id = req.body.farmer_id
        await User.findOne({ _id: farmer_id }, async(err, result) => {
            // console.log(result, "result")
            if (err) throw err;
            else {
                if (result == null) {
                    res.send({ MSG: "Ple Enter Valid Farmer_Id, Given Id is Not in Our Database " })
                }
                else{
                    const data={
                        panNumber:req.body.adharNumber,
                        panCardPhoto:req.file.path,
                        farmer_id:req.body.farmer_id
                    }
                    console.log(data.panCardPhoto,'panCardPhoto');
                    await PanVerification.create(data,(err,result)=>{
                        if(err) throw err;
                        else{
                            res.send({Message:"Your Data Successfully Inserted",result})
                        }
                    });
                }
            }
        })
    }catch(err){
        console.log(err);
    }
})

