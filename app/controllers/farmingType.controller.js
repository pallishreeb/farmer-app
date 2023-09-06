const RegulerFarming = require("../models/regulerFarming.model");
const ContractFarming = require("../models/contractFarming.model");
const OrganicFarming = require("../models/organicFarming.model");
const Admin = require("../models/admin.model");

exports.addregulerfarming = async(req,res)=>{
    try {
        const farmer_id = req.body.farmer_id
        await Admin.findOne({ _id: farmer_id }, (err, result) => {
            // console.log(result, "result")
            if (err) throw err;
            else {
                if (result == null) {
                    res.send({ MSG: "Ple Enter Valid Farmer_Id, Given Id is Not in Our Database " })
                }
                else {
                    const data = {
                        soilType: req.body.soilType,
                        regulerFarmingType: req.body.regulerFarmingType,
                        cropQuantity: req.body.cropQuantity,
                        farmer_id:req.body.farmer_id
                    }
                    // console.log("data",data);
                    RegulerFarming.create(data, (err, result) => {
                        if (err)
                            throw err;
                        else {
                            res.send({ Message: "Add Reguler Farming Successfully Done", result});
                        }
                    })
                }

            }
        })
    } catch (err) {
        console.log(err);
    }
}

exports.getregulerfarming=async(req,res)=>{
    const result = await RegulerFarming.find({});
    if(!result || result=="") return res.status(500).send({Message:"Can't Find Data Of Reguler Farming"})
    res.status(200).send({Message:"Reguler Farming Data Find Successfully Done",result})
}

exports.addcontractfarming = async(req,res)=>{
    try {
        const farmer_id = req.body.farmer_id
        await Admin.findOne({ _id: farmer_id }, (err, result) => {
            console.log(result, "result")
            if (err) throw err;
            else {
                if (result == null) {
                    res.send({ MSG: "Ple Enter Valid Farmer_Id, Given Id is Not in Our Database " })
                }
                else {
                    const data = {
                        soilType:req.body.soilType,
                        cropQuantity:req.body.cropQuantity,
                        farmer_id:req.body.farmer_id
                    }
                    // console.log("data",data);
                    ContractFarming.create(data, (err, result) => {
                        if (err)
                            throw err;
                        else {
                            res.send({ Message: "Add Contract Farming Successfully Done", result});
                        }
                    })
                }

            }
        })
    } catch (err) {
        console.log(err);
    }
}

exports.getcontractfarming=async(req,res)=>{
    const result = await ContractFarming.find({});
    if(!result || result=="") return res.status(500).send({Message:"Can't Find Data Of Contract Farming Done"})
    res.status(200).send({Message:"Contract Farming Data Find Successfully Done",result})
}

exports.addorganicfarming = async(req,res)=>{
    try {
        const farmer_id = req.body.farmer_id
        await Admin.findOne({ _id: farmer_id }, (err, result) => {
            console.log(result, "result")
            if (err) throw err;
            else {
                if (result == null) {
                    res.send({ MSG: "Ple Enter Valid Farmer_Id, Given Id is Not in Our Database " })
                }
                else {
                    const data = {
                        soilType:req.body.soilType,
                        landType:req.body.landType,
                        organicFarmType:req.body.organicFarmType,
                        organicFarmingMethod:req.body.organicFarmingMethod,
                        farmer_id:req.body.farmer_id
                    }
                    // console.log("data",data);
                    OrganicFarming.create(data, (err, result) => {
                        if (err)
                            throw err;
                        else {
                            res.send({ Message: "Add Organic Farming Successfully Done", result});
                        }
                    })
                }

            }
        })
    } catch (err) {
        console.log(err);
    }
}

exports.getorganicfarming=async(req,res)=>{
    const result = await OrganicFarming.find({});
    if(!result || result=="") return res.status(500).send({Message:"Can't Find Data Of Organic Farming"})
    res.status(200).send({Message:"Organic Farming Data Find Successfully Done",result})
}