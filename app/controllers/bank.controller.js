const bank = require("../models/bank.model");

exports.loginbankaccount = async (req, res) => {
    const data = {
        beneficiaryName: req.body.beneficiaryName,
        beneficiaryLastName: req.body.beneficiaryLastName,
        bankCode: req.body.bankCode,
        ifscCode: req.body.ifscCode,
        bankAccountNumber: req.body.bankAccountNumber,
        address: req.body.address,
        email: req.body.email,
        mobileNumber: req.body.mobileNumber,
        gstInNumber: req.body.gstInNumber
    }
    await bank.create(data, (err, result) => {
        if (err) {
            res.status(500).send({ Error: "Can't Login Bank Account Because of Error", err });
        }
        else {
            res.status("200").send({ Message: "Bank Account Login successfully done..." });
        }
    })
}

exports.getbankaccountbyID = async (req, res) => {
    const result = await bank.findById(req.params.id);
    if (!result) return res.status(500).send({ Message: "Can't Find Bank Data With Given Id" });
    res.status(200).send({ Message: "Bank Detail Find Successfully Done..", data: result })
}

exports.getbankaccount = async (req, res) => {
    const result = await bank.find({});
    if (!result) return res.status(500).send({ Message: "Can't Find Bank Data With Given Id" });
    res.status(200).send({ Message: "Bank Detail Find Successfully Done..", data: result })
}

exports.updatebankaccount= async(req,res)=>{
    const result=await bank.findByIdAndUpdate(req.params.id,{
        beneficiaryName: req.body.beneficiaryName,
        beneficiaryLastName: req.body.beneficiaryLastName,
        bankCode: req.body.bankCode,
        ifscCode: req.body.ifscCode,
        bankAccountNumber: req.body.bankAccountNumber,
        address: req.body.address,
        email: req.body.email,
        mobileNumber: req.body.mobileNumber,
        gstInNumber: req.body.gstInNumber
    },{new:true})
    if(!result) return res.status(500).send({Message:"Can't Find Data With Given ID"})
    res.status(200).send({Message:"Update Data Successfully Done",result})
}

exports.deletebankaccount = async (req, res) => {
    const result = await bank.findByIdAndDelete(req.params.id);
    if (!result) return res.status(500).send({ Message: "Can't Find Bank Data With Given Id" });
    res.status(200).send({ Message: "Bank Detail Delete Successfully Done.." })
}
